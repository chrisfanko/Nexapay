"use client";

import { useState } from "react";

const contactOptions = [
  {
    icon: "💬",
    title: "Sales",
    desc: "Interested in NexaPay for your business?",
    email: "sales@nexapay.com",
    color: "rgba(30,111,255,0.15)",
    border: "rgba(30,111,255,0.25)",
  },
  {
    icon: "🛠️",
    title: "Technical Support",
    desc: "Having trouble with your integration?",
    email: "support@nexapay.com",
    color: "rgba(0,212,170,0.15)",
    border: "rgba(0,212,170,0.25)",
  },
  {
    icon: "🤝",
    title: "Partnerships",
    desc: "Want to partner with NexaPay?",
    email: "partners@nexapay.com",
    color: "rgba(139,92,246,0.15)",
    border: "rgba(139,92,246,0.25)",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      setSent(true);
    } catch {
      setError("Could not send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        .contact-page {
          font-family: 'DM Sans', sans-serif;
          background: #050A14;
          color: #fff;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .contact-hero {
          padding: 120px 5% 80px;
          text-align: center;
          position: relative;
        }

        .contact-hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(30,111,255,0.14) 0%, transparent 70%);
          pointer-events: none;
        }

        .contact-hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%);
        }

        .contact-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,212,170,0.1);
          border: 1px solid rgba(0,212,170,0.25);
          color: #00D4AA;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 16px;
          border-radius: 100px;
          margin-bottom: 28px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .contact-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(40px, 6vw, 80px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
          margin-bottom: 20px;
        }

        .contact-subtitle {
          color: rgba(255,255,255,0.45);
          font-size: clamp(15px, 2vw, 18px);
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.7;
          font-weight: 300;
        }

        .options-section {
          padding: 60px 5%;
          max-width: 1000px;
          margin: 0 auto;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .option-card {
          border-radius: 20px;
          padding: 28px 24px;
          border: 1px solid;
          transition: all 0.3s;
          cursor: pointer;
          text-decoration: none;
          display: block;
        }
        .option-card:hover { transform: translateY(-4px); }

        .option-icon { font-size: 28px; margin-bottom: 14px; display: block; }
        .option-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; margin-bottom: 6px; color: #fff; }
        .option-desc { font-size: 13px; color: rgba(255,255,255,0.45); margin-bottom: 14px; line-height: 1.5; }
        .option-email { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.6); font-family: monospace; }

        .form-section {
          padding: 40px 5% 120px;
          max-width: 800px;
          margin: 0 auto;
        }

        .form-container {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }

        .form-container::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #1E6FFF, #00D4AA, #1E6FFF);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .form-title { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.02em; }
        .form-subtitle { color: rgba(255,255,255,0.4); font-size: 14px; margin-bottom: 36px; font-weight: 300; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .form-group { margin-bottom: 16px; }

        .form-label { display: block; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.6); margin-bottom: 8px; letter-spacing: 0.02em; }

        .form-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          padding: 13px 16px;
          border-radius: 12px;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        .form-input:focus {
          border-color: rgba(30,111,255,0.5);
          background: rgba(30,111,255,0.05);
          box-shadow: 0 0 0 3px rgba(30,111,255,0.1);
        }
        .form-input::placeholder { color: rgba(255,255,255,0.2); }
        textarea.form-input { resize: none; min-height: 140px; }

        .error-box {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          color: #FCA5A5;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          margin-bottom: 16px;
        }

        .submit-btn {
          width: 100%;
          background: #1E6FFF;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          padding: 15px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
        }
        .submit-btn:hover:not(:disabled) {
          background: #3D8BFF;
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(30,111,255,0.35);
        }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .success-container { text-align: center; padding: 40px 0; }

        .success-icon {
          width: 72px;
          height: 72px;
          background: rgba(0,212,170,0.15);
          border: 1px solid rgba(0,212,170,0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin: 0 auto 24px;
          animation: scaleIn 0.5s cubic-bezier(.16,1,.3,1);
        }

        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .success-title { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; margin-bottom: 12px; }
        .success-desc { color: rgba(255,255,255,0.45); font-size: 15px; max-width: 360px; margin: 0 auto 28px; line-height: 1.7; font-weight: 300; }

        .reset-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          padding: 10px 24px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .reset-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .options-grid { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
          .form-container { padding: 32px 24px; }
        }
      `}</style>

      <div className="contact-page">

        {/* Hero */}
        <section className="contact-hero">
          <div className="contact-hero-bg" />
          <div className="contact-hero-grid" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <span className="contact-tag">Get in Touch</span>
            <h1 className="contact-title">
              We&apos;d love to<br />
              <span style={{ color: "#1E6FFF" }}>hear from you</span>
            </h1>
            <p className="contact-subtitle">
              Whether you&apos;re a developer with a question, a business exploring NexaPay, or just curious — we&apos;re here.
            </p>
          </div>
        </section>

        {/* Contact Options */}
        <section className="options-section">
          <div className="options-grid">
            {contactOptions.map((opt) => (
              <a
                key={opt.title}
                href={`mailto:${opt.email}`}
                className="option-card"
                style={{ background: opt.color, borderColor: opt.border }}
              >
                <span className="option-icon">{opt.icon}</span>
                <div className="option-title">{opt.title}</div>
                <div className="option-desc">{opt.desc}</div>
                <div className="option-email">{opt.email}</div>
              </a>
            ))}
          </div>
        </section>

        {/* Form */}
        <section className="form-section">
          <div className="form-container">
            {sent ? (
              <div className="success-container">
                <div className="success-icon">✓</div>
                <h3 className="success-title">Message Sent!</h3>
                <p className="success-desc">
                  Thanks for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button
                  className="reset-btn"
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="form-title">Send us a message</h2>
                <p className="form-subtitle">Fill out the form below and we&apos;ll get back to you as soon as possible.</p>

                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@company.com"
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject *</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      title="Select a subject"
                      className="form-input"
                    >
                      <option value="">Select a subject...</option>
                      <option value="Sales Inquiry">Sales Inquiry</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Billing">Billing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      required
                      className="form-input"
                    />
                  </div>

                  {error && <div className="error-box">{error}</div>}

                  <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? (
                      <>
                        <div className="spinner" />
                        Sending...
                      </>
                    ) : (
                      "Send Message →"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>

      </div>
    </>
  );
}