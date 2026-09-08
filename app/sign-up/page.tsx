"use client";

import type { FormEvent, MouseEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Github,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function SignUp() {
  const t = useTranslations("auth");
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        router.push("/sign-in");
        return;
      }

      setError(data.message || "Unable to create your account. Please try again.");
    } catch {
      setError("Unable to create your account. Please try again.");
    } finally {
      setPending(false);
    }
  };

  const handleProvider = (
    event: MouseEvent<HTMLButtonElement>,
    provider: "github" | "google"
  ) => {
    event.preventDefault();
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden border border-slate-200 bg-white lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,0.7fr)]">
        <section className="hidden flex-col justify-between bg-[#0A0A0A] p-10 text-white lg:flex">
          <Link href="/" className="inline-flex items-center gap-2.5 self-start">
            <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#1E6FFF] text-sm font-extrabold">
              N
            </span>
            <span className="text-lg font-semibold tracking-[-0.03em]">
              Nexa<span className="text-[#1E6FFF]">Pay</span>
            </span>
          </Link>

          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
              Start with NexaPay
            </p>
            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.06em]">
              Build your payment experience with confidence.
            </h1>
            <p className="mt-6 text-base leading-7 text-slate-300">
              Create your merchant account, set up your business, and start
              accepting payments through one platform.
            </p>
          </div>

          <p className="text-sm text-slate-500">No setup fee. No monthly fee.</p>
        </section>

        <section className="flex flex-col p-6 sm:p-10 lg:p-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 self-start text-sm font-medium text-slate-500 transition-colors hover:text-[#0A0A0A]"
          >
            <ArrowLeft className="size-4" />
            {t("backHome")}
          </Link>

          <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
            <div className="lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#1E6FFF] text-sm font-extrabold text-white">
                  N
                </span>
                <span className="text-lg font-semibold tracking-[-0.03em] text-[#0A0A0A]">
                  Nexa<span className="text-[#1E6FFF]">Pay</span>
                </span>
              </Link>
            </div>

            <h2 className="mt-10 text-3xl font-semibold tracking-[-0.045em] text-[#0A0A0A]">
              {t("signUp.title")}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {t("signUp.desc")}
            </p>

            {error && (
              <div
                role="alert"
                className="mt-6 flex gap-3 border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <label className="block text-sm font-medium text-slate-700">
                {t("signUp.fullName")}
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  disabled={pending}
                  required
                  autoComplete="name"
                  className={inputClassName}
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                {t("signUp.email")}
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  disabled={pending}
                  required
                  autoComplete="email"
                  className={inputClassName}
                />
              </label>

              <PasswordField
                label={t("signUp.password")}
                value={form.password}
                onChange={(value) => updateField("password", value)}
                visible={showPassword}
                onToggle={() => setShowPassword((visible) => !visible)}
                autoComplete="new-password"
                disabled={pending}
              />

              <PasswordField
                label={t("signUp.confirmPassword")}
                value={form.confirmPassword}
                onChange={(value) => updateField("confirmPassword", value)}
                visible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((visible) => !visible)}
                autoComplete="new-password"
                disabled={pending}
              />

              <button
                type="submit"
                disabled={pending}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1E6FFF] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#175ed8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending && <Loader2 className="size-4 animate-spin" />}
                {t("signUp.continue")}
              </button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={(event) => handleProvider(event, "google")}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 text-sm font-semibold text-[#0A0A0A] transition-colors hover:border-[#0A0A0A] hover:bg-slate-50"
              >
                Google
              </button>

              <button
                type="button"
                onClick={(event) => handleProvider(event, "github")}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 text-sm font-semibold text-[#0A0A0A] transition-colors hover:border-[#0A0A0A] hover:bg-slate-50"
              >
                <Github className="size-4" />
                GitHub
              </button>
            </div>

            <p className="mt-8 text-sm text-slate-500">
              {t("signUp.hasAccount")}{" "}
              <Link
                href="/sign-in"
                className="font-semibold text-[#1E6FFF] hover:text-[#175ed8]"
              >
                {t("signUp.signIn")}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  autoComplete: string;
  disabled: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <span className="relative mt-2 block">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          required
          autoComplete={autoComplete}
          className={`${inputClassName} pr-11`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-[#0A0A0A]"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </span>
    </label>
  );
}

const inputClassName =
  "mt-2 block w-full border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#0A0A0A] outline-none transition-colors focus:border-[#1E6FFF] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50";