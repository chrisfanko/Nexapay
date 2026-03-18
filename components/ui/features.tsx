"use client";

import { Shield, Zap, Globe, Smartphone } from "lucide-react";

const features = [
  {
    icon: <Shield className="w-7 h-7" />,
    title: "Secure Payments",
    description: "Bank-level encryption and fraud detection keep every transaction safe and protected.",
    color: "#1E6FFF",
    glow: "rgba(30,111,255,0.2)",
    bg: "rgba(30,111,255,0.1)",
    border: "rgba(30,111,255,0.25)",
    tag: "Security",
  },
  {
    icon: <Zap className="w-7 h-7" />,
    title: "Fast Transactions",
    description: "Payments processed in seconds — no delays, no waiting, just instant results.",
    color: "#00D4AA",
    glow: "rgba(0,212,170,0.2)",
    bg: "rgba(0,212,170,0.1)",
    border: "rgba(0,212,170,0.25)",
    tag: "Speed",
  },
  {
    icon: <Globe className="w-7 h-7" />,
    title: "Multi-Currency Support",
    description: "Accept payments in multiple currencies from customers around the world.",
    color: "#A78BFA",
    glow: "rgba(167,139,250,0.2)",
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.25)",
    tag: "Global",
  },
  {
    icon: <Smartphone className="w-7 h-7" />,
    title: "Mobile Friendly",
    description: "Fully optimized for mobile — your customers can pay from any device, anywhere.",
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.2)",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
    tag: "Mobile",
  },
];

const Features = () => {
  return (
    <section style={{
      background: "linear-gradient(180deg, #050A14 0%, #0A1628 100%)",
      padding: "100px 5%",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .features-section { font-family: 'DM Sans', sans-serif; }

        .feature-card {
          border-radius: 20px;
          padding: 32px;
          border: 1px solid;
          transition: all 0.35s cubic-bezier(.16,1,.3,1);
          position: relative;
          overflow: hidden;
          cursor: default;
        }

        .feature-card:hover {
          transform: translateY(-6px);
        }

        .feature-icon-circle {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          transition: transform 0.3s;
          flex-shrink: 0;
        }

        .feature-card:hover .feature-icon-circle {
          transform: scale(1.1);
        }

        .feature-tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 10px;
          display: block;
        }

        .feature-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 10px;
        }

        .feature-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          line-height: 1.7;
          font-weight: 300;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          max-width: 900px;
          margin: 0 auto;
        }

        @media (max-width: 640px) {
          .features-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Background glow */}
      <div style={{
        position: "absolute",
        top: "10%", left: "50%",
        transform: "translateX(-50%)",
        width: "600px", height: "300px",
        background: "radial-gradient(ellipse, rgba(30,111,255,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="features-section">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span style={{
            display: "inline-block",
            background: "rgba(0,212,170,0.1)",
            border: "1px solid rgba(0,212,170,0.25)",
            color: "#00D4AA",
            fontSize: 12,
            fontWeight: 600,
            padding: "6px 16px",
            borderRadius: 100,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 20,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Why NexaPay
          </span>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(32px, 4vw, 48px)",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.02em",
            marginBottom: 16,
            lineHeight: 1.1,
          }}>
            Everything you need to<br />
            <span style={{ color: "#1E6FFF" }}>accept payments</span>
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 16,
            maxWidth: 480,
            margin: "0 auto",
            lineHeight: 1.7,
            fontWeight: 300,
          }}>
            Built for businesses of all sizes — from startups to enterprises across Africa and beyond.
          </p>
        </div>

        {/* Cards */}
        <div className="features-grid">
          {features.map((f) => (
            <div
              key={f.title}
              className="feature-card"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: f.border,
                boxShadow: `0 4px 24px ${f.glow}`,
                borderTop: `3px solid ${f.color}`,
              }}
            >
              {/* Icon circle — fully visible, colored background */}
              <div
                className="feature-icon-circle"
                style={{
                  background: f.bg,
                  border: `1px solid ${f.border}`,
                  color: f.color,
                }}
              >
                {f.icon}
              </div>

              <span className="feature-tag" style={{ color: f.color }}>{f.tag}</span>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;