"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CircleAlert,
  Clock3,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";

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
  "Cameroon",
  "Nigeria",
  "Ghana",
  "Kenya",
  "Senegal",
  "Côte d'Ivoire",
  "South Africa",
  "Tanzania",
  "Uganda",
  "Rwanda",
  "Ethiopia",
  "Mozambique",
  "Zambia",
  "Zimbabwe",
  "Mali",
  "Burkina Faso",
  "Guinea",
  "Benin",
  "Togo",
  "Other",
];

const fieldClassName =
  "mt-2 block w-full border border-slate-300 bg-white px-3.5 py-3 text-sm text-[#0A0A0A] outline-none transition placeholder:text-slate-400 focus:border-[#1E6FFF] focus:ring-2 focus:ring-blue-100";

export default function RegisterBusinessPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations("registerBusiness");

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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/sign-in");
    }
  }, [router, status]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/business/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t("form.errorFallback"));
        return;
      }

      setSuccess(true);
    } catch {
      setError(t("form.errorFallback"));
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <LoaderCircle className="size-6 animate-spin text-[#1E6FFF]" />
      </main>
    );
  }

  const steps = [
    { label: t("steps.signUp"), complete: true },
    { label: t("steps.registerBusiness"), active: true },
    { label: t("steps.getApproved") },
    { label: t("steps.startIntegrating") },
  ];

  if (success) {
    return (
      <main className="min-h-screen bg-slate-50">
        <BrandHeader />

        <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-6 py-16 lg:px-8">
          <div className="mx-auto w-full max-w-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-6 sm:p-8">
              <div className="flex size-11 items-center justify-center rounded-lg bg-blue-50 text-[#1E6FFF]">
                <CheckCircle2 className="size-5" />
              </div>

              <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
                {t("success.pendingLabel")}
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#0A0A0A]">
                {t("success.title")}
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-6 text-slate-600">
                {t("success.desc")}
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex gap-3 border border-amber-200 bg-amber-50 p-4">
                <Clock3 className="mt-0.5 size-4 shrink-0 text-amber-700" />
                <p className="text-sm leading-6 text-amber-900">
                  Your account is <strong>{t("success.pendingLabel")}</strong>.{" "}
                  {t("success.pendingDesc")}
                </p>
              </div>

              <Link
                href="/dashboard"
                className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1E6FFF] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#175ED8]"
              >
                {t("success.goToDashboard")}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-[#0A0A0A]">
      <BrandHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
            Merchant onboarding
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
        <ol className="grid border-l border-t border-slate-200 bg-white sm:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.label}
              className="border-b border-r border-slate-200 p-4 sm:p-5"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                    step.complete
                      ? "border-[#1E6FFF] bg-[#1E6FFF] text-white"
                      : step.active
                        ? "border-[#1E6FFF] bg-blue-50 text-[#1E6FFF]"
                        : "border-slate-300 text-slate-400"
                  }`}
                >
                  {step.complete ? <CheckCircle2 className="size-4" /> : index + 1}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    step.active || step.complete
                      ? "text-[#0A0A0A]"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 grid border border-slate-200 bg-white lg:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.28fr)]">
          <div className="p-6 sm:p-8">
            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-xl font-semibold tracking-[-0.03em]">
                Business details
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Tell us about the business that will use NexaPay.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-6">
              <FieldLabel required>{t("form.companyName")}</FieldLabel>
              <input
                className={fieldClassName}
                name="companyName"
                onChange={handleChange}
                placeholder={t("form.companyNamePlaceholder")}
                required
                type="text"
                value={form.companyName}
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <FieldLabel required>{t("form.businessType")}</FieldLabel>
                  <select
                    className={fieldClassName}
                    name="businessType"
                    onChange={handleChange}
                    required
                    title={t("form.businessType")}
                    value={form.businessType}
                  >
                    <option value="">
                      {t("form.businessTypePlaceholder")}
                    </option>
                    {BUSINESS_TYPES.map((businessType) => (
                      <option key={businessType} value={businessType}>
                        {businessType}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel required>{t("form.country")}</FieldLabel>
                  <select
                    className={fieldClassName}
                    name="country"
                    onChange={handleChange}
                    required
                    title={t("form.country")}
                    value={form.country}
                  >
                    <option value="">{t("form.countryPlaceholder")}</option>
                    {AFRICAN_COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <FieldLabel required>{t("form.phone")}</FieldLabel>
                <input
                  className={fieldClassName}
                  name="phone"
                  onChange={handleChange}
                  placeholder="+237 6XX XXX XXX"
                  required
                  type="tel"
                  value={form.phone}
                />
              </div>

              <div>
                <FieldLabel optional>{t("form.website")}</FieldLabel>
                <input
                  className={fieldClassName}
                  name="website"
                  onChange={handleChange}
                  placeholder="https://yourcompany.com"
                  type="url"
                  value={form.website}
                />
              </div>

              <div>
                <FieldLabel optional>{t("form.description")}</FieldLabel>
                <textarea
                  className={`${fieldClassName} min-h-28 resize-y`}
                  name="description"
                  onChange={handleChange}
                  placeholder={t("form.descriptionPlaceholder")}
                  rows={4}
                  value={form.description}
                />
              </div>

              {error && (
                <div
                  className="flex gap-3 border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
                  role="alert"
                >
                  <CircleAlert className="mt-0.5 size-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <button
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1E6FFF] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#175ED8] disabled:cursor-not-allowed disabled:bg-slate-300"
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" />
                    {t("form.submitting")}
                  </>
                ) : (
                  <>
                    {t("form.submit")}
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <aside className="border-t border-slate-200 bg-[#0A0A0A] p-6 text-white lg:border-l lg:border-t-0 sm:p-8">
            <Building2 className="size-5 text-[#1E6FFF]" />
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
              What happens next
            </p>
            <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em]">
              A clear path to accepting payments.
            </h2>

            <div className="mt-8 border-t border-white/15">
              <InfoItem
                number="01"
                text="We review the business information you submit."
              />
              <InfoItem
                number="02"
                text="Your application moves to approved status once verified."
              />
              <InfoItem
                number="03"
                text="You can use your live API key to start accepting payments."
              />
            </div>

            <div className="mt-8 border border-white/15 p-4">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#1E6FFF]" />
                <p className="text-sm leading-6 text-slate-300">
                  Your details are used only to verify and support your merchant
                  account.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <p className="mt-5 text-center text-sm text-slate-500">
          {t("alreadyHaveAccount")}{" "}
          <Link
            className="font-semibold text-[#1E6FFF] transition-colors hover:text-[#175ED8]"
            href="/dashboard"
          >
            {t("goToDashboard")}
          </Link>
        </p>
      </section>
    </main>
  );
}

function BrandHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link
          aria-label="NexaPay home"
          className="flex items-center gap-2.5"
          href="/"
        >
          <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#1E6FFF] text-sm font-extrabold text-white">
            N
          </span>
          <span className="text-lg font-semibold tracking-[-0.03em] text-[#0A0A0A]">
            Nexa<span className="text-[#1E6FFF]">Pay</span>
          </span>
        </Link>

        <Link
          className="text-sm font-semibold text-slate-600 transition-colors hover:text-[#0A0A0A]"
          href="/dashboard"
        >
          {`Dashboard`}
        </Link>
      </div>
    </header>
  );
}

function FieldLabel({
  children,
  optional = false,
  required = false,
}: {
  children: React.ReactNode;
  optional?: boolean;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-[#0A0A0A]">
      {children}
      {required && <span className="ml-1 text-[#1E6FFF]">*</span>}
      {optional && (
        <span className="ml-1 font-normal text-slate-400">
          ({`optional`})
        </span>
      )}
    </label>
  );
}

function InfoItem({ number, text }: { number: string; text: string }) {
  return (
    <div className="border-b border-white/15 py-5">
      <p className="font-mono text-xs font-semibold text-[#1E6FFF]">{number}</p>
      <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
    </div>
  );
}