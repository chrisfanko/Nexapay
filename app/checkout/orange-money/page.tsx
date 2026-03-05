"use client";

import { useState } from "react";

export default function OrangeMoneyCheckout() {
  const [form, setForm] = useState({ name: "",  phone: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/notchpay/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
        currency: "XAF",
        channel: "Orange Money",
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data?.authorization_url) {
      window.location.href = data.authorization_url;
    } else {
      setError(data.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-orange-500">Orange Money</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          required
          className="w-full border p-3 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
         
        <input
          type="tel"
          placeholder="Phone (e.g. 6XXXXXXXX)"
          required
          className="w-full border p-3 rounded"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount (XAF)"
          required
          className="w-full border p-3 rounded"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-3 rounded font-semibold hover:bg-orange-600 transition"
        >
          {loading ? "Processing..." : "Pay with Orange Money"}
        </button>
      </form>
    </div>
  );
}