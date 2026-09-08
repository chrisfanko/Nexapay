"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  BookOpen,
  Code2,
  KeyRound,
  Webhook,
} from "lucide-react";

export default function DeveloperOverviewPage() {
  const t = useTranslations("developerOverview");
  const { data: session } = useSession();

  const tools = [
    {
      icon: KeyRound,
      title: t("cards.apiKeys.title"),
      description: t("cards.apiKeys.desc"),
      href: "/developer/api-keys",
      cta: t("cards.apiKeys.cta"),
    },
    {
      icon: BookOpen,
      title: t("cards.docs.title"),
      description: t("cards.docs.desc"),
      href: "/developer/docs",
      cta: t("cards.docs.cta"),
    },
    {
      icon: Code2,
      title: t("cards.snippets.title"),
      description: t("cards.snippets.desc"),
      href: "/developer/code-snippets",
      cta: t("cards.snippets.cta"),
    },
    {
      icon: Webhook,
      title: t("cards.webhooks.title"),
      description: t("cards.webhooks.desc"),
      href: "/developer/webhooks",
      cta: t("cards.webhooks.cta"),
    },
  ];

  return (
    <div>
      <header className="border-b border-slate-200 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
          Developer portal
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#0A0A0A] sm:text-4xl">
          {t("title")} {session?.user?.name}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          {t("subtitle")}
        </p>
      </header>

      <section className="mt-8 grid overflow-hidden border border-[#0A0A0A] bg-[#0A0A0A] text-white lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
            Quick start
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
            {t("quickStart.title")}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            {t("quickStart.desc")}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1E6FFF] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#175ED8]"
              href="/developer/api-keys"
            >
              {t("quickStart.getKey")}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/25 px-5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-[#0A0A0A]"
              href="/developer/docs"
            >
              {t("quickStart.readDocs")}
            </Link>
          </div>
        </div>

        <div className="border-t border-white/15 p-6 lg:border-l lg:border-t-0 sm:p-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#1E6FFF]">
            Integration path
          </p>

          <ol className="mt-6 divide-y divide-white/15">
            <li className="py-4 first:pt-0">
              <p className="font-mono text-xs text-[#1E6FFF]">01</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Create or copy your API key.
              </p>
            </li>
            <li className="py-4">
              <p className="font-mono text-xs text-[#1E6FFF]">02</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Build and test your payment flow.
              </p>
            </li>
            <li className="py-4 last:pb-0">
              <p className="font-mono text-xs text-[#1E6FFF]">03</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Configure webhooks for payment events.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
              Build with NexaPay
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#0A0A0A]">
              Developer tools
            </h2>
          </div>
        </div>

        <div className="mt-6 grid border-l border-t border-slate-200 bg-white sm:grid-cols-2">
          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <article
                className="group flex min-h-60 flex-col border-b border-r border-slate-200 p-6 transition-colors hover:bg-slate-50 sm:p-7"
                key={tool.title}
              >
                <Icon className="size-5 text-[#1E6FFF]" />

                <div className="mt-auto pt-12">
                  <h3 className="text-lg font-semibold tracking-[-0.025em] text-[#0A0A0A]">
                    {tool.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                    {tool.description}
                  </p>

                  <Link
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1E6FFF] transition-colors hover:text-[#175ED8]"
                    href={tool.href}
                  >
                    {tool.cta}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}