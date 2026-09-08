"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import UserButton from "./userButton";

export default function Navbar() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/about", label: t("about") },
    { href: "/solutions", label: t("solutions") },
    { href: "/developer", label: t("developer") },
    { href: "/prices", label: t("pricing") },
    { href: "/contact", label: t("contact") },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="NexaPay home"
        >
          <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#1E6FFF] text-sm font-extrabold text-white">
            N
          </span>
          <span className="text-lg font-semibold tracking-[-0.03em] text-[#0A0A0A]">
            Nexa<span className="text-[#1E6FFF]">Pay</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`border-b-2 py-5 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "border-[#1E6FFF] text-[#1E6FFF]"
                    : "border-transparent text-slate-600 hover:text-[#0A0A0A]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="h-5 w-px bg-slate-200" />

          <LanguageSwitcher />
          <UserButton />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <UserButton />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex size-10 items-center justify-center rounded-lg border border-slate-200 text-[#0A0A0A] transition-colors hover:border-slate-300 hover:bg-slate-50"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between border-b border-slate-100 py-4 text-sm font-medium ${
                    isActive(link.href)
                      ? "text-[#1E6FFF]"
                      : "text-slate-700 hover:text-[#0A0A0A]"
                  }`}
                >
                  {link.label}
                  <ArrowRight className="size-4" />
                </Link>
              ))}
            </div>

            <div className="pt-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}