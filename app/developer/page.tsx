"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Key, BookOpen, Code2, Webhook } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DeveloperOverviewPage() {
  const t = useTranslations("developerOverview");
  const { data: session } = useSession();

  const cards = [
    { icon: <Key className="w-6 h-6 text-blue-500" />, title: t("cards.apiKeys.title"), description: t("cards.apiKeys.desc"), href: "/developer/api-keys", cta: t("cards.apiKeys.cta") },
    { icon: <BookOpen className="w-6 h-6 text-blue-500" />, title: t("cards.docs.title"), description: t("cards.docs.desc"), href: "/developer/docs", cta: t("cards.docs.cta") },
    { icon: <Code2 className="w-6 h-6 text-blue-500" />, title: t("cards.snippets.title"), description: t("cards.snippets.desc"), href: "/developer/code-snippets", cta: t("cards.snippets.cta") },
    { icon: <Webhook className="w-6 h-6 text-blue-500" />, title: t("cards.webhooks.title"), description: t("cards.webhooks.desc"), href: "/developer/webhooks", cta: t("cards.webhooks.cta") },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-zinc-900">
          {t("title")} {session?.user?.name} 👋
        </h1>
        <p className="text-gray-500 mt-2">{t("subtitle")}</p>
      </div>

      {/* Quick start banner */}
      <div className="bg-blue-500 rounded-2xl p-6 mb-10 text-white">
        <h2 className="text-xl font-bold mb-1">{t("quickStart.title")}</h2>
        <p className="text-blue-100 text-sm mb-4">{t("quickStart.desc")}</p>
        <div className="flex gap-3">
          <Link href="/developer/api-keys" className="bg-white text-blue-500 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition">
            {t("quickStart.getKey")}
          </Link>
          <Link href="/developer/docs" className="bg-blue-400 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition">
            {t("quickStart.readDocs")}
          </Link>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.map((card) => (
          <div key={card.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              {card.icon}
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">{card.title}</h3>
            <p className="text-gray-500 text-sm mb-4">{card.description}</p>
            <Link href={card.href} className="text-blue-500 font-semibold text-sm hover:text-blue-700 transition">
              {card.cta} →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}