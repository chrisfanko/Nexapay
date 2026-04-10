import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo_db";
import Transaction from "@/models/transaction";
import User from "@/models/users";
import { getFeeBreakdown } from "@/lib/fees";

export async function POST(req: NextRequest) {
  const { amount, currency, email, name, phone, channel } = await req.json();

  // 1. Validate inputs
  if (!amount || !name || !phone || !channel) {
    return NextResponse.json(
      { error: "Missing required fields: amount, name, phone, channel" },
      { status: 400 }
    );
  }

  // 2. Validate API key and find merchant
  let merchantId = null;
  let mode: "live" | "test" = "live";
  const apiKey = req.headers.get("x-api-key");

  if (apiKey) {
    try {
      await connectToDatabase();

      // Check if it's a test key (npk_test_...) or live key (npk_live_...)
      const isTestKey = apiKey.startsWith("npk_test_");

      let merchant;
      if (isTestKey) {
        // Test key — any registered user can use it, no approval needed
        merchant = await User.findOne({ testApiKey: apiKey });
        if (!merchant) {
          return NextResponse.json(
            { error: "Invalid test API key" },
            { status: 401 }
          );
        }
        mode = "test";
      } else {
        // Live key — merchant must be approved
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

  // 3. Calculate fees
  const fees = getFeeBreakdown(Number(amount), "notchpay");

  // 4. Send to NotchPay
  let notchpayData;
  try {
    const response = await fetch("https://api.notchpay.co/payments", {
      method: "POST",
      headers: {
        Authorization: process.env.NOTCHPAY_PUBLIC_KEY!,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        amount: fees.grossAmount,
        currency: currency || "XAF",
        description: `[${mode.toUpperCase()}] Payment via ${channel}`,
        callback: `${process.env.NEXT_PUBLIC_BASE_URL}/api/notchpay/verify`,
        customer: { email, name, phone },
      }),
    });

    notchpayData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: notchpayData.message || "Failed to initialize payment" },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error("NotchPay initialize error:", err);
    return NextResponse.json(
      { error: "Could not connect to payment provider." },
      { status: 502 }
    );
  }

  // 5. Save a PENDING transaction to MongoDB
  try {
    await connectToDatabase();

    const reference = notchpayData?.transaction?.reference;

    if (reference) {
      await Transaction.create({
        reference,
        provider: "notchpay",
        channel,
        status: "pending",
        currency: currency || "XAF",
        mode,
        ...(merchantId && { userId: merchantId }),
        merchantAmount: fees.merchantAmount,
        nexapayFee: fees.nexapayFee,
        grossAmount: fees.grossAmount,
        providerFee: fees.providerFee,
        netAmount: fees.netAmount,
        customerName: name,
        customerPhone: phone,
      });

      console.log(`[${mode.toUpperCase()}] Transaction saved: ${reference} | Merchant: ${merchantId || "direct"}`);
    }
  } catch (dbError) {
    console.error("Failed to save pending transaction:", dbError);
  }

  return NextResponse.json({ ...notchpayData, mode });
}