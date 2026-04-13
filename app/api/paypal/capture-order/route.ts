import { getPayPalAccessToken, PAYPAL_API_BASE } from "@/lib/aggregators/paypal/client";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo_db";
import Transaction from "@/models/transaction";
import PaymentSession from "@/models/paymentSession";
import { deliverWebhook } from "@/lib/webhook";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderID } = body;

    if (!orderID) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // 1. Capture the PayPal order
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    // 2. Find payment session for this order
    await connectToDatabase();
    const paymentSession = await PaymentSession.findOne({
      transactionReference: orderID,
    }).catch(() => null);

    if (!response.ok) {
      console.error("PayPal capture error:", data);

      try {
        await Transaction.findOneAndUpdate(
          { reference: orderID },
          {
            status: "failed",
            failureReason: data?.message || "PayPal capture failed",
          }
        );
      } catch (dbError) {
        console.error("Failed to update failed PayPal transaction:", dbError);
      }

      // Redirect to cancelUrl if available
      if (paymentSession?.cancelUrl) {
        return NextResponse.json({
          error: "PayPal capture failed",
          redirect: `${paymentSession.cancelUrl}?reference=${orderID}&status=failed`,
        }, { status: 400 });
      }

      return NextResponse.json(
        { error: "PayPal capture failed", details: data },
        { status: response.status }
      );
    }

    // 3. Extract customer info from PayPal response
    const payer = data?.payer;
    const customerName = payer
      ? `${payer.name?.given_name || ""} ${payer.name?.surname || ""}`.trim()
      : "PayPal Customer";

    // 4. Update transaction in MongoDB
    let savedTransaction = null;
    try {
      const existing = await Transaction.findOne({ reference: orderID });

      if (existing) {
        savedTransaction = await Transaction.findOneAndUpdate(
          { reference: orderID },
          { 
            status: "complete", 
            customerName,
            ...(paymentSession?.merchantId && { userId: paymentSession.merchantId }),
          },
          { new: true }
        );
      } else {
        // Create transaction if it doesn't exist yet
        const purchaseUnit = data?.purchase_units?.[0];
        const amount = parseFloat(purchaseUnit?.amount?.value || "0");

        savedTransaction = await Transaction.create({
          reference: orderID,
          provider: "paypal",
          channel: "PayPal",
          status: "complete",
          currency: purchaseUnit?.amount?.currency_code || "USD",
          mode: paymentSession?.mode || "live",
          ...(paymentSession?.merchantId && { userId: paymentSession.merchantId }),
          merchantAmount: amount,
          nexapayFee: 0,
          grossAmount: amount,
          providerFee: 0,
          netAmount: amount,
          customerName,
        });
      }

      // Mark session as completed
      if (paymentSession) {
        await PaymentSession.findOneAndUpdate(
          { transactionReference: orderID },
          { status: "completed" }
        );
      }

      console.log(`PayPal transaction ${orderID} captured and marked complete`);
    } catch (dbError) {
      console.error("Failed to update PayPal transaction in DB:", dbError);
    }

    // 5. Deliver webhook to merchant
    if (savedTransaction?.userId) {
      await deliverWebhook(savedTransaction.userId.toString(), {
        event: "payment.complete",
        reference: orderID,
        status: "complete",
        amount: savedTransaction.merchantAmount,
        currency: savedTransaction.currency,
        channel: "PayPal",
        provider: "paypal",
        customerName,
        nexapayFee: savedTransaction.nexapayFee,
        netAmount: savedTransaction.netAmount,
        timestamp: new Date().toISOString(),
      });
    }

    // 6. Return success with redirect URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const redirectUrl = paymentSession?.successUrl
      ? `${paymentSession.successUrl}?reference=${orderID}&status=complete`
      : `${baseUrl}/payment/success?reference=${orderID}`;

    return NextResponse.json({ 
      ...data, 
      redirect_url: redirectUrl 
    });

  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    return NextResponse.json(
      { error: "Failed to capture order", details: String(error) },
      { status: 500 }
    );
  }
}