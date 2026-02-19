import { Shield, Zap, Globe, Smartphone } from "lucide-react";

const features = [
  {
    icon: <Shield className="w-6 h-6 text-blue-500" />,
    title: "Secure Payments",
    description:
      "Bank-level encryption and fraud detection keep every transaction safe and protected.",
  },
  {
    icon: <Zap className="w-6 h-6 text-blue-500" />,
    title: "Fast Transactions",
    description:
      "Payments processed in seconds — no delays, no waiting, just instant results.",
  },
  {
    icon: <Globe className="w-6 h-6 text-blue-500" />,
    title: "Multi-Currency Support",
    description:
      "Accept payments in multiple currencies from customers around the world.",
  },
  {
    icon: <Smartphone className="w-6 h-6 text-blue-500" />,
    title: "Mobile Friendly",
    description:
      "Fully optimized for mobile — your customers can pay from any device, anywhere.",
  },
];

const Features = () => {
  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-blue-500 font-semibold text-sm uppercase tracking-widest mb-2">
            Why NexaPay
          </p>
          <h2 className="text-4xl font-black text-zinc-900">
            Everything you need to accept payments
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Built for businesses of all sizes — from startups to enterprises across Africa and beyond.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;