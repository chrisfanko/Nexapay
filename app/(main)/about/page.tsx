"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const stats = [
  { value: "10K+", label: "Transactions Processed" },
  { value: "500+", label: "Merchants Onboarded" },
  { value: "99.9%", label: "Uptime Guarantee" },
  { value: "5+", label: "Payment Methods" },
];

const values = [
  {
    icon: "⚡",
    title: "Speed First",
    desc: "Every millisecond counts. We obsess over performance so your customers never wait.",
  },
  {
    icon: "🔒",
    title: "Security by Default",
    desc: "Bank-grade encryption and fraud detection built into every transaction.",
  },
  {
    icon: "🌍",
    title: "Africa at Heart",
    desc: "Built specifically for African markets — Mobile Money, local currencies, local needs.",
  },
  {
    icon: "🧩",
    title: "Developer Obsessed",
    desc: "Clean APIs, great docs, and tools that make integration a pleasure not a pain.",
  },
];

const team = [
  { name: "Founders", role: "Vision & Strategy", initial: "F" },
  { name: "Engineering", role: "Product & Infrastructure", initial: "E" },
  { name: "Operations", role: "Compliance & Finance", initial: "O" },
  { name: "Support", role: "Merchant Success", initial: "S" },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        .about-page {
          font-family: 'DM Sans', sans-serif;
          background: #050A14;
          color: #fff;
          overflow-x: hidden;
        }

        .font-display { font-family: 'Syne', sans-serif; }

        .reveal {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1);
        }
        .reveal.animate-in {
          opacity: 1;
          transform: none;
        }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
        .reveal-delay-4 { transition-delay: 0.4s; }

        /* Hero */
        .hero {
          min-height: 92vh;
          display: flex;
          align-items: center;
          position: relative;
          padding: 120px 5% 80px;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(30,111,255,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 80% 50%, rgba(0,212,170,0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        .hero-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
        }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(30,111,255,0.12);
          border: 1px solid rgba(30,111,255,0.3);
          color: #60A5FA;
          font-size: 13px;
          font-weight: 500;
          padding: 6px 16px;
          border-radius: 100px;
          margin-bottom: 32px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(48px, 7vw, 96px);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -0.03em;
          margin-bottom: 28px;
        }

        .hero-title .accent { color: #1E6FFF; }
        .hero-title .accent-green { color: #00D4AA; }

        .hero-desc {
          font-size: clamp(16px, 2vw, 20px);
          color: rgba(255,255,255,0.5);
          max-width: 560px;
          line-height: 1.7;
          font-weight: 300;
          margin-bottom: 48px;
        }

        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #1E6FFF;
          color: #fff;
          font-weight: 600;
          font-size: 15px;
          padding: 14px 28px;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .hero-cta:hover {
          background: #3D8BFF;
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(30,111,255,0.35);
        }

        /* Floating card */
        .hero-card {
          position: absolute;
          right: 8%;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 32px;
          width: 320px;
          backdrop-filter: blur(20px);
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(-50%) translateY(0px); }
          50% { transform: translateY(-50%) translateY(-12px); }
        }

        .hero-card-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }

        .hero-card-icon {
          width: 36px;
          height: 36px;
          background: #1E6FFF;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 14px;
          font-family: 'Syne', sans-serif;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #00D4AA;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        /* Stats */
        .stats-section {
          padding: 80px 5%;
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
          background: rgba(255,255,255,0.06);
          border-radius: 20px;
          overflow: hidden;
        }

        .stat-item {
          background: #050A14;
          padding: 40px 32px;
          text-align: center;
        }

        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 48px;
          font-weight: 800;
          color: #1E6FFF;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          font-weight: 400;
        }

        /* Mission */
        .mission-section {
          padding: 120px 5%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-tag {
          font-size: 12px;
          font-weight: 600;
          color: #00D4AA;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 16px;
        }

        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
        }

        .section-body {
          color: rgba(255,255,255,0.5);
          line-height: 1.8;
          font-size: 16px;
          font-weight: 300;
        }

        .mission-visual {
          position: relative;
        }

        .mission-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s;
        }
        .mission-card:hover {
          background: rgba(30,111,255,0.06);
          border-color: rgba(30,111,255,0.2);
          transform: translateX(8px);
        }

        .mission-card-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        /* Values */
        .values-section {
          padding: 120px 5%;
          background: rgba(255,255,255,0.02);
        }

        .values-header {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 64px;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          max-width: 900px;
          margin: 0 auto;
        }

        .value-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 36px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .value-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #1E6FFF, #00D4AA);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .value-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-4px);
        }
        .value-card:hover::before { opacity: 1; }

        .value-icon {
          font-size: 32px;
          margin-bottom: 16px;
          display: block;
        }

        .value-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .value-desc {
          color: rgba(255,255,255,0.45);
          font-size: 14px;
          line-height: 1.7;
          font-weight: 300;
        }

        /* Team */
        .team-section {
          padding: 120px 5%;
          max-width: 1100px;
          margin: 0 auto;
        }

        .team-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .team-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 32px 24px;
          text-align: center;
          transition: all 0.3s;
        }
        .team-card:hover {
          background: rgba(30,111,255,0.06);
          border-color: rgba(30,111,255,0.2);
          transform: translateY(-6px);
        }

        .team-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1E6FFF, #00D4AA);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          margin: 0 auto 16px;
        }

        .team-name {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .team-role {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
        }

        /* CTA */
        .cta-section {
          padding: 120px 5%;
          text-align: center;
          position: relative;
        }

        .cta-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(30,111,255,0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .cta-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 20px;
        }

        .cta-desc {
          color: rgba(255,255,255,0.45);
          font-size: 18px;
          max-width: 480px;
          margin: 0 auto 40px;
          font-weight: 300;
        }

        .cta-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: #1E6FFF;
          color: #fff;
          font-weight: 600;
          font-size: 15px;
          padding: 14px 28px;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-primary:hover {
          background: #3D8BFF;
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(30,111,255,0.35);
        }

        .btn-secondary {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          font-weight: 500;
          font-size: 15px;
          padding: 14px 28px;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .hero-card { display: none; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .mission-section { grid-template-columns: 1fr; gap: 48px; }
          .values-grid { grid-template-columns: 1fr; }
          .team-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="about-page" ref={heroRef}>

        {/* Hero */}
        <section className="hero">
          <div className="hero-bg" />
          <div className="hero-grid" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="hero-tag reveal">
              <span className="pulse-dot" />
              Our Story
            </div>
            <h1 className="hero-title reveal reveal-delay-1">
              Built for<br />
              <span className="accent">Africa's</span><br />
              <span className="accent-green">Builders</span>
            </h1>
            <p className="hero-desc reveal reveal-delay-2">
              NexaPay was born from a simple frustration — why should African developers spend months integrating payment systems that should take hours?
            </p>
            <Link href="/register-business" className="hero-cta reveal reveal-delay-3">
              Start Building →
            </Link>
          </div>

          {/* Floating card */}
          <div className="hero-card">
            <div className="hero-card-logo">
              <div className="hero-card-icon">N</div>
              <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18 }}>
                Nexa<span style={{ color: "#1E6FFF" }}>Pay</span>
              </span>
            </div>
            <div style={{ marginBottom: 20 }}>
              {["MTN Mobile Money", "Orange Money", "PayPal", "Visa / Mastercard"].map((m) => (
                <div key={m} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  fontSize: 13, color: "rgba(255,255,255,0.7)"
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00D4AA" }} />
                  {m}
                </div>
              ))}
            </div>
            <div style={{
              background: "rgba(30,111,255,0.1)",
              border: "1px solid rgba(30,111,255,0.2)",
              borderRadius: 12,
              padding: "10px 14px",
              fontSize: 12,
              color: "#60A5FA",
              textAlign: "center"
            }}>
              One API · All payment methods
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="stats-section">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div className={`stat-item reveal reveal-delay-${i + 1}`} key={s.label}>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section style={{ padding: "120px 5%" }}>
          <div className="mission-section" style={{ padding: 0 }}>
            <div>
              <p className="section-tag reveal">Our Mission</p>
              <h2 className="section-title reveal reveal-delay-1">
                Democratizing payments across Africa
              </h2>
              <p className="section-body reveal reveal-delay-2">
                We believe every African business — from a solo founder in Yaoundé to an enterprise in Lagos — deserves access to world-class payment infrastructure. NexaPay levels the playing field.
              </p>
              <p className="section-body reveal reveal-delay-3" style={{ marginTop: 16 }}>
                Our platform connects Mobile Money networks, international card processors, and digital wallets through a single, unified API. Build once, accept payments everywhere.
              </p>
            </div>
            <div className="mission-visual reveal reveal-delay-2">
              {[
                { icon: "🌍", bg: "rgba(30,111,255,0.15)", title: "Pan-African Coverage", desc: "10+ countries and growing" },
                { icon: "⚡", bg: "rgba(0,212,170,0.15)", title: "Real-time Processing", desc: "Sub-second transaction speeds" },
                { icon: "🔐", bg: "rgba(139,92,246,0.15)", title: "Bank-grade Security", desc: "PCI-DSS compliant infrastructure" },
                { icon: "📊", bg: "rgba(245,158,11,0.15)", title: "Live Analytics", desc: "Full visibility into your revenue" },
              ].map((item) => (
                <div className="mission-card" key={item.title}>
                  <div className="mission-card-icon" style={{ background: item.bg }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="values-section">
          <div className="values-header">
            <p className="section-tag reveal">What We Stand For</p>
            <h2 className="section-title reveal reveal-delay-1">Our Core Values</h2>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div className={`value-card reveal reveal-delay-${i + 1}`} key={v.title}>
                <span className="value-icon">{v.icon}</span>
                <div className="value-title">{v.title}</div>
                <div className="value-desc">{v.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="team-section">
          <div className="team-header">
            <p className="section-tag reveal">The People</p>
            <h2 className="section-title reveal reveal-delay-1">Who Builds NexaPay</h2>
            <p className="section-body reveal reveal-delay-2" style={{ maxWidth: 480, margin: "0 auto" }}>
              A passionate team of engineers, designers, and fintech experts united by one goal — making payments work for Africa.
            </p>
          </div>
          <div className="team-grid">
            {team.map((member, i) => (
              <div className={`team-card reveal reveal-delay-${i + 1}`} key={member.name}>
                <div className="team-avatar">{member.initial}</div>
                <div className="team-name">{member.name}</div>
                <div className="team-role">{member.role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="cta-bg" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 className="cta-title reveal">
              Ready to build<br />
              <span style={{ color: "#1E6FFF" }}>something great?</span>
            </h2>
            <p className="cta-desc reveal reveal-delay-1">
              Join hundreds of African businesses already processing payments with NexaPay.
            </p>
            <div className="cta-buttons reveal reveal-delay-2">
              <Link href="/register-business" className="btn-primary">
                Get Started Free →
              </Link>
              <Link href="/contact" className="btn-secondary">
                Talk to Us
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}