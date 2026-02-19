import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("=== CREATE ORDER API CALLED ===");
  
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
  const PAYPAL_API_URL = "https://api-m.sandbox.paypal.com";

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    console.error("Missing PayPal credentials");
    return NextResponse.json(
      { error: "PayPal credentials not configured" },
      { status: 500 }
    );
  }

  try {
    // Get access token
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
    
    const tokenResponse = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Token error:", tokenData);
      return NextResponse.json(
        { error: "Failed to get PayPal access token", details: tokenData },
        { status: 500 }
      );
    }

    const accessToken = tokenData.access_token;

    // Create order - MINIMAL structure
    const orderResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          amount: {
            currency_code: "USD",
            value: "1.00"
          }
        }]
      }),
    });

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      console.error("Order creation error:", orderData);
      return NextResponse.json(
        { error: "Failed to create PayPal order", details: orderData },
        { status: 500 }
      );
    }

    console.log("Order created:", orderData.id);
    return NextResponse.json({ id: orderData.id });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}