"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  // ✅ Fixed: initial state is "loading" not "success"
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [errorMessage, setErrorMessage] = useState(
    "We could not verify your payment."
  );

  useEffect(() => {
    // No reference in the URL — something went wrong before payment
    if (!reference) {
      setErrorMessage(
        "No payment reference found. The payment may not have been initiated correctly."
      );
      setStatus("failed");
      return;
    }

    // Call verify endpoint — it verifies with NotchPay AND saves to MongoDB
    fetch(`/api/notchpay/verify?reference=${reference}`)
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          // Server-side error (e.g. NotchPay unreachable)
          setErrorMessage(
            data.error || "Something went wrong while verifying your payment."
          );
          setStatus("failed");
          return;
        }

        if (data?.transaction?.status === "complete") {
          setStatus("success");
        } else {
          // Payment exists but wasn't completed
          setErrorMessage(
            data?.transaction?.message ||
              "Your payment was not completed. Please try again."
          );
          setStatus("failed");
        }
      })
      .catch(() => {
        // Network error
        setErrorMessage(
          "A network error occurred. Please check your connection and try again."
        );
        setStatus("failed");
      });
  }, [reference]);

  // Loading state
  if (status === "loading") {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white shadow-lg rounded-lg p-12 max-w-md w-full text-center">
          <div className="text-6xl mb-6 animate-pulse">⏳</div>
          <h1 className="text-2xl font-bold text-gray-600">
            Verifying your payment...
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Please wait, do not close this page.
          </p>
        </div>
      </main>
    );
  }

  // Failed state
  if (status === "failed") {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white shadow-lg rounded-lg p-12 max-w-md w-full text-center">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Payment Failed
          </h1>
          <p className="text-gray-600 mb-2">{errorMessage}</p>
          {reference && (
            <p className="text-xs text-gray-400 mb-8">Reference: {reference}</p>
          )}
          <div className="space-y-3">
            <Link
              href="/solutions"
              className="block w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Success state
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white shadow-lg rounded-lg p-12 max-w-md w-full text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-4">
          Thank you for your payment. Your transaction has been recorded
          successfully.
        </p>
        {reference && (
          <p className="text-sm text-gray-400 mb-8">Reference: {reference}</p>
        )}
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            View Transactions
          </Link>
        </div>
      </div>
    </main>
  );
}