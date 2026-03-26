"use client";

import { useEffect, useState } from "react";
import { Search, FlaskConical, Zap } from "lucide-react";

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

export default function DashboardTransactionsPage() {
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
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.transactions || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status, channel, searchQuery, page, mode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchQuery(search);
    setLoading(true);
  };

  const handleModeChange = (newMode: "live" | "test") => {
    setMode(newMode);
    setPage(1);
    setLoading(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900">Transactions</h1>
          <p className="text-gray-500 mt-1">{total} total {mode} transactions</p>
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

      {/* Test mode banner */}
      {mode === "test" && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 text-sm text-amber-700">
          <FlaskConical className="w-4 h-4 shrink-0" />
          Viewing <strong>test transactions</strong> — no real money involved.
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-48">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition">
            Search
          </button>
        </form>

        <select
          title="Filter by status"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); setLoading(true); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="complete">Complete</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>

        <select
          title="Filter by channel"
          value={channel}
          onChange={(e) => { setChannel(e.target.value); setPage(1); setLoading(true); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Channels</option>
          <option value="Orange Money">Orange Money</option>
          <option value="MTN Mobile Money">MTN Mobile Money</option>
          <option value="PayPal">PayPal</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Reference</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Channel</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">NexaPay Fee</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Net</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-400">
                    No {mode} transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">
                      {tx.reference.slice(0, 20)}...
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-zinc-900">{tx.customerName}</p>
                      {tx.customerPhone && (
                        <p className="text-xs text-gray-400">{tx.customerPhone}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{tx.channel}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {(tx.grossAmount ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {tx.currency}
                    </td>
                    <td className="px-4 py-3 text-green-600 font-medium">
                      {(tx.nexapayFee ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {tx.currency}
                    </td>
                    <td className="px-4 py-3 text-zinc-900">
                      {(tx.netAmount ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {tx.currency}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[tx.status]}`}>
                        {statusEmoji[tx.status]} {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button
              onClick={() => { setPage((p) => Math.max(1, p - 1)); setLoading(true); }}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Previous
            </button>
            <button
              onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); setLoading(true); }}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}