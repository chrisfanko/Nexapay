"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
  { id: "mtn_money", label: "MTN Money", icon: "📱", currency: ["XAF", "XOF"], needsPhone: true },
  { id: "orange_money", label: "Orange Money", icon: "🟠", currency: ["XAF", "XOF"], needsPhone: true },
  { id: "paypal", label: "PayPal", icon: "🅿️", currency: ["USD", "EUR", "GBP", "CAD", "XAF"], needsPhone: false },
  { id: "visa", label: "Visa", icon: "💳", currency: ["USD", "EUR", "XAF"], needsPhone: false },
  { id: "mastercard", label: "Mastercard", icon: "💳", currency: ["USD", "EUR", "XAF"], needsPhone: false },
];

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
      .then((res) => res.json())
      .then((data) => {
        if (data.error) { setError(data.error); }
        else {
          setSession(data.session);
          if (data.session.customerName) setName(data.session.customerName);
          if (data.session.customerEmail) setEmail(data.session.customerEmail);
          if (data.session.customerPhone) setPhone(data.session.customerPhone);
        }
        setLoading(false);
      })
      .catch(() => { setError(t("sessionExpired")); setLoading(false); });
  }, [sessionId, t]);

  const selectedMethodData = PAYMENT_METHODS.find((m) => m.id === selectedMethod);
  const needsPhone = selectedMethodData?.needsPhone ?? false;
  const isPayPal = selectedMethod === "paypal";
  const availableMethods = PAYMENT_METHODS.filter((m) => !session || m.currency.includes(session.currency));

  const handlePay = async () => {
    if (!selectedMethod || !session) return;
    setPaying(true);
    setPayError("");
    try {
      const res = await fetch("/api/checkout/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, method: selectedMethod, name, phone, email }),
      });
      const data = await res.json();
      if (!res.ok) { setPayError(data.error || t("sessionExpired")); setPaying(false); return; }
      if (data.authorization_url) { router.push(data.authorization_url); }
      else { setPayError(t("sessionExpired")); setPaying(false); }
    } catch {
      setPayError(t("sessionExpired"));
      setPaying(false);
    }
  };

  const isFormValid = name && (!needsPhone || phone) && selectedMethod;

  if (loading) {
    return (
      <main className="min-h-screen bg-linear-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">{t("loading")}</p>
        </div>
      </main>
    );
  }

  if (error || !session) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white shadow-lg rounded-2xl p-12 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">{t("sessionNotFound")}</h1>
          <p className="text-gray-500">{error || t("sessionExpired")}</p>
        </div>
      </main>
    );
  }

  const paypalCurrencies = ["USD", "EUR", "GBP", "CAD"];
  const paypalCurrency = paypalCurrencies.includes(session.currency) ? session.currency : "USD";
  const paypalAmount = session.currency === "XAF"
    ? (session.amount / 655).toFixed(2)
    : session.amount.toFixed(2);

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">N</span>
            </div>
            <span className="text-xl font-bold text-gray-800">
              Nexa<span className="text-blue-600">Pay</span>
            </span>
          </div>
          {session.mode === "test" && (
            <span className="block text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
              {t("testMode")}
            </span>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 px-6 py-4 text-white text-center">
            <p className="text-xs text-blue-100 mb-1">{t("payTo")} {session.merchantName}</p>
            <p className="text-3xl font-black">
              {session.currency} {(session.grossAmount || session.amount).toLocaleString()}
            </p>
            {session.nexapayFee > 0 && (
              <p className="text-xs text-blue-200 mt-1">
                {t("includesFee", { currency: session.currency, fee: session.nexapayFee.toLocaleString() })}
              </p>
            )}
            {session.description && (
              <p className="text-xs text-blue-100 mt-1">{session.description}</p>
            )}
          </div>

          <div className="p-5 space-y-4">
            <div className="space-y-2">
              <input type="text" placeholder={t("fullName")} value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
              {needsPhone && (
                <input type="tel" placeholder={t("phoneNumber")} value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
              )}
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">{t("selectMethod")}</p>
              <div className="grid grid-cols-2 gap-2">
                {availableMethods.map((method) => (
                  <button key={method.id} onClick={() => setSelectedMethod(method.id)}
                    className={`flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-xl border-2 transition-all text-center ${
                      selectedMethod === method.id ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                    }`}>
                    <span className="text-xl">{method.icon}</span>
                    <span className="text-xs font-medium text-gray-700 leading-tight">{method.label}</span>
                    {selectedMethod === method.id && <span className="text-xs text-blue-600">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {payError && (
              <p className="text-xs text-red-600 bg-red-50 px-4 py-2 rounded-lg">{payError}</p>
            )}

            {isPayPal && name ? (
              <PaypalButton amount={paypalAmount} currency={paypalCurrency}
                sessionId={sessionId as string} redirectUrl={session.successUrl} />
            ) : (
              <button onClick={handlePay} disabled={!isFormValid || paying || isPayPal}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors">
                {paying ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t("processing")}
                  </span>
                ) : isPayPal && !name ? t("enterName")
                  : t("pay", { currency: session.currency, amount: (session.grossAmount || session.amount).toLocaleString() })}
              </button>
            )}

            {session.cancelUrl && (
              <button onClick={() => router.push(session.cancelUrl!)}
                className="w-full text-xs text-gray-400 hover:text-gray-600 text-center">
                {t("cancel")}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">{t("secured")}</p>
      </div>
    </main>
  );
}