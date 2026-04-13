import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo_db";
import PaymentSession from "@/models/paymentSession";

const NOTCHPAY_METHODS = ["mtn_money", "orange_money", "mobile_money", "visa", "mastercard"];
const PAYPAL_CURRENCIES = ["USD", "EUR", "GBP", "CAD"];

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
    // Save customer info to session
await PaymentSession.findOneAndUpdate(
  { sessionId },
  {
    ...(name && { customerName: name }),
    ...(phone && { customerPhone: phone }),
    ...(email && { customerEmail: email }),
  }
);

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
        amount: session.grossAmount || session.amount, // use grossAmount!
        currency: session.currency,
        email: email || session.customerEmail,
        name: name || session.customerName,
        phone: phone || session.customerPhone,
        channel: normalizedMethod,
      }),
    });

      const data = await res.json();

      if (!res.ok) {
        return NextResponse.json(
          { error: data.error || "Payment failed" },
          { status: 400 }
        );
      }

      // Save transaction reference to session
      await PaymentSession.findOneAndUpdate(
        { sessionId },
        { transactionReference: data?.transaction?.reference }
      );

      return NextResponse.json(data);
    }

    // ── PayPal ──
    if (normalizedMethod === "paypal") {
      // PayPal doesn't support XAF — default to USD if currency not supported
      const paypalCurrency = PAYPAL_CURRENCIES.includes(session.currency)
        ? session.currency
        : "USD";

      // PayPal works with decimals — convert if XAF (no decimals)
      const paypalAmount = session.currency === "XAF"
        ? (session.amount / 655).toFixed(2) // convert XAF to USD approx
        : session.amount.toFixed(2);

      const res = await fetch(`${baseUrl}/api/paypal/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: paypalAmount,
          currency: paypalCurrency,
          description: session.description || "Payment via NexaPay",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("PayPal order error:", data);
        return NextResponse.json(
          { error: data.error || "PayPal order failed" },
          { status: 400 }
        );
      }

      // Save PayPal order ID to session
      await PaymentSession.findOneAndUpdate(
        { sessionId },
        { transactionReference: data.id }
      );

      // Return the full PayPal response including links
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: "Unsupported payment method" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Checkout pay error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}