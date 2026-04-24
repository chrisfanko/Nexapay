import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { locales, type Locale } from "./config";

export { locales, type Locale };

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value ?? "en";

  const resolvedLocale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : "en";

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
  };
});