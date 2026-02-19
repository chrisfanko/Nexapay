
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/ month",
    description: "Perfect for individuals and small projects.",
    color: "bg-white",
    badge: null,
    buttonStyle: "bg-blue-500 text-white hover:bg-blue-600",
    features: [
      "Up to 100 transactions/month",
      "PayPal & Visa support",
      "Basic dashboard",
      "Email support",
      "1 user account",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    period: "/ month",
    description: "For growing businesses that need more power.",
    color: "bg-blue-500",
    badge: "Most Popular",
    buttonStyle: "bg-white text-blue-500 hover:bg-blue-50",
    features: [
      "Up to 10,000 transactions/month",
      "All payment methods supported",
      "Advanced analytics dashboard",
      "Priority email & chat support",
      "Up to 5 user accounts",
      "Webhook integrations",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large companies with custom needs.",
    color: "bg-zinc-900",
    badge: null,
    buttonStyle: "bg-blue-500 text-white hover:bg-blue-600",
    features: [
      "Unlimited transactions",
      "All payment methods supported",
      "Custom integrations & API access",
      "Dedicated account manager",
      "Unlimited user accounts",
      "SLA & uptime guarantee",
    ],
  },
];

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      
      {/* Header */}
      <div className="text-center py-20 px-6">
        <p className="text-blue-500 font-semibold text-sm uppercase tracking-widest mb-2">
          Pricing
        </p>
        <h1 className="text-5xl font-black text-zinc-900 mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">
          No hidden fees. No surprises. Pick the plan that fits your business and scale as you grow.
        </p>
      </div>

      {/* Plans */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
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
              <h2
                className={`text-lg font-bold mb-1 ${
                  plan.name === "Pro" || plan.name === "Enterprise"
                    ? "text-white"
                    : "text-zinc-900"
                }`}
              >
                {plan.name}
              </h2>

              {/* Price */}
              <div className="flex items-end gap-1 mb-2">
                <span
                  className={`text-5xl font-black ${
                    plan.name === "Pro" || plan.name === "Enterprise"
                      ? "text-white"
                      : "text-zinc-900"
                  }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`text-sm mb-2 ${
                    plan.name === "Pro" || plan.name === "Enterprise"
                      ? "text-blue-100"
                      : "text-gray-400"
                  }`}
                >
                  {plan.period}
                </span>
              </div>

              {/* Description */}
              <p
                className={`text-sm mb-6 ${
                  plan.name === "Pro" || plan.name === "Enterprise"
                    ? "text-blue-100"
                    : "text-gray-500"
                }`}
              >
                {plan.description}
              </p>

              {/* Button */}
              <Link
                href="/sign-up"
                className={`block text-center font-semibold py-3 px-6 rounded-xl transition-colors mb-8 ${plan.buttonStyle}`}
              >
                {plan.name === "Enterprise" ? "Contact Us" : "Get Started"}
              </Link>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check
                      className={`w-4 h-4 flex-shrink-0 ${
                        plan.name === "Pro" || plan.name === "Enterprise"
                          ? "text-white"
                          : "text-blue-500"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        plan.name === "Pro" || plan.name === "Enterprise"
                          ? "text-blue-100"
                          : "text-gray-600"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;