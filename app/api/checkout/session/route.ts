import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo_db";
import PaymentSession from "@/models/paymentSession";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    await connectToDatabase();
    const session = await PaymentSession.findOne({ sessionId });

    if (!session) {
      return NextResponse.json({ error: "Payment session not found" }, { status: 404 });
    }

    if (session.status === "expired" || new Date() > session.expiresAt) {
      return NextResponse.json({ error: "Payment session has expired" }, { status: 410 });
    }

    if (session.status === "completed") {
      return NextResponse.json({ error: "Payment already completed" }, { status: 410 });
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error("Session fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}