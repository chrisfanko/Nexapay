import Image from "next/image";

const Trusted = () => {
  const logos = [
    { name: "PayPal", src: "/logos/paypal.png" },
    { name: "Visa", src: "/logos/visa.png" },
    { name: "Mastercard", src: "/logos/mastercard.png" },
    { name: "Orange Money", src: "/logos/om.png" },
    { name: "MTN Mobile Money", src: "/logos/mtn3.png" },
  ];

  return (
    <section className="bg-white py-12 px-6 border-y border-gray-100">
      <div className="max-w-5xl mx-auto">
        
        {/* Title */}
        <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-10">
          Trusted payment methods we support
        </p>

        {/* Logos */}
        <div className="flex flex-wrap items-center justify-center gap-10">
          {logos.map((logo) => (
            <div key={logo.name} className="relative w-28 h-14 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Trusted;