"use client";

import PaypalButton from "@/components/ui/PaypalButton";
import { useState } from "react";

export default function PaypalCheckoutPage() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");
  const [ready, setReady] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    setReady(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">PayPal Payment</h1>

        <div className="bg-white shadow-lg rounded-lg p-8">
          {!ready ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="What are you paying for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setReady(false);
                  }}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  title="currency"
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Proceed to Pay {amount ? `${currency} ${Number(amount).toFixed(2)}` : ""}
              </button>
            </form>
          ) : (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1">{description || "Payment"}</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {currency} {Number(amount).toFixed(2)}
                </p>
              </div>

              <PaypalButton amount={Number(amount).toFixed(2)} currency={currency} />

              <button
                onClick={() => setReady(false)}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline w-full text-center"
              >
                ← Edit amount
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}