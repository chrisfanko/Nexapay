"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  CircleAlert,
  Clock3,
  ExternalLink,
  Search,
  XCircle,
} from "lucide-react";

type MerchantStatus = "unverified" | "pending" | "approved" | "rejected";

interface Business {
  companyName?: string;
  businessType?: string;
  country?: string;
  phone?: string;
  website?: string;
  description?: string;
  registeredAt?: string;
}

interface Merchant {
  _id: string;
  name: string;
  email: string;
  merchantStatus: MerchantStatus;
  rejectionReason?: string;
  business?: Business;
  createdAt: string;
}

const statusStyles: Record<MerchantStatus, string> = {
  approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  rejected: "border-red-200 bg-red-50 text-red-800",
  unverified: "border-slate-200 bg-slate-50 text-slate-700",
};

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | MerchantStatus>(
    "all"
  );
  const [search, setSearch] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadBusinesses = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      const response = await fetch(
        `/api/admin/businesses${params.size ? `?${params}` : ""}`
      );

      if (!response.ok) {
        throw new Error("Unable to load businesses");
      }

      const data = await response.json();
      setBusinesses(data.businesses ?? []);
    } catch {
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, [statusFilter]);

  const filteredBusinesses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return businesses.filter((merchant) =>
      [
        merchant.name,
        merchant.email,
        merchant.business?.companyName,
        merchant.business?.businessType,
        merchant.business?.country,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [businesses, search]);

  async function updateBusinessStatus(
    merchant: Merchant,
    action: "approve" | "reject"
  ) {
    if (action === "reject" && !rejectionReason.trim()) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: merchant._id,
          action,
          rejectionReason:
            action === "reject" ? rejectionReason.trim() : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update business status");
      }

      setSelectedMerchant(null);
      setRejectionReason("");
      await loadBusinesses();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <header className="flex flex-col gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
            Compliance
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#0A0A0A] sm:text-4xl">
            Business approvals
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Review merchant business details before approving access to live
            payments.
          </p>
        </div>

        <div className="border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Results
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-[-0.035em] text-[#0A0A0A]">
            {loading ? "—" : filteredBusinesses.length}
          </p>
        </div>
      </header>

      <section className="mt-8 border border-slate-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row">
          <label className="relative block flex-1">
            <span className="sr-only">Search businesses</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-10 w-full border border-slate-300 bg-white pl-10 pr-3 text-sm text-[#0A0A0A] outline-none placeholder:text-slate-400 focus:border-[#1E6FFF]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by merchant, business, or country"
              value={search}
            />
          </label>

          <label>
            <span className="sr-only">Filter approval status</span>
            <select
              className="h-10 w-full border border-slate-300 bg-white px-3 text-sm text-slate-600 outline-none focus:border-[#1E6FFF] sm:w-48"
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as "all" | MerchantStatus
                )
              }
              value={statusFilter}
            >
              <option value="all">All applications</option>
              <option value="pending">Pending review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="unverified">Unverified</option>
            </select>
          </label>
        </div>

        <div className="divide-y divide-slate-200">
          {loading &&
            Array.from({ length: 5 }).map((_, index) => (
              <div className="grid gap-5 p-6 lg:grid-cols-[1fr_1fr_160px]" key={index}>
                <div className="h-16 animate-pulse bg-slate-100" />
                <div className="h-16 animate-pulse bg-slate-100" />
                <div className="h-10 animate-pulse bg-slate-100" />
              </div>
            ))}

          {!loading && filteredBusinesses.length === 0 && (
            <div className="px-6 py-16 text-center text-sm text-slate-500">
              No business applications match the selected filters.
            </div>
          )}

          {!loading &&
            filteredBusinesses.map((merchant) => (
              <article
                className="grid gap-6 p-6 transition-colors hover:bg-slate-50 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_180px]"
                key={merchant._id}
              >
                <div>
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center bg-[#0A0A0A] text-white">
                      <Building2 className="size-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-[#0A0A0A]">
                        {merchant.business?.companyName || "Business name missing"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {merchant.business?.businessType || "Business type missing"}
                        {merchant.business?.country
                          ? ` · ${merchant.business.country}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  {merchant.business?.description && (
                    <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
                      {merchant.business.description}
                    </p>
                  )}
                </div>

                <div className="border-l-0 border-slate-200 lg:border-l lg:pl-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Account owner
                  </p>
                  <p className="mt-2 font-medium text-[#0A0A0A]">
                    {merchant.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{merchant.email}</p>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                    {merchant.business?.phone && (
                      <span>{merchant.business.phone}</span>
                    )}
                    {merchant.business?.website && (
                      <a
                        className="inline-flex items-center gap-1 font-semibold text-[#1E6FFF] hover:text-[#175ED8]"
                        href={merchant.business.website}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Website
                        <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>

                  {merchant.rejectionReason && (
                    <p className="mt-4 border-l-2 border-red-500 pl-3 text-xs leading-5 text-red-700">
                      {merchant.rejectionReason}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-start gap-4 lg:items-end">
                  <StatusBadge status={merchant.merchantStatus} />

                  <p className="text-xs text-slate-500">
                    Submitted {formatDate(merchant.business?.registeredAt || merchant.createdAt)}
                  </p>

                  {merchant.merchantStatus === "pending" && (
                    <div className="flex gap-2">
                      <button
                        className="inline-flex h-9 items-center gap-1.5 border border-red-200 bg-white px-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
                        onClick={() => {
                          setSelectedMerchant(merchant);
                          setRejectionReason("");
                        }}
                        type="button"
                      >
                        <XCircle className="size-4" />
                        Reject
                      </button>
                      <button
                        className="inline-flex h-9 items-center gap-1.5 bg-[#0A0A0A] px-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E6FFF]"
                        onClick={() => updateBusinessStatus(merchant, "approve")}
                        type="button"
                      >
                        <CheckCircle2 className="size-4" />
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
        </div>
      </section>

      {selectedMerchant && (
        <div className="fixed inset-0 z-50 flex items-end bg-[#0A0A0A]/40 p-4 sm:items-center sm:justify-center">
          <div className="w-full max-w-lg border border-slate-200 bg-white p-6 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
              Reject application
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#0A0A0A]">
              Reject {selectedMerchant.business?.companyName || "this business"}?
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              This message will be shown to the merchant with their application
              status.
            </p>

            <label className="mt-6 block">
              <span className="mb-2 block text-sm font-semibold text-[#0A0A0A]">
                Reason for rejection
              </span>
              <textarea
                className="min-h-28 w-full border border-slate-300 p-3 text-sm text-[#0A0A0A] outline-none placeholder:text-slate-400 focus:border-[#1E6FFF]"
                onChange={(event) => setRejectionReason(event.target.value)}
                placeholder="Explain what the merchant needs to correct."
                value={rejectionReason}
              />
            </label>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                className="h-10 border border-slate-300 px-4 text-sm font-semibold text-[#0A0A0A] transition-colors hover:border-[#0A0A0A]"
                onClick={() => {
                  setSelectedMerchant(null);
                  setRejectionReason("");
                }}
                type="button"
              >
                Cancel
              </button>
              <button
                className="h-10 bg-red-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!rejectionReason.trim() || submitting}
                onClick={() => updateBusinessStatus(selectedMerchant, "reject")}
                type="button"
              >
                {submitting ? "Rejecting..." : "Reject application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: MerchantStatus }) {
  const Icon =
    status === "approved"
      ? CheckCircle2
      : status === "pending"
        ? Clock3
        : CircleAlert;

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
  }).format(new Date(value));
}