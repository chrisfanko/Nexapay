import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { label: t("links.solutions"), href: "/solutions" },
    { label: t("links.pricing"), href: "/prices" },
    { label: t("links.developers"), href: "/developer" },
  ];

  const companyLinks = [
    { label: t("links.about"), href: "/about" },
    { label: t("links.contact"), href: "/contact" },
  ];

  return (
    <footer className="bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_180px_180px] lg:py-16">
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
              aria-label="NexaPay home"
            >
              <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#1E6FFF] text-sm font-extrabold text-white">
                N
              </span>
              <span className="text-lg font-semibold tracking-[-0.03em]">
                Nexa<span className="text-[#1E6FFF]">Pay</span>
              </span>
            </Link>

            <p className="mt-5 text-sm leading-6 text-slate-400">{t("tagline")}</p>

            <Link
              href="/register-business"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#1E6FFF]"
            >
              Get started
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <FooterLinks title={t("product")} links={productLinks} />
          <FooterLinks title={t("company")} links={companyLinks} />
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} NexaPay. {t("copyright")}
          </p>
          <p>Built for businesses across Africa and beyond.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {title}
      </h2>

      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-slate-300 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}