"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { TrendingUp, CheckCircle, XCircle, Clock, ArrowLeftRight, FlaskConical, Zap } from "lucide-react";

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

const statusColors = {
  complete: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
};

const statusEmoji = {
  complete: "✅",
  failed: "❌",
  pending: "⏳",
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"live" | "test">("live");

  useEffect(() => {
    fetch(`/api/dashboard/stats?mode=${mode}`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [mode]);

  const handleModeChange = (newMode: 'live' | 'test') => {
    setMode(newMode);
    setLoading(true);
    setStats(null);
  };

  const statCards = [
    {
      label: "Total Volume",
      value: stats ? `${stats.totalVolume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} XAF` : "—",
      icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
      bg: "bg-blue-50",
    },
    {
      label: "Total Transactions",
      value: stats?.totalTransactions ?? "—",
      icon: <ArrowLeftRight className="w-5 h-5 text-purple-500" />,
      bg: "bg-purple-50",
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
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900">
            Welcome, {session?.user?.name} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here&apos;s an overview of your payment activity on NexaPay.
          </p>
        </div>

        {/* TEST / LIVE toggle */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
          <button
            onClick={() => handleModeChange("test")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              mode === "test"
                ? "bg-amber-100 text-amber-700"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            Test
          </button>
          <button
            onClick={() => handleModeChange("live")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              mode === "live"
                ? "bg-green-100 text-green-700"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Zap className="w-4 h-4" />
            Live
          </button>
        </div>
      </div>

      {/* Mode banner */}
      {mode === "test" && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 text-sm text-amber-700">
          <FlaskConical className="w-4 h-4 shrink-0" />
          You are viewing <strong>test transactions</strong> — no real money involved.
        </div>
      )}

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse h-28" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                {card.icon}
              </div>
              <p className="text-2xl font-black text-zinc-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-zinc-900">Recent Transactions</h2>
          <Link href="/dashboard/transactions" className="text-sm text-blue-500 font-medium hover:text-blue-700 transition">
            View all →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-gray-600">Reference</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-600">Customer</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-600">Channel</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-600">Amount</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-600">Status</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-5 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : !stats?.recentTransactions?.length ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                    No {mode} transactions yet
                  </td>
                </tr>
              ) : (
                stats.recentTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-mono text-xs text-gray-600">
                      {tx.reference.slice(0, 18)}...
                    </td>
                    <td className="px-5 py-3 text-zinc-900">{tx.customerName}</td>
                    <td className="px-5 py-3 text-gray-600">{tx.channel}</td>
                    <td className="px-5 py-3 font-medium text-zinc-900">
                      {(tx.grossAmount ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {tx.currency}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[tx.status]}`}>
                        {statusEmoji[tx.status]} {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {new Date(tx.createdAt).toLocaleDateString()}
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