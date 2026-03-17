"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

  useEffect(() => {
    if (!reference) return;

    fetch(`/api/notchpay/verify?reference=${reference}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.transaction?.status === "complete") {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, [reference]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white shadow-lg rounded-lg p-12 max-w-md w-full text-center">
          <div className="text-6xl mb-6 animate-pulse">⏳</div>
          <h1 className="text-2xl font-bold text-gray-600">Verifying your payment...</h1>
        </div>
      </main>
    );
  }

  if (status === "failed") {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white shadow-lg rounded-lg p-12 max-w-md w-full text-center">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
          <p className="text-gray-600 mb-8">
            We could not verify your payment. Please try again or contact support.
          </p>
          <div className="space-y-3">
            <Link href="/" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white shadow-lg rounded-lg p-12 max-w-md w-full text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your payment. Your transaction has been completed successfully.
        </p>
        {reference && (
          <p className="text-sm text-gray-400 mb-6">Reference: {reference}</p>
        )}
        <div className="space-y-3">
          <Link href="/" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition">
            Back to Home
          </Link>
          <Link href="/dashboard" className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition">
            View Transactions
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white shadow-lg rounded-lg p-12 max-w-md w-full text-center">
          <div className="text-6xl mb-6 animate-pulse">⏳</div>
          <h1 className="text-2xl font-bold text-gray-600">Loading...</h1>
        </div>
      </main>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}