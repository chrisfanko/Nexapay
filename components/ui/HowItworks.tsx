"use client";

import { CheckCircle2, CreditCard, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HowItWorks() {
  const t = useTranslations("howItWorks");

  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: t("step1.title"),
      description: t("step1.description"),
    },
    {
      number: "02",
      icon: CreditCard,
      title: t("step2.title"),
      description: t("step2.description"),
    },
    {
      number: "03",
      icon: CheckCircle2,
      title: t("step3.title"),
      description: t("step3.description"),
    },
  ];

  return (
    <section className="bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
            {t("badge")}
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            {t("headline1")}
            <br />
            <span className="text-[#1E6FFF]">{t("headline2")}</span>
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-300">
            {t("subheadline")}
          </p>
        </div>

        <div className="mt-14 grid border-t border-white/15 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="border-b border-white/15 py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-[#1E6FFF]">
                    {t("step")} {step.number}
                  </span>
                  <Icon className="size-5 text-slate-400" />
                </div>

                <h3 className="mt-12 text-xl font-semibold tracking-[-0.025em]">
                  {step.title}
                </h3>

                <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}