const PAYPAL_API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export async function getPayPalAccessToken(): Promise<string> {
  const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
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
    console.error("Failed to get PayPal access token:", errorData);
    throw new Error("Failed to authenticate with PayPal");
  }

  const data = await response.json();
  return data.access_token;
}

export { PAYPAL_API_BASE };