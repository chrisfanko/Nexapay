import crypto from "crypto";
import connectToDatabase from "@/lib/mongo_db";
import WebhookLog from "@/models/webhookLog";
import User from "@/models/users";

export interface WebhookPayload {
  event: "payment.complete" | "payment.failed" | "payment.pending";
  reference: string;
  status: string;
  amount: number;
  currency: string;
  channel: string;
  provider: string;
  customerName: string;
  customerPhone?: string;
  nexapayFee: number;
  netAmount: number;
  timestamp: string;
}

export async function deliverWebhook(
  userId: string,
  payload: WebhookPayload
) {
  try {
    await connectToDatabase();

    // Find merchant and their webhook URL
    const merchant = await User.findById(userId).select("webhookUrl webhookSecret");
    if (!merchant?.webhookUrl) return;

    // Sign the payload with webhook secret
    const secret = merchant.webhookSecret || "";
    const body = JSON.stringify(payload);
    const signature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    // Deliver the webhook
    let status: "success" | "failed" = "failed";
    let statusCode: number | undefined;
    let responseBody: string | undefined;

    try {
      const res = await fetch(merchant.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-NexaPay-Signature": `sha256=${signature}`,
          "X-NexaPay-Event": payload.event,
        },
        body,
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      statusCode = res.status;
      responseBody = await res.text().catch(() => "");
      status = res.ok ? "success" : "failed";
    } catch (err) {
      console.error("Webhook delivery error:", err);
      statusCode = 0;
      responseBody = String(err);
      status = "failed";
    }

    // Save log
    await WebhookLog.create({
      userId,
      transactionReference: payload.reference,
      webhookUrl: merchant.webhookUrl,
      event: payload.event,
      payload,
      status,
      statusCode,
      responseBody: responseBody?.slice(0, 500), // limit response size
      attempts: 1,
    });

    console.log(`Webhook delivered to ${merchant.webhookUrl} — ${status} (${statusCode})`);
  } catch (error) {
    console.error("Webhook system error:", error);
  }
}