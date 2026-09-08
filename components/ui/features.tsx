"use client";

import { Globe2, ShieldCheck, Smartphone, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Features() {
  const t = useTranslations("features");

  const features = [
    {
      icon: ShieldCheck,
      title: t("secure.title"),
      description: t("secure.description"),
      tag: t("secure.tag"),
    },
    {
      icon: Zap,
      title: t("fast.title"),
      description: t("fast.description"),
      tag: t("fast.tag"),
    },
    {
      icon: Globe2,
      title: t("global.title"),
      description: t("global.description"),
      tag: t("global.tag"),
    },
    {
      icon: Smartphone,
      title: t("mobile.title"),
      description: t("mobile.description"),
      tag: t("mobile.tag"),
    },
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div className="max-w-md">
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

          <div className="grid border-l border-t border-slate-200 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="border-b border-r border-slate-200 p-6 sm:p-7"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-[#1E6FFF]">
                    <Icon className="size-5" />
                  </div>

                  <p className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-[#1E6FFF]">
                    {feature.tag}
                  </p>

                  <h3 className="mt-3 text-base font-semibold text-[#0A0A0A]">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}