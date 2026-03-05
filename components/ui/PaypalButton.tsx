"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PaypalButtonProps {
  amount?: string;
  currency?: string;
}

export default function PaypalButton({
  amount = "10.00",
  currency = "USD",
}: PaypalButtonProps) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!clientId) {
    return <p className="text-red-500">PayPal Client ID is missing!</p>;
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Complete Your Payment</h2>

      {status === "success" && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          ✅ Payment successful! Redirecting...
        </div>
      )}

      {status === "error" && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          ❌ {errorMessage}
        </div>
      )}

      <PayPalScriptProvider
        options={{
          clientId: clientId,
          currency: currency,
        }}
      >
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "paypal",
          }}
          createOrder={async () => {
            try {
              const res = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, currency }),
              });

              if (!res.ok) {
                throw new Error("Failed to create order");
              }

              const data = await res.json();

              if (!data.id) {
                throw new Error("No order ID received from server");
              }

              return data.id;
            } catch (error) {
              setStatus("error");
              setErrorMessage("Failed to initiate payment. Please try again.");
              throw error;
            }
          }}
          onApprove={async (data) => {
            try {
              const response = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderID: data.orderID }),
              });

              const result = await response.json();

              if (response.ok) {
                setStatus("success");
                setTimeout(() => {
                  router.push("/payment/success");
                }, 2000);
              } else {
                setStatus("error");
                setErrorMessage("Payment capture failed. Please contact support.");
              }
            } catch (err) {
              setStatus("error");
              setErrorMessage("An unexpected error occurred.");
            }
          }}
          onError={() => {
            setStatus("error");
            setErrorMessage("PayPal encountered an error. Please try again.");
          }}
          onCancel={() => {
            setStatus("idle");
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}