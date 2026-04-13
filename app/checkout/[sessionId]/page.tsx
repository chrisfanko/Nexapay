"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

  // Add fee fields
  grossAmount: number;
  nexapayFee: number;
  merchantAmount: number;
};

const PAYMENT_METHODS = [
  { id: "mtn_money", label: "MTN Money", icon: "📱", currency: ["XAF", "XOF"], needsPhone: true, needsEmail: false },
  { id: "orange_money", label: "Orange Money", icon: "🟠", currency: ["XAF", "XOF"], needsPhone: true, needsEmail: false },
  { id: "paypal", label: "PayPal", icon: "🅿️", currency: ["USD", "EUR", "GBP", "CAD", "XAF"], needsPhone: false, needsEmail: false },
  { id: "visa", label: "Visa", icon: "💳", currency: ["USD", "EUR", "XAF"], needsPhone: false, needsEmail: false },
  { id: "mastercard", label: "Mastercard", icon: "💳", currency: ["USD", "EUR", "XAF"], needsPhone: false, needsEmail: false },
];

export default function CheckoutPage() {
  const { sessionId } = useParams();
  const router = useRouter();

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
        if (data.error) {
          setError(data.error);
        } else {
          setSession(data.session);
          if (data.session.customerName) setName(data.session.customerName);
          if (data.session.customerEmail) setEmail(data.session.customerEmail);
          if (data.session.customerPhone) setPhone(data.session.customerPhone);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load payment session.");
        setLoading(false);
      });
  }, [sessionId]);

  const selectedMethodData = PAYMENT_METHODS.find((m) => m.id === selectedMethod);
  const needsPhone = selectedMethodData?.needsPhone ?? false;
  
  const isPayPal = selectedMethod === "paypal";

  const availableMethods = PAYMENT_METHODS.filter(
    (m) => !session || m.currency.includes(session.currency)
  );

  const handlePay = async () => {
    if (!selectedMethod || !session) return;
    setPaying(true);
    setPayError("");

    try {
      const res = await fetch("/api/checkout/pay", {
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

      const data = await res.json();

      if (!res.ok) {
        setPayError(data.error || "Payment failed. Please try again.");
        setPaying(false);
        return;
      }

      if (data.authorization_url) {
        router.push(data.authorization_url);
      } else {
        setPayError("Could not get payment URL. Please try again.");
        setPaying(false);
      }
    } catch {
      setPayError("A network error occurred. Please try again.");
      setPaying(false);
    }
  };

  const isFormValid =
    name &&
    (!needsPhone || phone) &&
    
    selectedMethod;

  if (loading) {
    return (
      <main className="min-h-screen bg-linear-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading payment...</p>
        </div>
      </main>
    );
  }

  if (error || !session) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white shadow-lg rounded-2xl p-12 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Session Not Found</h1>
          <p className="text-gray-500">{error || "This payment session is invalid or has expired."}</p>
        </div>
      </main>
    );
  }

  // PayPal amount handling
  const paypalCurrencies = ["USD", "EUR", "GBP", "CAD"];
  const paypalCurrency = paypalCurrencies.includes(session.currency)
    ? session.currency
    : "USD";
  const paypalAmount = session.currency === "XAF"
    ? (session.amount / 655).toFixed(2)
    : session.amount.toFixed(2);

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Header */}
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
              TEST MODE
            </span>
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

            
        {/* Amount banner */}
          <div className="bg-blue-600 px-6 py-4 text-white text-center">
            <p className="text-xs text-blue-100 mb-1">Pay to {session.merchantName}</p>
            <p className="text-3xl font-black">
              {session.currency} {(session.grossAmount || session.amount).toLocaleString()}
            </p>
            {session.nexapayFee > 0 && (
              <p className="text-xs text-blue-200 mt-1">
                Includes {session.currency} {session.nexapayFee.toLocaleString()} processing fee
              </p>
            )}
            {session.description && (
              <p className="text-xs text-blue-100 mt-1">{session.description}</p>
            )}
          </div>

          <div className="p-5 space-y-4">

            {/* Customer info */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
              {needsPhone && (
                <input
                  type="tel"
                  placeholder="Phone Number (e.g. 6XXXXXXXX)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              )}
               
            </div>

            {/* Payment methods — 2 columns */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Select payment method</p>
              <div className="grid grid-cols-2 gap-2">
                {availableMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-xl border-2 transition-all text-center ${
                      selectedMethod === method.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <span className="text-xl">{method.icon}</span>
                    <span className="text-xs font-medium text-gray-700 leading-tight">{method.label}</span>
                    {selectedMethod === method.id && (
                      <span className="text-xs text-blue-600">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {payError && (
              <p className="text-xs text-red-600 bg-red-50 px-4 py-2 rounded-lg">{payError}</p>
            )}

            {/* PayPal button OR regular pay button */}
            {isPayPal && name ? (
              <PaypalButton
                amount={paypalAmount}
                currency={paypalCurrency}
                sessionId={sessionId as string}
                redirectUrl={session.successUrl}
              />
            ) : (
              <button
                onClick={handlePay}
                disabled={!isFormValid || paying || isPayPal}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
              >
                {paying ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : isPayPal && !name ? (
                  "Enter your name to continue"
                ) : (
                  `Pay ${session.currency} ${(session.grossAmount || session.amount).toLocaleString()}`
                )}
              </button>
            )}

            {/* Cancel */}
            {session.cancelUrl && (
              <button
                onClick={() => router.push(session.cancelUrl!)}
                className="w-full text-xs text-gray-400 hover:text-gray-600 text-center"
              >
                Cancel and return to merchant
              </button>
            )}

          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Secured by NexaPay · All transactions are encrypted
        </p>
      </div>
    </main>
  );
}