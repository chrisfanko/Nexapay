import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo_db";
import Transaction from "@/models/transaction";
import PaymentSession from "@/models/paymentSession";
import { deliverWebhook } from "@/lib/webhook";

export async function POST(req: NextRequest) {
  const body = await req.json();
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

    const existing = await Transaction.findOne({ reference });

    if (existing) {
      const updated = await Transaction.findOneAndUpdate(
        { reference },
        {
          status: isComplete ? "complete" : "failed",
          failureReason: isFailed ? data.message || "Payment failed" : undefined,
        },
        { new: true }
      );

      console.log(`NotchPay webhook: transaction ${reference} updated to "${isComplete ? "complete" : "failed"}"`);

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
      // Try to find userId from PaymentSession
      const paymentSession = await PaymentSession.findOne({
        transactionReference: reference,
      });

      await Transaction.create({
        reference,
        provider: "notchpay",
        channel: data.channel || "Orange Money",
        status: isComplete ? "complete" : "failed",
        currency: data.currency || "XAF",
        mode: paymentSession?.mode || "live",
        ...(paymentSession?.merchantId && { userId: paymentSession.merchantId }),
        merchantAmount: data.amount || 0,
        nexapayFee: 0,
        grossAmount: data.amount || 0,
        providerFee: 0,
        netAmount: data.amount || 0,
        customerName: data.customer?.name || "Unknown",
        customerPhone: data.customer?.phone || undefined,
        failureReason: isFailed ? data.message || "Payment failed" : undefined,
      });

      console.log(`NotchPay webhook: transaction ${reference} created with merchant ${paymentSession?.merchantId || "unknown"}`);
    }
  } catch (error) {
    console.error("NotchPay webhook DB error:", error);
  }
}