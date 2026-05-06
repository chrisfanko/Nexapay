"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const t = useTranslations("paymentSuccess");
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

  useEffect(() => {
    if (!reference) return;
    fetch(`/api/notchpay/verify?reference=${reference}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data?.transaction?.status === "complete" ? "success" : "failed");
      })
      .catch(() => setStatus("failed"));
  }, [reference]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white shadow-lg rounded-lg p-12 max-w-md w-full text-center">
          <div className="text-6xl mb-6 animate-pulse">⏳</div>
          <h1 className="text-2xl font-bold text-gray-600">{t("loading")}</h1>
        </div>
      </main>
    );
  }

  if (status === "failed") {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white shadow-lg rounded-lg p-12 max-w-md w-full text-center">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-3xl font-bold text-red-600 mb-4">{t("failed.title")}</h1>
          <p className="text-gray-600 mb-8">{t("failed.desc")}</p>
          <Link href="/" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition">
            {t("failed.backHome")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white shadow-lg rounded-lg p-12 max-w-md w-full text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">{t("success.title")}</h1>
        <p className="text-gray-600 mb-8">{t("success.desc")}</p>
        {reference && (
          <p className="text-sm text-gray-400 mb-6">{t("success.reference")} {reference}</p>
        )}
        <div className="space-y-3">
          <Link href="/" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition">
            {t("success.backHome")}
          </Link>
          <Link href="/dashboard" className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition">
            {t("success.viewTransactions")}
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  const t = useTranslations("paymentSuccess");
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white shadow-lg rounded-lg p-12 max-w-md w-full text-center">
          <div className="text-6xl mb-6 animate-pulse">⏳</div>
          <h1 className="text-2xl font-bold text-gray-600">{t("fallbackLoading")}</h1>
        </div>
      </main>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}