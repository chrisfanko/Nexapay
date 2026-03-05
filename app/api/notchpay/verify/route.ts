import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo_db";
import Transaction from "@/models/transaction";

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");

  // 1. Validate reference
  if (!reference) {
    return NextResponse.json(
      { error: "No reference provided" },
      { status: 400 }
    );
  }

  // 2. Verify with NotchPay
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

  // 3. Update the existing pending transaction in MongoDB
  try {
    await connectToDatabase();

    const existing = await Transaction.findOne({ reference });

    if (existing) {
      // Update the pending transaction with final status
      await Transaction.findOneAndUpdate(
        { reference },
        {
          status: isComplete ? "complete" : "failed",
          failureReason: isComplete
            ? undefined
            : tx.message || "Payment was not completed",
        }
      );

      console.log(`Transaction ${reference} updated to "${isComplete ? "complete" : "failed"}"`);
    } else {
      // Fallback: if pending transaction wasn't saved at initialization,
      // create it now with whatever info we have from NotchPay
      await Transaction.create({
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
        failureReason: isComplete
          ? undefined
          : tx.message || "Payment was not completed",
      });

      console.log(`Transaction ${reference} created as fallback with status "${isComplete ? "complete" : "failed"}"`);
    }
  } catch (dbError) {
    console.error("Failed to update transaction in database:", dbError);
  }

  // 4. Return NotchPay data to frontend
  return NextResponse.json(notchpayData);
}