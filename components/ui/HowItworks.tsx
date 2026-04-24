"use client";

import { UserPlus, CreditCard, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

const HowItWorks = () => {
  const t = useTranslations("howItWorks");

  const steps = [
    {
      icon: <UserPlus className="w-8 h-8" />,
      step: "01",
      title: t("step1.title"),
      description: t("step1.description"),
      color: "#1E6FFF",
      glow: "rgba(30,111,255,0.25)",
      border: "rgba(30,111,255,0.3)",
      bg: "rgba(30,111,255,0.08)",
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      step: "02",
      title: t("step2.title"),
      description: t("step2.description"),
      color: "#00D4AA",
      glow: "rgba(0,212,170,0.25)",
      border: "rgba(0,212,170,0.3)",
      bg: "rgba(0,212,170,0.08)",
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      step: "03",
      title: t("step3.title"),
      description: t("step3.description"),
      color: "#F59E0B",
      glow: "rgba(245,158,11,0.25)",
      border: "rgba(245,158,11,0.3)",
      bg: "rgba(245,158,11,0.08)",
    },
  ];

  return (
    <section style={{
      background: "#0A1628",
      padding: "100px 5%",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .hiw-section { font-family: 'DM Sans', sans-serif; }
        .hiw-card {
          border-radius: 24px;
          padding: 36px 28px;
          border: 1px solid;
          transition: all 0.35s cubic-bezier(.16,1,.3,1);
          position: relative;
          overflow: hidden;
          text-align: center;
          flex: 1;
        }
        .hiw-card:hover { transform: translateY(-8px); }
        .hiw-step-num {
          font-family: 'Syne', sans-serif;
          font-size: 72px;
          font-weight: 800;
          line-height: 1;
          opacity: 0.06;
          position: absolute;
          top: 16px;
          right: 20px;
          pointer-events: none;
        }
        .hiw-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          transition: transform 0.3s;
          border: 1px solid;
        }
        .hiw-card:hover .hiw-icon-wrap { transform: scale(1.08) rotate(-3deg); }
        .hiw-step-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 12px;
          display: block;
        }
        .hiw-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 12px;
        }
        .hiw-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          line-height: 1.7;
          font-weight: 300;
        }
        .hiw-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
        }
        .hiw-connector {
          position: absolute;
          top: 56px;
          height: 1px;
          background: linear-gradient(90deg, rgba(30,111,255,0.4), rgba(0,212,170,0.4));
          z-index: 0;
          left: calc(33.3% - 10px);
          width: calc(33.3% + 20px);
        }
        .hiw-connector-2 {
          left: calc(66.6% - 10px);
          background: linear-gradient(90deg, rgba(0,212,170,0.4), rgba(245,158,11,0.4));
        }
        @media (max-width: 768px) {
          .hiw-grid { grid-template-columns: 1fr; }
          .hiw-connector, .hiw-connector-2 { display: none; }
        }
      `}</style>

      <div style={{ position: "absolute", top: 0, left: "20%", width: 300, height: 300, background: "radial-gradient(circle, rgba(30,111,255,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, right: "20%", width: 300, height: 300, background: "radial-gradient(circle, rgba(0,212,170,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="hiw-section">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span style={{
            display: "inline-block",
            background: "rgba(30,111,255,0.1)",
            border: "1px solid rgba(30,111,255,0.25)",
            color: "#1E6FFF",
            fontSize: 12,
            fontWeight: 600,
            padding: "6px 16px",
            borderRadius: 100,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 20,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {t("badge")}
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
            {t("headline1")}<br />
            <span style={{ color: "#00D4AA" }}>{t("headline2")}</span>
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 16,
            maxWidth: 460,
            margin: "0 auto",
            lineHeight: 1.7,
            fontWeight: 300,
          }}>
            {t("subheadline")}
          </p>
        </div>

        {/* Steps */}
        <div className="hiw-grid">
          <div className="hiw-connector hidden md:block" />
          <div className="hiw-connector hiw-connector-2 hidden md:block" />

          {steps.map((step) => (
            <div
              key={step.step}
              className="hiw-card"
              style={{
                background: step.bg,
                borderColor: step.border,
                boxShadow: `0 8px 32px ${step.glow}`,
              }}
            >
              <div className="hiw-step-num" style={{ color: step.color }}>{step.step}</div>
              <div
                className="hiw-icon-wrap"
                style={{
                  background: step.bg,
                  borderColor: step.border,
                  color: step.color,
                  boxShadow: `0 0 20px ${step.glow}`,
                }}
              >
                {step.icon}
              </div>
              <span className="hiw-step-label" style={{ color: step.color }}>
                {t("step")} {step.step}
              </span>
              <div className="hiw-title">{step.title}</div>
              <div className="hiw-desc">{step.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;