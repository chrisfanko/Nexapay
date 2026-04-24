"use client";

import { useState } from "react";
import { Copy, CheckCheck } from "lucide-react";
import { useTranslations } from "next-intl";

function CopyButton({ text, copiedLabel, copyLabel }: { text: string; copiedLabel: string; copyLabel: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
    >
      {copied ? <CheckCheck className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? copiedLabel : copyLabel}
    </button>
  );
}

function CodeBlock({ code, copiedLabel, copyLabel }: { code: string; copiedLabel: string; copyLabel: string }) {
  return (
    <div className="relative bg-[#0A0F1E] border border-[#1E3A6E] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#1E3A6E]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <CopyButton text={code} copiedLabel={copiedLabel} copyLabel={copyLabel} />
      </div>
      <pre className="px-5 py-4 text-sm text-blue-200 overflow-x-auto font-mono leading-relaxed">{code}</pre>
    </div>
  );
}

function Badge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    POST: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    GET: "bg-green-500/20 text-green-400 border-green-500/30",
  };
  return <span className={`text-xs font-bold px-3 py-1 rounded-full border ${colors[method]}`}>{method}</span>;
}

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return <section id={id} className="mb-12 scroll-mt-8">{children}</section>;
}

export default function DocsPage() {
  const t = useTranslations("docs");

  const navLinks = [
    { id: "prerequisites", label: t("nav.prerequisites") },
    { id: "base-url", label: t("nav.baseUrl") },
    { id: "authentication", label: t("nav.authentication") },
    { id: "fees", label: t("nav.fees") },
    { id: "initialize", label: t("nav.initialize") },
    { id: "verify", label: t("nav.verify") },
    { id: "paypal", label: t("nav.paypal") },
    { id: "webhooks", label: t("nav.webhooks") },
    { id: "errors", label: t("nav.errors") },
  ];

  const tableRows = (rows: { field: string; type: string; req: string; desc: string }[]) => (
    <div className="overflow-x-auto mb-5">
      <table className="w-full text-sm border border-[#1E3A6E] rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-[#0D1829] text-left">
            <th className="px-4 py-3 font-semibold text-blue-300 text-xs">{t("table.field")}</th>
            <th className="px-4 py-3 font-semibold text-blue-300 text-xs">{t("table.type")}</th>
            <th className="px-4 py-3 font-semibold text-blue-300 text-xs">{t("table.required")}</th>
            <th className="px-4 py-3 font-semibold text-blue-300 text-xs">{t("table.description")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1E3A6E]/50">
          {rows.map((row) => (
            <tr key={row.field} className="bg-[#080E1C] hover:bg-[#0D1829] transition">
              <td className="px-4 py-3 font-mono text-blue-400 text-xs">{row.field}</td>
              <td className="px-4 py-3 text-zinc-400 text-xs">{row.type}</td>
              <td className="px-4 py-3 text-xs">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  row.req === t("table.yes")
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-zinc-700/30 text-zinc-500 border border-zinc-700/30"
                }`}>{row.req}</span>
              </td>
              <td className="px-4 py-3 text-zinc-400 text-xs">{row.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const copyLabel = "Copy";
  const copiedLabel = "Copied!";

  return (
    <div className="flex gap-8 max-w-5xl mx-auto">
      {/* Sidebar nav */}
      <aside className="hidden lg:block w-48 shrink-0">
        <div className="sticky top-8">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">{t("onThisPage")}</p>
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <a key={link.id} href={`#${link.id}`} className="block text-sm text-zinc-400 hover:text-blue-400 transition py-1 border-l-2 border-transparent hover:border-blue-500 pl-3">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <style>{`
          .docs-page { color: #e2e8f0; }
          .docs-page h2 { font-family: 'Syne', sans-serif; }
          .section-title { font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
          .section-title::before { content: ''; display: inline-block; width: 3px; height: 20px; background: #1E6FFF; border-radius: 2px; }
        `}</style>

        <div className="docs-page">
          {/* Header */}
          <div className="mb-10 pb-8 border-b border-[#1E3A6E]">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              {t("badge")}
            </div>
            <h1 className="text-3xl font-black text-white mb-2">{t("title")}</h1>
            <p className="text-zinc-400 text-sm leading-relaxed">{t("subtitle")}</p>
          </div>

          {/* Prerequisites */}
          <Section id="prerequisites">
            <div className="section-title">{t("prerequisites.title")}</div>
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5 text-sm text-blue-300 space-y-2">
              <p className="font-medium text-blue-200">{t("prerequisites.intro")}</p>
              <ul className="space-y-2 mt-2">
                {(t.raw("prerequisites.steps") as string[]).map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          {/* Base URL */}
          <Section id="base-url">
            <div className="section-title">{t("baseUrl.title")}</div>
            <CodeBlock code="https://yourdomain.com/api" copyLabel={copyLabel} copiedLabel={copiedLabel} />
          </Section>

          {/* Authentication */}
          <Section id="authentication">
            <div className="section-title">{t("authentication.title")}</div>
            <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
              {t("authentication.desc").split("X-API-Key").map((part, i) =>
                i === 0 ? <span key={i}>{part}<code className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-xs">X-API-Key</code></span>
                : <span key={i}>{part.split("approved").map((p, j) =>
                  j === 0 ? <span key={j}>{p}<span className="text-green-400 font-medium">approved</span></span>
                  : <span key={j}>{p}</span>
                )}</span>
              )}
            </p>
            <CodeBlock code={`X-API-Key: npk_live_your_api_key_here\nContent-Type: application/json`} copyLabel={copyLabel} copiedLabel={copiedLabel} />
            <div className="mt-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3 text-xs text-yellow-300">
              ⚠️ {t("authentication.warning")}
            </div>
          </Section>

          {/* Fees */}
          <Section id="fees">
            <div className="section-title">{t("fees.title")}</div>
            <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{t("fees.desc")}</p>
            <CodeBlock code={`// Example: you want to charge 10,000 XAF\nNexaPay fee   = max(10,000 × 1.5%, 50 XAF) = 150 XAF\nCustomer pays = 10,150 XAF  (gross)\nYou receive   =  9,850 XAF  (net)\n\n// All amounts are tracked per transaction:\n// merchantAmount, nexapayFee, grossAmount, providerFee, netAmount`} copyLabel={copyLabel} copiedLabel={copiedLabel} />
          </Section>

          {/* Initialize */}
          <Section id="initialize">
            <div className="section-title">{t("initialize.title")}</div>
            <div className="flex items-center gap-3 mb-4">
              <Badge method="POST" />
              <code className="font-mono text-sm text-zinc-300">/api/notchpay/initialize</code>
            </div>
            <p className="text-zinc-400 text-sm mb-5 leading-relaxed">{t("initialize.desc")}</p>
            <p className="text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider">{t("initialize.requestBody")}</p>
            {tableRows(t.raw("initialize.fields") as { field: string; type: string; req: string; desc: string }[])}
            <p className="text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider">{t("initialize.successResponse")}</p>
            <CodeBlock code={`{\n  "transaction": {\n    "reference": "trx_xxx",\n    "status": "pending",\n    "amount": 10150,\n    "currency": "XAF"\n  },\n  "authorization_url": "https://pay.notchpay.co/pay/trx_xxx"\n}`} copyLabel={copyLabel} copiedLabel={copiedLabel} />
          </Section>

          {/* Verify */}
          <Section id="verify">
            <div className="section-title">{t("verify.title")}</div>
            <div className="flex items-center gap-3 mb-4">
              <Badge method="GET" />
              <code className="font-mono text-sm text-zinc-300">/api/notchpay/verify?reference=trx_xxx</code>
            </div>
            <p className="text-zinc-400 text-sm mb-5 leading-relaxed">{t("verify.desc")}</p>
            <p className="text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider">{t("verify.queryParams")}</p>
            {tableRows(t.raw("verify.fields") as { field: string; type: string; req: string; desc: string }[])}
            <p className="text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider">{t("verify.successResponse")}</p>
            <CodeBlock code={`{\n  "transaction": {\n    "reference": "trx_xxx",\n    "status": "complete",\n    "amount": 10150,\n    "currency": "XAF",\n    "customer": {\n      "name": "John Doe",\n      "phone": "237600000000"\n    }\n  }\n}`} copyLabel={copyLabel} copiedLabel={copiedLabel} />
          </Section>

          {/* PayPal */}
          <Section id="paypal">
            <div className="section-title">{t("paypal.title")}</div>
            <div className="flex items-center gap-3 mb-4">
              <Badge method="POST" />
              <code className="font-mono text-sm text-zinc-300">/api/paypal/create-order</code>
            </div>
            <p className="text-zinc-400 text-sm mb-5 leading-relaxed">{t("paypal.desc")}</p>
            <p className="text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider">{t("paypal.requestBody")}</p>
            {tableRows(t.raw("paypal.fields") as { field: string; type: string; req: string; desc: string }[])}
            <p className="text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider">{t("paypal.successResponse")}</p>
            <CodeBlock code={`{ "id": "PAYPAL_ORDER_ID_xxx" }`} copyLabel={copyLabel} copiedLabel={copiedLabel} />
            <div className="mt-4">
              <div className="flex items-center gap-3 mb-4">
                <Badge method="POST" />
                <code className="font-mono text-sm text-zinc-300">/api/paypal/capture-order</code>
              </div>
              <p className="text-zinc-400 text-sm mb-4">{t("paypal.captureDesc")}</p>
              {tableRows(t.raw("paypal.captureFields") as { field: string; type: string; req: string; desc: string }[])}
            </div>
          </Section>

          {/* Webhooks */}
          <Section id="webhooks">
            <div className="section-title">{t("webhooks.title")}</div>
            <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{t("webhooks.desc")}</p>
            <p className="text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider">{t("webhooks.events")}</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {["payment.complete", "payment.failed", "payment.pending"].map((e) => (
                <span key={e} className="bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs px-3 py-1.5 rounded-lg">{e}</span>
              ))}
            </div>
            <p className="text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider">{t("webhooks.payload")}</p>
            <CodeBlock code={`{\n  "event": "payment.complete",\n  "reference": "trx_xxx",\n  "status": "complete",\n  "amount": 10000,\n  "currency": "XAF",\n  "channel": "MTN Mobile Money",\n  "provider": "notchpay",\n  "customerName": "John Doe",\n  "customerPhone": "237600000000",\n  "nexapayFee": 150,\n  "netAmount": 9850,\n  "timestamp": "2026-03-16T10:00:00.000Z"\n}`} copyLabel={copyLabel} copiedLabel={copiedLabel} />
            <p className="text-xs font-semibold text-zinc-300 mb-2 mt-5 uppercase tracking-wider">{t("webhooks.verifyTitle")}</p>
            <p className="text-zinc-400 text-sm mb-3">{t("webhooks.verifyDesc")}</p>
            <CodeBlock code={`const crypto = require("crypto");\n\nfunction verifyWebhook(payload, signature, secret) {\n  const expected = "sha256=" + crypto\n    .createHmac("sha256", secret)\n    .update(payload)\n    .digest("hex");\n\n  return crypto.timingSafeEqual(\n    Buffer.from(signature),\n    Buffer.from(expected)\n  );\n}`} copyLabel={copyLabel} copiedLabel={copiedLabel} />
          </Section>

          {/* Errors */}
          <Section id="errors">
            <div className="section-title">{t("errors.title")}</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-[#1E3A6E] rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-[#0D1829] text-left">
                    <th className="px-4 py-3 font-semibold text-blue-300 text-xs">{t("table.code")}</th>
                    <th className="px-4 py-3 font-semibold text-blue-300 text-xs">{t("table.meaning")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E3A6E]/50">
                  {(t.raw("errors.rows") as { code: string; meaning: string; color?: string }[]).map((row, i) => {
                    const colors = ["text-green-400", "text-yellow-400", "text-red-400", "text-red-400", "text-yellow-400", "text-red-400", "text-red-400"];
                    return (
                      <tr key={row.code} className="bg-[#080E1C] hover:bg-[#0D1829] transition">
                        <td className={`px-4 py-3 font-mono text-xs font-bold ${colors[i]}`}>{row.code}</td>
                        <td className="px-4 py-3 text-zinc-400 text-xs">{row.meaning}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}