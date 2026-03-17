import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo_db";
import Transaction from "@/models/transaction";
import { deliverWebhook } from "@/lib/webhook";

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ error: "No reference provided" }, { status: 400 });
  }

  // 1. Verify with NotchPay
  let notchpayData;
  try {
    const response = await fetch(
      `https://api.notchpay.co/payments/${reference}`,
      {
        headers: {
          Authorization: process.env.NOTCHPAY_PUBLIC_KEY!,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to reach NotchPay. Please try again later." },
        { status: 502 }
      );
    }

    notchpayData = await response.json();
  } catch (err) {
    console.error("NotchPay verify error:", err);
    return NextResponse.json(
      { error: "Could not connect to payment provider." },
      { status: 502 }
    );
  }

  const tx = notchpayData?.transaction;
  if (!tx) {
    return NextResponse.json(
      { error: "Invalid response from payment provider." },
      { status: 502 }
    );
  }

  const isComplete = tx.status === "complete";

  // 2. Update transaction in MongoDB
  let savedTransaction = null;
  try {
    await connectToDatabase();

    const existing = await Transaction.findOne({ reference });

    if (existing) {
      savedTransaction = await Transaction.findOneAndUpdate(
        { reference },
        {
          status: isComplete ? "complete" : "failed",
          failureReason: isComplete ? undefined : tx.message || "Payment was not completed",
        },
        { new: true }
      );
    } else {
      savedTransaction = await Transaction.create({
        reference,
        provider: "notchpay",
        channel: tx.channel || "Orange Money",
        status: isComplete ? "complete" : "failed",
        currency: tx.currency || "XAF",
        merchantAmount: tx.amount || 0,
        nexapayFee: 0,
        grossAmount: tx.amount || 0,
        providerFee: 0,
        netAmount: tx.amount || 0,
        customerName: tx.customer?.name || "Unknown",
        customerPhone: tx.customer?.phone || undefined,
        failureReason: isComplete ? undefined : tx.message || "Payment was not completed",
      });
    }

    console.log(`Transaction ${reference} updated to "${isComplete ? "complete" : "failed"}"`);
  } catch (dbError) {
    console.error("Failed to update transaction in database:", dbError);
  }

  // 3. Deliver webhook if transaction belongs to a merchant
  if (savedTransaction?.userId) {
    await deliverWebhook(savedTransaction.userId.toString(), {
      event: isComplete ? "payment.complete" : "payment.failed",
      reference,
      status: isComplete ? "complete" : "failed",
      amount: savedTransaction.merchantAmount,
      currency: savedTransaction.currency,
      channel: savedTransaction.channel,
      provider: "notchpay",
      customerName: savedTransaction.customerName,
      customerPhone: savedTransaction.customerPhone,
      nexapayFee: savedTransaction.nexapayFee,
      netAmount: savedTransaction.netAmount,
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json(notchpayData);
}