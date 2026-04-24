import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

const paymentMethods = [
  { key: "paypal", name: "PayPal", logo: "/logos/paypal.png", href: "/checkout/paypal" },
  { key: "visa", name: "Visa", logo: "/logos/visa.png", href: "/checkout/visa" },
  { key: "mastercard", name: "Mastercard", logo: "/logos/mastercard.png", href: "/checkout/mastercard" },
  { key: "orange", name: "Orange Money", logo: "/logos/om.png", href: "/checkout/orange-money" },
  { key: "mtn", name: "MTN Mobile Money", logo: "/logos/mtn3.png", href: "/checkout/mtn-money" },
];

export default function SolutionsPage() {
  const t = useTranslations("solutions");

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {t("title")}
        </h1>
        <p className="text-center text-gray-500 mb-12">
          {t("subtitle")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentMethods.map((method) => (
            <Link key={method.name} href={method.href}>
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center text-center cursor-pointer group">
                <div className="w-24 h-24 relative mb-4">
                  <Image src={method.logo} alt={method.name} fill className="object-contain" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {method.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {t(`methods.${method.key}`)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}