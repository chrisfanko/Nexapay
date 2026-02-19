import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    description: "Perfect for individuals and small projects.",
    color: "bg-white",
    badge: null,
    buttonStyle: "bg-blue-500 text-white hover:bg-blue-600",
    features: [
      "Limited transactions/month",
      "PayPal & Visa support",
      "Basic dashboard",
      "Email support",
    ],
  },
  {
    name: "Pro",
    description: "For growing businesses that need more power.",
    color: "bg-blue-500",
    badge: "Most Popular",
    buttonStyle: "bg-white text-blue-500 hover:bg-blue-50",
    features: [
      "High transaction volume",
      "All payment methods supported",
      "Advanced analytics",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    description: "For large companies with custom needs.",
    color: "bg-zinc-900",
    badge: null,
    buttonStyle: "bg-blue-500 text-white hover:bg-blue-600",
    features: [
      "Unlimited transactions",
      "Custom integrations & API",
      "Dedicated account manager",
      "SLA & uptime guarantee",
    ],
  },
];

const PricingSection = () => {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-blue-500 font-semibold text-sm uppercase tracking-widest mb-2">
            Pricing
          </p>
          <h2 className="text-4xl font-black text-zinc-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            No hidden fees. Pick the plan that fits your business and scale as you grow.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 shadow-lg ${plan.color} ${
                plan.name === "Pro" ? "scale-105 shadow-blue-200 shadow-2xl" : ""
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-blue-500 text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                  {plan.badge}
                </span>
              )}

              {/* Plan name */}
              <h3 className={`text-lg font-bold mb-2 ${
                plan.name === "Pro" || plan.name === "Enterprise" ? "text-white" : "text-zinc-900"
              }`}>
                {plan.name}
              </h3>

              {/* Description */}
              <p className={`text-sm mb-6 ${
                plan.name === "Pro" || plan.name === "Enterprise" ? "text-blue-100" : "text-gray-500"
              }`}>
                {plan.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className={`w-4 h-4 flex-shrink-0 ${
                      plan.name === "Pro" || plan.name === "Enterprise" ? "text-white" : "text-blue-500"
                    }`} />
                    <span className={`text-sm ${
                      plan.name === "Pro" || plan.name === "Enterprise" ? "text-blue-100" : "text-gray-600"
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <Link
                href="/sign-up"
                className={`block text-center font-semibold py-3 px-6 rounded-xl transition-colors ${plan.buttonStyle}`}
              >
                {plan.name === "Enterprise" ? "Contact Us" : "Get Started"}
              </Link>
            </div>
          ))}
        </div>

        {/* See full pricing link */}
        <div className="text-center">
          <Link
            href="/prices"
            className="text-blue-500 font-semibold hover:text-blue-700 transition-colors"
          >
            See full pricing details →
          </Link>
        </div>

      </div>
    </section>
  );
};

export default PricingSection;