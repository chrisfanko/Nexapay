import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo_db";
import User from "@/models/users";

// ── CORS headers ───────────────────────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
};

// ── Handle preflight requests ──────────────────────────────
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// ── Supported methods ──────────────────────────────────────
const NOTCHPAY_METHODS = ["mtn_money", "orange_money", "mobile_money"];
const PAYPAL_METHODS = ["paypal"];
const CARD_METHODS = ["visa", "mastercard"];

// ── Validate API key helper ────────────────────────────────
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
      status: 401
    };
    return { merchant, mode: "live" as const };
  }
}

// ── Main unified endpoint ──────────────────────────────────
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
    const { amount, currency = "XAF", method, email, name, phone, description } = body;

    // 3. Validate required fields
    if (!amount || !method) {
      return NextResponse.json(
        { error: "Missing required fields: amount, method" },
        { status: 400, headers: corsHeaders }
      );
    }

    const normalizedMethod = method.toLowerCase();

    // 4. Route to the right provider
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    };

    // ── NotchPay (MTN, Orange, Mobile Money) ──
    if (NOTCHPAY_METHODS.includes(normalizedMethod)) {
      if (!name || !phone) {
        return NextResponse.json(
          { error: "Missing required fields for mobile money: name, phone" },
          { status: 400, headers: corsHeaders }
        );
      }

      const res = await fetch(`${baseUrl}/api/notchpay/initialize`, {
        method: "POST",
        headers,
        body: JSON.stringify({ amount, currency, email, name, phone, channel: normalizedMethod }),
      });

      const data = await res.json();
      return NextResponse.json({
        provider: "notchpay",
        method: normalizedMethod,
        mode,
        merchant: merchant.name,
        ...data,
      }, { status: res.status, headers: corsHeaders });
    }

    // ── PayPal ──
    if (PAYPAL_METHODS.includes(normalizedMethod)) {
      const res = await fetch(`${baseUrl}/api/paypal/create-order`, {
        method: "POST",
        headers,
        body: JSON.stringify({ amount, currency: currency || "USD", description }),
      });

      const data = await res.json();
      return NextResponse.json({
        provider: "paypal",
        method: normalizedMethod,
        mode,
        merchant: merchant.name,
        ...data,
      }, { status: res.status, headers: corsHeaders });
    }

    // ── Card (Visa/Mastercard) ──
    if (CARD_METHODS.includes(normalizedMethod)) {
      const res = await fetch(`${baseUrl}/api/notchpay/initialize`, {
        method: "POST",
        headers,
        body: JSON.stringify({ amount, currency, email, name, phone, channel: normalizedMethod }),
      });

      const data = await res.json();
      return NextResponse.json({
        provider: "notchpay",
        method: normalizedMethod,
        mode,
        merchant: merchant.name,
        ...data,
      }, { status: res.status, headers: corsHeaders });
    }

    // ── Unknown method ──
    return NextResponse.json(
      {
        error: `Unsupported payment method: ${method}`,
        supported_methods: [...NOTCHPAY_METHODS, ...PAYPAL_METHODS, ...CARD_METHODS]
      },
      { status: 400, headers: corsHeaders }
    );

  } catch (error) {
    console.error("Unified pay endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}