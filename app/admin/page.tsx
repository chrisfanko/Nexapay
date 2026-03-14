"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

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

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Total Volume",
      value: stats ? `${stats.totalVolume.toLocaleString()} XAF` : "—",
      icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
      bg: "bg-blue-50",
    },
    {
      label: "NexaPay Fees Collected",
      value: stats ? `${stats.totalFees.toLocaleString()} XAF` : "—",
      icon: <DollarSign className="w-5 h-5 text-green-500" />,
      bg: "bg-green-50",
    },
    {
      label: "Total Transactions",
      value: stats?.totalTransactions ?? "—",
      icon: <ArrowLeftRight className="w-5 h-5 text-purple-500" />,
      bg: "bg-purple-50",
    },
    {
      label: "Total Merchants",
      value: stats?.totalMerchants ?? "—",
      icon: <Users className="w-5 h-5 text-orange-500" />,
      bg: "bg-orange-50",
    },
    {
      label: "Successful",
      value: stats?.successfulTransactions ?? "—",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      bg: "bg-green-50",
    },
    {
      label: "Failed",
      value: stats?.failedTransactions ?? "—",
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      bg: "bg-red-50",
    },
    {
      label: "Pending",
      value: stats?.pendingTransactions ?? "—",
      icon: <Clock className="w-5 h-5 text-yellow-500" />,
      bg: "bg-yellow-50",
    },
    {
      label: "Success Rate",
      value: stats ? `${stats.successRate}%` : "—",
      icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-zinc-900">Admin Overview</h1>
        <p className="text-gray-500 mt-2">
          Platform-wide stats across all merchants and transactions.
        </p>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse h-28"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <div
                className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}
              >
                {card.icon}
              </div>
              <p className="text-2xl font-black text-zinc-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/admin/transactions"
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <ArrowLeftRight className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900">View All Transactions</h3>
            <p className="text-sm text-gray-500">
              Filter, search and review every transaction
            </p>
          </div>
        </Link>

        <Link
          href="/admin/merchants"
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900">View All Merchants</h3>
            <p className="text-sm text-gray-500">
              See all registered users on NexaPay
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}