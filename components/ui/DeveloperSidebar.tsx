"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Code2,
  KeyRound,
  LayoutDashboard,
  LogOut,
  TerminalSquare,
  Webhook,
} from "lucide-react";

const navigation = [
  {
    href: "/developer",
    label: "Overview",
    icon: TerminalSquare,
    exact: true,
  },
  {
    href: "/developer/api-keys",
    label: "API keys",
    icon: KeyRound,
  },
  {
    href: "/developer/docs",
    label: "Documentation",
    icon: BookOpen,
  },
  {
    href: "/developer/code-snippets",
    label: "Code snippets",
    icon: Code2,
  },
  {
    href: "/developer/webhooks",
    label: "Webhooks",
    icon: Webhook,
  },
];

export default function DeveloperSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      <header className="border-b border-slate-200 bg-white lg:hidden">
        <div className="flex h-16 items-center justify-between px-5">
          <Link className="flex items-center gap-2.5" href="/developer">
            <span className="flex size-8 items-center justify-center bg-[#0A0A0A] text-xs font-extrabold text-white">
              N
            </span>
            <span className="text-lg font-semibold tracking-[-0.03em] text-[#0A0A0A]">
              Nexa<span className="text-[#1E6FFF]">Pay</span>
            </span>
          </Link>

          <Link
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1E6FFF]"
            href="/dashboard"
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
        </div>

        <nav className="flex overflow-x-auto border-t border-slate-200 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                className={`inline-flex h-12 shrink-0 items-center gap-2 border-b-2 px-3 text-xs font-semibold transition-colors ${
                  active
                    ? "border-[#1E6FFF] text-[#1E6FFF]"
                    : "border-transparent text-slate-500 hover:text-[#0A0A0A]"
                }`}
                href={item.href}
                key={item.href}
              >
                <Icon className="size-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-20 items-center border-b border-slate-200 px-6">
          <Link className="flex items-center gap-2.5" href="/developer">
            <span className="flex size-9 items-center justify-center bg-[#0A0A0A] text-sm font-extrabold text-white">
              N
            </span>
            <span className="text-lg font-semibold tracking-[-0.03em] text-[#0A0A0A]">
              Nexa<span className="text-[#1E6FFF]">Pay</span>
            </span>
          </Link>
        </div>

        <div className="border-b border-slate-200 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E6FFF]">
            Merchant workspace
          </p>
          <p className="mt-2 text-sm font-semibold text-[#0A0A0A]">
            Developer portal
          </p>
        </div>

        <nav className="flex-1 px-3 py-5">
          <Link
            className="mb-5 flex h-10 items-center gap-3 border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition-colors hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
            href="/dashboard"
          >
            <LayoutDashboard className="size-4 text-[#1E6FFF]" />
            Merchant dashboard
          </Link>

          <p className="px-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Build
          </p>

          <div className="mt-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  className={`flex h-10 items-center gap-3 px-3 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-[#0A0A0A] text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-[#0A0A0A]"
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  <Icon
                    className={`size-4 ${
                      active ? "text-[#1E6FFF]" : "text-slate-400"
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-slate-200 p-3">
          <div className="flex items-center gap-3 px-3 py-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-[#0A0A0A]">
              {session?.user?.name?.slice(0, 1).toUpperCase() || "M"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#0A0A0A]">
                {session?.user?.name || "Merchant account"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {session?.user?.email || "Developer access"}
              </p>
            </div>
          </div>

          <button
            className="flex h-10 w-full items-center gap-3 px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700"
            onClick={() => signOut({ callbackUrl: "/" })}
            type="button"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}