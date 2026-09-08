"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BadgeDollarSign,
  ChevronDown,
  ReceiptText,
  Unplug,
} from "lucide-react";
import { useTranslations } from "next-intl";

const channels = [
  { name: "MTN Mobile Money", logo: "/logos/mtn3.png", currency: "XAF" },
  { name: "Orange Money", logo: "/logos/om.png", currency: "XAF" },
  { name: "PayPal", logo: "/logos/paypal.png", currency: "USD" },
  {
    name: "Visa / Mastercard",
    logo: "/logos/visa.png",
    currency: "XAF",
    soon: true,
  },
];

function calculateFee(amount: number) {
  const fee = Math.max(Math.round(amount * 0.015), 50);

  return {
    merchantAmount: amount,
    nexaPayFee: fee,
    customerPays: amount + fee,
  };
}

export default function PricingPage() {
  const t = useTranslations("prices");
  const [amount, setAmount] = useState(10000);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const calculation = calculateFee(amount);
  const faqs = t.raw("faq.items") as { q: string; a: string }[];

  const formatAmount = (value: number) =>
    new Intl.NumberFormat("en-US").format(value);

  const benefits = [
    {
      icon: BadgeDollarSign,
      title: t("means.card1.title"),
      description: t("means.card1.desc"),
    },
    {
      icon: ReceiptText,
      title: t("means.card2.title"),
      description: t("means.card2.desc"),
    },
    {
      icon: Unplug,
      title: t("means.card3.title"),
      description: t("means.card3.desc"),
    },
  ];

  return (
    <main className="bg-white text-[#0A0A0A]">
      <section className="border-b border-white/10 bg-[#0A0A0A] text-white">
        <div className="mx-auto grid min-h-[560px] max-w-7xl items-end gap-14 px-6 pb-16 pt-32 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:pb-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
              {t("hero.tag")}
            </p>

            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">
              {t("hero.title1")}
              <br />
              <span className="text-[#1E6FFF]">{t("hero.title2")}</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              {t("hero.subtitle")}
            </p>
          </div>

          <div className="border border-white/15 p-7 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              {t("hero.feeLabel")}
            </p>

            <p className="mt-6 text-7xl font-semibold tracking-[-0.07em] text-[#1E6FFF]">
              1.5<span className="text-4xl">%</span>
            </p>

            <p className="mt-2 text-sm text-slate-300">{t("hero.feeUnit")}</p>

            <p className="mt-8 border-t border-white/10 pt-5 text-sm leading-6 text-slate-400">
              {t("hero.feeNote")}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
            {t("means.tag")}
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            {t("means.title")}
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-600">
            {t("means.subtitle")}
          </p>
        </div>

        <div className="mt-12 grid border-l border-t border-slate-200 md:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article
                key={benefit.title}
                className="border-b border-r border-slate-200 p-7"
              >
                <Icon className="size-5 text-[#1E6FFF]" />
                <h3 className="mt-8 text-lg font-semibold tracking-[-0.025em]">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
              {t("calc.tag")}
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              {t("calc.title")}
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              {t("calc.subtitle")}
            </p>
          </div>

          <div className="mt-10 border border-slate-200 bg-white p-6 sm:p-8">
            <label
              htmlFor="transaction-amount"
              className="text-sm font-medium text-slate-700"
            >
              {t("calc.label")}
            </label>

            <div className="mt-2 flex overflow-hidden border border-slate-300 bg-white focus-within:border-[#1E6FFF] focus-within:ring-2 focus-within:ring-blue-100">
              <input
                id="transaction-amount"
                type="number"
                min="0"
                max="10000000"
                value={amount}
                onChange={(event) =>
                  setAmount(Math.max(0, Number(event.target.value)))
                }
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-xl font-semibold tracking-[-0.03em] outline-none"
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
              aria-label={t("calc.label")}
            />

            <div className="mt-8 grid border-l border-t border-slate-200 sm:grid-cols-3">
              <CalculationValue
                label={t("calc.merchantAmount")}
                value={formatAmount(calculation.merchantAmount)}
              />
              <CalculationValue
                label={t("calc.nexapayFee")}
                value={formatAmount(calculation.nexaPayFee)}
                highlighted
              />
              <CalculationValue
                label={t("calc.customerPays")}
                value={formatAmount(calculation.customerPays)}
              />
            </div>

            <p className="mt-5 text-center text-xs leading-5 text-slate-400">
              {t("calc.note")}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
            {t("channels.tag")}
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            {t("channels.title")}
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-600">
            {t("channels.subtitle")}
          </p>
        </div>

        <div className="mt-12 grid border-l border-t border-slate-200 sm:grid-cols-2">
          {channels.map((channel) => (
            <article
              key={channel.name}
              className="flex items-center justify-between gap-5 border-b border-r border-slate-200 p-6 sm:p-7"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative size-12 shrink-0">
                  <Image
                    src={channel.logo}
                    alt={`${channel.name} logo`}
                    fill
                    className="object-contain"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold">{channel.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{channel.currency}</p>
                </div>
              </div>

              {channel.soon ? (
                <span className="shrink-0 border border-slate-300 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                  {t("channels.soon")}
                </span>
              ) : (
                <span className="shrink-0 text-lg font-semibold tracking-[-0.03em] text-[#1E6FFF]">
                  1.5%
                </span>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
              {t("faq.tag")}
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              {t("faq.title")}
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              {t("faq.subtitle")}
            </p>
          </div>

          <div className="mt-12 border-t border-slate-200">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div key={faq.q} className="border-b border-slate-200">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-sm font-semibold text-[#0A0A0A]"
                    aria-expanded={isOpen}
                  >
                    {faq.q}
                    <ChevronDown
                      className={`size-5 shrink-0 text-[#1E6FFF] transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <p className="max-w-2xl pb-5 text-sm leading-6 text-slate-600">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#0A0A0A] text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8 lg:py-24">
          <h2 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            {t("cta.title1")}
            <br />
            <span className="text-[#1E6FFF]">{t("cta.title2")}</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-300">
            {t("cta.desc")}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register-business"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1E6FFF] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#175ed8]"
            >
              {t("cta.primary")}
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-white/25 px-5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-[#0A0A0A]"
            >
              {t("cta.secondary")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function CalculationValue({
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
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
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