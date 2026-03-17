"use client";

import { useState } from "react";
import { Copy, CheckCheck } from "lucide-react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
    >
      {copied ? <CheckCheck className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative bg-[#0A0F1E] border border-[#1E3A6E] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#1E3A6E]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <CopyButton text={code} />
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
  return (
    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${colors[method]}`}>
      {method}
    </span>
  );
}

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-12 scroll-mt-8">
      {children}
    </section>
  );
}

const tableRows = (rows: { field: string; type: string; req: string; desc: string }[]) => (
  <div className="overflow-x-auto mb-5">
    <table className="w-full text-sm border border-[#1E3A6E] rounded-xl overflow-hidden">
      <thead>
        <tr className="bg-[#0D1829] text-left">
          <th className="px-4 py-3 font-semibold text-blue-300 text-xs">Field</th>
          <th className="px-4 py-3 font-semibold text-blue-300 text-xs">Type</th>
          <th className="px-4 py-3 font-semibold text-blue-300 text-xs">Required</th>
          <th className="px-4 py-3 font-semibold text-blue-300 text-xs">Description</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#1E3A6E]/50">
        {rows.map((row) => (
          <tr key={row.field} className="bg-[#080E1C] hover:bg-[#0D1829] transition">
            <td className="px-4 py-3 font-mono text-blue-400 text-xs">{row.field}</td>
            <td className="px-4 py-3 text-zinc-400 text-xs">{row.type}</td>
            <td className="px-4 py-3 text-xs">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                row.req === "Yes"
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-zinc-700/30 text-zinc-500 border border-zinc-700/30"
              }`}>
                {row.req}
              </span>
            </td>
            <td className="px-4 py-3 text-zinc-400 text-xs">{row.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const navLinks = [
  { id: "prerequisites", label: "Prerequisites" },
  { id: "base-url", label: "Base URL" },
  { id: "authentication", label: "Authentication" },
  { id: "fees", label: "Fee Structure" },
  { id: "initialize", label: "Initialize Payment" },
  { id: "verify", label: "Verify Payment" },
  { id: "paypal", label: "PayPal Payment" },
  { id: "webhooks", label: "Webhooks" },
  { id: "errors", label: "Error Codes" },
];

export default function DocsPage() {
  return (
    <div className="flex gap-8 max-w-5xl mx-auto">

      {/* Sidebar nav */}
      <aside className="hidden lg:block w-48 shrink-0">
        <div className="sticky top-8">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">On this page</p>
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="block text-sm text-zinc-400 hover:text-blue-400 transition py-1 border-l-2 border-transparent hover:border-blue-500 pl-3"
              >
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
          .section-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .section-title::before {
            content: '';
            display: inline-block;
            width: 3px;
            height: 20px;
            background: #1E6FFF;
            border-radius: 2px;
          }
        `}</style>

        <div className="docs-page">
          {/* Header */}
          <div className="mb-10 pb-8 border-b border-[#1E3A6E]">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              API Reference v1.0
            </div>
            <h1 className="text-3xl font-black text-white mb-2">API Documentation</h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Complete reference for integrating NexaPay into your application. Supports Mobile Money, PayPal and more.
            </p>
          </div>

          {/* Prerequisites */}
          <Section id="prerequisites">
            <div className="section-title">Prerequisites</div>
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5 text-sm text-blue-300 space-y-2">
              <p className="font-medium text-blue-200">Before using the NexaPay API:</p>
              <ul className="space-y-2 mt-2">
                {[
                  "Create a NexaPay account at /sign-up",
                  "Register your business at /register-business",
                  "Wait for business approval (24-48 hours)",
                  "Copy your API key from the API Keys section",
                ].map((item, i) => (
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
            <div className="section-title">Base URL</div>
            <CodeBlock code="https://yourdomain.com/api" />
          </Section>

          {/* Authentication */}
          <Section id="authentication">
            <div className="section-title">Authentication</div>
            <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
              All API requests must include your API key in the{" "}
              <code className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-xs">X-API-Key</code>{" "}
              header. Your merchant account must be <span className="text-green-400 font-medium">approved</span> for the key to work.
            </p>
            <CodeBlock code={`X-API-Key: npk_live_your_api_key_here
Content-Type: application/json`} />
            <div className="mt-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3 text-xs text-yellow-300">
              ⚠️ Never expose your API key in frontend code. Always call NexaPay from your backend server.
            </div>
          </Section>

          {/* Fees */}
          <Section id="fees">
            <div className="section-title">Fee Structure</div>
            <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
              NexaPay charges <span className="text-white font-semibold">1.5%</span> per successful transaction (minimum 50 XAF).
              The fee is added on top of the merchant amount — your customer pays the gross amount and you receive the net.
            </p>
            <CodeBlock code={`// Example: you want to charge 10,000 XAF
NexaPay fee   = max(10,000 × 1.5%, 50 XAF) = 150 XAF
Customer pays = 10,150 XAF  (gross)
You receive   =  9,850 XAF  (net)

// All amounts are tracked per transaction:
// merchantAmount, nexapayFee, grossAmount, providerFee, netAmount`} />
          </Section>

          {/* Initialize NotchPay */}
          <Section id="initialize">
            <div className="section-title">Initialize a Mobile Money Payment</div>
            <div className="flex items-center gap-3 mb-4">
              <Badge method="POST" />
              <code className="font-mono text-sm text-zinc-300">/api/notchpay/initialize</code>
            </div>
            <p className="text-zinc-400 text-sm mb-5 leading-relaxed">
              Creates a new Mobile Money payment and returns an{" "}
              <code className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-xs">authorization_url</code>{" "}
              to redirect your customer to complete payment.
            </p>

            <p className="text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider">Request Body</p>
            {tableRows([
              { field: "amount", type: "number", req: "Yes", desc: "Merchant amount in XAF — NexaPay fee added automatically" },
              { field: "currency", type: "string", req: "No", desc: "Currency code — defaults to XAF" },
              { field: "name", type: "string", req: "Yes", desc: "Customer full name" },
              { field: "phone", type: "string", req: "Yes", desc: "Customer phone number" },
              { field: "email", type: "string", req: "No", desc: "Customer email address" },
              { field: "channel", type: "string", req: "Yes", desc: "Orange Money or MTN Mobile Money" },
            ])}

            <p className="text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider">Success Response</p>
            <CodeBlock code={`{
  "transaction": {
    "reference": "trx_xxx",
    "status": "pending",
    "amount": 10150,
    "currency": "XAF"
  },
  "authorization_url": "https://pay.notchpay.co/pay/trx_xxx"
}`} />
          </Section>

          {/* Verify Payment */}
          <Section id="verify">
            <div className="section-title">Verify a Payment</div>
            <div className="flex items-center gap-3 mb-4">
              <Badge method="GET" />
              <code className="font-mono text-sm text-zinc-300">/api/notchpay/verify?reference=trx_xxx</code>
            </div>
            <p className="text-zinc-400 text-sm mb-5 leading-relaxed">
              Verifies the status of a payment. Called automatically when the customer is redirected back after payment.
              Updates the transaction status in your dashboard.
            </p>

            <p className="text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider">Query Parameters</p>
            {tableRows([
              { field: "reference", type: "string", req: "Yes", desc: "The transaction reference returned at initialization" },
            ])}

            <p className="text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider">Success Response</p>
            <CodeBlock code={`{
  "transaction": {
    "reference": "trx_xxx",
    "status": "complete",
    "amount": 10150,
    "currency": "XAF",
    "customer": {
      "name": "John Doe",
      "phone": "237600000000"
    }
  }
}`} />
          </Section>

          {/* PayPal */}
          <Section id="paypal">
            <div className="section-title">Initialize a PayPal Payment</div>
            <div className="flex items-center gap-3 mb-4">
              <Badge method="POST" />
              <code className="font-mono text-sm text-zinc-300">/api/paypal/create-order</code>
            </div>
            <p className="text-zinc-400 text-sm mb-5 leading-relaxed">
              Creates a PayPal order and returns an order ID. Use the PayPal JS SDK to complete the payment on the frontend.
            </p>

            <p className="text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider">Request Body</p>
            {tableRows([
              { field: "amount", type: "string", req: "Yes", desc: "Amount as decimal string e.g. '10.00'" },
              { field: "currency", type: "string", req: "No", desc: "Currency code — defaults to USD" },
              { field: "description", type: "string", req: "No", desc: "Payment description" },
            ])}

            <p className="text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider">Success Response</p>
            <CodeBlock code={`{ "id": "PAYPAL_ORDER_ID_xxx" }`} />

            <div className="mt-4">
              <div className="flex items-center gap-3 mb-4">
                <Badge method="POST" />
                <code className="font-mono text-sm text-zinc-300">/api/paypal/capture-order</code>
              </div>
              <p className="text-zinc-400 text-sm mb-4">Captures a PayPal order after the customer approves it.</p>
              {tableRows([
                { field: "orderID", type: "string", req: "Yes", desc: "The PayPal order ID from create-order" },
              ])}
            </div>
          </Section>

          {/* Webhooks */}
          <Section id="webhooks">
            <div className="section-title">Webhooks</div>
            <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
              NexaPay sends a <code className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-xs">POST</code> request
              to your webhook URL after every payment event. Configure your URL in the{" "}
              <span className="text-blue-400 font-medium">Webhooks</span> section.
            </p>

            <p className="text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider">Events</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {["payment.complete", "payment.failed", "payment.pending"].map((e) => (
                <span key={e} className="bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs px-3 py-1.5 rounded-lg">
                  {e}
                </span>
              ))}
            </div>

            <p className="text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider">Payload</p>
            <CodeBlock code={`{
  "event": "payment.complete",
  "reference": "trx_xxx",
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
}`} />

            <p className="text-xs font-semibold text-zinc-300 mb-2 mt-5 uppercase tracking-wider">Verifying the Signature</p>
            <p className="text-zinc-400 text-sm mb-3">
              Every webhook request includes an{" "}
              <code className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-xs">X-NexaPay-Signature</code>{" "}
              header. Verify it with your webhook secret to confirm the request came from NexaPay.
            </p>
            <CodeBlock code={`const crypto = require("crypto");

function verifyWebhook(payload, signature, secret) {
  const expected = "sha256=" + crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}`} />
          </Section>

          {/* Error Codes */}
          <Section id="errors">
            <div className="section-title">Error Codes</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-[#1E3A6E] rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-[#0D1829] text-left">
                    <th className="px-4 py-3 font-semibold text-blue-300 text-xs">Code</th>
                    <th className="px-4 py-3 font-semibold text-blue-300 text-xs">Meaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E3A6E]/50">
                  {[
                    { code: "200", meaning: "Success", color: "text-green-400" },
                    { code: "400", meaning: "Bad request — missing or invalid parameters", color: "text-yellow-400" },
                    { code: "401", meaning: "Unauthorized — invalid, missing, or unapproved API key", color: "text-red-400" },
                    { code: "403", meaning: "Forbidden — insufficient permissions", color: "text-red-400" },
                    { code: "404", meaning: "Not found — transaction reference does not exist", color: "text-yellow-400" },
                    { code: "500", meaning: "Internal server error", color: "text-red-400" },
                    { code: "502", meaning: "Could not reach payment provider", color: "text-red-400" },
                  ].map((row) => (
                    <tr key={row.code} className="bg-[#080E1C] hover:bg-[#0D1829] transition">
                      <td className={`px-4 py-3 font-mono text-xs font-bold ${row.color}`}>{row.code}</td>
                      <td className="px-4 py-3 text-zinc-400 text-xs">{row.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}