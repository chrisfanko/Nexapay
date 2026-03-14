"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  Building2,
  ArrowLeft,
  Loader,
} from "lucide-react";

const sidebarLinks = [
  {
    label: "Overview",
    href: "/admin",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    label: "Transactions",
    href: "/admin/transactions",
    icon: <ArrowLeftRight className="w-4 h-4" />,
  },
  {
    label: "Merchants",
    href: "/admin/merchants",
    icon: <Users className="w-4 h-4" />,
  },
  {
    label: "Businesses",
    href: "/admin/businesses",
    icon: <Building2 className="w-4 h-4" />,
  },
];

export default function AdminSidebar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
      return;
    }

    if (status === "authenticated") {
      // Verify admin role via API
      fetch("/api/admin/stats")
        .then((res) => {
          if (res.status === 403 || res.status === 401) {
            router.push("/");
          } else {
            setIsAdmin(true);
          }
          setChecking(false);
        })
        .catch(() => {
          router.push("/");
          setChecking(false);
        });
    }
  }, [status, router]);

  if (status === "loading" || checking) {
    return (
      <aside className="w-64 bg-zinc-900 fixed h-full z-40 flex items-center justify-center">
        <Loader className="w-6 h-6 animate-spin text-white" />
      </aside>
    );
  }

  if (!session || !isAdmin) return null;

  return (
    <aside className="w-64 bg-zinc-900 flex flex-col fixed h-full z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-zinc-700">
        <div className="inline-flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs">N</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Nexa<span className="text-blue-400">Pay</span>
          </span>
        </div>
        <p className="text-xs text-zinc-400 mt-1">Admin Portal</p>
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
                  ? "bg-blue-500 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-zinc-700 space-y-3">
        <div className="px-3 py-2 bg-zinc-800 rounded-lg">
          <p className="text-xs text-zinc-500">Signed in as</p>
          <p className="text-sm font-medium text-white truncate">
            {session.user?.name}
          </p>
          <p className="text-xs text-zinc-500 truncate">
            {session.user?.email}
          </p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </aside>
  );
}