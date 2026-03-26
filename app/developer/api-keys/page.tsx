"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Copy, RefreshCw, Eye, EyeOff, CheckCheck, FlaskConical, Zap } from "lucide-react";
import { toast } from "sonner";

export default function ApiKeysPage() {
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
      .then((res) => res.json())
      .then((data) => {
        setApiKey(data.apiKey || null);
        setTestApiKey(data.testApiKey || null);
        setMerchantStatus(data.merchantStatus || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const maskKey = (key: string) => `${key.slice(0, 16)}${"•".repeat(20)}`;

  const handleCopy = (key: string, isTest: boolean) => {
    navigator.clipboard.writeText(key);
    if (isTest) {
      setCopiedTest(true);
      setTimeout(() => setCopiedTest(false), 2000);
    } else {
      setCopiedLive(true);
      setTimeout(() => setCopiedLive(false), 2000);
    }
    toast.success(`${isTest ? "Test" : "Live"} API key copied!`);
  };

  const handleRegenerate = async () => {
    const confirmed = window.confirm(
      "Are you sure? Your old live API key will stop working immediately."
    );
    if (!confirmed) return;

    setRegenerating(true);
    try {
      const res = await fetch("/api/developer/regenerate-key", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setApiKey(data.apiKey);
        setVisibleLive(true);
        toast.success("Live API key regenerated!");
      } else {
        toast.error(data.error || "Failed to regenerate key.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-zinc-900">API Keys</h1>
        <p className="text-gray-500 mt-2">
          Use your API keys to authenticate requests to the NexaPay API.
          Use the <span className="font-semibold text-amber-600">test key</span> for development and the{" "}
          <span className="font-semibold text-green-600">live key</span> for production.
        </p>
        <p className="text-xs text-gray-400 mt-1">Signed in as {session?.user?.email}</p>
      </div>

      {/* Test Key Card */}
      <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900">Test API Key</h2>
              <p className="text-xs text-gray-400 mt-0.5">For development & testing — no approval needed</p>
            </div>
          </div>
          <span className="bg-amber-100 text-amber-600 text-xs font-semibold px-3 py-1 rounded-full">
            Sandbox
          </span>
        </div>

        {loading ? (
          <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
        ) : testApiKey ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 font-mono text-sm text-gray-700 overflow-hidden">
              {visibleTest ? testApiKey : maskKey(testApiKey)}
            </div>
            <button
              onClick={() => setVisibleTest(!visibleTest)}
              className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition text-gray-500"
            >
              {visibleTest ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleCopy(testApiKey, true)}
              className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition text-gray-500"
            >
              {copiedTest
                ? <CheckCheck className="w-4 h-4 text-green-500" />
                : <Copy className="w-4 h-4" />
              }
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-400">No test key found.</p>
        )}

        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
          ⚡ Test transactions are marked as <strong>TEST</strong> and processed through sandbox. No real money moves.
        </div>
      </div>

      {/* Live Key Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900">Live API Key</h2>
              <p className="text-xs text-gray-400 mt-0.5">For production — requires approved business</p>
            </div>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
            merchantStatus === "approved"
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-500"
          }`}>
            {merchantStatus === "approved" ? "Active" : "Requires Approval"}
          </span>
        </div>

        {loading ? (
          <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
        ) : apiKey ? (
          <>
            {merchantStatus !== "approved" && (
              <div className="mb-3 bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-500">
                🔒 Your live key is ready but will only work after your business is approved by our team.
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-mono text-sm text-gray-700 overflow-hidden">
                {visibleLive ? apiKey : maskKey(apiKey)}
              </div>
              <button
                onClick={() => setVisibleLive(!visibleLive)}
                className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition text-gray-500"
              >
                {visibleLive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleCopy(apiKey, false)}
                className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition text-gray-500"
              >
                {copiedLive
                  ? <CheckCheck className="w-4 h-4 text-green-500" />
                  : <Copy className="w-4 h-4" />
                }
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-400">No live key found.</p>
        )}
      </div>

      {/* Regenerate live key */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-zinc-900 mb-1">Regenerate Live Key</h2>
        <p className="text-sm text-gray-500 mb-4">
          If your live key is compromised, regenerate it immediately. Your old key will stop working right away.
        </p>
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-red-100 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${regenerating ? "animate-spin" : ""}`} />
          {regenerating ? "Regenerating..." : "Regenerate Live Key"}
        </button>
      </div>
    </div>
  );
}