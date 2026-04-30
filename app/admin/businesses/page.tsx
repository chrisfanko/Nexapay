"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle, XCircle, Clock, Building2 } from "lucide-react";

interface Business {
  _id: string;
  name: string;
  email: string;
  merchantStatus: "pending" | "approved" | "rejected";
  business: {
    companyName: string;
    businessType: string;
    country: string;
    phone: string;
    website?: string;
    description?: string;
    registeredAt: string;
  };
  rejectionReason?: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const statusIcons = {
  pending: <Clock className="w-4 h-4" />,
  approved: <CheckCircle className="w-4 h-4" />,
  rejected: <XCircle className="w-4 h-4" />,
};

export default function AdminBusinessesPage() {
  const t = useTranslations("adminBusinesses");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetch(`/api/admin/businesses?status=${filter}`)
      .then((res) => res.json())
      .then((data) => { setBusinesses(data.businesses || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filter]);

  const handleAction = async (userId: string, action: "approve" | "reject", reason?: string) => {
    setActionLoading(userId);
    const res = await fetch("/api/admin/businesses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action, rejectionReason: reason }),
    });
    if (res.ok) {
      setBusinesses((prev) =>
        prev.map((b) =>
          b._id === userId
            ? { ...b, merchantStatus: action === "approve" ? "approved" : "rejected", rejectionReason: reason }
            : b
        )
      );
    }
    setActionLoading(null);
    setRejectModal(null);
    setRejectReason("");
  };

  const filterKeys = ["all", "pending", "approved", "rejected"] as const;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-zinc-900">{t("title")}</h1>
        <p className="text-gray-500 mt-2">{t("subtitle")}</p>
      </div>

      <div className="flex gap-2 mb-6">
        {filterKeys.map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setLoading(true); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === s ? "bg-blue-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t(`filters.${s}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-40" />
          ))}
        </div>
      ) : businesses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">{t("noApplications")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {businesses.map((b) => (
            <div key={b._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-lg font-bold text-zinc-900">{b.business?.companyName}</h2>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[b.merchantStatus]}`}>
                      {statusIcons[b.merchantStatus]}
                      {b.merchantStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{b.name} · {b.email}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">{t("fields.type")}</p>
                      <p className="font-medium text-zinc-900">{b.business?.businessType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{t("fields.country")}</p>
                      <p className="font-medium text-zinc-900">{b.business?.country}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{t("fields.phone")}</p>
                      <p className="font-medium text-zinc-900">{b.business?.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{t("fields.applied")}</p>
                      <p className="font-medium text-zinc-900">
                        {new Date(b.business?.registeredAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {b.business?.website && (
                    <a href={b.business.website} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline mt-2 inline-block">
                      {b.business.website}
                    </a>
                  )}
                  {b.business?.description && (
                    <p className="text-sm text-gray-500 mt-2 italic">&ldquo;{b.business.description}&rdquo;</p>
                  )}
                  {b.rejectionReason && (
                    <div className="mt-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-sm text-red-600">
                      {t("rejectionReason")}: {b.rejectionReason}
                    </div>
                  )}
                </div>

                {b.merchantStatus === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleAction(b._id, "approve")}
                      disabled={actionLoading === b._id}
                      className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {t("approve")}
                    </button>
                    <button
                      onClick={() => setRejectModal(b._id)}
                      disabled={actionLoading === b._id}
                      className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                      <XCircle className="w-4 h-4" />
                      {t("reject")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold text-zinc-900 mb-2">{t("rejectModal.title")}</h3>
            <p className="text-sm text-gray-500 mb-4">{t("rejectModal.subtitle")}</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={t("rejectModal.placeholder")}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setRejectModal(null); setRejectReason(""); }}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                {t("rejectModal.cancel")}
              </button>
              <button
                onClick={() => handleAction(rejectModal, "reject", rejectReason)}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition"
              >
                {t("rejectModal.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}