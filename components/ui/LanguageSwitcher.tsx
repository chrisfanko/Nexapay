"use client";

import { useCallback, useState } from "react";
import { Check, ChevronDown, Globe2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { locales, type Locale } from "@/i18n/config";

export default function LanguageSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const switchLocale = useCallback(
    (newLocale: Locale) => {
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
      router.refresh();
      setOpen(false);
    },
    [router]
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-9 items-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#0A0A0A]"
        aria-label="Select language"
        aria-expanded={open}
      >
        <Globe2 className="size-4" />
        <span className="hidden xl:inline">{t(locale)}</span>
        <span className="xl:hidden">{locale.toUpperCase()}</span>
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
            aria-label="Close language menu"
          />

          <div className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
            {locales.map((language) => (
              <button
                type="button"
                key={language}
                onClick={() => switchLocale(language)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  language === locale
                    ? "bg-blue-50 font-semibold text-[#1E6FFF]"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="w-6 text-xs font-semibold text-slate-400">
                  {language.toUpperCase()}
                </span>
                <span>{t(language)}</span>
                {language === locale && <Check className="ml-auto size-4" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}