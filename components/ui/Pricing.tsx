"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function PricingSection() {
  const t = useTranslations("pricing");
  const [amount, setAmount] = useState(10000);

  const fee = Math.max(Math.round(amount * 0.015), 50);
  const gross = amount + fee;

  const formatAmount = (value: number) =>
    new Intl.NumberFormat("en-US").format(value);

  const plans = [
    {
      name: t("starter.name"),
      price: "1.5%",
      description: t("starter.per"),
      features: t.raw("starter.features") as string[],
      cta: t("starter.cta"),
      href: "/sign-up",
      featured: false,
    },
    {
      name: t("growth.name"),
      price: "1.5%",
      description: t("growth.per"),
      features: t.raw("growth.features") as string[],
      cta: t("growth.cta"),
      href: "/sign-up",
      featured: true,
    },
    {
      name: t("enterprise.name"),
      price: t("enterprise.price"),
      description: t("enterprise.per"),
      features: t.raw("enterprise.features") as string[],
      cta: t("enterprise.cta"),
      href: "/contact",
      featured: false,
    },
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
            {t("badge")}
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[#0A0A0A] sm:text-4xl">
            {t("headline1")}
            <br />
            <span className="text-[#1E6FFF]">{t("headline2")}</span>
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-600">
            {t("subheadline")}
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col border p-7 ${
                plan.featured
                  ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                  : "border-slate-200 bg-white text-[#0A0A0A]"
              }`}
            >
              {plan.featured && (
                <span className="absolute right-6 top-6 rounded-full bg-[#1E6FFF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white">
                  {t("mostPopular")}
                </span>
              )}

              <p
                className={`text-xs font-semibold uppercase tracking-[0.16em] ${
                  plan.featured ? "text-blue-300" : "text-[#1E6FFF]"
                }`}
              >
                {plan.name}
              </p>

              <p className="mt-7 text-4xl font-semibold tracking-[-0.05em]">
                {plan.price}
              </p>

              <p
                className={`mt-2 min-h-10 text-sm leading-6 ${
                  plan.featured ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {plan.description}
              </p>

              <ul
                className={`mt-7 border-t pt-5 ${
                  plan.featured ? "border-white/15" : "border-slate-200"
                }`}
              >
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={`flex gap-3 border-b py-3 text-sm ${
                      plan.featured
                        ? "border-white/10 text-slate-200"
                        : "border-slate-100 text-slate-600"
                    }`}
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-[#1E6FFF]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors ${
                  plan.featured
                    ? "bg-[#1E6FFF] text-white hover:bg-[#175ed8]"
                    : "border border-slate-300 text-[#0A0A0A] hover:border-[#0A0A0A] hover:bg-slate-50"
                }`}
              >
                {plan.cta}
                <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
              {t("calculator.badge")}
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#0A0A0A]">
              {t("calculator.title")}
            </h3>
          </div>

          <div className="mt-8">
            <label
              htmlFor="transaction-amount"
              className="text-sm font-medium text-slate-700"
            >
              {t("calculator.label")}
            </label>

            <div className="mt-2 flex overflow-hidden border border-slate-300 bg-white focus-within:border-[#1E6FFF] focus-within:ring-2 focus-within:ring-blue-100">
              <input
                id="transaction-amount"
                type="number"
                min="0"
                value={amount}
                onChange={(event) =>
                  setAmount(Math.max(0, Number(event.target.value)))
                }
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-xl font-semibold tracking-[-0.03em] text-[#0A0A0A] outline-none"
              />
              <span className="flex items-center border-l border-slate-200 px-4 text-sm font-medium text-slate-500">
                XAF
              </span>
            </div>

            <input
              type="range"
              min="500"
              max="500000"
              step="500"
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="mt-5 h-1 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#1E6FFF]"
              aria-label={t("calculator.label")}
            />
          </div>

          <div className="mt-8 grid border-l border-t border-slate-200 sm:grid-cols-3">
            <CalculatorValue
              label={t("calculator.youCharge")}
              value={formatAmount(amount)}
            />
            <CalculatorValue
              label={t("calculator.nexapayFee")}
              value={formatAmount(fee)}
              highlighted
            />
            <CalculatorValue
              label={t("calculator.customerPays")}
              value={formatAmount(gross)}
            />
          </div>

          <Link
            href="/prices"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1E6FFF] transition-colors hover:text-[#175ed8]"
          >
            {t("calculator.fullDetails")}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CalculatorValue({
  label,
  value,
  highlighted = false,
}: {
  label: string;
  value: string;
  highlighted?: boolean;
}) {
  return (
    <div className="border-b border-r border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>
      <p
        className={`mt-3 text-xl font-semibold tracking-[-0.035em] ${
          highlighted ? "text-[#1E6FFF]" : "text-[#0A0A0A]"
        }`}
      >
        {value} <span className="text-sm font-medium text-slate-400">XAF</span>
      </p>
    </div>
  );
}