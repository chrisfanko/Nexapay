import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Trusted() {
  const t = useTranslations("trusted");

  const paymentMethods = [
    { name: "PayPal", src: "/logos/paypal.png" },
    { name: "Visa", src: "/logos/visa.png" },
    { name: "Mastercard", src: "/logos/mastercard.png" },
    { name: "Orange Money", src: "/logos/om.png" },
    { name: "MTN Mobile Money", src: "/logos/mtn3.png" },
  ];

  return (
    <section className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          {t("label")}
        </p>

        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 border-l border-t border-slate-200 sm:grid-cols-5">
          {paymentMethods.map((method) => (
            <div
              key={method.name}
              className="relative flex h-20 items-center justify-center border-b border-r border-slate-200 bg-white p-5"
            >
              <Image
                src={method.src}
                alt={method.name}
                fill
                className="object-contain p-5"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}