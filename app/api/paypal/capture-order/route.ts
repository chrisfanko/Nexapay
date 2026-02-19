import { NextResponse } from "next/server";

const PAYPAL_API_BASE = process.env.PAYPAL_API_URL || 
  (process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com");

async function getAccessToken() {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials not configured");
  }

  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Failed to get access token:", errorData);
    throw new Error("Failed to authenticate with PayPal");
  }

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Capture request body:", body);
    
    const { orderID } = body;
    
    if (!orderID) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }
    
    const accessToken = await getAccessToken();

    console.log(`Attempting to capture order: ${orderID}`);

    const response = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error("PayPal capture error:", data);
      return NextResponse.json(
        { error: "PayPal capture failed", details: data },
        { status: response.status }
      );
    }
    
    console.log("Order captured successfully:", data.id);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    return NextResponse.json(
      { error: "Failed to capture order", details: String(error) },
      { status: 500 }
    );
  }
}