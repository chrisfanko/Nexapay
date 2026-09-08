"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Check,
  CircleAlert,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import PaypalButton from "@/components/ui/PaypalButton";

type Session = {
  sessionId: string;
  merchantName: string;
  amount: number;
  currency: string;
  description?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  mode: "live" | "test";
  status: string;
  successUrl?: string;
  cancelUrl?: string;
  grossAmount: number;
  nexapayFee: number;
  merchantAmount: number;
};

const PAYMENT_METHODS = [
  {
    id: "mtn_money",
    label: "MTN Money",
    logo: "/logos/mtn3.png",
    currency: ["XAF", "XOF"],
    needsPhone: true,
  },
  {
    id: "orange_money",
    label: "Orange Money",
    logo: "/logos/om.png",
    currency: ["XAF", "XOF"],
    needsPhone: true,
  },
  {
    id: "paypal",
    label: "PayPal",
    logo: "/logos/paypal.png",
    currency: ["USD", "EUR", "GBP", "CAD", "XAF"],
    needsPhone: false,
  },
  {
    id: "visa",
    label: "Visa",
    logo: "/logos/visa.png",
    currency: ["USD", "EUR", "XAF"],
    needsPhone: false,
  },
  {
    id: "mastercard",
    label: "Mastercard",
    logo: "/logos/mastercard.png",
    currency: ["USD", "EUR", "XAF"],
    needsPhone: false,
  },
];

const fieldClassName =
  "w-full border border-slate-300 bg-white px-3.5 py-3 text-sm text-[#0A0A0A] outline-none transition placeholder:text-slate-400 focus:border-[#1E6FFF] focus:ring-2 focus:ring-blue-100";

