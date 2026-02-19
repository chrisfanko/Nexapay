import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="min-h-screen relative flex items-center justify-center px-6">
      
      {/* Background Image */}
      <Image
        src="/hero.jpg"  
        alt="Hero background"
        fill
        className="object-cover"
        priority
      />

      {/* Dark overlay so text is readable */}
      <div className="absolute inset-0 bg-blue-900/60" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Trusted by 10,000+ businesses across Africa
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
          One Gateway. <br />
          <span className="text-blue-300">Every Payment.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
          Accept payments from anywhere in the world — PayPal, Visa, Mastercard,
          Orange Money, MTN MoMo and more. Fast, secure, and reliable.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="bg-white text-blue-900 font-semibold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors w-full sm:w-auto"
          >
            Get Started 
          </Link>
          <Link
            href="/solutions"
            className="bg-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/30 transition-colors w-full sm:w-auto border border-white/30"
          >
            View Solutions →
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Hero;