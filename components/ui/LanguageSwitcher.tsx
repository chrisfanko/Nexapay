"use client";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { locales, flagMap, type Locale } from "@/i18n/config";

export default function LanguageSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const switchLocale = useCallback(
    (newLocale: Locale) => {
      // Since we use cookies (not URL prefixes), just set the cookie and refresh
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
      router.refresh();
      setOpen(false);
    },
    [router]
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-blue-100 hover:text-white transition-colors text-sm font-medium px-2 py-1 rounded-md hover:bg-blue-500"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">
          {flagMap[locale]} {t(locale)}
        </span>
        <span className="sm:hidden">{flagMap[locale]}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 overflow-hidden">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  l === locale
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-base">{flagMap[l]}</span>
                <span>{t(l)}</span>
                {l === locale && (
                  <span className="ml-auto text-blue-500">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}