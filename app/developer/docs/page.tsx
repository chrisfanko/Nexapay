"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { CheckCheck, Copy } from "lucide-react";

type FieldRow = {
  field: string;
  type: string;
  req: "Yes" | "No";
  desc: string;
};

const copyLabel = "Copy";
const copiedLabel = "Copied!";

const navLinks = [
  { id: "prerequisites", label: "Prerequisites" },
  { id: "base-url", label: "Base URL" },
  { id: "authentication", label: "Authentication" },
  { id: "fees", label: "Fees" },
  { id: "initialize", label: "Initialize payment" },
  { id: "verify", label: "Verify payment" },
  { id: "paypal", label: "PayPal" },
  { id: "webhooks", label: "Webhooks" },
  { id: "errors", label: "Errors" },
];

const initializeFields: FieldRow[] = [
  {
    field: "amount",
    type: "number",
    req: "Yes",
    desc: "Amount to charge before platform fees.",
  },
  {
    field: "currency",
    type: "string",
    req: "Yes",
    desc: "Transaction currency. Use XAF for Mobile Money flows.",
  },
  {
    field: "customerName",
    type: "string",
    req: "Yes",
    desc: "Name of the customer making the payment.",
  },
  {
    field: "customerPhone",
    type: "string",
    req: "Yes",
    desc: "Customer phone number in international format.",
  },
  {
    field: "email",
    type: "string",
    req: "No",
    desc: "Customer email address for receipts and records.",
  },
  {
    field: "callbackUrl",
    type: "string",
    req: "No",
    desc: "URL where the customer returns after payment.",
  },
  {
    field: "metadata",
    type: "object",
    req: "No",
    desc: "Custom data attached to the transaction.",
  },
];

const verifyFields: FieldRow[] = [
  {
    field: "reference",
    type: "string",
    req: "Yes",
    desc: "Transaction reference returned during initialization.",
  },
];

const paypalFields: FieldRow[] = [
  {
    field: "amount",
    type: "number",
    req: "Yes",
    desc: "Amount to charge in the selected currency.",
  },
  {
    field: "currency",
    type: "string",
    req: "Yes",
    desc: "PayPal-supported currency code such as USD or EUR.",
  },
  {
    field: "metadata",
    type: "object",
    req: "No",
    desc: "Custom data attached to the order.",
  },
];

const paypalCaptureFields: FieldRow[] = [
  {
    field: "orderId",
    type: "string",
    req: "Yes",
    desc: "PayPal order ID returned by the create-order endpoint.",
  },
];

