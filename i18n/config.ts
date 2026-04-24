export const locales = ["en", "fr", "es"] as const;
export type Locale = (typeof locales)[number];

export const flagMap: Record<Locale, string> = {
  en: "🇬🇧",
  fr: "🇫🇷",
  es: "🇪🇸",
};