import { getPayPalAccessToken, PAYPAL_API_BASE } from "@/lib/aggregators/paypal/client";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo_db";
import Transaction from "@/models/transaction";
import { getFeeBreakdown } from "@/lib/fees";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      amount = "10.00",
      currency = "USD",
      description = "Payment",
    } = body;

    // 1. Calculate fees
    // PayPal uses decimals (e.g. 10.00) so we convert to cents for fee calc then back
    const amountInCents = Math.round(parseFloat(amount) * 100);
    const fees = getFeeBreakdown(amountInCents, "paypal");
    const grossAmountDecimal = (fees.grossAmount / 100).toFixed(2);

    // 2. Create PayPal order with gross amount
    const accessToken = await getPayPalAccessToken();

    const orderResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            description,
            amount: {
              currency_code: currency,
              value: grossAmountDecimal,
            },
          },
        ],
      }),
    });

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      console.error("PayPal order creation error:", orderData);
      return NextResponse.json(
        { error: "Failed to create PayPal order", details: orderData },
        { status: 500 }
      );
    }

    // 3. Save pending transaction to MongoDB
    try {
      await connectToDatabase();

      await Transaction.create({
        reference: orderData.id,
        provider: "paypal",
        channel: "PayPal",
        status: "pending",
        currency,
        merchantAmount: amountInCents,
        nexapayFee: fees.nexapayFee,
        grossAmount: fees.grossAmount,
        providerFee: fees.providerFee,
        netAmount: fees.netAmount,
        customerName: "PayPal Customer",  // will be updated on capture
        customerPhone: undefined,
      });

      console.log(`PayPal pending transaction saved: ${orderData.id} | Gross: ${grossAmountDecimal} ${currency}`);
    } catch (dbError) {
      console.error("Failed to save PayPal pending transaction:", dbError);
    }

    console.log("PayPal order created:", orderData.id);
    return NextResponse.json({ id: orderData.id });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}