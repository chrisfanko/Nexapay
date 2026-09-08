"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import {
  CheckCircle2,
  Handshake,
  Headphones,
  Loader2,
  Mail,
  Send,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("contact");

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const contactOptions = [
    {
      icon: Mail,
      title: t("options.sales.title"),
      description: t("options.sales.desc"),
      email: "sales@nexapay.com",
    },
    {
      icon: Headphones,
      title: t("options.support.title"),
      description: t("options.support.desc"),
      email: "support@nexapay.com",
    },
    {
      icon: Handshake,
      title: t("options.partners.title"),
      description: t("options.partners.desc"),
      email: "partners@nexapay.com",
    },
  ];

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t("form.errorFallback"));
        return;
      }

      setSent(true);
    } catch {
      setError(t("form.errorNetwork"));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSent(false);
    setError("");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <main className="bg-white text-[#0A0A0A]">
      <section className="border-b border-white/10 bg-[#0A0A0A] text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-8 lg:py-32">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
            {t("hero.tag")}
          </p>

          <h1 className="mt-6 text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">
            {t("hero.title1")}
            <br />
            <span className="text-[#1E6FFF]">{t("hero.title2")}</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid border-l border-t border-slate-200 md:grid-cols-3">
          {contactOptions.map((option) => {
            const Icon = option.icon;

            return (
              <a
                key={option.email}
                href={`mailto:${option.email}`}
                className="group border-b border-r border-slate-200 p-6 transition-colors hover:bg-slate-50 sm:p-7"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-[#1E6FFF]">
                  <Icon className="size-5" />
                </div>

                <h2 className="mt-8 text-lg font-semibold tracking-[-0.025em]">
                  {option.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {option.description}
                </p>

                <p className="mt-6 font-mono text-xs text-[#1E6FFF]">
                  {option.email}
                </p>
              </a>
            );
          })}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:px-8 lg:py-28">
          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
              Contact NexaPay
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              Tell us how we can help.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              Send us a message and the right NexaPay team will get back to you
              as soon as possible.
            </p>
          </div>

          <div className="border border-slate-200 bg-white p-6 sm:p-8">
            {sent ? (
              <div className="py-8 text-center sm:py-12">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-50 text-[#1E6FFF]">
                  <CheckCircle2 className="size-6" />
                </div>

                <h2 className="mt-6 text-2xl font-semibold tracking-[-0.035em]">
                  {t("success.title")}
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                  {t("success.desc")}
                </p>

                <button
                  type="button"
                  onClick={resetForm}
                  className="mt-7 inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-[#0A0A0A] transition-colors hover:border-[#0A0A0A] hover:bg-slate-50"
                >
                  {t("success.reset")}
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-semibold tracking-[-0.035em]">
                  {t("form.title")}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {t("form.subtitle")}
                </p>

                <form onSubmit={handleSubmit} className="mt-8">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      id="contact-name"
                      label={t("form.name")}
                      required
                    >
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                        className={inputClassName}
                      />
                    </FormField>

                    <FormField
                      id="contact-email"
                      label={t("form.email")}
                      required
                    >
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        className={inputClassName}
                      />
                    </FormField>
                  </div>

                  <div className="mt-5">
                    <FormField
                      id="contact-subject"
                      label={t("form.subject")}
                      required
                    >
                      <select
                        id="contact-subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        className={inputClassName}
                      >
                        <option value="">{t("form.subjectPlaceholder")}</option>
                        <option value="Sales Inquiry">
                          {t("form.subjectOptions.sales")}
                        </option>
                        <option value="Technical Support">
                          {t("form.subjectOptions.support")}
                        </option>
                        <option value="Partnership">
                          {t("form.subjectOptions.partnership")}
                        </option>
                        <option value="Billing">
                          {t("form.subjectOptions.billing")}
                        </option>
                        <option value="Other">
                          {t("form.subjectOptions.other")}
                        </option>
                      </select>
                    </FormField>
                  </div>

                  <div className="mt-5">
                    <FormField
                      id="contact-message"
                      label={t("form.message")}
                      required
                    >
                      <textarea
                        id="contact-message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder={t("form.messagePlaceholder")}
                        className={`${inputClassName} resize-y`}
                      />
                    </FormField>
                  </div>

                  {error && (
                    <p
                      role="alert"
                      className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1E6FFF] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#175ed8] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        {t("form.sending")}
                      </>
                    ) : (
                      <>
                        {t("form.submit")}
                        <Send className="size-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

const inputClassName =
  "mt-2 block w-full border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#0A0A0A] outline-none transition-colors placeholder:text-slate-400 focus:border-[#1E6FFF] focus:ring-2 focus:ring-blue-100";

function FormField({
  id,
  label,
  required = false,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className="block text-sm font-medium text-slate-700">
      {label}
      {required && <span className="text-[#1E6FFF]"> *</span>}
      {children}
    </label>
  );
}