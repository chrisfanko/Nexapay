"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, CheckCircle, Clock, XCircle } from "lucide-react";

const BUSINESS_TYPES = [
  "E-commerce",
  "Fintech",
  "SaaS",
  "Healthcare",
  "Education",
  "Logistics",
  "Travel",
  "Entertainment",
  "Food & Beverage",
  "Real Estate",
  "NGO / Non-profit",
  "Other",
];

const AFRICAN_COUNTRIES = [
  "Cameroon", "Nigeria", "Ghana", "Kenya", "Senegal",
  "Côte d'Ivoire", "South Africa", "Tanzania", "Uganda",
  "Rwanda", "Ethiopia", "Mozambique", "Zambia", "Zimbabwe",
  "Mali", "Burkina Faso", "Guinea", "Benin", "Togo", "Other",
];

export default function RegisterBusinessPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    companyName: "",
    businessType: "",
    country: "",
    phone: "",
    website: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    router.push("/sign-in");
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/business/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-black text-zinc-900 mb-2">Application Submitted!</h1>
          <p className="text-gray-500 mb-6">
            Your business application is now under review. We will notify you once it is approved. This usually takes 24-48 hours.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-500 shrink-0" />
            <p className="text-sm text-yellow-700 text-left">
              Your account is <strong>pending approval</strong>. API keys and webhooks will be available once approved.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition inline-block"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-black text-zinc-900">Register Your Business</h1>
          <p className="text-gray-500 mt-2">
            Complete your business profile to get access to API keys, webhooks, and the developer portal.
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { step: "1", label: "Sign Up", done: true },
            { step: "2", label: "Register Business", done: false, active: true },
            { step: "3", label: "Get Approved", done: false },
            { step: "4", label: "Start Integrating", done: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 ${item.active ? "text-blue-600" : item.done ? "text-green-500" : "text-gray-400"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  item.active ? "border-blue-500 bg-blue-50 text-blue-600" :
                  item.done ? "border-green-500 bg-green-50 text-green-600" :
                  "border-gray-300 text-gray-400"
                }`}>
                  {item.done ? "✓" : item.step}
                </div>
                <span className="text-xs font-medium hidden sm:block">{item.label}</span>
              </div>
              {i < 3 && <div className="w-6 h-px bg-gray-300" />}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Acme Corp"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Business Type + Country (side by side) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
                  Business Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="businessType"
                  value={form.businessType}
                  onChange={handleChange}
                  required
                  title="Select business type"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type...</option>
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  required
                  title="Select country"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select country...</option>
                  {AFRICAN_COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
                Business Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+237 6XX XXX XXX"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
                Website <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="url"
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://yourcompany.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
                Business Description <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Briefly describe what your business does..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                <XCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <Link href="/dashboard" className="text-blue-500 hover:underline">
            Go to Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}