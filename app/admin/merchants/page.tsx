"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Search,
  Users,
} from "lucide-react";

type MerchantStatus = "unverified" | "pending" | "approved" | "rejected";

interface Merchant {
  _id: string;
  name: string;
  email: string;
  image?: string;
  merchantStatus: MerchantStatus;
  business?: {
    companyName?: string;
    businessType?: string;
    country?: string;
    phone?: string;
  };
  createdAt: string;
}

const merchantStatusStyles: Record<MerchantStatus, string> = {
  approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  rejected: "border-red-200 bg-red-50 text-red-800",
  unverified: "border-slate-200 bg-slate-50 text-slate-700",
};

export default function AdminMerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | MerchantStatus>(
    "all"
  );

  useEffect(() => {
    async function loadMerchants() {
      try {
        const response = await fetch("/api/admin/merchants");

        if (!response.ok) {
          throw new Error("Unable to load merchants");
        }

        const data = await response.json();
        setMerchants(data.merchants ?? []);
      } catch {
        setMerchants([]);
      } finally {
        setLoading(false);
      }
    }

    loadMerchants();
  }, []);

  const filteredMerchants = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return merchants.filter((merchant) => {
      const matchesStatus =
        statusFilter === "all" || merchant.merchantStatus === statusFilter;

      const searchableText = [
        merchant.name,
        merchant.email,
        merchant.business?.companyName,
        merchant.business?.country,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(normalizedSearch);
    });
  }, [merchants, search, statusFilter]);

  const statusCounts = useMemo(
    () => ({
      total: merchants.length,
      approved: merchants.filter(
        (merchant) => merchant.merchantStatus === "approved"
      ).length,
      pending: merchants.filter(
        (merchant) => merchant.merchantStatus === "pending"
      ).length,
    }),
    [merchants]
  );

  return (
    <div>
      <header className="flex flex-col gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
            Accounts
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#0A0A0A] sm:text-4xl">
            Merchant directory
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Search and review every merchant account registered on NexaPay.
          </p>
        </div>

        <div className="grid grid-cols-3 divide-x divide-slate-200 border border-slate-200 bg-white">
          <SummaryItem label="Total" value={statusCounts.total} />
          <SummaryItem label="Approved" value={statusCounts.approved} />
          <SummaryItem label="Pending" value={statusCounts.pending} />
        </div>
      </header>

      <section className="mt-8 border border-slate-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row">
          <label className="relative block flex-1">
            <span className="sr-only">Search merchants</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-10 w-full border border-slate-300 bg-white pl-10 pr-3 text-sm text-[#0A0A0A] outline-none placeholder:text-slate-400 focus:border-[#1E6FFF]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, business, or country"
              value={search}
            />
          </label>

          <label>
            <span className="sr-only">Filter merchant status</span>
            <select
              className="h-10 w-full border border-slate-300 bg-white px-3 text-sm text-slate-600 outline-none focus:border-[#1E6FFF] sm:w-44"
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as "all" | MerchantStatus
                )
              }
              value={statusFilter}
            >
              <option value="all">All statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="unverified">Unverified</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                <th className="px-5 py-4">Merchant</th>
                <th className="px-5 py-4">Business</th>
                <th className="px-5 py-4">Country</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Joined</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {loading &&
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index}>
                    {Array.from({ length: 5 }).map((__, cellIndex) => (
                      <td className="px-5 py-5" key={cellIndex}>
                        <div className="h-4 animate-pulse bg-slate-100" />
                      </td>
                    ))}
                  </tr>
                ))}

              {!loading && filteredMerchants.length === 0 && (
                <tr>
                  <td
                    className="px-5 py-16 text-center text-sm text-slate-500"
                    colSpan={5}
                  >
                    No merchants match this search.
                  </td>
                </tr>
              )}

              {!loading &&
                filteredMerchants.map((merchant) => (
                  <tr
                    className="transition-colors hover:bg-slate-50"
                    key={merchant._id}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <MerchantAvatar merchant={merchant} />
                        <div>
                          <p className="font-semibold text-[#0A0A0A]">
                            {merchant.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {merchant.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-[#0A0A0A]">
                        {merchant.business?.companyName || "Not submitted"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {merchant.business?.businessType || "—"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {merchant.business?.country || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <MerchantStatusBadge status={merchant.merchantStatus} />
                    </td>

                    <td className="px-5 py-4 text-xs text-slate-500">
                      {formatDate(merchant.createdAt)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {!loading && (
          <footer className="border-t border-slate-200 px-5 py-4 text-sm text-slate-500">
            Showing {filteredMerchants.length} of {merchants.length} merchants
          </footer>
        )}
      </section>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-24 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold tracking-[-0.035em] text-[#0A0A0A]">
        {value}
      </p>
    </div>
  );
}

function MerchantAvatar({ merchant }: { merchant: Merchant }) {
  if (merchant.image) {
    return (
      <img
        alt=""
        className="size-9 rounded-full border border-slate-200 object-cover"
        src={merchant.image}
      />
    );
  }

  return (
    <span className="flex size-9 items-center justify-center rounded-full bg-[#0A0A0A] text-xs font-semibold text-white">
      {merchant.name.slice(0, 1).toUpperCase()}
    </span>
  );
}

function MerchantStatusBadge({ status }: { status: MerchantStatus }) {
  const Icon =
    status === "approved"
      ? CheckCircle2
      : status === "pending"
        ? Clock3
        : status === "rejected"
          ? CircleAlert
          : Users;

  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] ${merchantStatusStyles[status]}`}
    >
      <Icon className="size-3" />
      {status}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(new Date(value));
}