const errorRows = [
  { code: "200", meaning: "Request completed successfully." },
  { code: "400", meaning: "The request body or query parameters are invalid." },
  { code: "401", meaning: "The API key is missing or invalid." },
  { code: "403", meaning: "The business account is not approved." },
  { code: "404", meaning: "The requested transaction or resource was not found." },
  { code: "409", meaning: "The transaction already exists or cannot be updated." },
  { code: "500", meaning: "The server could not complete the request." },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-white"
    >
      {copied ? (
        <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {copied ? copiedLabel : copyLabel}
    </button>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="overflow-hidden border border-slate-800 bg-[#0A0F1E]">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500/70" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
        </div>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-sm leading-relaxed text-blue-100">
        {code}
      </pre>
    </div>
  );
}

function Badge({ method }: { method: "POST" | "GET" }) {
  const styles = {
    POST: "border-blue-200 bg-blue-50 text-[#1E6FFF]",
    GET: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return (
    <span className={`border px-3 py-1 text-xs font-semibold ${styles[method]}`}>
      {method}
    </span>
  );
}

function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="mb-12 scroll-mt-8">
      {children}
    </section>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2.5 text-xl font-semibold text-[#0A0A0A]">
      <span className="h-5 w-[3px] bg-[#1E6FFF]" />
      {children}
    </div>
  );
}

function FieldsTable({ rows }: { rows: FieldRow[] }) {
  return (
    <div className="mb-5 overflow-x-auto border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-left">
            <th className="px-4 py-3 text-xs font-semibold text-slate-600">Field</th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-600">Type</th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-600">Required</th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-600">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.map((row) => (
            <tr key={row.field} className="bg-white transition hover:bg-slate-50">
              <td className="px-4 py-3 font-mono text-xs text-[#1E6FFF]">{row.field}</td>
              <td className="px-4 py-3 text-xs text-slate-500">{row.type}</td>
              <td className="px-4 py-3 text-xs">
                <span
                  className={`border px-2 py-0.5 text-xs font-medium ${
                    row.req === "Yes"
                      ? "border-red-200 bg-red-50 text-red-600"
                      : "border-slate-200 bg-slate-50 text-slate-500"
                  }`}
                >
                  {row.req}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-slate-500">{row.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="mx-auto flex max-w-6xl gap-8">
      <aside className="hidden w-48 shrink-0 lg:block">
        <div className="sticky top-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            On this page
          </p>
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="block border-l-2 border-transparent py-1 pl-3 text-sm text-slate-500 transition hover:border-[#1E6FFF] hover:text-[#1E6FFF]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="mb-10 border-b border-slate-200 pb-8">
          <div className="mb-4 inline-flex items-center gap-2 border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#1E6FFF]">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            Developer docs
          </div>
          <h1 className="mb-2 text-3xl font-semibold text-[#0A0A0A]">
            API documentation
          </h1>
          <p className="text-sm leading-6 text-slate-500">
            Build secure payment flows with PayFlows REST API, Mobile Money
            integrations, PayPal orders, and signed webhook events.
          </p>
        </div>

        <Section id="prerequisites">
          <SectionTitle>Prerequisites</SectionTitle>
          <div className="border border-blue-100 bg-blue-50 p-5 text-sm text-slate-600">
            <p className="font-medium text-slate-800">
              Before you start integrating payments, make sure you have:
            </p>
            <ul className="mt-3 space-y-2">
              {[
                "A registered business account.",
                "An approved business profile.",
                "A live or test API key from the developer dashboard.",
                "A secure backend server for secret-key requests.",
              ].map((item, index) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-blue-200 bg-white text-xs font-semibold text-[#1E6FFF]">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section id="base-url">
          <SectionTitle>Base URL</SectionTitle>
          <CodeBlock code="https://yourdomain.com/api" />
        </Section>

        <Section id="authentication">
          <SectionTitle>Authentication</SectionTitle>
          <p className="mb-4 text-sm leading-relaxed text-slate-500">
            Send your API key in the{" "}
            <code className="border border-blue-100 bg-blue-50 px-1.5 py-0.5 text-xs text-[#1E6FFF]">
              X-API-Key
            </code>{" "}
            header. Requests only work when the linked business is approved.
          </p>
          <CodeBlock
            code={`X-API-Key: npk_live_your_api_key_here
Content-Type: application/json`}
          />
          <div className="mt-3 border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-700">
            Keep secret keys on your server. Never expose them in browser code
            or mobile apps.
          </div>
        </Section>

        <Section id="fees">
          <SectionTitle>Fees</SectionTitle>
          <p className="mb-4 text-sm leading-relaxed text-slate-500">
            Platform fees are calculated per transaction and stored with the
            payment record for clean reconciliation.
          </p>
          <CodeBlock
            code={`// Example: you want to charge 10,000 XAF
NexaPay fee   = max(10,000 x 1.5%, 50 XAF) = 150 XAF
Customer pays = 10,150 XAF  (gross)
You receive   =  9,850 XAF  (net)

// All amounts are tracked per transaction:
// merchantAmount, nexapayFee, grossAmount, providerFee, netAmount`}
          />
        </Section>

        <Section id="initialize">
          <SectionTitle>Initialize payment</SectionTitle>
          <div className="mb-4 flex items-center gap-3">
            <Badge method="POST" />
            <code className="font-mono text-sm text-slate-700">
              /api/notchpay/initialize
            </code>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-slate-500">
            Create a Mobile Money payment and receive an authorization URL for
            the customer to complete the transaction.
          </p>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-700">
            Request body
          </p>
          <FieldsTable rows={initializeFields} />
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-700">
            Success response
          </p>
          <CodeBlock
            code={`{
  "transaction": {
    "reference": "trx_xxx",
    "status": "pending",
    "amount": 10150,
    "currency": "XAF"
  },
  "authorization_url": "https://pay.notchpay.co/pay/trx_xxx"
}`}
          />
        </Section>

        <Section id="verify">
          <SectionTitle>Verify payment</SectionTitle>
          <div className="mb-4 flex items-center gap-3">
            <Badge method="GET" />
            <code className="font-mono text-sm text-slate-700">
              /api/notchpay/verify?reference=trx_xxx
            </code>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-slate-500">
            Verify a transaction by reference before granting value to the
            customer.
          </p>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-700">
            Query parameters
          </p>
          <FieldsTable rows={verifyFields} />
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-700">
            Success response
          </p>
          <CodeBlock
            code={`{
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
}`}
          />
        </Section>

        <Section id="paypal">
          <SectionTitle>PayPal</SectionTitle>
          <div className="mb-4 flex items-center gap-3">
            <Badge method="POST" />
            <code className="font-mono text-sm text-slate-700">
              /api/paypal/create-order
            </code>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-slate-500">
            Create a PayPal order and use the returned order ID to complete the
            approval flow on the client.
          </p>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-700">
            Request body
          </p>
          <FieldsTable rows={paypalFields} />
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-700">
            Success response
          </p>
          <CodeBlock code={`{ "id": "PAYPAL_ORDER_ID_xxx" }`} />

          <div className="mt-5">
            <div className="mb-4 flex items-center gap-3">
              <Badge method="POST" />
              <code className="font-mono text-sm text-slate-700">
                /api/paypal/capture-order
              </code>
            </div>
            <p className="mb-4 text-sm text-slate-500">
              Capture an approved PayPal order after the customer confirms the
              payment.
            </p>
            <FieldsTable rows={paypalCaptureFields} />
          </div>
        </Section>

        <Section id="webhooks">
          <SectionTitle>Webhooks</SectionTitle>
          <p className="mb-4 text-sm leading-relaxed text-slate-500">
            Webhooks notify your backend when a payment changes state. Always
            verify the signature before trusting the payload.
          </p>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-700">
            Events
          </p>
          <div className="mb-5 flex flex-wrap gap-2">
            {["payment.complete", "payment.failed", "payment.pending"].map((event) => (
              <span
                key={event}
                className="border border-blue-100 bg-blue-50 px-3 py-1.5 font-mono text-xs text-[#1E6FFF]"
              >
                {event}
              </span>
            ))}
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-700">
            Payload
          </p>
          <CodeBlock
            code={`{
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
}`}
          />
          <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-slate-700">
            Verify signatures
          </p>
          <p className="mb-3 text-sm text-slate-500">
            Compare the incoming signature with an HMAC digest generated from
            your webhook secret.
          </p>
          <CodeBlock
            code={`const crypto = require("crypto");

function verifyWebhook(payload, signature, secret) {
  const expected = "sha256=" + crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}`}
          />
        </Section>

        <Section id="errors">
          <SectionTitle>Errors</SectionTitle>
          <div className="overflow-x-auto border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-600">
                    Code
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-600">
                    Meaning
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {errorRows.map((row) => (
                  <tr key={row.code} className="bg-white transition hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-800">
                      {row.code}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {row.meaning}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </main>
    </div>
  );
}