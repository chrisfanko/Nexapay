"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Code2,
  Globe2,
  LockKeyhole,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";

type IconItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function AboutPage() {
  const t = useTranslations("about");

  const stats = [
    { value: "10K+", label: t("stats.transactions") },
    { value: "500+", label: t("stats.merchants") },
    { value: "99.9%", label: t("stats.uptime") },
    { value: "5+", label: t("stats.methods") },
  ];

  const missionPoints: IconItem[] = [
    {
      icon: Globe2,
      title: t("mission.card1.title"),
      description: t("mission.card1.desc"),
    },
    {
      icon: Zap,
      title: t("mission.card2.title"),
      description: t("mission.card2.desc"),
    },
    {
      icon: ShieldCheck,
      title: t("mission.card3.title"),
      description: t("mission.card3.desc"),
    },
    {
      icon: LockKeyhole,
      title: t("mission.card4.title"),
      description: t("mission.card4.desc"),
    },
  ];

  const values: IconItem[] = [
    {
      icon: Zap,
      title: t("values.speed.title"),
      description: t("values.speed.desc"),
    },
    {
      icon: ShieldCheck,
      title: t("values.security.title"),
      description: t("values.security.desc"),
    },
    {
      icon: Globe2,
      title: t("values.africa.title"),
      description: t("values.africa.desc"),
    },
    {
      icon: Code2,
      title: t("values.developer.title"),
      description: t("values.developer.desc"),
    },
  ];

  const team = [
    {
      name: t("team.founders.name"),
      role: t("team.founders.role"),
    },
    {
      name: t("team.engineering.name"),
      role: t("team.engineering.role"),
    },
    {
      name: t("team.operations.name"),
      role: t("team.operations.role"),
    },
    {
      name: t("team.support.name"),
      role: t("team.support.role"),
    },
  ];

  return (
    <div className="bg-white text-[#0A0A0A]">
      <section className="border-b border-white/10 bg-[#0A0A0A] text-white">
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-end gap-12 px-6 pb-16 pt-32 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:pb-20">
          <div className="max-w-3xl">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
              {t("hero.tag")}
            </p>

            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              {t("hero.title1")}
              <br />
              <span className="text-[#1E6FFF]">{t("hero.title2")}</span>
              <br />
              {t("hero.title3")}
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              {t("hero.desc")}
            </p>

            <Link
              href="/register-business"
              className="mt-9 inline-flex h-11 items-center gap-2 rounded-lg bg-[#1E6FFF] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#175ed8]"
            >
              {t("hero.cta")}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="border-l border-white/15 pl-6 pb-1">
            <div className="mb-8 flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#1E6FFF] text-sm font-extrabold">
                N
              </span>
              <span className="text-lg font-semibold tracking-[-0.03em]">
                Nexa<span className="text-[#1E6FFF]">Pay</span>
              </span>
            </div>

            <ul className="space-y-4 border-y border-white/10 py-5 text-sm text-slate-300">
              {["MTN Mobile Money", "Orange Money", "PayPal", "Visa / Mastercard"].map(
                (method) => (
                  <li key={method} className="flex items-center gap-3">
                    <span className="size-1.5 rounded-full bg-[#1E6FFF]" />
                    {method}
                  </li>
                )
              )}
            </ul>

            <p className="pt-5 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
              {t("hero.apiLabel")}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-slate-200 border-x border-slate-200 px-0 sm:grid-cols-4 lg:px-0">
          {stats.map((stat) => (
            <div key={stat.label} className="px-6 py-8 sm:px-8 sm:py-10">
              <p className="text-3xl font-semibold tracking-[-0.04em] text-[#0A0A0A]">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-2 lg:gap-24 lg:px-8 lg:py-28">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
            {t("mission.tag")}
          </p>
          <h2 className="mt-4 max-w-lg text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            {t("mission.title")}
          </h2>
          <div className="mt-7 max-w-xl space-y-4 text-base leading-7 text-slate-600">
            <p>{t("mission.body1")}</p>
            <p>{t("mission.body2")}</p>
          </div>
        </div>

        <div className="border-t border-slate-200">
          {missionPoints.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="grid grid-cols-[auto_1fr] gap-4 border-b border-slate-200 py-5"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-[#1E6FFF]">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0A0A0A]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
              {t("values.tag")}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              {t("values.title")}
            </h2>
          </div>

          <div className="mt-12 grid border-l border-t border-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.title}
                  className="border-b border-r border-slate-200 bg-white p-6 lg:p-7"
                >
                  <Icon className="size-5 text-[#1E6FFF]" />
                  <h3 className="mt-8 text-base font-semibold">{value.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
            {t("team.tag")}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            {t("team.title")}
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-600">{t("team.desc")}</p>
        </div>

        <div className="mt-12 grid border-t border-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, index) => (
            <article key={member.name} className="border-b border-slate-200 py-6 lg:pr-6">
              <p className="font-mono text-xs text-[#1E6FFF]">
                0{index + 1}
              </p>
              <h3 className="mt-8 text-base font-semibold">{member.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{member.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#0A0A0A] text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8 lg:py-28">
          <h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            {t("cta.title1")}
            <br />
            <span className="text-[#1E6FFF]">{t("cta.title2")}</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-300">
            {t("cta.desc")}
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register-business"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-[#1E6FFF] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#175ed8]"
            >
              {t("cta.primary")}
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
    </div>
  );
}