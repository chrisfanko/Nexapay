"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";

export default function PaypalButton() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

  if (!clientId) {
    return <p className="text-red-500">PayPal Client ID is missing!</p>;
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Complete Your Payment</h2>

      <PayPalScriptProvider
        options={{
          clientId: clientId,
          currency: "USD",
        }}
      >
        <PayPalButtons
          style={{ 
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "paypal"
          }}
          createOrder={async () => {
            console.log("=== CREATING ORDER ===");
            
            try {
              const res = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              });

              console.log("Response status:", res.status);

              if (!res.ok) {
                const errorText = await res.text();
                console.error("Create order failed:", errorText);
                throw new Error("Failed to create order");
              }

              const data = await res.json();
              console.log("=== ORDER DATA RECEIVED ===", data);
              console.log("Order ID being returned:", data.id);

              if (!data.id) {
                console.error("No order ID in response!");
                throw new Error("No order ID received from server");
              }

              // RETURN THE ORDER ID AS A STRING
              return data.id;
              
            } catch (error) {
              console.error("=== CREATE ORDER ERROR ===", error);
              alert("Failed to create order: " + error);
              throw error;
            }
          }}
          onApprove={async (data) => {
            console.log("=== PAYMENT APPROVED ===");
            console.log("Order ID from PayPal:", data.orderID);

            try {
              const response = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                  orderID: data.orderID 
                }),
              });

              const result = await response.json();
              console.log("=== CAPTURE RESULT ===", result);

              if (response.ok) {
                alert("Payment successful! ✅");
              } else {
                alert("Payment capture failed: " + JSON.stringify(result));
              }
            } catch (err) {
              console.error("=== CAPTURE ERROR ===", err);
              alert("Error capturing payment: " + err);
            }
          }}
          onError={(err) => {
            console.error("=== PAYPAL BUTTON ERROR ===", err);
            alert("PayPal Error: " + JSON.stringify(err));
          }}
          onCancel={() => {
            console.log("Payment cancelled by user");
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}