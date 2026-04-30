"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface Merchant {
  _id: string;
  name: string;
  email: string;
  apiKey?: string;
  createdAt: string;
}

export default function AdminMerchantsPage() {
  const t = useTranslations("adminMerchants");
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/merchants")
      .then((res) => res.json())
      .then((data) => { setMerchants(data.merchants || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-zinc-900">{t("title")}</h1>
        <p className="text-gray-500 mt-2">
          {t("subtitle")} {merchants.length} {t("total")}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">{t("table.name")}</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">{t("table.email")}</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">{t("table.apiKey")}</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">{t("table.joined")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(4)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : merchants.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-400">{t("noMerchants")}</td>
                </tr>
              ) : (
                merchants.map((merchant) => (
                  <tr key={merchant._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-zinc-900">{merchant.name}</td>
                    <td className="px-4 py-3 text-gray-600">{merchant.email}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">
                      {merchant.apiKey ? `${merchant.apiKey.slice(0, 16)}••••••••` : t("noKey")}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(merchant.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}