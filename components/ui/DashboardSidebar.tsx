"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Code2,
  ArrowLeft,
  Loader,
} from "lucide-react";

const sidebarLinks = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: <ArrowLeftRight className="w-4 h-4" />,
  },
  {
    label: "Developer Portal",
    href: "/developer",
    icon: <Code2 className="w-4 h-4" />,
  },
];

export default function DashboardSidebar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-40 flex items-center justify-center">
        <Loader className="w-6 h-6 animate-spin text-blue-500" />
      </aside>
    );
  }

  if (!session) return null;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs">N</span>
          </div>
          <span className="text-zinc-900 font-bold text-lg tracking-tight">
            Nexa<span className="text-blue-500">Pay</span>
          </span>
        </Link>
        <p className="text-xs text-gray-400 mt-1">Merchant Dashboard</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-gray-200 space-y-3">
        <div className="px-3 py-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-400">Signed in as</p>
          <p className="text-sm font-medium text-gray-700 truncate">
            {session.user?.name}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {session.user?.email}
          </p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </aside>
  );
}