import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code2, ShieldCheck, WalletCards } from "lucide-react";
import { useTranslations } from "next-intl";

const paymentMethods = [
  { key: "paypal", name: "PayPal", logo: "/logos/paypal.png" },
  { key: "visa", name: "Visa", logo: "/logos/visa.png" },
  { key: "mastercard", name: "Mastercard", logo: "/logos/mastercard.png" },
  { key: "orange", name: "Orange Money", logo: "/logos/om.png" },
  { key: "mtn", name: "MTN Mobile Money", logo: "/logos/mtn3.png" },
];

export default function SolutionsPage() {
  const t = useTranslations("solutions");
  const hero = useTranslations("hero");

  const benefits = [
    {
      icon: Code2,
      title: "One integration",
      description:
        "Connect once and access the payment methods your customers already know and trust.",
    },
    {
      icon: WalletCards,
      title: "One payment experience",
      description:
        "Offer mobile money, cards, and digital wallets through one clear checkout flow.",
    },
    {
      icon: ShieldCheck,
      title: "One reliable platform",
      description:
        "Manage transactions, payment activity, and settlement from a single place.",
    },
  ];

  return (
    <main className="bg-white text-[#0A0A0A]">
      <section className="border-b border-white/10 bg-[#0A0A0A] text-white">
        <div className="mx-auto grid min-h-[520px] max-w-7xl items-end gap-12 px-6 pb-16 pt-32 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8 lg:pb-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
              Payment solutions
            </p>

            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">
              One integration.
              <br />
              <span className="text-[#1E6FFF]">Every way to pay.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              {t("subtitle")}
            </p>

            <Link
              href="/sign-up"
              className="mt-9 inline-flex h-11 items-center gap-2 rounded-lg bg-[#1E6FFF] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#175ed8]"
            >
              {hero("getStarted")}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="border-l border-white/15 pl-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Built for modern commerce
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-3xl font-semibold tracking-[-0.04em]">5</p>
                <p className="mt-1 text-sm text-slate-400">payment methods supported</p>
              </div>

              <div className="border-t border-white/10 pt-5">
                <p className="text-sm leading-6 text-slate-300">
                  Mobile money for local customers. Cards and wallets for global
                  customers. All managed through NexaPay.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
            Supported methods
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            Payment options your customers recognize.
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-600">
            Enable the methods that make sense for your customers and markets.
            Each option is available through the same NexaPay integration.
          </p>
        </div>

        <div className="mt-12 grid border-l border-t border-slate-200 sm:grid-cols-2 lg:grid-cols-3">
          {paymentMethods.map((method) => (
            <article
              key={method.name}
              className="flex min-h-64 flex-col border-b border-r border-slate-200 bg-white p-6 sm:p-7"
            >
              <div className="relative h-12 w-28">
                <Image
                  src={method.logo}
                  alt={`${method.name} logo`}
                  fill
                  className="object-contain object-left"
                />
              </div>

              <div className="mt-auto pt-10">
                <h3 className="text-lg font-semibold tracking-[-0.025em]">
                  {method.name}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                  {t(`methods.${method.key}`)}
                </p>
              </div>
            </article>
          ))}

          <article className="flex min-h-64 flex-col justify-between border-b border-r border-slate-200 bg-slate-50 p-6 sm:p-7">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-[#1E6FFF]">
              <WalletCards className="size-5" />
            </div>

            <div>
              <h3 className="text-lg font-semibold tracking-[-0.025em]">
                More methods, one platform
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                NexaPay is built to grow as new payment methods and markets are
                added.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
                Designed for merchants
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                Keep payments simple as your business grows.
              </h2>
            </div>

            <div className="grid border-l border-t border-slate-200 sm:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <article
                    key={benefit.title}
                    className="border-b border-r border-slate-200 bg-white p-6"
                  >
                    <Icon className="size-5 text-[#1E6FFF]" />
                    <h3 className="mt-8 text-base font-semibold">{benefit.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {benefit.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0A0A0A] text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8 lg:py-24">
          <h2 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            Start accepting payments with NexaPay.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-300">
            Create an account, set up your business, and begin building your
            payment experience.
          </p>

          <Link
            href="/register-business"
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-[#1E6FFF] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#175ed8]"
          >
            Register your business
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}