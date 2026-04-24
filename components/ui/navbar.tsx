"use client";
import Link from "next/link";
import React, { useState } from "react";
import UserButton from "./userButton";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations("nav");

  const navLinks = [
    { href: "/about", label: t("about") },
    { href: "/solutions", label: t("solutions") },
    { href: "/developer", label: t("developer") },
    { href: "/contact", label: t("contact") },
    { href: "/prices", label: t("pricing") },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full flex items-center justify-between h-14 px-6 border-b border-blue-500/30 bg-blue-400 z-50">
        {/* Logo */}
        <Link
          href="/"
          className="inline-flex items-center gap-2"
          onClick={() => setMenuOpen(false)}
        >
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-zinc-950 font-black text-sm">N</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Nexa<span className="text-zinc-200">Pay</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`transition-colors font-medium ${
                  pathname === link.href
                    ? "text-white"
                    : "text-blue-100 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <UserButton />
          <button
            className="md:hidden flex items-center justify-center text-white p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-14 left-0 right-0 bg-blue-500 z-40 md:hidden transition-all duration-300 border-b border-blue-400 ${
          menuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-6 py-3 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-white bg-blue-600"
                    : "text-blue-100 hover:text-white hover:bg-blue-600"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        {/* Language switcher in mobile drawer */}
        <div className="px-6 py-3 border-t border-blue-400">
          <LanguageSwitcher />
        </div>
      </div>
    </>
  );
};

export default Navbar;