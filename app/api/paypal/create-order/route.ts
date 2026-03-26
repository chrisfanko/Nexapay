import { getPayPalAccessToken, PAYPAL_API_BASE } from "@/lib/aggregators/paypal/client";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo_db";
import Transaction from "@/models/transaction";
import User from "@/models/users";
import { getFeeBreakdown } from "@/lib/fees";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      amount = "10.00",
      currency = "USD",
      description = "Payment",
    } = body;

    // 1. Validate API key and find merchant
    let merchantId = null;
    let mode: "live" | "test" = "live";
    const apiKey = req.headers.get("x-api-key");

    if (apiKey) {
      try {
        await connectToDatabase();

        const isTestKey = apiKey.startsWith("npk_test_");

        let merchant;
        if (isTestKey) {
          // Test key — no approval needed
          merchant = await User.findOne({ testApiKey: apiKey });
          if (!merchant) {
            return NextResponse.json(
              { error: "Invalid test API key" },
              { status: 401 }
            );
          }
          mode = "test";
        } else {
          // Live key — must be approved
          merchant = await User.findOne({ apiKey, merchantStatus: "approved" });
          if (!merchant) {
            return NextResponse.json(
              { error: "Invalid or unauthorized API key. Make sure your business is approved." },
              { status: 401 }
            );
          }
          mode = "live";
        }

        merchantId = merchant._id;
      } catch (err) {
        console.error("API key validation error:", err);
        return NextResponse.json(
          { error: "Could not validate API key" },
          { status: 500 }
        );
      }
    }

    // 2. Calculate fees
    const amountInCents = Math.round(parseFloat(amount) * 100);
    const fees = getFeeBreakdown(amountInCents, "paypal");
    const grossAmountDecimal = (fees.grossAmount / 100).toFixed(2);

    // 3. Create PayPal order
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
            description: `[${mode.toUpperCase()}] ${description}`,
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

    // 4. Save pending transaction to MongoDB
    try {
      await connectToDatabase();

      await Transaction.create({
        reference: orderData.id,
        provider: "paypal",
        channel: "PayPal",
        status: "pending",
        currency,
        mode,
        ...(merchantId && { userId: merchantId }),
        merchantAmount: amountInCents,
        nexapayFee: fees.nexapayFee,
        grossAmount: fees.grossAmount,
        providerFee: fees.providerFee,
        netAmount: fees.netAmount,
        customerName: "PayPal Customer",
        customerPhone: undefined,
      });

      console.log(`[${mode.toUpperCase()}] PayPal transaction saved: ${orderData.id} | Merchant: ${merchantId || "direct"}`);
    } catch (dbError) {
      console.error("Failed to save PayPal pending transaction:", dbError);
    }

    return NextResponse.json({ id: orderData.id, mode });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}