import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo_db";
import User from "@/models/users";
import PaymentSession from "@/models/paymentSession";
import crypto from "crypto";
import { getFeeBreakdown } from "@/lib/fees";

// ── CORS headers ───────────────────────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// ── Validate API key ───────────────────────────────────────
async function validateApiKey(apiKey: string) {
  await connectToDatabase();
  const isTestKey = apiKey.startsWith("npk_test_");

  let merchant;
  if (isTestKey) {
    merchant = await User.findOne({ testApiKey: apiKey });
    if (!merchant) return { error: "Invalid test API key", status: 401 };
    return { merchant, mode: "test" as const };
  } else {
    merchant = await User.findOne({ apiKey, merchantStatus: "approved" });
    if (!merchant) return {
      error: "Invalid or unauthorized API key. Make sure your business is approved.",
      status: 401,
    };
    return { merchant, mode: "live" as const };
  }
}

// ── Main endpoint ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // 1. Check API key
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing x-api-key header" },
        { status: 401, headers: corsHeaders }
      );
    }

    const authResult = await validateApiKey(apiKey);
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status, headers: corsHeaders }
      );
    }

    const { merchant, mode } = authResult;

    // 2. Parse body
    const body = await req.json();
    const {
      amount,
      currency = "XAF",
      description,
      customerName,
      customerEmail,
      customerPhone,
      successUrl,
      cancelUrl,
    } = body;

    // 3. Validate required fields
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json(
        { error: "Invalid or missing amount" },
        { status: 400, headers: corsHeaders }
      );
    }

    // 4. Create payment session
    await connectToDatabase();
    const sessionId = crypto.randomBytes(16).toString("hex");

    // Calculate fees at session creation
  const provider = ["USD", "EUR", "GBP", "CAD"].includes(currency) 
    ? "paypal" 
    : "notchpay";
  const fees = getFeeBreakdown(Number(amount), provider);

  await PaymentSession.create({
    sessionId,
    merchantId: merchant._id,
    merchantName: merchant.name,
    mode,
    amount: Number(amount),        // original merchant amount
    currency,
    description,
    customerName,
    customerEmail,
    customerPhone,
    successUrl,
    cancelUrl,
    // Store full fee breakdown
    merchantAmount: fees.merchantAmount,
    nexapayFee: fees.nexapayFee,
    grossAmount: fees.grossAmount,
    providerFee: fees.providerFee,
    netAmount: fees.netAmount,
  });

    // 5. Return checkout URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const checkoutUrl = `${baseUrl}/checkout/${sessionId}`;

      return NextResponse.json(
    {
      success: true,
      checkout_url: checkoutUrl,
      session_id: sessionId,
      mode,
      amount: Number(amount),
      grossAmount: fees.grossAmount,
      nexapayFee: fees.nexapayFee,
      currency,
      expires_at: new Date(Date.now() + 60 * 60 * 1000),
    },
    { headers: corsHeaders }
  );

  } catch (error) {
    console.error("Pay endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
   
}