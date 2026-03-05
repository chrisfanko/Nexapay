"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Key, BookOpen, Code2, Webhook } from "lucide-react";

const cards = [
  {
    icon: <Key className="w-6 h-6 text-blue-500" />,
    title: "API Keys",
    description: "View and manage your API keys to authenticate requests to the NexaPay API.",
    href: "/developer/api-keys",
    cta: "Manage Keys",
  },
  {
    icon: <BookOpen className="w-6 h-6 text-blue-500" />,
    title: "Documentation",
    description: "Full reference of all NexaPay API endpoints, parameters, and responses.",
    href: "/developer/docs",
    cta: "Read Docs",
  },
  {
    icon: <Code2 className="w-6 h-6 text-blue-500" />,
    title: "Code Snippets",
    description: "Ready-to-use code examples in JavaScript and TypeScript to integrate NexaPay fast.",
    href: "/developer/code-snippets",
    cta: "View Snippets",
  },
  {
    icon: <Webhook className="w-6 h-6 text-blue-500" />,
    title: "Webhooks",
    description: "Get notified in real time when payments succeed or fail in your application.",
    href: "/developer/webhooks",
    cta: "Setup Webhooks",
  },
];

export default function DeveloperOverviewPage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-zinc-900">
          Welcome, {session?.user?.name} 👋
        </h1>
        <p className="text-gray-500 mt-2">
          This is your NexaPay developer portal. Manage your API keys, read the
          docs, and integrate payments into your app.
        </p>
      </div>

      {/* Quick start banner */}
      <div className="bg-blue-500 rounded-2xl p-6 mb-10 text-white">
        <h2 className="text-xl font-bold mb-1">Quick Start</h2>
        <p className="text-blue-100 text-sm mb-4">
          Get up and running with NexaPay in minutes. Grab your API key and
          follow the integration guide.
        </p>
        <div className="flex gap-3">
          <Link
            href="/developer/api-keys"
            className="bg-white text-blue-500 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition"
          >
            Get API Key
          </Link>
          <Link
            href="/developer/docs"
            className="bg-blue-400 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
          >
            Read Docs
          </Link>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              {card.icon}
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">
              {card.title}
            </h3>
            <p className="text-gray-500 text-sm mb-4">{card.description}</p>
            <Link
              href={card.href}
              className="text-blue-500 font-semibold text-sm hover:text-blue-700 transition"
            >
              {card.cta} →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}