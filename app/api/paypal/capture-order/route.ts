import { getPayPalAccessToken, PAYPAL_API_BASE } from "@/lib/aggregators/paypal/client";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo_db";
import Transaction from "@/models/transaction";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderID } = body;

    if (!orderID) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // 1. Capture the PayPal order
    const accessToken = await getPayPalAccessToken();

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

      // Update transaction as failed in DB
      try {
        await connectToDatabase();
        await Transaction.findOneAndUpdate(
          { reference: orderID },
          {
            status: "failed",
            failureReason: data?.message || "PayPal capture failed",
          }
        );
      } catch (dbError) {
        console.error("Failed to update failed PayPal transaction:", dbError);
      }

      return NextResponse.json(
        { error: "PayPal capture failed", details: data },
        { status: response.status }
      );
    }

    // 2. Extract customer name from PayPal response
    const payer = data?.payer;
    const customerName = payer
      ? `${payer.name?.given_name || ""} ${payer.name?.surname || ""}`.trim()
      : "PayPal Customer";

    // 3. Update the pending transaction to complete in MongoDB
    try {
      await connectToDatabase();

      await Transaction.findOneAndUpdate(
        { reference: orderID },
        {
          status: "complete",
          customerName,
        }
      );

      console.log(`PayPal transaction ${orderID} captured and updated to complete`);
    } catch (dbError) {
      console.error("Failed to update PayPal transaction in DB:", dbError);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    return NextResponse.json(
      { error: "Failed to capture order", details: String(error) },
      { status: 500 }
    );
  }
}