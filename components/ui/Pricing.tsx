"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Link from "next/link";

const PricingSection = () => {
  const [amount, setAmount] = useState(10000);
  const fee = Math.max(Math.round(amount * 0.015), 50);
  const gross = amount + fee;

  return (
    <section style={{
      background: "linear-gradient(180deg, #0A1628 0%, #050A14 100%)",
      padding: "100px 5%",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .pricing-section { font-family: 'DM Sans', sans-serif; }

        .pricing-card {
          border-radius: 24px;
          padding: 36px 32px;
          border: 1px solid;
          transition: all 0.35s cubic-bezier(.16,1,.3,1);
          position: relative;
          overflow: hidden;
          flex: 1;
        }

        .pricing-card:hover {
          transform: translateY(-6px);
        }

        .pricing-card-featured {
          transform: scale(1.04);
        }

        .pricing-card-featured:hover {
          transform: scale(1.04) translateY(-6px);
        }

        .pricing-feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          font-weight: 400;
        }

        .pricing-feature-item:last-child {
          border-bottom: none;
        }

        .pricing-btn {
          display: block;
          width: 100%;
          text-align: center;
          font-weight: 600;
          font-size: 14px;
          padding: 13px;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.2s;
          margin-top: 28px;
          font-family: 'DM Sans', sans-serif;
        }

        .calc-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: 700;
          padding: 14px 18px;
          border-radius: 14px;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
          margin-bottom: 16px;
        }

        .calc-input:focus {
          border-color: rgba(30,111,255,0.5);
          background: rgba(30,111,255,0.06);
          box-shadow: 0 0 0 3px rgba(30,111,255,0.1);
        }

        .calc-slider {
          width: 100%;
          appearance: none;
          height: 4px;
          border-radius: 2px;
          background: rgba(255,255,255,0.1);
          outline: none;
          margin-bottom: 24px;
          cursor: pointer;
        }

        .calc-slider::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #1E6FFF;
          cursor: pointer;
          box-shadow: 0 0 0 4px rgba(30,111,255,0.2);
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          max-width: 1000px;
          margin: 0 auto 80px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .pricing-grid { grid-template-columns: 1fr; }
          .pricing-card-featured { transform: none; }
          .pricing-card-featured:hover { transform: translateY(-6px); }
        }
      `}</style>

      {/* Glow */}
      <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(30,111,255,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="pricing-section">
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
          }}>
            Pricing
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
            One rate.<br />
            <span style={{ color: "#00D4AA" }}>No surprises.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, maxWidth: 460, margin: "0 auto", lineHeight: 1.7, fontWeight: 300 }}>
            NexaPay charges a single flat rate per successful transaction. No monthly fees. No setup costs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-grid">

          {/* Free / Starter */}
          <div className="pricing-card" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Starter</p>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, color: "#fff" }}>1.5%</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 28, fontWeight: 300 }}>per successful transaction</p>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 20 }}>
              {[
                "Mobile Money (MTN, Orange)",
                "PayPal integration",
                "API key access",
                "Basic dashboard",
                "Min. fee: 50 XAF",
              ].map((f) => (
                <div className="pricing-feature-item" key={f}>
                  <Check style={{ width: 14, height: 14, color: "#1E6FFF", flexShrink: 0 }} />
                  {f}
                </div>
              ))}
            </div>
            <Link href="/sign-up" className="pricing-btn" style={{ background: "rgba(30,111,255,0.12)", border: "1px solid rgba(30,111,255,0.3)", color: "#1E6FFF" }}>
              Get Started Free
            </Link>
          </div>

          {/* Featured — Pay per transaction */}
          <div className="pricing-card pricing-card-featured" style={{
            background: "linear-gradient(135deg, rgba(30,111,255,0.15) 0%, rgba(0,212,170,0.08) 100%)",
            borderColor: "rgba(30,111,255,0.4)",
            boxShadow: "0 20px 60px rgba(30,111,255,0.2)",
          }}>
            <div style={{
              position: "absolute",
              top: -1, left: "50%", transform: "translateX(-50%)",
              background: "#1E6FFF",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 16px",
              borderRadius: "0 0 12px 12px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}>
              Most Popular
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#1E6FFF", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Growth</p>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, color: "#fff" }}>1.5%</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 28, fontWeight: 300 }}>per successful transaction</p>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20 }}>
              {[
                "Everything in Starter",
                "Webhook delivery system",
                "Full transaction analytics",
                "Merchant dashboard",
                "Priority support",
              ].map((f) => (
                <div className="pricing-feature-item" key={f}>
                  <Check style={{ width: 14, height: 14, color: "#00D4AA", flexShrink: 0 }} />
                  {f}
                </div>
              ))}
            </div>
            <Link href="/sign-up" className="pricing-btn" style={{ background: "#1E6FFF", color: "#fff", boxShadow: "0 8px 24px rgba(30,111,255,0.35)" }}>
              Start Now →
            </Link>
          </div>

          {/* Enterprise */}
          <div className="pricing-card" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Enterprise</p>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, color: "#fff" }}>Custom</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 28, fontWeight: 300 }}>volume-based pricing</p>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 20 }}>
              {[
                "Everything in Growth",
                "Custom fee negotiation",
                "Dedicated account manager",
                "SLA & uptime guarantee",
                "Custom integrations",
              ].map((f) => (
                <div className="pricing-feature-item" key={f}>
                  <Check style={{ width: 14, height: 14, color: "#A78BFA", flexShrink: 0 }} />
                  {f}
                </div>
              ))}
            </div>
            <Link href="/contact" className="pricing-btn" style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.3)", color: "#A78BFA" }}>
              Contact Us
            </Link>
          </div>
        </div>

        {/* Live Calculator */}
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: 40,
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Top accent */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #1E6FFF, #00D4AA)" }} />

            <p style={{ fontSize: 11, fontWeight: 700, color: "#00D4AA", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Fee Calculator</p>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 24 }}>
              See exactly what you pay
            </h3>

            <label style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 10, display: "block" }}>
              Transaction Amount (XAF)
            </label>
            <input
              aria-label="transaction amt input"
              type="number"
              className="calc-input"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              min={0}
            />
            <input
              aria-label="transaction amt slider"
              type="range"
              className="calc-slider"
              min={500}
              max={500000}
              step={500}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { label: "You charge", value: amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), color: "#fff" },
                { label: "NexaPay fee", value: fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), color: "#1E6FFF" },
                { label: "Customer pays", value: gross.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), color: "#00D4AA" },
              ].map((item) => (
                <div key={item.label} style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 14,
                  padding: "16px 12px",
                  textAlign: "center",
                }}>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{item.label}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: item.color }}>{item.value}</p>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 2 }}>XAF</p>
                </div>
              ))}
            </div>
          </div>

          <p style={{ textAlign: "center", marginTop: 20 }}>
            <Link href="/prices" style={{ color: "#1E6FFF", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              See full pricing details →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;