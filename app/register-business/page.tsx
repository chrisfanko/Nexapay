"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Building2, CheckCircle, Clock, XCircle } from "lucide-react";

const BUSINESS_TYPES = [
  "E-commerce", "Fintech", "SaaS", "Healthcare", "Education",
  "Logistics", "Travel", "Entertainment", "Food & Beverage",
  "Real Estate", "NGO / Non-profit", "Other",
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
  const t = useTranslations("registerBusiness");

  const [form, setForm] = useState({
    companyName: "", businessType: "", country: "",
    phone: "", website: "", description: "",
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

  if (!session) { router.push("/sign-in"); return null; }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
    if (!res.ok) { setError(data.error || t("form.errorFallback")); setLoading(false); return; }
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
          <h1 className="text-2xl font-black text-zinc-900 mb-2">{t("success.title")}</h1>
          <p className="text-gray-500 mb-6">{t("success.desc")}</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-500 shrink-0" />
            <p className="text-sm text-yellow-700 text-left">
              Your account is <strong>{t("success.pendingLabel")}</strong>. {t("success.pendingDesc")}
            </p>
          </div>
          <Link href="/dashboard" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition inline-block">
            {t("success.goToDashboard")}
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { label: t("steps.signUp"), done: true },
    { label: t("steps.registerBusiness"), done: false, active: true },
    { label: t("steps.getApproved"), done: false },
    { label: t("steps.startIntegrating"), done: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-black text-zinc-900">{t("title")}</h1>
          <p className="text-gray-500 mt-2">{t("subtitle")}</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 ${item.active ? "text-blue-600" : item.done ? "text-green-500" : "text-gray-400"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  item.active ? "border-blue-500 bg-blue-50 text-blue-600" :
                  item.done ? "border-green-500 bg-green-50 text-green-600" :
                  "border-gray-300 text-gray-400"
                }`}>
                  {item.done ? "✓" : i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:block">{item.label}</span>
              </div>
              {i < steps.length - 1 && <div className="w-6 h-px bg-gray-300" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
                {t("form.companyName")} <span className="text-red-500">*</span>
              </label>
              <input type="text" name="companyName" value={form.companyName} onChange={handleChange}
                placeholder={t("form.companyNamePlaceholder")} required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
                  {t("form.businessType")} <span className="text-red-500">*</span>
                </label>
                <select name="businessType" value={form.businessType} onChange={handleChange} required
                  title={t("form.businessType")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">{t("form.businessTypePlaceholder")}</option>
                  {BUSINESS_TYPES.map((bt) => <option key={bt} value={bt}>{bt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
                  {t("form.country")} <span className="text-red-500">*</span>
                </label>
                <select name="country" value={form.country} onChange={handleChange} required
                  title={t("form.country")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">{t("form.countryPlaceholder")}</option>
                  {AFRICAN_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
                {t("form.phone")} <span className="text-red-500">*</span>
              </label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                placeholder="+237 6XX XXX XXX" required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
                {t("form.website")} <span className="text-gray-400 font-normal">({t("form.optional")})</span>
              </label>
              <input type="url" name="website" value={form.website} onChange={handleChange}
                placeholder="https://yourcompany.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
                {t("form.description")} <span className="text-gray-400 font-normal">({t("form.optional")})</span>
              </label>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder={t("form.descriptionPlaceholder")} rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                <XCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("form.submitting")}
                </>
              ) : t("form.submit")}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/dashboard" className="text-blue-500 hover:underline">{t("goToDashboard")}</Link>
        </p>
      </div>
    </div>
  );
}