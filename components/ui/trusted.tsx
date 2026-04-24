import Image from "next/image";
import { useTranslations } from "next-intl";

const Trusted = () => {
  const t = useTranslations("trusted");

  const logos = [
    { name: "PayPal", src: "/logos/paypal.png" },
    { name: "Visa", src: "/logos/visa.png" },
    { name: "Mastercard", src: "/logos/mastercard.png" },
    { name: "Orange Money", src: "/logos/om.png" },
    { name: "MTN Mobile Money", src: "/logos/mtn3.png" },
  ];

  return (
    <section style={{
      background: "#050A14",
      padding: "60px 5%",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');
        .trusted-section { font-family: 'DM Sans', sans-serif; }
        .trusted-logo-wrap {
          position: relative;
          width: 120px;
          height: 56px;
          transition: transform 0.3s;
          opacity: 1;
        }
        .trusted-logo-wrap:hover { transform: scale(1.1); }
        .trusted-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(30,111,255,0.3), rgba(0,212,170,0.3), transparent);
          margin-bottom: 40px;
        }
      `}</style>

      <div className="trusted-section" style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="trusted-divider" />

        <p style={{
          textAlign: "center",
          fontSize: 11,
          fontWeight: 600,
          color: "rgba(255,255,255,0.35)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: 36,
        }}>
          {t("label")}
        </p>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}>
          {logos.map((logo) => (
            <div key={logo.name} className="trusted-logo-wrap">
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>

        <div className="trusted-divider" style={{ marginTop: 40, marginBottom: 0 }} />
      </div>
    </section>
  );
};

export default Trusted;