export default function CheckoutPage() {
  const { sessionId } = useParams();
  const router = useRouter();
  const t = useTranslations("checkout");

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    fetch(`/api/checkout/session?sessionId=${sessionId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }

        setSession(data.session);
        setName(data.session.customerName || "");
        setEmail(data.session.customerEmail || "");
        setPhone(data.session.customerPhone || "");
      })
      .catch(() => setError(t("sessionExpired")))
      .finally(() => setLoading(false));
  }, [sessionId, t]);

  const selectedMethodData = PAYMENT_METHODS.find(
    (method) => method.id === selectedMethod
  );
  const needsPhone = selectedMethodData?.needsPhone ?? false;
  const isPayPal = selectedMethod === "paypal";

  const availableMethods = PAYMENT_METHODS.filter(
    (method) => !session || method.currency.includes(session.currency)
  );

  const handlePay = async () => {
    if (!selectedMethod || !session) return;

    setPaying(true);
    setPayError("");

    try {
      const response = await fetch("/api/checkout/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          method: selectedMethod,
          name,
          phone,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPayError(data.error || t("sessionExpired"));
        return;
      }

      if (data.authorization_url) {
        router.push(data.authorization_url);
        return;
      }

      setPayError(t("sessionExpired"));
    } catch {
      setPayError(t("sessionExpired"));
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return <CheckoutState message={t("loading")} loading />;
  }

  if (error || !session) {
    return (
      <CheckoutState
        description={error || t("sessionExpired")}
        message={t("sessionNotFound")}
      />
    );
  }

  const grossAmount = session.grossAmount || session.amount;
  const formattedAmount = new Intl.NumberFormat().format(grossAmount);
  const isFormValid = Boolean(name && selectedMethod && (!needsPhone || phone));

  const paypalCurrencies = ["USD", "EUR", "GBP", "CAD"];
  const paypalCurrency = paypalCurrencies.includes(session.currency)
    ? session.currency
    : "USD";
  const paypalAmount =
    session.currency === "XAF"
      ? (session.amount / 655).toFixed(2)
      : session.amount.toFixed(2);

  return (
    <main className="min-h-screen bg-slate-50 text-[#0A0A0A]">
      <CheckoutHeader testMode={session.mode === "test"} />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden border border-slate-200 bg-white lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="p-5 sm:p-8">
            <div className="border-b border-slate-200 pb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
                {t("payTo")}
              </p>
              <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                {session.merchantName}
              </h1>
              {session.description && (
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                  {session.description}
                </p>
              )}
            </div>

            <div className="mt-7">
              <label
                className="text-sm font-semibold text-[#0A0A0A]"
                htmlFor="customer-name"
              >
                {t("fullName")}
              </label>
              <input
                className={`${fieldClassName} mt-2`}
                id="customer-name"
                onChange={(event) => setName(event.target.value)}
                placeholder={t("fullName")}
                type="text"
                value={name}
              />
            </div>

            {needsPhone && (
              <div className="mt-5">
                <label
                  className="text-sm font-semibold text-[#0A0A0A]"
                  htmlFor="customer-phone"
                >
                  {t("phoneNumber")}
                </label>
                <input
                  className={`${fieldClassName} mt-2`}
                  id="customer-phone"
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder={t("phoneNumber")}
                  type="tel"
                  value={phone}
                />
              </div>
            )}

            <div className="mt-8">
              <p className="text-sm font-semibold text-[#0A0A0A]">
                {t("selectMethod")}
              </p>

              <div className="mt-3 grid border-l border-t border-slate-200 sm:grid-cols-2">
                {availableMethods.map((method) => {
                  const isSelected = selectedMethod === method.id;

                  return (
                    <button
                      aria-pressed={isSelected}
                      className={`relative flex min-h-24 items-center gap-4 border-b border-r border-slate-200 p-4 text-left transition-colors ${
                        isSelected
                          ? "bg-blue-50"
                          : "bg-white hover:bg-slate-50"
                      }`}
                      key={method.id}
                      onClick={() => {
                        setSelectedMethod(method.id);
                        setPayError("");
                      }}
                      type="button"
                    >
                      <span className="relative flex size-11 shrink-0 items-center justify-center border border-slate-200 bg-white p-2">
                        <Image
                          alt={`${method.label} logo`}
                          className="object-contain"
                          fill
                          sizes="44px"
                          src={method.logo}
                        />
                      </span>

                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-[#0A0A0A]">
                          {method.label}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">
                          {method.needsPhone
                            ? "Pay securely using your mobile money account."
                            : "Continue securely with this payment method."}
                        </span>
                      </span>

                      {isSelected && (
                        <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-[#1E6FFF] text-white">
                          <Check className="size-3.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {payError && (
              <div
                className="mt-6 flex gap-3 border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
                role="alert"
              >
                <CircleAlert className="mt-0.5 size-4 shrink-0" />
                <p>{payError}</p>
              </div>
            )}

            <div className="mt-8">
              {isPayPal && name ? (
                <PaypalButton
                  amount={paypalAmount}
                  currency={paypalCurrency}
                  customerEmail={email}
                  customerName={name}
                  customerPhone={phone}
                  redirectUrl={session.successUrl}
                  sessionId={sessionId as string}
                />
              ) : (
                <button
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1E6FFF] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#175ED8] disabled:cursor-not-allowed disabled:bg-slate-300"
                  disabled={!isFormValid || paying || isPayPal}
                  onClick={handlePay}
                  type="button"
                >
                  {paying ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" />
                      {t("processing")}
                    </>
                  ) : isPayPal && !name ? (
                    t("enterName")
                  ) : (
                    t("pay", {
                      currency: session.currency,
                      amount: formattedAmount,
                    })
                  )}
                </button>
              )}

              {session.cancelUrl && (
                <button
                  className="mt-4 w-full text-center text-xs font-medium text-slate-500 transition-colors hover:text-[#0A0A0A]"
                  onClick={() => router.push(session.cancelUrl!)}
                  type="button"
                >
                  {t("cancel")}
                </button>
              )}
            </div>
          </section>

          <aside className="border-t border-slate-200 bg-[#0A0A0A] p-6 text-white sm:p-8 lg:border-l lg:border-t-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
              Payment summary
            </p>

            <div className="mt-8 border-y border-white/15 py-6">
              <p className="text-sm text-slate-400">Amount to pay</p>
              <p className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
                {session.currency} {formattedAmount}
              </p>
            </div>

            <div className="divide-y divide-white/10">
              <SummaryRow
                label="Order amount"
                value={`${session.currency} ${new Intl.NumberFormat().format(
                  session.merchantAmount || session.amount
                )}`}
              />
              {session.nexapayFee > 0 && (
                <SummaryRow
                  label={t("includesFee", {
                    currency: session.currency,
                    fee: new Intl.NumberFormat().format(session.nexapayFee),
                  })}
                  value=""
                />
              )}
            </div>

            <div className="mt-8 flex gap-3 border border-white/15 p-4">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#1E6FFF]" />
              <p className="text-sm leading-6 text-slate-300">{t("secured")}</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function CheckoutHeader({ testMode }: { testMode: boolean }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#1E6FFF] text-sm font-extrabold text-white">
            N
          </span>
          <span className="text-lg font-semibold tracking-[-0.03em] text-[#0A0A0A]">
            Nexa<span className="text-[#1E6FFF]">Pay</span>
          </span>
        </div>

        {testMode ? (
          <span className="border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-800">
            Test mode
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
            <LockKeyhole className="size-3.5 text-[#1E6FFF]" />
            Secure checkout
          </span>
        )}
      </div>
    </header>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 text-sm">
      <span className="leading-6 text-slate-400">{label}</span>
      {value && <span className="shrink-0 font-medium text-slate-200">{value}</span>}
    </div>
  );
}

function CheckoutState({
  description,
  loading = false,
  message,
}: {
  description?: string;
  loading?: boolean;
  message: string;
}) {
  return (
    <main className="min-h-screen bg-slate-50">
      <CheckoutHeader testMode={false} />

      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-md border border-slate-200 bg-white p-8 text-center">
          {loading ? (
            <LoaderCircle className="mx-auto size-6 animate-spin text-[#1E6FFF]" />
          ) : (
            <CircleAlert className="mx-auto size-6 text-red-600" />
          )}
          <h1 className="mt-5 text-2xl font-semibold tracking-[-0.04em]">
            {message}
          </h1>
          {description && (
            <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
          )}
        </div>
      </div>
    </main>
  );
}