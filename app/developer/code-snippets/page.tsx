"use client";

import { useState } from "react";
import { CheckCheck, Copy, Terminal } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const codes = [
  `const res = await fetch("https://yourdomain.com/api/notchpay/initialize", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "npk_live_your_api_key_here",
  },
  body: JSON.stringify({
    name: "John Doe",
    phone: "237600000000",
    email: "john@example.com",
    amount: 10000,
    currency: "XAF",
    channel: "MTN Mobile Money",
  }),
});

const data = await res.json();

if (data?.transaction?.reference) {
  window.location.href = data.authorization_url;
} else {
  console.error("Failed to initialize payment:", data.error);
}`,

  `const reference = new URLSearchParams(window.location.search).get("reference");

const res = await fetch(
  \`https://yourdomain.com/api/notchpay/verify?reference=\${reference}\`
);

const data = await res.json();

if (data?.transaction?.status === "complete") {
  console.log("Payment successful!");
  console.log("Amount:", data.transaction.amount, data.transaction.currency);
} else {
  console.log("Payment failed or pending.");
}`,

  `const res = await fetch("https://yourdomain.com/api/paypal/create-order", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "npk_live_your_api_key_here",
  },
  body: JSON.stringify({
    amount: "10.00",
    currency: "USD",
    description: "Order #1234",
  }),
});

const { id: orderID } = await res.json();

const captureRes = await fetch("https://yourdomain.com/api/paypal/capture-order", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "npk_live_your_api_key_here",
  },
  body: JSON.stringify({ orderID }),
});

const captureData = await captureRes.json();
console.log("PayPal payment status:", captureData.status);`,

  `// app/api/pay/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, phone, amount, channel } = await req.json();

  const res = await fetch(
    "https://yourdomain.com/api/notchpay/initialize",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.NEXAPAY_API_KEY!,
      },
      body: JSON.stringify({ name, phone, amount, currency: "XAF", channel }),
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}`,

  `// app/api/webhooks/nexapay/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-nexapay-signature") || "";
  const body = await req.text();

  const expected = "sha256=" + crypto
    .createHmac("sha256", process.env.NEXAPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(body);

  if (payload.event === "payment.complete") {
    console.log("Payment complete:", payload.reference);
  }

  return NextResponse.json({ received: true });
}`,

  `import "package:http/http.dart" as http;
import "dart:convert";

Future<String> initializePayment({
  required String name,
  required String phone,
  required int amount,
  required String channel,
}) async {
  final response = await http.post(
    Uri.parse("https://yourdomain.com/api/notchpay/initialize"),
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": "npk_live_your_api_key_here",
    },
    body: jsonEncode({
      "name": name,
      "phone": phone,
      "amount": amount,
      "currency": "XAF",
      "channel": channel,
    }),
  );

  final data = jsonDecode(response.body);

  if (response.statusCode == 200) {
    return data["authorization_url"];
  }

  throw Exception(data["error"] ?? "Payment failed");
}`,
];

const languages = [
  "JavaScript",
  "JavaScript",
  "JavaScript",
  "TypeScript",
  "TypeScript",
  "Dart",
];

type Snippet = {
  label: string;
  desc: string;
  code: string;
  language: string;
};

function CopyButton({
  code,
  copiedLabel,
  copyLabel,
  toastMessage,
}: {
  code: string;
  copiedLabel: string;
  copyLabel: string;
  toastMessage: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success(toastMessage);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition-colors hover:text-white"
      onClick={handleCopy}
      type="button"
    >
      {copied ? (
        <CheckCheck className="size-3.5 text-emerald-400" />
      ) : (
        <Copy className="size-3.5" />
      )}
      {copied ? copiedLabel : copyLabel}
    </button>
  );
}

function CodePanel({
  code,
  language,
  copiedLabel,
  copyLabel,
  toastMessage,
}: {
  code: string;
  language: string;
  copiedLabel: string;
  copyLabel: string;
  toastMessage: string;
}) {
  return (
    <div className="overflow-hidden border border-[#0A0A0A] bg-[#0A0A0A]">
      <div className="flex items-center justify-between border-b border-white/15 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <Terminal className="size-3.5 text-[#1E6FFF]" />
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
            {language}
          </span>
        </div>
        <CopyButton
          code={code}
          copiedLabel={copiedLabel}
          copyLabel={copyLabel}
          toastMessage={toastMessage}
        />
      </div>

      <pre className="max-h-[34rem] overflow-auto px-4 py-5 font-mono text-xs leading-6 text-slate-200 sm:px-5 sm:text-sm">
        {code}
      </pre>
    </div>
  );
}

export default function CodeSnippetsPage() {
  const t = useTranslations("codeSnippets");
  const [activeIndex, setActiveIndex] = useState(0);

  const snippets: Snippet[] = (
    t.raw("snippets") as { label: string; desc: string }[]
  ).map((snippet, index) => ({
    ...snippet,
    code: codes[index] ?? "",
    language: languages[index] ?? "Code",
  }));

  const activeSnippet = snippets[activeIndex];

  if (!activeSnippet) {
    return null;
  }

  return (
    <div>
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

      <section className="mt-8 border border-[#0A0A0A] bg-[#0A0A0A] p-6 text-white sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
          Integration library
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.035em]">
              Ready-to-use examples
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Copy a tested starting point, then replace the sample key and URL
              with your own values.
            </p>
          </div>
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            {snippets.length} examples
          </span>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-5">
          {snippets.map((snippet, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                className={`h-10 border px-4 text-xs font-semibold transition-colors ${
                  isActive
                    ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
                }`}
                key={snippet.label}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                {snippet.label}
              </button>
            );
          })}
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
              Selected example
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#0A0A0A]">
              {activeSnippet.label}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {activeSnippet.desc}
            </p>

            <div className="mt-6">
              <CodePanel
                code={activeSnippet.code}
                copiedLabel={t("copied")}
                copyLabel={t("copy")}
                language={activeSnippet.language}
                toastMessage={t("codeCopied")}
              />
            </div>
          </div>

          <aside className="border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E6FFF]">
              Before you ship
            </p>
            <ol className="mt-5 space-y-4">
              {[
                "Use your own live or test API key.",
                "Never expose your API key in client-side code.",
                "Verify webhooks before updating an order.",
              ].map((item, index) => (
                <li className="flex gap-3 text-sm leading-6 text-slate-600" key={item}>
                  <span className="font-mono text-xs font-semibold text-[#1E6FFF]">
                    0{index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-5 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
              Complete reference
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#0A0A0A]">
              {t("allSnippets")}
            </h2>
          </div>
        </div>

        <div className="mt-6 space-y-10">
          {snippets.map((snippet) => (
            <article key={snippet.label}>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold tracking-[-0.025em] text-[#0A0A0A]">
                    {snippet.label}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{snippet.desc}</p>
                </div>
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#1E6FFF]">
                  {snippet.language}
                </span>
              </div>

              <CodePanel
                code={snippet.code}
                copiedLabel={t("copied")}
                copyLabel={t("copy")}
                language={snippet.language}
                toastMessage={t("codeCopied")}
              />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}