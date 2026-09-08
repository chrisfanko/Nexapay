"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";

type PaymentStatus = "loading" | "success" | "failed";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const t = useTranslations("paymentSuccess");
  const [status, setStatus] = useState<PaymentStatus>("loading");
  
  useEffect(() => {
  if (!reference) return;

  fetch(`/api/notchpay/verify?reference=${reference}`)
    .then((response) => response.json())
    .then((data) => {
      setStatus(
        data?.transaction?.status === "complete" ? "success" : "failed"
      );
    })
    .catch(() => setStatus("failed"));
}, [reference]);

  if (status === "loading") {
    return <PaymentResultShell loading title={t("loading")} />;
  }

  if (!reference || status === "failed") {
    return (
      <PaymentResultShell
        action={
          <Link
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#1E6FFF] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#175ED8]"
            href="/"
          >
            {t("failed.backHome")}
          </Link>
        }
        description={t("failed.desc")}
        icon={<CircleAlert className="size-6 text-red-600" />}
        label="Payment status"
        title={t("failed.title")}
      />
    );
  }

  return (
    <PaymentResultShell
      action={
        <div className="space-y-3">
          <Link
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#1E6FFF] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#175ED8]"
            href="/"
          >
            {t("success.backHome")}
          </Link>
          <Link
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-slate-300 px-5 text-sm font-semibold text-[#0A0A0A] transition-colors hover:border-[#0A0A0A] hover:bg-slate-50"
            href="/dashboard"
          >
            {t("success.viewTransactions")}
          </Link>
        </div>
      }
      description={t("success.desc")}
      icon={<CheckCircle2 className="size-6 text-[#1E6FFF]" />}
      label="Payment confirmed"
      reference={reference}
      referenceLabel={t("success.reference")}
      title={t("success.title")}
    />
  );
}

export default function PaymentSuccessPage() {
  const t = useTranslations("paymentSuccess");

  return (
    <Suspense fallback={<PaymentResultShell loading title={t("fallbackLoading")} />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentResultShell({
  action,
  description,
  icon,
  label,
  loading = false,
  reference,
  referenceLabel,
  title,
}: {
  action?: React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
  label?: string;
  loading?: boolean;
  reference?: string | null;
  referenceLabel?: string;
  title: string;
}) {
  return (
    <main className="min-h-screen bg-slate-50 text-[#0A0A0A]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link aria-label="NexaPay home" className="flex items-center gap-2.5" href="/">
            <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#1E6FFF] text-sm font-extrabold text-white">
              N
            </span>
            <span className="text-lg font-semibold tracking-[-0.03em]">
              Nexa<span className="text-[#1E6FFF]">Pay</span>
            </span>
          </Link>

          <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
            <LockKeyhole className="size-3.5 text-[#1E6FFF]" />
            Secure payment
          </span>
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <section className="mx-auto grid w-full max-w-2xl overflow-hidden border border-slate-200 bg-white sm:grid-cols-[112px_minmax(0,1fr)]">
          <div className="flex items-start justify-center border-b border-slate-200 bg-[#0A0A0A] p-8 sm:border-b-0 sm:border-r sm:border-white/15">
            <span className="flex size-11 items-center justify-center rounded-lg bg-white text-[#0A0A0A]">
              {loading ? (
                <LoaderCircle className="size-5 animate-spin text-[#1E6FFF]" />
              ) : (
                icon
              )}
            </span>
          </div>

          <div className="p-6 sm:p-8">
            {label && (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
                {label}
              </p>
            )}

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">
              {title}
            </h1>

            {description && (
              <p className="mt-4 text-sm leading-6 text-slate-600">{description}</p>
            )}

            {reference && (
              <div className="mt-6 border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {referenceLabel}
                </p>
                <p className="mt-2 break-all font-mono text-sm text-[#0A0A0A]">
                  {reference}
                </p>
              </div>
            )}

            {action && <div className="mt-7">{action}</div>}
          </div>
        </section>
      </div>
    </main>
  );
}