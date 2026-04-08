import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo_db";
import PaymentSession from "@/models/paymentSession";
import { getFeeBreakdown } from "@/lib/fees";

const NOTCHPAY_METHODS = ["mtn_money", "orange_money", "mobile_money", "visa", "mastercard"];

export async function POST(req: NextRequest) {
  try {
    const { sessionId, method, name, phone, email } = await req.json();

    if (!sessionId || !method) {
      return NextResponse.json(
        { error: "Missing sessionId or method" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const session = await PaymentSession.findOne({ sessionId });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.status !== "pending" || new Date() > session.expiresAt) {
      return NextResponse.json({ error: "Session expired or already used" }, { status: 410 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const normalizedMethod = method.toLowerCase();

    // ── NotchPay (MTN, Orange, Visa, Mastercard) ──
    if (NOTCHPAY_METHODS.includes(normalizedMethod)) {
      const res = await fetch(`${baseUrl}/api/notchpay/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: session.amount,
          currency: session.currency,
          email: email || session.customerEmail,
          name: name || session.customerName,
          phone: phone || session.customerPhone,
          channel: normalizedMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return NextResponse.json({ error: data.error || "Payment failed" }, { status: 400 });
      }

      // Update session with transaction reference
      await PaymentSession.findOneAndUpdate(
        { sessionId },
        { transactionReference: data?.transaction?.reference }
      );

      return NextResponse.json(data);
    }

    // ── PayPal ──
    if (method === "paypal") {
      const res = await fetch(`${baseUrl}/api/paypal/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: session.amount,
          currency: session.currency || "USD",
          description: session.description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return NextResponse.json({ error: data.error || "PayPal order failed" }, { status: 400 });
      }

      await PaymentSession.findOneAndUpdate(
        { sessionId },
        { transactionReference: data.id }
      );

      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unsupported payment method" }, { status: 400 });

  } catch (error) {
    console.error("Checkout pay error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}