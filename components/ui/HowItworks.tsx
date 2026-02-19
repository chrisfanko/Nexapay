import { UserPlus, CreditCard, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: <UserPlus className="w-8 h-8 text-white" />,
    step: "01",
    title: "Create your account",
    description:
      "Sign up for free in minutes. No paperwork, no hidden fees — just create your account and you're ready to go.",
  },
  {
    icon: <CreditCard className="w-8 h-8 text-white" />,
    step: "02",
    title: "Choose a payment method",
    description:
      "Select from PayPal, Visa, Mastercard, Orange Money, MTN MoMo and more. We've got every payment method covered.",
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-white" />,
    step: "03",
    title: "Pay instantly",
    description:
      "Complete your payment in seconds. Fast, secure, and reliable — every single time.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-blue-500 font-semibold text-sm uppercase tracking-widest mb-2">
            How It Works
          </p>
          <h2 className="text-4xl font-black text-zinc-900">
            3 simple steps to get started
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Getting started with NexaPay is quick and easy. No technical knowledge required.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative flex flex-col items-center text-center">
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-blue-100 z-0" />
              )}

              {/* Icon circle */}
              <div className="relative z-10 w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
                {step.icon}
              </div>

              {/* Step number */}
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">
                Step {step.step}
              </span>

              <h3 className="text-lg font-bold text-zinc-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;