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
  Mail,
  ArrowLeft,
  Loader,
} from "lucide-react";

export default function AdminSidebar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "admin";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    } else if (status === "authenticated" && !isAdmin) {
      router.push("/");
    }
  }, [status, isAdmin, router]);

  // Fetch unread message count every 60 seconds
  useEffect(() => {
    if (!isAdmin) return;

    const fetchUnread = () => {
      fetch("/api/admin/messages?filter=unread")
        .then((res) => res.json())
        .then((data) => setUnreadCount(data.unreadCount || 0))
        .catch(() => {});
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 60000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  const sidebarLinks = [
    {
      label: "Overview",
      href: "/admin",
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: null,
    },
    {
      label: "Transactions",
      href: "/admin/transactions",
      icon: <ArrowLeftRight className="w-4 h-4" />,
      badge: null,
    },
    {
      label: "Merchants",
      href: "/admin/merchants",
      icon: <Users className="w-4 h-4" />,
      badge: null,
    },
    {
      label: "Businesses",
      href: "/admin/businesses",
      icon: <Building2 className="w-4 h-4" />,
      badge: null,
    },
    {
      label: "Messages",
      href: "/admin/messages",
      icon: <Mail className="w-4 h-4" />,
      badge: unreadCount > 0 ? unreadCount : null,
    },
  ];

  if (status === "loading") {
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
              <span className="flex-1">{link.label}</span>
              {link.badge !== null && (
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {link.badge > 99 ? "99+" : link.badge}
                </span>
              )}
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