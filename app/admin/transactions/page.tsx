"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  CircleX,
  Clock3,
  Search,
  SlidersHorizontal,
  CheckCircle2,
} from "lucide-react";

type TransactionStatus = "complete" | "failed" | "pending";

interface Transaction {
  _id: string;
  reference: string;
  provider: string;
  channel: string;
  status: TransactionStatus;
  currency: string;
  grossAmount: number;
  merchantAmount: number;
  nexapayFee: number;
  customerName: string;
  customerPhone?: string;
  createdAt: string;
}

interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  totalPages: number;
}

const statusStyles: Record<TransactionStatus, string> = {
  complete: "border-emerald-200 bg-emerald-50 text-emerald-800",
  failed: "border-red-200 bg-red-50 text-red-800",
  pending: "border-amber-200 bg-amber-50 text-amber-800",
};

export default function AdminTransactionsPage() {
  const [data, setData] = useState<TransactionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [provider, setProvider] = useState("all");
  const [channel, setChannel] = useState("all");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTransactions() {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });

      if (status !== "all") params.set("status", status);
      if (provider !== "all") params.set("provider", provider);
      if (channel !== "all") params.set("channel", channel);
      if (submittedSearch) params.set("search", submittedSearch);

      try {
        const response = await fetch(`/api/admin/transactions?${params}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load transactions");
        }

        setData(await response.json());
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setData(null);
        }
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();

    return () => controller.abort();
  }, [channel, page, provider, status, submittedSearch]);

  function resetFilters() {
    setStatus("all");
    setProvider("all");
    setChannel("all");
    setSearch("");
    setSubmittedSearch("");
    setPage(1);
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedSearch(search.trim());
    setPage(1);
  }

  const hasFilters =
    status !== "all" ||
    provider !== "all" ||
    channel !== "all" ||
    submittedSearch.length > 0;

  return (
    <div>
      <header className="flex flex-col gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
            Payments
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#0A0A0A] sm:text-4xl">
            Transaction activity
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Review payments processed across all merchants and payment methods.
          </p>
        </div>

        <div className="border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Total records
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-[-0.035em] text-[#0A0A0A]">
            {loading ? "—" : formatNumber(data?.total ?? 0)}
          </p>
        </div>
      </header>

      <section className="mt-8 border border-slate-200 bg-white">
        <form
          className="grid gap-4 border-b border-slate-200 p-5 lg:grid-cols-[minmax(0,1fr)_150px_150px_180px_auto]"
          onSubmit={handleSearchSubmit}
        >
          <label className="relative block">
            <span className="sr-only">Search transactions</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-10 w-full border border-slate-300 bg-white pl-10 pr-3 text-sm text-[#0A0A0A] outline-none transition-colors placeholder:text-slate-400 focus:border-[#1E6FFF]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by transaction reference"
              value={search}
            />
          </label>

          <FilterSelect
            label="Status"
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            options={[
              { label: "All statuses", value: "all" },
              { label: "Completed", value: "complete" },
              { label: "Failed", value: "failed" },
              { label: "Pending", value: "pending" },
            ]}
            value={status}
          />

          <FilterSelect
            label="Provider"
            onChange={(value) => {
              setProvider(value);
              setPage(1);
            }}
            options={[
              { label: "All providers", value: "all" },
              { label: "NotchPay", value: "notchpay" },
              { label: "PayPal", value: "paypal" },
            ]}
            value={provider}
          />

          <FilterSelect
            label="Channel"
            onChange={(value) => {
              setChannel(value);
              setPage(1);
            }}
            options={[
              { label: "All channels", value: "all" },
              { label: "Orange Money", value: "Orange Money" },
              { label: "MTN Mobile Money", value: "MTN Mobile Money" },
              { label: "PayPal", value: "PayPal" },
              { label: "Visa", value: "Visa" },
              { label: "Mastercard", value: "Mastercard" },
            ]}
            value={channel}
          />

          <button
            className="inline-flex h-10 items-center justify-center gap-2 bg-[#0A0A0A] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1E6FFF]"
            type="submit"
          >
            <SlidersHorizontal className="size-4" />
            Apply
          </button>
        </form>

        {hasFilters && (
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
            <p className="text-sm text-slate-500">Filtered transaction results</p>
            <button
              className="text-sm font-semibold text-[#1E6FFF] transition-colors hover:text-[#175ED8]"
              onClick={resetFilters}
              type="button"
            >
              Reset filters
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                <th className="px-5 py-4">Reference</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Provider</th>
                <th className="px-5 py-4">Channel</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {loading &&
                Array.from({ length: 7 }).map((_, index) => (
                  <tr key={index}>
                    {Array.from({ length: 7 }).map((__, cellIndex) => (
                      <td className="px-5 py-5" key={cellIndex}>
                        <div className="h-4 animate-pulse bg-slate-100" />
                      </td>
                    ))}
                  </tr>
                ))}

              {!loading && data?.transactions.length === 0 && (
                <tr>
                  <td
                    className="px-5 py-16 text-center text-sm text-slate-500"
                    colSpan={7}
                  >
                    No transactions match the selected filters.
                  </td>
                </tr>
              )}

              {!loading &&
                data?.transactions.map((transaction) => (
                  <tr
                    className="transition-colors hover:bg-slate-50"
                    key={transaction._id}
                  >
                    <td className="px-5 py-4 font-mono text-xs text-slate-600">
                      {truncateReference(transaction.reference)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#0A0A0A]">
                        {transaction.customerName || "Unknown customer"}
                      </p>
                      {transaction.customerPhone && (
                        <p className="mt-1 text-xs text-slate-500">
                          {transaction.customerPhone}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 capitalize text-slate-600">
                      {transaction.provider}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {transaction.channel}
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#0A0A0A]">
                      {formatNumber(transaction.grossAmount)}{" "}
                      {transaction.currency}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={transaction.status} />
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">
                      {formatDate(transaction.createdAt)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <footer className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            {!loading && data
              ? `Page ${data.page} of ${Math.max(data.totalPages, 1)}`
              : "Loading transactions"}
          </p>

          <div className="flex gap-2">
            <button
              className="inline-flex h-9 items-center gap-1.5 border border-slate-300 bg-white px-3 text-sm font-semibold text-[#0A0A0A] transition-colors hover:border-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!data || data.page <= 1 || loading}
              onClick={() => setPage((currentPage) => currentPage - 1)}
              type="button"
            >
              <ChevronLeft className="size-4" />
              Previous
            </button>
            <button
              className="inline-flex h-9 items-center gap-1.5 border border-slate-300 bg-white px-3 text-sm font-semibold text-[#0A0A0A] transition-colors hover:border-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={
                !data || data.page >= data.totalPages || data.totalPages === 0 || loading
              }
              onClick={() => setPage((currentPage) => currentPage + 1)}
              type="button"
            >
              Next
              <ChevronRight className="size-4" />
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}

function FilterSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  value: string;
}) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select
        className="h-10 w-full border border-slate-300 bg-white px-3 text-sm text-slate-600 outline-none transition-colors focus:border-[#1E6FFF] focus:text-[#0A0A0A]"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  const Icon =
    status === "complete"
      ? CheckCircle2
      : status === "failed"
        ? CircleX
        : Clock3;

  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] ${statusStyles[status]}`}
    >
      <Icon className="size-3" />
      {status}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat().format(value ?? 0);
}

function truncateReference(reference: string) {
  return reference.length > 24 ? `${reference.slice(0, 24)}…` : reference;
}