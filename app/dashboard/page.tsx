"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  ArrowLeftRight,
  CheckCircle2,
  CircleX,
  Clock3,
  FlaskConical,
  TrendingUp,
  Zap,
} from "lucide-react";

interface Stats {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  totalVolume: number;
  successRate: number;
  recentTransactions: {
    _id: string;
    reference: string;
    status: "complete" | "failed" | "pending";
    channel: string;
    grossAmount: number;
    currency: string;
    customerName: string;
    createdAt: string;
    mode: "live" | "test";
  }[];
}

const statusStyles = {
  complete: "border-green-200 bg-green-50 text-green-800",
  failed: "border-red-200 bg-red-50 text-red-800",
  pending: "border-amber-200 bg-amber-50 text-amber-800",
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const t = useTranslations("dashboardOverview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"live" | "test">("live");

  useEffect(() => {
    

    fetch(`/api/dashboard/stats?mode=${mode}`)
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [mode]);

  const handleModeChange = (newMode: "live" | "test") => {
  if (newMode === mode) return;

  setLoading(true);
  setMode(newMode);
};

  const statCards = [
    {
      label: t("stats.totalVolume"),
      value: stats ? `${formatNumber(stats.totalVolume)} XAF` : "—",
      icon: TrendingUp,
      iconClassName: "text-[#1E6FFF]",
    },
    {
      label: t("stats.totalTransactions"),
      value: stats?.totalTransactions ?? "—",
      icon: ArrowLeftRight,
      iconClassName: "text-[#0A0A0A]",
    },
    {
      label: t("stats.successful"),
      value: stats?.successfulTransactions ?? "—",
      icon: CheckCircle2,
      iconClassName: "text-green-700",
    },
    {
      label: t("stats.failed"),
      value: stats?.failedTransactions ?? "—",
      icon: CircleX,
      iconClassName: "text-red-700",
    },
    {
      label: t("stats.pending"),
      value: stats?.pendingTransactions ?? "—",
      icon: Clock3,
      iconClassName: "text-amber-700",
    },
    {
      label: t("stats.successRate"),
      value: stats ? `${stats.successRate}%` : "—",
      icon: TrendingUp,
      iconClassName: "text-[#1E6FFF]",
    },
  ];

  return (
    <div>
      <header className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
            Merchant workspace
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#0A0A0A] sm:text-4xl">
            {t("welcome")} {session?.user?.name}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{t("subtitle")}</p>
        </div>

        <ModeSwitch mode={mode} onChange={handleModeChange} t={t} />
      </header>

      {mode === "test" && (
        <div className="mt-6 flex gap-3 border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <FlaskConical className="mt-0.5 size-4 shrink-0" />
          <p>
            {t("modeBanner")} <strong>{t("testTransactions")}</strong>{" "}
            {t("noRealMoney")}
          </p>
        </div>
      )}

      <section className="mt-8">
        <div className="grid border-l border-t border-slate-200 bg-white sm:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  className="min-h-40 border-b border-r border-slate-200 p-6"
                  key={index}
                >
                  <div className="size-5 animate-pulse bg-slate-100" />
                  <div className="mt-8 h-8 w-24 animate-pulse bg-slate-100" />
                  <div className="mt-3 h-4 w-32 animate-pulse bg-slate-100" />
                </div>
              ))
            : statCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    className="min-h-40 border-b border-r border-slate-200 p-6"
                    key={card.label}
                  >
                    <Icon className={`size-5 ${card.iconClassName}`} />
                    <p className="mt-8 text-3xl font-semibold tracking-[-0.045em] text-[#0A0A0A]">
                      {card.value}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">{card.label}</p>
                  </article>
                );
              })}
        </div>
      </section>

      <section className="mt-10 border border-slate-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E6FFF]">
              Activity
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#0A0A0A]">
              {t("recentTransactions")}
            </h2>
          </div>

          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E6FFF] transition-colors hover:text-[#175ED8]"
            href="/dashboard/transactions"
          >
            {t("viewAll")}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                <th className="px-5 py-4 sm:px-6">{t("table.reference")}</th>
                <th className="px-5 py-4">{t("table.customer")}</th>
                <th className="px-5 py-4">{t("table.channel")}</th>
                <th className="px-5 py-4">{t("table.amount")}</th>
                <th className="px-5 py-4">{t("table.status")}</th>
                <th className="px-5 py-4 sm:px-6">{t("table.date")}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {!loading && !stats?.recentTransactions?.length && (
                <tr>
                  <td
                    className="px-5 py-16 text-center text-sm text-slate-500 sm:px-6"
                    colSpan={6}
                  >
                    {t("noTransactions", { mode })}
                  </td>
                </tr>
              )}

              {stats?.recentTransactions.map((transaction) => (
                <tr
                  className="transition-colors hover:bg-slate-50"
                  key={transaction._id}
                >
                  <td className="px-5 py-4 font-mono text-xs text-slate-600 sm:px-6">
                    {truncateReference(transaction.reference)}
                  </td>
                  <td className="px-5 py-4 font-medium text-[#0A0A0A]">
                    {transaction.customerName}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {transaction.channel}
                  </td>
                  <td className="px-5 py-4 font-semibold text-[#0A0A0A]">
                    {formatNumber(transaction.grossAmount)} {transaction.currency}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={transaction.status} />
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500 sm:px-6">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ModeSwitch({
  mode,
  onChange,
  t,
}: {
  mode: "live" | "test";
  onChange: (mode: "live" | "test") => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="inline-flex border border-slate-300 bg-white p-1">
      <button
        className={`inline-flex h-9 items-center gap-2 px-3 text-sm font-semibold transition-colors ${
          mode === "test"
            ? "bg-amber-50 text-amber-800"
            : "text-slate-500 hover:text-[#0A0A0A]"
        }`}
        onClick={() => onChange("test")}
        type="button"
      >
        <FlaskConical className="size-4" />
        {t("test")}
      </button>
      <button
        className={`inline-flex h-9 items-center gap-2 px-3 text-sm font-semibold transition-colors ${
          mode === "live"
            ? "bg-[#0A0A0A] text-white"
            : "text-slate-500 hover:text-[#0A0A0A]"
        }`}
        onClick={() => onChange("live")}
        type="button"
      >
        <Zap className={`size-4 ${mode === "live" ? "text-[#1E6FFF]" : ""}`} />
        {t("live")}
      </button>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "complete" | "failed" | "pending";
}) {
  return (
    <span
      className={`inline-flex border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat().format(value ?? 0);
}

function truncateReference(reference: string) {
  return reference.length > 20 ? `${reference.slice(0, 20)}…` : reference;
}