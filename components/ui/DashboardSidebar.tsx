"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  ArrowLeftRight,
  Code2,
  LayoutDashboard,
  LoaderCircle,
  Menu,
} from "lucide-react";

const sidebarLinks = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: ArrowLeftRight,
  },
  {
    label: "Developer portal",
    href: "/developer",
    icon: Code2,
  },
];

export default function DashboardSidebar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/sign-in");
    }
  }, [router, status]);

  if (status === "loading") {
    return (
      <>
        <header className="flex h-16 items-center border-b border-slate-200 bg-white px-5 lg:hidden">
          <LoaderCircle className="size-5 animate-spin text-[#1E6FFF]" />
        </header>
        <aside className="fixed inset-y-0 left-0 hidden w-64 items-center justify-center border-r border-slate-200 bg-white lg:flex">
          <LoaderCircle className="size-5 animate-spin text-[#1E6FFF]" />
        </aside>
      </>
    );
  }

  if (!session) return null;

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 lg:hidden">
        <Brand />
        <span
          aria-label="Merchant workspace navigation"
          className="flex size-9 items-center justify-center border border-slate-200 text-slate-600"
        >
          <Menu className="size-4" />
        </span>
      </header>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="border-b border-slate-200 px-6 py-5">
          <Brand />
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Merchant workspace
          </p>
        </div>

        <nav className="flex-1 px-4 py-6">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>

          <div className="mt-3 space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#0A0A0A] text-white"
                      : "text-slate-600 hover:bg-slate-50 hover:text-[#0A0A0A]"
                  }`}
                  href={link.href}
                  key={link.href}
                >
                  <Icon
                    className={`size-4 ${
                      isActive ? "text-[#1E6FFF]" : "text-slate-400"
                    }`}
                  />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Signed in as
            </p>
            <p className="mt-2 truncate text-sm font-semibold text-[#0A0A0A]">
              {session.user?.name}
            </p>
            <p className="mt-1 truncate text-xs text-slate-500">
              {session.user?.email}
            </p>
          </div>

          <Link
            className="mt-3 flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-[#0A0A0A]"
            href="/"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
        </div>
      </aside>
    </>
  );
}

function Brand() {
  return (
    <Link
      aria-label="NexaPay home"
      className="inline-flex items-center gap-2.5"
      href="/"
    >
      <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#1E6FFF] text-sm font-extrabold text-white">
        N
      </span>
      <span className="text-lg font-semibold tracking-[-0.03em] text-[#0A0A0A]">
        Nexa<span className="text-[#1E6FFF]">Pay</span>
      </span>
    </Link>
  );
}