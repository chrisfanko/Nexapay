import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code2, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("hero");

  const paymentMethods = [
    { name: "PayPal", src: "/logos/paypal.png" },
    { name: "Visa", src: "/logos/visa.png" },
    { name: "Mastercard", src: "/logos/mastercard.png" },
    { name: "Orange Money", src: "/logos/om.png" },
    { name: "MTN Mobile Money", src: "/logos/mtn3.png" },
  ];

  return (
    <section className="bg-[#0A0A0A] text-white">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:px-8 lg:py-28">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
            {t("badge")}
          </p>

          <h1 className="mt-6 text-5xl font-semibold tracking-[-0.06em] sm:text-6xl lg:text-7xl">
            {t("headline1")}
            <br />
            <span className="text-[#1E6FFF]">{t("headline2")}</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            {t("subheadline")}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1E6FFF] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#175ed8]"
            >
              {t("getStarted")}
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/solutions"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-white/25 px-5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-[#0A0A0A]"
            >
              {t("viewSolutions")}
            </Link>
          </div>
        </div>

        <div className="border border-white/15 bg-white p-6 text-[#0A0A0A] sm:p-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-5">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#1E6FFF] text-sm font-extrabold text-white">
                N
              </span>
              <span className="text-lg font-semibold tracking-[-0.03em]">
                Nexa<span className="text-[#1E6FFF]">Pay</span>
              </span>
            </div>

            <span className="text-xs font-medium text-slate-500">Payments API</span>
          </div>

          <div className="space-y-5 py-7">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#1E6FFF]">
                <Code2 className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">One integration</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Connect the payment methods your customers already use.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#1E6FFF]">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Built for reliable payments</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Give your business a simple and secure way to accept payment.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Supported payment methods
            </p>

            <div className="mt-4 grid grid-cols-5 gap-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.name}
                  className="relative h-9 border border-slate-200 bg-white p-1.5"
                  title={method.name}
                >
                  <Image
                    src={method.src}
                    alt={method.name}
                    fill
                    className="object-contain p-1.5"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}