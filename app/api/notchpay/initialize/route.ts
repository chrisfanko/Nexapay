import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo_db";
import Transaction from "@/models/transaction";
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

  // 2. Calculate fees
  const fees = getFeeBreakdown(Number(amount), "notchpay");

  // 3. Send to NotchPay with the gross amount (merchant amount + NexaPay fee)
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
        amount: fees.grossAmount,  // customer pays gross amount
        currency: currency || "XAF",
        description: "Payment via " + channel,
        callback: `${process.env.NEXT_PUBLIC_BASE_URL}/payement/succes`,
        customer: {
          email,
          name,
          phone,
        },
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

  // 4. Save a PENDING transaction to MongoDB with customer info and fee breakdown
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
        merchantAmount: fees.merchantAmount,
        nexapayFee: fees.nexapayFee,
        grossAmount: fees.grossAmount,
        providerFee: fees.providerFee,
        netAmount: fees.netAmount,
        customerName: name,
        customerPhone: phone,
      });

      console.log(`Pending transaction saved: ${reference} | Gross: ${fees.grossAmount} | NexaPay fee: ${fees.nexapayFee}`);
    }
  } catch (dbError) {
    // Don't block the payment if DB save fails
    console.error("Failed to save pending transaction:", dbError);
  }

  // 5. Return NotchPay response to frontend
  return NextResponse.json(notchpayData);
}