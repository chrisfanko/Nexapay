"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const channels = [
  { name: "MTN Mobile Money", icon: "📱", currency: "XAF" },
  { name: "Orange Money", icon: "🟠", currency: "XAF" },
  { name: "PayPal", icon: "🌐", currency: "USD" },
  { name: "Visa / Mastercard", icon: "💳", currency: "XAF", soon: true },
];

function calcFee(amount: number) {
  const fee = Math.max(Math.round(amount * 0.015), 50);
  return { fee, gross: amount + fee, net: amount };
}

export default function PricingPage() {
  const t = useTranslations("prices");
  const [amount, setAmount] = useState(10000);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { fee, gross, net } = calcFee(amount);

  const faqs = t.raw("faq.items") as { q: string; a: string }[];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .pricing-page { font-family: 'DM Sans', sans-serif; background: #050A14; color: #fff; min-height: 100vh; overflow-x: hidden; }
        .pricing-hero { padding: 130px 5% 90px; text-align: center; position: relative; }
        .hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 70% 55% at 50% 0%, rgba(30,111,255,0.15) 0%, transparent 70%); pointer-events: none; }
        .hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px); background-size: 60px 60px; pointer-events: none; mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%); }
        .pricing-tag { display: inline-flex; align-items: center; gap: 8px; background: rgba(0,212,170,0.1); border: 1px solid rgba(0,212,170,0.25); color: #00D4AA; font-size: 12px; font-weight: 600; padding: 6px 16px; border-radius: 100px; margin-bottom: 28px; letter-spacing: 0.1em; text-transform: uppercase; }
        .pricing-title { font-family: 'Syne', sans-serif; font-size: clamp(42px, 6vw, 82px); font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 20px; }
        .pricing-subtitle { color: rgba(255,255,255,0.45); font-size: clamp(15px, 2vw, 19px); max-width: 520px; margin: 0 auto 60px; line-height: 1.7; font-weight: 300; }
        .fee-card { display: inline-block; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 28px; padding: 52px 64px; position: relative; overflow: hidden; text-align: center; min-width: 380px; }
        .fee-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #1E6FFF, #00D4AA); }
        .fee-glow { position: absolute; top: -60px; left: 50%; transform: translateX(-50%); width: 200px; height: 200px; background: radial-gradient(circle, rgba(30,111,255,0.15) 0%, transparent 70%); pointer-events: none; }
        .fee-label { font-size: 13px; color: rgba(255,255,255,0.4); font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 12px; }
        .fee-amount { font-family: 'Syne', sans-serif; font-size: 88px; font-weight: 800; color: #1E6FFF; line-height: 1; letter-spacing: -0.04em; margin-bottom: 4px; }
        .fee-unit { font-family: 'Syne', sans-serif; font-size: 28px; color: rgba(255,255,255,0.5); margin-bottom: 16px; }
        .fee-note { font-size: 13px; color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); padding: 8px 16px; border-radius: 100px; display: inline-block; }
        .means-section { padding: 100px 5%; max-width: 1100px; margin: 0 auto; }
        .section-tag { font-size: 12px; font-weight: 600; color: #00D4AA; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px; text-align: center; }
        .section-title { font-family: 'Syne', sans-serif; font-size: clamp(28px, 4vw, 46px); font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 16px; text-align: center; }
        .section-sub { color: rgba(255,255,255,0.4); font-size: 15px; text-align: center; margin-bottom: 56px; font-weight: 300; }
        .pillars-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .pillar-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 32px 28px; transition: all 0.3s; position: relative; overflow: hidden; }
        .pillar-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; opacity: 0; transition: opacity 0.3s; }
        .pillar-card:nth-child(1)::after { background: #1E6FFF; }
        .pillar-card:nth-child(2)::after { background: #00D4AA; }
        .pillar-card:nth-child(3)::after { background: #A78BFA; }
        .pillar-card:hover { background: rgba(255,255,255,0.05); transform: translateY(-4px); }
        .pillar-card:hover::after { opacity: 1; }
        .pillar-icon { font-size: 30px; margin-bottom: 16px; display: block; }
        .pillar-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 8px; }
        .pillar-desc { color: rgba(255,255,255,0.4); font-size: 14px; line-height: 1.7; font-weight: 300; }
        .calc-section { padding: 100px 5%; background: rgba(255,255,255,0.02); }
        .calc-inner { max-width: 700px; margin: 0 auto; }
        .calc-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 44px; position: relative; overflow: hidden; }
        .calc-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #1E6FFF, #00D4AA); }
        .calc-label { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.5); margin-bottom: 10px; letter-spacing: 0.04em; }
        .calc-input { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #fff; font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; padding: 16px 20px; border-radius: 14px; outline: none; transition: all 0.2s; box-sizing: border-box; margin-bottom: 28px; }
        .calc-input:focus { border-color: rgba(30,111,255,0.5); background: rgba(30,111,255,0.06); box-shadow: 0 0 0 3px rgba(30,111,255,0.1); }
        .calc-slider { width: 100%; appearance: none; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.1); outline: none; margin-bottom: 36px; cursor: pointer; }
        .calc-slider::-webkit-slider-thumb { appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #1E6FFF; cursor: pointer; box-shadow: 0 0 0 4px rgba(30,111,255,0.2); }
        .calc-results { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .calc-result-item { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 18px 16px; text-align: center; }
        .calc-result-label { font-size: 11px; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
        .calc-result-value { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; }
        .channels-section { padding: 100px 5%; max-width: 1000px; margin: 0 auto; }
        .channels-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .channel-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 18px; padding: 24px 28px; display: flex; align-items: center; justify-content: space-between; transition: all 0.3s; }
        .channel-card:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.12); transform: translateX(4px); }
        .channel-left { display: flex; align-items: center; gap: 14px; }
        .channel-icon { font-size: 24px; width: 44px; height: 44px; background: rgba(255,255,255,0.05); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .channel-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; }
        .channel-currency { font-size: 12px; color: rgba(255,255,255,0.35); margin-top: 2px; }
        .channel-fee { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #1E6FFF; }
        .soon-badge { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); font-size: 10px; font-weight: 600; padding: 3px 10px; border-radius: 100px; letter-spacing: 0.05em; }
        .faq-section { padding: 100px 5%; max-width: 720px; margin: 0 auto; }
        .faq-item { border-bottom: 1px solid rgba(255,255,255,0.07); }
        .faq-question { width: 100%; background: none; border: none; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; text-align: left; padding: 22px 0; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 16px; transition: color 0.2s; }
        .faq-question:hover { color: #60A5FA; }
        .faq-chevron { font-size: 18px; color: rgba(255,255,255,0.3); transition: transform 0.3s; flex-shrink: 0; }
        .faq-chevron.open { transform: rotate(45deg); color: #1E6FFF; }
        .faq-answer { color: rgba(255,255,255,0.45); font-size: 14px; line-height: 1.8; font-weight: 300; padding-bottom: 22px; max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.3s; }
        .faq-answer.open { max-height: 200px; }
        .cta-section { padding: 100px 5%; text-align: center; position: relative; }
        .cta-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 60% 70% at 50% 50%, rgba(30,111,255,0.08) 0%, transparent 70%); pointer-events: none; }
        .cta-title { font-family: 'Syne', sans-serif; font-size: clamp(34px, 5vw, 58px); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 16px; }
        .cta-desc { color: rgba(255,255,255,0.4); font-size: 17px; max-width: 440px; margin: 0 auto 40px; font-weight: 300; line-height: 1.7; }
        .btn-primary { background: #1E6FFF; color: #fff; font-weight: 600; font-size: 15px; padding: 14px 32px; border-radius: 12px; text-decoration: none; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; margin-right: 12px; }
        .btn-primary:hover { background: #3D8BFF; transform: translateY(-2px); box-shadow: 0 12px 40px rgba(30,111,255,0.35); }
        .btn-secondary { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #fff; font-weight: 500; font-size: 15px; padding: 14px 32px; border-radius: 12px; text-decoration: none; transition: all 0.2s; display: inline-flex; align-items: center; }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }
        @media (max-width: 768px) { .fee-card { min-width: unset; padding: 36px 28px; } .pillars-grid { grid-template-columns: 1fr; } .calc-results { grid-template-columns: 1fr; } .channels-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="pricing-page">

        {/* Hero */}
        <section className="pricing-hero">
          <div className="hero-bg" />
          <div className="hero-grid" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <span className="pricing-tag">{t("hero.tag")}</span>
            <h1 className="pricing-title">
              {t("hero.title1")}<br />
              <span style={{ color: "#1E6FFF" }}>{t("hero.title2")}</span>
            </h1>
            <p className="pricing-subtitle">{t("hero.subtitle")}</p>
            <div className="fee-card">
              <div className="fee-glow" />
              <div className="fee-label">{t("hero.feeLabel")}</div>
              <div className="fee-amount">1.5</div>
              <div className="fee-unit">{t("hero.feeUnit")}</div>
              <div className="fee-note">{t("hero.feeNote")}</div>
            </div>
          </div>
        </section>

        {/* What this means */}
        <section className="means-section">
          <p className="section-tag">{t("means.tag")}</p>
          <h2 className="section-title">{t("means.title")}</h2>
          <p className="section-sub">{t("means.subtitle")}</p>
          <div className="pillars-grid">
            <div className="pillar-card">
              <span className="pillar-icon">🎯</span>
              <div className="pillar-title">{t("means.card1.title")}</div>
              <div className="pillar-desc">{t("means.card1.desc")}</div>
            </div>
            <div className="pillar-card">
              <span className="pillar-icon">📊</span>
              <div className="pillar-title">{t("means.card2.title")}</div>
              <div className="pillar-desc">{t("means.card2.desc")}</div>
            </div>
            <div className="pillar-card">
              <span className="pillar-icon">🚀</span>
              <div className="pillar-title">{t("means.card3.title")}</div>
              <div className="pillar-desc">{t("means.card3.desc")}</div>
            </div>
          </div>
        </section>

        {/* Fee Calculator */}
        <section className="calc-section">
          <div className="calc-inner">
            <p className="section-tag">{t("calc.tag")}</p>
            <h2 className="section-title">{t("calc.title")}</h2>
            <p className="section-sub">{t("calc.subtitle")}</p>
            <div className="calc-card">
              <div className="calc-label">{t("calc.label")}</div>
              <input
                aria-label="Transaction input"
                type="number"
                className="calc-input"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                min={0}
                max={10000000}
              />
              <input
                aria-label="Transaction amount slider"
                type="range"
                className="calc-slider"
                min={500}
                max={500000}
                step={500}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <div className="calc-results">
                <div className="calc-result-item">
                  <div className="calc-result-label">{t("calc.merchantAmount")}</div>
                  <div className="calc-result-value" style={{ color: "#fff" }}>{net.toLocaleString()}</div>
                </div>
                <div className="calc-result-item">
                  <div className="calc-result-label">{t("calc.nexapayFee")}</div>
                  <div className="calc-result-value" style={{ color: "#1E6FFF" }}>{fee.toLocaleString()}</div>
                </div>
                <div className="calc-result-item">
                  <div className="calc-result-label">{t("calc.customerPays")}</div>
                  <div className="calc-result-value" style={{ color: "#00D4AA" }}>{gross.toLocaleString()}</div>
                </div>
              </div>
              <p style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 12, marginTop: 20 }}>
                {t("calc.note")}
              </p>
            </div>
          </div>
        </section>

        {/* Supported channels */}
        <section className="channels-section">
          <p className="section-tag">{t("channels.tag")}</p>
          <h2 className="section-title">{t("channels.title")}</h2>
          <p className="section-sub" style={{ marginBottom: 40 }}>{t("channels.subtitle")}</p>
          <div className="channels-grid">
            {channels.map((ch) => (
              <div className="channel-card" key={ch.name}>
                <div className="channel-left">
                  <div className="channel-icon">{ch.icon}</div>
                  <div>
                    <div className="channel-name">{ch.name}</div>
                    <div className="channel-currency">{ch.currency}</div>
                  </div>
                </div>
                {ch.soon
                  ? <span className="soon-badge">{t("channels.soon")}</span>
                  : <div className="channel-fee">1.5%</div>
                }
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="faq-section">
          <p className="section-tag">{t("faq.tag")}</p>
          <h2 className="section-title">{t("faq.title")}</h2>
          <p className="section-sub" style={{ marginBottom: 48 }}>{t("faq.subtitle")}</p>
          <div>
            {faqs.map((faq, i) => (
              <div className="faq-item" key={i}>
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <span className={`faq-chevron ${openFaq === i ? "open" : ""}`}>+</span>
                </button>
                <div className={`faq-answer ${openFaq === i ? "open" : ""}`}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="cta-bg" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 className="cta-title">
              {t("cta.title1")}<br />
              <span style={{ color: "#1E6FFF" }}>{t("cta.title2")}</span>
            </h2>
            <p className="cta-desc">{t("cta.desc")}</p>
            <Link href="/register-business" className="btn-primary">
              {t("cta.primary")}
            </Link>
            <Link href="/contact" className="btn-secondary">
              {t("cta.secondary")}
            </Link>
          </div>
        </section>

      </div>
    </>
  );
}