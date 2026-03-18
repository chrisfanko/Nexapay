import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo_db";
import Transaction from "@/models/transaction";
import { deliverWebhook } from "@/lib/webhook";

export async function POST(req: NextRequest) {
  // 1. Return 200 immediately — NotchPay requires response within 5 seconds
  const body = await req.json();

  // Process asynchronously after responding
  processWebhook(body).catch((err) =>
    console.error("Webhook processing error:", err)
  );

  return NextResponse.json({ received: true }, { status: 200 });
}

async function processWebhook(event: {
  type: string;
  data: {
    id: string;
    status?: string;
    amount?: number;
    currency?: string;
    channel?: string;
    customer?: {
      name?: string;
      phone?: string;
    };
    message?: string;
  };
}) {
  const { type, data } = event;

  if (!data?.id) {
    console.error("NotchPay webhook: missing transaction ID");
    return;
  }

  const reference = data.id;
  const isComplete = type === "payment.complete";
  const isFailed = type === "payment.failed";

  if (!isComplete && !isFailed) {
    console.log(`NotchPay webhook: unhandled event type "${type}"`);
    return;
  }

  try {
    await connectToDatabase();

    // 2. Find existing transaction
    const existing = await Transaction.findOne({ reference });

    if (existing) {
      // 3. Update transaction status
      const updated = await Transaction.findOneAndUpdate(
        { reference },
        {
          status: isComplete ? "complete" : "failed",
          failureReason: isFailed
            ? data.message || "Payment failed"
            : undefined,
        },
        { new: true }
      );

      console.log(
        `NotchPay webhook: transaction ${reference} updated to "${isComplete ? "complete" : "failed"}"`
      );

      // 4. Trigger outgoing webhook to merchant if transaction belongs to one
      if (updated?.userId) {
        await deliverWebhook(updated.userId.toString(), {
          event: isComplete ? "payment.complete" : "payment.failed",
          reference,
          status: isComplete ? "complete" : "failed",
          amount: updated.merchantAmount,
          currency: updated.currency,
          channel: updated.channel,
          provider: "notchpay",
          customerName: updated.customerName,
          customerPhone: updated.customerPhone,
          nexapayFee: updated.nexapayFee,
          netAmount: updated.netAmount,
          timestamp: new Date().toISOString(),
        });
      }
    } else {
      // 5. Fallback: create transaction if it doesn't exist
      await Transaction.create({
        reference,
        provider: "notchpay",
        channel: data.channel || "Orange Money",
        status: isComplete ? "complete" : "failed",
        currency: data.currency || "XAF",
        merchantAmount: data.amount || 0,
        nexapayFee: 0,
        grossAmount: data.amount || 0,
        providerFee: 0,
        netAmount: data.amount || 0,
        customerName: data.customer?.name || "Unknown",
        customerPhone: data.customer?.phone || undefined,
        failureReason: isFailed ? data.message || "Payment failed" : undefined,
      });

      console.log(
        `NotchPay webhook: transaction ${reference} created as fallback`
      );
    }
  } catch (error) {
    console.error("NotchPay webhook DB error:", error);
  }
}