"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  ArrowLeftRight,
  Building2,
  CheckCircle2,
  CircleX,
  Clock3,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";

interface Stats {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  totalVolume: number;
  totalFees: number;
  totalMerchants: number;
  successRate: number;
}

const statStyles = [
  { icon: TrendingUp, iconClassName: "text-[#1E6FFF]" },
  { icon: DollarSign, iconClassName: "text-emerald-700" },
  { icon: ArrowLeftRight, iconClassName: "text-[#0A0A0A]" },
  { icon: Users, iconClassName: "text-[#1E6FFF]" },
  { icon: CheckCircle2, iconClassName: "text-emerald-700" },
  { icon: CircleX, iconClassName: "text-red-700" },
  { icon: Clock3, iconClassName: "text-amber-700" },
  { icon: TrendingUp, iconClassName: "text-[#1E6FFF]" },
];

export default function AdminOverviewPage() {
  const t = useTranslations("adminOverview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: t("stats.totalVolume"),
      value: stats ? `${formatNumber(stats.totalVolume)} XAF` : "—",
    },
    {
      label: t("stats.totalFees"),
      value: stats ? `${formatNumber(stats.totalFees)} XAF` : "—",
    },
    {
      label: t("stats.totalTransactions"),
      value: stats?.totalTransactions ?? "—",
    },
    {
      label: t("stats.totalMerchants"),
      value: stats?.totalMerchants ?? "—",
    },
    {
      label: t("stats.successful"),
      value: stats?.successfulTransactions ?? "—",
    },
    {
      label: t("stats.failed"),
      value: stats?.failedTransactions ?? "—",
    },
    {
      label: t("stats.pending"),
      value: stats?.pendingTransactions ?? "—",
    },
    {
      label: t("stats.successRate"),
      value: stats ? `${stats.successRate}%` : "—",
    },
  ];

  const adminLinks = [
    {
      href: "/admin/transactions",
      title: t("quickLinks.transactions"),
      description: t("quickLinks.transactionsDesc"),
      icon: ArrowLeftRight,
      eyebrow: "Payments",
    },
    {
      href: "/admin/merchants",
      title: t("quickLinks.merchants"),
      description: t("quickLinks.merchantsDesc"),
      icon: Users,
      eyebrow: "Accounts",
    },
    {
      href: "/admin/businesses",
      title: "Business approvals",
      description: "Review submitted merchant businesses and approval status.",
      icon: Building2,
      eyebrow: "Compliance",
    },
  ];

  return (
    <div>
      <header className="border-b border-slate-200 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
          Administration
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#0A0A0A] sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          {t("subtitle")}
        </p>
      </header>

      <section className="mt-8">
        <div className="grid border-l border-t border-slate-200 bg-white sm:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  className="min-h-40 border-b border-r border-slate-200 p-6"
                  key={index}
                >
                  <div className="size-5 animate-pulse bg-slate-100" />
                  <div className="mt-8 h-8 w-28 animate-pulse bg-slate-100" />
                  <div className="mt-3 h-4 w-32 animate-pulse bg-slate-100" />
                </div>
              ))
            : statCards.map((card, index) => {
                const Icon = statStyles[index].icon;

                return (
                  <article
                    className="min-h-40 border-b border-r border-slate-200 p-6"
                    key={card.label}
                  >
                    <Icon
                      className={`size-5 ${statStyles[index].iconClassName}`}
                    />
                    <p className="mt-8 text-3xl font-semibold tracking-[-0.045em] text-[#0A0A0A]">
                      {card.value}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">{card.label}</p>
                  </article>
                );
              })}
        </div>
      </section>

      <section className="mt-10">
        <div className="border-b border-slate-200 pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
            Operations
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#0A0A0A]">
            Manage your platform
          </h2>
        </div>

        <div className="mt-6 grid border-l border-t border-slate-200 bg-white md:grid-cols-3">
          {adminLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                className="group flex min-h-64 flex-col border-b border-r border-slate-200 p-6 transition-colors hover:bg-slate-50"
                href={link.href}
                key={link.href}
              >
                <Icon className="size-5 text-[#1E6FFF]" />

                <div className="mt-auto pt-12">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {link.eyebrow}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold tracking-[-0.025em] text-[#0A0A0A]">
                    {link.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {link.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1E6FFF] transition-colors group-hover:text-[#175ED8]">
                    Open section
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat().format(value ?? 0);
}