"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Copy, Save, RefreshCw } from "lucide-react";

interface WebhookLog {
  _id: string;
  transactionReference: string;
  webhookUrl: string;
  event: string;
  status: "success" | "failed";
  statusCode?: number;
  attempts: number;
  createdAt: string;
}

export default function WebhooksPage() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/webhooks/save")
      .then((res) => res.json())
      .then((data) => {
        setWebhookUrl(data.webhookUrl || "");
        setWebhookSecret(data.webhookSecret || "");
      });

    fetch("/api/webhooks/logs")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs || []);
        setLogsLoading(false);
      })
      .catch(() => setLogsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/webhooks/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ webhookUrl }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to save");
      setSaving(false);
      return;
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const copySecret = () => {
    navigator.clipboard.writeText(webhookSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const refreshLogs = () => {
    setLogsLoading(true);
    fetch("/api/webhooks/logs")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs || []);
        setLogsLoading(false);
      })
      .catch(() => setLogsLoading(false));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-zinc-900">Webhooks</h1>
        <p className="text-gray-500 mt-2">
          Get notified in real-time when payments are completed or failed.
        </p>
      </div>

      {/* Webhook URL */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-zinc-900 mb-1">Webhook Endpoint</h2>
        <p className="text-sm text-gray-500 mb-5">
          NexaPay will send a POST request to this URL after every payment event.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Webhook URL
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://yourapp.com/webhooks/nexapay"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <XCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving || !webhookUrl}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition"
          >
            {saving ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</>
            ) : saved ? (
              <><CheckCircle className="w-4 h-4" /> Saved!</>
            ) : (
              <><Save className="w-4 h-4" /> Save Endpoint</>
            )}
          </button>
        </form>
      </div>

      {/* Webhook Secret */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-zinc-900 mb-1">Webhook Secret</h2>
        <p className="text-sm text-gray-500 mb-5">
          Use this secret to verify that webhook requests are coming from NexaPay.
          Check the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">X-NexaPay-Signature</code> header on incoming requests.
        </p>

        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono text-sm text-gray-700 overflow-hidden">
            {showSecret ? webhookSecret : "whsec_" + "•".repeat(40)}
          </div>
          <button
            onClick={() => setShowSecret(!showSecret)}
            className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            {showSecret ? "Hide" : "Reveal"}
          </button>
          <button
            onClick={copySecret}
            className="flex items-center gap-1.5 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Payload Example */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-zinc-900 mb-1">Payload Example</h2>
        <p className="text-sm text-gray-500 mb-4">
          This is what NexaPay sends to your endpoint on a successful payment.
        </p>
        <pre className="bg-zinc-900 text-green-400 rounded-xl p-5 text-xs overflow-x-auto leading-relaxed">
{`{
  "event": "payment.complete",
  "reference": "tx_abc123...",
  "status": "complete",
  "amount": 10000,
  "currency": "XAF",
  "channel": "MTN Mobile Money",
  "provider": "notchpay",
  "customerName": "John Doe",
  "customerPhone": "237600000000",
  "nexapayFee": 150,
  "netAmount": 9850,
  "timestamp": "2026-03-16T10:00:00.000Z"
}`}
        </pre>
      </div>

      {/* Webhook Logs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-zinc-900">Delivery Logs</h2>
          <button
            onClick={refreshLogs}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {logsLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-sm">No webhook deliveries yet.</p>
            <p className="text-xs mt-1">Logs will appear here after your first payment.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {logs.map((log) => (
              <div key={log._id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  {log.status === "success"
                    ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    : <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                  }
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{log.event}</p>
                    <p className="text-xs text-gray-400 font-mono">
                      {log.transactionReference.slice(0, 24)}...
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    log.status === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {log.statusCode || "—"}
                  </span>
                  <p className="text-xs text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}