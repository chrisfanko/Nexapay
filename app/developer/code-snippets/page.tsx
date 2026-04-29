"use client";

import { useState } from "react";
import { Copy, CheckCheck } from "lucide-react";
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
  console.log("✅ Payment successful!");
  console.log("Amount:", data.transaction.amount, data.transaction.currency);
} else {
  console.log("❌ Payment failed or pending.");
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
  `import 'package:http/http.dart' as http;
import 'dart:convert';

Future<String> initializePayment({
  required String name,
  required String phone,
  required int amount,
  required String channel,
}) async {
  final response = await http.post(
    Uri.parse('https://yourdomain.com/api/notchpay/initialize'),
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'npk_live_your_api_key_here',
    },
    body: jsonEncode({
      'name': name,
      'phone': phone,
      'amount': amount,
      'currency': 'XAF',
      'channel': channel,
    }),
  );

  final data = jsonDecode(response.body);

  if (response.statusCode == 200) {
    return data['authorization_url'];
  } else {
    throw Exception(data['error'] ?? 'Payment failed');
  }
}`,
];

const languages = ["JavaScript", "JavaScript", "JavaScript", "TypeScript", "TypeScript", "Dart"];

function CodeBlock({ code, language, copiedLabel, copyLabel, toastMsg }: {
  code: string; language: string; copiedLabel: string; copyLabel: string; toastMsg: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success(toastMsg);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-[#0A0F1E] border border-[#1E3A6E] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#1E3A6E]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="text-xs text-zinc-500 font-medium">{language}</span>
        </div>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition">
          {copied ? <CheckCheck className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <pre className="px-5 py-5 text-sm text-blue-200 overflow-x-auto font-mono leading-relaxed">{code}</pre>
    </div>
  );
}

export default function CodeSnippetsPage() {
  const t = useTranslations("codeSnippets");
  const [active, setActive] = useState(0);

  const snippets = (t.raw("snippets") as { label: string; desc: string }[]).map((s, i) => ({
    ...s,
    code: codes[i],
    language: languages[i],
  }));

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-[#1E3A6E]">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          {t("badge")}
        </div>
        <h1 className="text-3xl font-black text-white mb-2">{t("title")}</h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          {t("subtitle").split("npk_live_your_api_key_here").map((part, i) =>
            i === 0 ? (
              <span key={i}>{part}<code className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-xs">npk_live_your_api_key_here</code></span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {snippets.map((s, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
              active === i
                ? "bg-blue-500 text-white"
                : "bg-[#0D1829] border border-[#1E3A6E] text-zinc-400 hover:text-white hover:border-blue-500/50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Active snippet */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-white mb-1">{snippets[active].label}</h2>
          <p className="text-sm text-zinc-400">{snippets[active].desc}</p>
        </div>
        <CodeBlock
          code={snippets[active].code}
          language={snippets[active].language}
          copyLabel={t("copy")}
          copiedLabel={t("copied")}
          toastMsg={t("codeCopied")}
        />
      </div>

      {/* All snippets */}
      <div className="mt-12 space-y-10">
        <div className="border-t border-[#1E3A6E] pt-8">
          <h2 className="text-lg font-bold text-white mb-6">{t("allSnippets")}</h2>
          {snippets.map((snippet, i) => (
            <div key={i} className="mb-8">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">{snippet.label}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">{snippet.desc}</p>
                </div>
                <span className="text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full ml-4 shrink-0">
                  {snippet.language}
                </span>
              </div>
              <CodeBlock
                code={snippet.code}
                language={snippet.language}
                copyLabel={t("copy")}
                copiedLabel={t("copied")}
                toastMsg={t("codeCopied")}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}