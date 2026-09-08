"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  FlaskConical,
  KeyRound,
  LoaderCircle,
  RefreshCw,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function ApiKeysPage() {
  const t = useTranslations("apiKeys");
  const { data: session } = useSession();

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [testApiKey, setTestApiKey] = useState<string | null>(null);
  const [merchantStatus, setMerchantStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [visibleLive, setVisibleLive] = useState(false);
  const [visibleTest, setVisibleTest] = useState(false);
  const [copiedLive, setCopiedLive] = useState(false);
  const [copiedTest, setCopiedTest] = useState(false);

  useEffect(() => {
    fetch("/api/developer/get-key")
      .then((response) => response.json())
      .then((data) => {
        setApiKey(data.apiKey || null);
        setTestApiKey(data.testApiKey || null);
        setMerchantStatus(data.merchantStatus || null);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const maskKey = (key: string) =>
    `${key.slice(0, 16)}${"•".repeat(Math.max(12, key.length - 16))}`;

  const handleCopy = async (key: string, environment: "live" | "test") => {
    try {
      await navigator.clipboard.writeText(key);

      if (environment === "test") {
        setCopiedTest(true);
        window.setTimeout(() => setCopiedTest(false), 2000);
        toast.success(t("testKey.copied"));
      } else {
        setCopiedLive(true);
        window.setTimeout(() => setCopiedLive(false), 2000);
        toast.success(t("liveKey.copied"));
      }
    } catch {
      toast.error("Unable to copy the API key.");
    }
  };

  const handleRegenerate = async () => {
    if (!window.confirm(t("regenerate.confirm"))) return;

    setRegenerating(true);

    try {
      const response = await fetch("/api/developer/regenerate-key", {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || t("regenerate.error"));
        return;
      }

      setApiKey(data.apiKey);
      setVisibleLive(true);
      toast.success(t("regenerate.success"));
    } catch {
      toast.error(t("regenerate.errorNetwork"));
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <header className="border-b border-slate-200 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
          Developer portal
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#0A0A0A] sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          {t("subtitle")}
        </p>
        <p className="mt-4 font-mono text-xs text-slate-400">
          {t("signedInAs")} {session?.user?.email}
        </p>
      </header>

      <section className="mt-8 border border-amber-200 bg-amber-50">
        <div className="flex flex-col justify-between gap-5 border-b border-amber-200 p-5 sm:flex-row sm:items-start sm:p-6">
          <div className="flex gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center border border-amber-200 bg-white text-amber-700">
              <FlaskConical className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-800">
                {t("testKey.badge")}
              </p>
              <h2 className="mt-2 text-lg font-semibold tracking-[-0.025em] text-[#0A0A0A]">
                {t("testKey.title")}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {t("testKey.desc")}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {loading ? (
            <KeySkeleton />
          ) : testApiKey ? (
            <KeyField
              copied={copiedTest}
              onCopy={() => handleCopy(testApiKey, "test")}
              onToggleVisibility={() => setVisibleTest((visible) => !visible)}
              value={visibleTest ? testApiKey : maskKey(testApiKey)}
              visible={visibleTest}
            />
          ) : (
            <p className="text-sm text-slate-500">{t("testKey.notFound")}</p>
          )}

          <div className="mt-5 flex gap-3 border border-amber-200 bg-white/70 p-4 text-sm leading-6 text-amber-900">
            <FlaskConical className="mt-0.5 size-4 shrink-0" />
            <p>{t("testKey.notice")}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 border border-slate-200 bg-white">
        <div className="flex flex-col justify-between gap-5 border-b border-slate-200 p-5 sm:flex-row sm:items-start sm:p-6">
          <div className="flex gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-[#1E6FFF]">
              <Zap className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E6FFF]">
                Production environment
              </p>
              <h2 className="mt-2 text-lg font-semibold tracking-[-0.025em] text-[#0A0A0A]">
                {t("liveKey.title")}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {t("liveKey.desc")}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex w-fit border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] ${
              merchantStatus === "approved"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-slate-300 bg-slate-50 text-slate-600"
            }`}
          >
            {merchantStatus === "approved"
              ? t("liveKey.badgeActive")
              : t("liveKey.badgePending")}
          </span>
        </div>

        <div className="p-5 sm:p-6">
          {loading ? (
            <KeySkeleton />
          ) : apiKey ? (
            <>
              {merchantStatus !== "approved" && (
                <div className="mb-5 flex gap-3 border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  <ShieldAlert className="mt-0.5 size-4 shrink-0 text-slate-500" />
                  <p>{t("liveKey.lockNotice")}</p>
                </div>
              )}

              <KeyField
                copied={copiedLive}
                onCopy={() => handleCopy(apiKey, "live")}
                onToggleVisibility={() => setVisibleLive((visible) => !visible)}
                value={visibleLive ? apiKey : maskKey(apiKey)}
                visible={visibleLive}
              />
            </>
          ) : (
            <p className="text-sm text-slate-500">{t("liveKey.notFound")}</p>
          )}
        </div>
      </section>

      <section className="mt-6 border border-red-200 bg-red-50">
        <div className="p-5 sm:p-6">
          <div className="flex gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center border border-red-200 bg-white text-red-700">
              <KeyRound className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-800">
                Sensitive action
              </p>
              <h2 className="mt-2 text-lg font-semibold tracking-[-0.025em] text-[#0A0A0A]">
                {t("regenerate.title")}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                {t("regenerate.desc")}
              </p>
            </div>
          </div>

          <button
            className="mt-6 inline-flex h-10 items-center gap-2 border border-red-300 bg-white px-4 text-sm font-semibold text-red-800 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={regenerating}
            onClick={handleRegenerate}
            type="button"
          >
            {regenerating ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            {regenerating ? t("regenerate.loading") : t("regenerate.btn")}
          </button>
        </div>
      </section>
    </div>
  );
}

function KeyField({
  copied,
  onCopy,
  onToggleVisibility,
  value,
  visible,
}: {
  copied: boolean;
  onCopy: () => void;
  onToggleVisibility: () => void;
  value: string;
  visible: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="min-w-0 flex-1 overflow-x-auto border border-slate-300 bg-white px-4 py-3 font-mono text-sm text-[#0A0A0A]">
        {value}
      </div>

      <div className="flex gap-2">
        <button
          aria-label={visible ? "Hide API key" : "Show API key"}
          className="inline-flex size-11 items-center justify-center border border-slate-300 bg-white text-slate-600 transition-colors hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
          onClick={onToggleVisibility}
          type="button"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>

        <button
          aria-label="Copy API key"
          className="inline-flex h-11 items-center justify-center gap-2 border border-slate-300 bg-white px-4 text-sm font-semibold text-[#0A0A0A] transition-colors hover:border-[#0A0A0A] hover:bg-slate-50"
          onClick={onCopy}
          type="button"
        >
          {copied ? <Check className="size-4 text-green-700" /> : <Copy className="size-4" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
    </div>
  );
}

function KeySkeleton() {
  return <div className="h-12 w-full animate-pulse bg-slate-100" />;
}