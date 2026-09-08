"use client";

import { useEffect, useState } from "react";
import {
  Check,
  CheckCircle2,
  CircleAlert,
  CircleX,
  Copy,
  Eye,
  EyeOff,
  LoaderCircle,
  RefreshCw,
  Save,
  Webhook,
} from "lucide-react";
import { useTranslations } from "next-intl";

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

const payloadExample = `{
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
}`;

export default function WebhooksPage() {
  const t = useTranslations("webhooksPage");

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
      .then((response) => response.json())
      .then((data) => {
        setWebhookUrl(data.webhookUrl || "");
        setWebhookSecret(data.webhookSecret || "");
      })
      .catch(() => undefined);

    fetch("/api/webhooks/logs")
      .then((response) => response.json())
      .then((data) => setLogs(data.logs || []))
      .catch(() => setLogs([]))
      .finally(() => setLogsLoading(false));
  }, []);

  const refreshLogs = () => {
    setLogsLoading(true);

    fetch("/api/webhooks/logs")
      .then((response) => response.json())
      .then((data) => setLogs(data.logs || []))
      .catch(() => setLogs([]))
      .finally(() => setLogsLoading(false));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/webhooks/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t("endpoint.errorFallback"));
        return;
      }

      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch {
      setError(t("endpoint.errorFallback"));
    } finally {
      setSaving(false);
    }
  };

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(webhookSecret);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const maskedSecret = webhookSecret
    ? `${webhookSecret.slice(0, 6)}${"•".repeat(40)}`
    : "whsec_••••••••••••••••••••••••••••••••••••••••";

  return (
    <div className="max-w-5xl">
      <header className="border-b border-slate-200 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
          Developer portal
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#0A0A0A] sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          {t("subtitle")}
        </p>
      </header>

      <section className="mt-8 grid overflow-hidden border border-slate-200 bg-white lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="p-6 sm:p-8">
          <div className="flex gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-[#1E6FFF]">
              <Webhook className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E6FFF]">
                Payment events
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#0A0A0A]">
                {t("endpoint.title")}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                {t("endpoint.desc")}
              </p>
            </div>
          </div>

          <form className="mt-7" onSubmit={handleSave}>
            <label
              className="text-sm font-semibold text-[#0A0A0A]"
              htmlFor="webhook-url"
            >
              {t("endpoint.label")}
            </label>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                className="h-11 min-w-0 flex-1 border border-slate-300 bg-white px-3.5 text-sm text-[#0A0A0A] outline-none placeholder:text-slate-400 focus:border-[#1E6FFF] focus:ring-2 focus:ring-blue-100"
                id="webhook-url"
                onChange={(event) => setWebhookUrl(event.target.value)}
                placeholder={t("endpoint.placeholder")}
                type="url"
                value={webhookUrl}
              />

              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1E6FFF] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#175ED8] disabled:cursor-not-allowed disabled:bg-slate-300"
                disabled={saving || !webhookUrl}
                type="submit"
              >
                {saving ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" />
                    {t("endpoint.saving")}
                  </>
                ) : saved ? (
                  <>
                    <Check className="size-4" />
                    {t("endpoint.saved")}
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    {t("endpoint.save")}
                  </>
                )}
              </button>
            </div>

            {error && (
              <div
                className="mt-4 flex gap-3 border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
                role="alert"
              >
                <CircleAlert className="mt-0.5 size-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </form>
        </div>

        <aside className="border-t border-slate-200 bg-[#0A0A0A] p-6 text-white lg:border-l lg:border-t-0 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E6FFF]">
            Events delivered
          </p>

          <div className="mt-6 divide-y divide-white/15 border-y border-white/15">
            {["payment.complete", "payment.failed", "payment.pending"].map(
              (event, index) => (
                <div className="flex items-center gap-3 py-4" key={event}>
                  <span className="font-mono text-xs text-[#1E6FFF]">
                    0{index + 1}
                  </span>
                  <span className="font-mono text-xs text-slate-300">{event}</span>
                </div>
              )
            )}
          </div>

          <p className="mt-6 text-sm leading-6 text-slate-400">
            NexaPay signs each delivery with your webhook secret.
          </p>
        </aside>
      </section>

      <section className="mt-6 border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E6FFF]">
            Signature verification
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#0A0A0A]">
            {t("secret.title")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {t("secret.desc")}
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="min-w-0 flex-1 overflow-x-auto border border-slate-300 bg-slate-50 px-4 py-3 font-mono text-sm text-[#0A0A0A]">
              {showSecret ? webhookSecret : maskedSecret}
            </div>

            <div className="flex gap-2">
              <button
                className="inline-flex h-11 items-center justify-center gap-2 border border-slate-300 bg-white px-4 text-sm font-semibold text-[#0A0A0A] transition-colors hover:border-[#0A0A0A] hover:bg-slate-50"
                onClick={() => setShowSecret((visible) => !visible)}
                type="button"
              >
                {showSecret ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                {showSecret ? t("secret.hide") : t("secret.reveal")}
              </button>

              <button
                aria-label={t("secret.copy")}
                className="inline-flex size-11 items-center justify-center border border-slate-300 bg-white text-slate-600 transition-colors hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
                disabled={!webhookSecret}
                onClick={copySecret}
                type="button"
              >
                {copied ? (
                  <Check className="size-4 text-green-700" />
                ) : (
                  <Copy className="size-4" />
                )}
              </button>
            </div>
          </div>

          {copied && (
            <p className="mt-3 text-sm font-medium text-green-700">
              {t("secret.copied")}
            </p>
          )}
        </div>
      </section>

      <section className="mt-6 border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E6FFF]">
            Event format
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#0A0A0A]">
            {t("payload.title")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {t("payload.desc")}
          </p>
        </div>

        <pre className="overflow-x-auto bg-[#0A0A0A] p-5 font-mono text-xs leading-6 text-slate-200 sm:p-6">
          {payloadExample}
        </pre>
      </section>

      <section className="mt-6 overflow-hidden border border-slate-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E6FFF]">
              Delivery history
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#0A0A0A]">
              {t("logs.title")}
            </h2>
          </div>

          <button
            className="inline-flex h-10 items-center justify-center gap-2 border border-slate-300 bg-white px-4 text-sm font-semibold text-[#0A0A0A] transition-colors hover:border-[#0A0A0A] hover:bg-slate-50"
            onClick={refreshLogs}
            type="button"
          >
            <RefreshCw className={`size-4 ${logsLoading ? "animate-spin" : ""}`} />
            {t("logs.refresh")}
          </button>
        </div>

        {logsLoading ? (
          <div className="divide-y divide-slate-200">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="flex items-center gap-4 p-5 sm:p-6" key={index}>
                <div className="size-5 animate-pulse bg-slate-100" />
                <div className="flex-1">
                  <div className="h-4 w-32 animate-pulse bg-slate-100" />
                  <div className="mt-2 h-3 w-48 animate-pulse bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <Webhook className="mx-auto size-5 text-slate-400" />
            <p className="mt-4 text-sm font-medium text-[#0A0A0A]">
              {t("logs.empty")}
            </p>
            <p className="mt-2 text-xs text-slate-500">{t("logs.emptyHint")}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {logs.map((log) => (
              <article
                className="flex flex-col gap-4 p-5 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                key={log._id}
              >
                <div className="flex min-w-0 items-start gap-3">
                  {log.status === "success" ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-700" />
                  ) : (
                    <CircleX className="mt-0.5 size-4 shrink-0 text-red-700" />
                  )}

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0A0A0A]">
                      {log.event}
                    </p>
                    <p className="mt-1 truncate font-mono text-xs text-slate-500">
                      {log.transactionReference}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:text-right">
                  <span
                    className={`border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] ${
                      log.status === "success"
                        ? "border-green-200 bg-green-50 text-green-800"
                        : "border-red-200 bg-red-50 text-red-800"
                    }`}
                  >
                    {log.statusCode || "—"}
                  </span>
                  <p className="text-xs text-slate-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}