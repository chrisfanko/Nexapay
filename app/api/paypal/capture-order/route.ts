import { getPayPalAccessToken, PAYPAL_API_BASE } from "@/lib/aggregators/paypal/client";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo_db";
import Transaction from "@/models/transaction";
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

    if (!response.ok) {
      console.error("PayPal capture error:", data);

      try {
        await connectToDatabase();
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

      return NextResponse.json(
        { error: "PayPal capture failed", details: data },
        { status: response.status }
      );
    }

    // 2. Extract customer name from PayPal response
    const payer = data?.payer;
    const customerName = payer
      ? `${payer.name?.given_name || ""} ${payer.name?.surname || ""}`.trim()
      : "PayPal Customer";

    // 3. Update transaction to complete in MongoDB
    let savedTransaction = null;
    try {
      await connectToDatabase();

      savedTransaction = await Transaction.findOneAndUpdate(
        { reference: orderID },
        { status: "complete", customerName },
        { new: true }
      );

      console.log(`PayPal transaction ${orderID} captured and updated to complete`);
    } catch (dbError) {
      console.error("Failed to update PayPal transaction in DB:", dbError);
    }

    // 4. Deliver webhook if transaction belongs to a merchant
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

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    return NextResponse.json(
      { error: "Failed to capture order", details: String(error) },
      { status: 500 }
    );
  }
}