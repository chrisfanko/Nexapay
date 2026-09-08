"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleX,
  Clock3,
  FlaskConical,
  Search,
  Zap,
} from "lucide-react";

interface Transaction {
  _id: string;
  reference: string;
  status: "complete" | "failed" | "pending";
  channel: string;
  grossAmount: number;
  nexapayFee: number;
  netAmount: number;
  currency: string;
  customerName: string;
  customerPhone?: string;
  createdAt: string;
  mode: "live" | "test";
}

const statusStyles = {
  complete: "border-green-200 bg-green-50 text-green-800",
  failed: "border-red-200 bg-red-50 text-red-800",
  pending: "border-amber-200 bg-amber-50 text-amber-800",
};

export default function DashboardTransactionsPage() {
  const t = useTranslations("dashboardTransactions");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"live" | "test">("live");
  const [status, setStatus] = useState("all");
  const [channel, setChannel] = useState("all");
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams({
      status,
      channel,
      search: searchQuery,
      page: String(page),
      limit: "20",
      mode,
    });

    fetch(`/api/dashboard/transactions?${params}`)
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data.transactions || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => {
        setTransactions([]);
        setTotal(0);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  }, [channel, mode, page, searchQuery, status]);

  const refreshWith = (updates: {
    mode?: "live" | "test";
    status?: string;
    channel?: string;
    page?: number;
    searchQuery?: string;
  }) => {
    setLoading(true);

    if (updates.mode !== undefined) setMode(updates.mode);
    if (updates.status !== undefined) setStatus(updates.status);
    if (updates.channel !== undefined) setChannel(updates.channel);
    if (updates.searchQuery !== undefined) setSearchQuery(updates.searchQuery);
    if (updates.page !== undefined) setPage(updates.page);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    refreshWith({ page: 1, searchQuery: search });
  };

  return (
    <div>
      <header className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
            Merchant workspace
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#0A0A0A] sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {total} {t("totalLabel", { mode })}
          </p>
        </div>

        <ModeSwitch
          mode={mode}
          onChange={(newMode) => {
            if (mode !== newMode) {
              refreshWith({ mode: newMode, page: 1 });
            }
          }}
          t={t}
        />
      </header>

      {mode === "test" && (
        <div className="mt-6 flex gap-3 border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <FlaskConical className="mt-0.5 size-4 shrink-0" />
          <p>
            {t("testBanner")} <strong>{t("testBannerBold")}</strong>{" "}
            {t("testBannerSuffix")}
          </p>
        </div>
      )}

      <section className="mt-8 border border-slate-200 bg-white p-4 sm:p-5">
        <form
          className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_auto]"
          onSubmit={handleSearch}
        >
          <div className="relative">
            <label className="sr-only" htmlFor="transaction-search">
              {t("searchPlaceholder")}
            </label>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-11 w-full border border-slate-300 bg-white pl-10 pr-3 text-sm text-[#0A0A0A] outline-none placeholder:text-slate-400 focus:border-[#1E6FFF] focus:ring-2 focus:ring-blue-100"
              id="transaction-search"
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("searchPlaceholder")}
              type="search"
              value={search}
            />
          </div>

          <select
            className="h-11 border border-slate-300 bg-white px-3 text-sm text-[#0A0A0A] outline-none focus:border-[#1E6FFF] focus:ring-2 focus:ring-blue-100"
            onChange={(event) =>
              refreshWith({ page: 1, status: event.target.value })
            }
            title={t("allStatus")}
            value={status}
          >
            <option value="all">{t("allStatus")}</option>
            <option value="complete">{t("complete")}</option>
            <option value="failed">{t("failed")}</option>
            <option value="pending">{t("pending")}</option>
          </select>

          <select
            className="h-11 border border-slate-300 bg-white px-3 text-sm text-[#0A0A0A] outline-none focus:border-[#1E6FFF] focus:ring-2 focus:ring-blue-100"
            onChange={(event) =>
              refreshWith({ channel: event.target.value, page: 1 })
            }
            title={t("allChannels")}
            value={channel}
          >
            <option value="all">{t("allChannels")}</option>
            <option value="Orange Money">Orange Money</option>
            <option value="MTN Mobile Money">MTN Mobile Money</option>
            <option value="PayPal">PayPal</option>
          </select>

          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1E6FFF] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#175ED8]"
            type="submit"
          >
            <Search className="size-4" />
            {t("search")}
          </button>
        </form>
      </section>

      <section className="mt-6 overflow-hidden border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E6FFF]">
            Payment activity
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#0A0A0A]">
            {t("title")}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                <th className="px-5 py-4 sm:px-6">{t("table.reference")}</th>
                <th className="px-5 py-4">{t("table.customer")}</th>
                <th className="px-5 py-4">{t("table.channel")}</th>
                <th className="px-5 py-4">{t("table.amount")}</th>
                <th className="px-5 py-4">{t("table.fee")}</th>
                <th className="px-5 py-4">{t("table.net")}</th>
                <th className="px-5 py-4">{t("table.status")}</th>
                <th className="px-5 py-4 sm:px-6">{t("table.date")}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {loading &&
                Array.from({ length: 5 }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array.from({ length: 8 }).map((__, cellIndex) => (
                      <td className="px-5 py-5 sm:px-6" key={cellIndex}>
                        <div className="h-4 animate-pulse bg-slate-100" />
                      </td>
                    ))}
                  </tr>
                ))}

              {!loading && transactions.length === 0 && (
                <tr>
                  <td
                    className="px-5 py-16 text-center text-sm text-slate-500 sm:px-6"
                    colSpan={8}
                  >
                    {t("noTransactions", { mode })}
                  </td>
                </tr>
              )}

              {!loading &&
                transactions.map((transaction) => (
                  <tr
                    className="transition-colors hover:bg-slate-50"
                    key={transaction._id}
                  >
                    <td className="px-5 py-4 font-mono text-xs text-slate-600 sm:px-6">
                      {truncateReference(transaction.reference)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#0A0A0A]">
                        {transaction.customerName}
                      </p>
                      {transaction.customerPhone && (
                        <p className="mt-1 text-xs text-slate-500">
                          {transaction.customerPhone}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {transaction.channel}
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#0A0A0A]">
                      {formatNumber(transaction.grossAmount)}{" "}
                      {transaction.currency}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatNumber(transaction.nexapayFee)}{" "}
                      {transaction.currency}
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#0A0A0A]">
                      {formatNumber(transaction.netAmount)} {transaction.currency}
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

      {totalPages > 1 && (
        <nav
          aria-label="Transaction pagination"
          className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-slate-500">
            {t("page")} {page} {t("of")} {totalPages}
          </p>

          <div className="flex gap-3">
            <button
              className="inline-flex h-10 items-center gap-2 border border-slate-300 bg-white px-4 text-sm font-semibold text-[#0A0A0A] transition-colors hover:border-[#0A0A0A] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={page === 1}
              onClick={() => refreshWith({ page: Math.max(1, page - 1) })}
              type="button"
            >
              <ArrowLeft className="size-4" />
              {t("previous")}
            </button>

            <button
              className="inline-flex h-10 items-center gap-2 border border-slate-300 bg-white px-4 text-sm font-semibold text-[#0A0A0A] transition-colors hover:border-[#0A0A0A] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={page === totalPages}
              onClick={() =>
                refreshWith({ page: Math.min(totalPages, page + 1) })
              }
              type="button"
            >
              {t("next")}
              <ArrowRight className="size-4" />
            </button>
          </div>
        </nav>
      )}
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