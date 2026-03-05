"use client";

import { useState } from "react";
import { Copy, CheckCheck } from "lucide-react";
import { toast } from "sonner";

const snippets = [
  {
    label: "Initialize Payment (fetch)",
    language: "JavaScript",
    code: `const res = await fetch("https://yourdomain.com/api/notchpay/initialize", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "npk_live_your_api_key_here",
  },
  body: JSON.stringify({
    name: "John Doe",
    phone: "699123456",
    amount: 5000,
    currency: "XAF",
    channel: "Orange Money",
  }),
});

const data = await res.json();

if (data.authorization_url) {
  // Redirect user to complete payment
  window.location.href = data.authorization_url;
} else {
  console.error("Payment failed to initialize:", data.error);
}`,
  },
  {
    label: "Verify Payment (fetch)",
    language: "JavaScript",
    code: `const reference = "trx_xxx"; // from URL query params

const res = await fetch(
  \`https://yourdomain.com/api/notchpay/verify?reference=\${reference}\`,
  {
    headers: {
      "Authorization": "npk_live_your_api_key_here",
    },
  }
);

const data = await res.json();

if (data?.transaction?.status === "complete") {
  console.log("Payment successful!");
} else {
  console.log("Payment failed or pending.");
}`,
  },
  {
    label: "Initialize Payment (Next.js API Route)",
    language: "TypeScript",
    code: `// app/api/pay/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, phone, amount } = await req.json();

  const res = await fetch("https://yourdomain.com/api/notchpay/initialize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": process.env.NEXAPAY_API_KEY!,
    },
    body: JSON.stringify({
      name,
      phone,
      amount,
      currency: "XAF",
      channel: "MTN Mobile Money",
    }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}`,
  },
  {
    label: "Handle Payment Success (Next.js page)",
    language: "TypeScript",
    code: `"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      return;
    }

    fetch(\`/api/notchpay/verify?reference=\${reference}\`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.transaction?.status === "complete") {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, [reference]);

  if (status === "loading") return <p>Verifying payment...</p>;
  if (status === "success") return <p>Payment successful!</p>;
  return <p>Payment failed. Please try again.</p>;
}`,
  },
];

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-zinc-900 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-700">
        <span className="text-xs text-zinc-400 font-medium">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
        >
          {copied ? (
            <CheckCheck className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="px-5 py-4 text-sm text-gray-300 overflow-x-auto font-mono leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

export default function CodeSnippetsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-zinc-900">Code Snippets</h1>
        <p className="text-gray-500 mt-2">
          Ready-to-use examples to integrate NexaPay into your app quickly.
          Replace <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-600 text-xs">npk_live_your_api_key_here</code> with your actual API key.
        </p>
      </div>

      {/* Snippets */}
      <div className="space-y-8">
        {snippets.map((snippet) => (
          <div key={snippet.label}>
            <h2 className="text-lg font-bold text-zinc-900 mb-3">
              {snippet.label}
            </h2>
            <CodeBlock code={snippet.code} language={snippet.language} />
          </div>
        ))}
      </div>
    </div>
  );
}