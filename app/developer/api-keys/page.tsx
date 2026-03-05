"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Copy, RefreshCw, Eye, EyeOff, CheckCheck } from "lucide-react";
import { toast } from "sonner";

export default function ApiKeysPage() {
  const { data: session } = useSession();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch the user's current API key
  useEffect(() => {
    fetch("/api/developer/get-key")
      .then((res) => res.json())
      .then((data) => {
        setApiKey(data.apiKey || null);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Mask the key e.g. "npk_live_a1b2c3...••••••••••••"
  const maskedKey = apiKey
    ? `${apiKey.slice(0, 16)}${"•".repeat(20)}`
    : null;

  const handleCopy = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success("API key copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    const confirmed = window.confirm(
      "Are you sure? Your old API key will stop working immediately."
    );
    if (!confirmed) return;

    setRegenerating(true);
    try {
      const res = await fetch("/api/developer/regenerate-key", {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok) {
        setApiKey(data.apiKey);
        setVisible(true);
        toast.success("API key regenerated successfully!");
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
          Use your API key to authenticate requests to the NexaPay API. Keep it
          secret — never expose it in client-side code.
        </p>
      </div>

      {/* Key card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">
              Live API Key
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Signed in as {session?.user?.email}
            </p>
          </div>
          <span className="bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
            Active
          </span>
        </div>

        {loading ? (
          <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
        ) : apiKey ? (
          <div className="flex items-center gap-2">
            {/* Key display */}
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-mono text-sm text-gray-700 overflow-hidden">
              {visible ? apiKey : maskedKey}
            </div>

            {/* Toggle visibility */}
            <button
              onClick={() => setVisible(!visible)}
              title={visible ? "Hide key" : "Show key"}
              className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition text-gray-500"
            >
              {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>

            {/* Copy */}
            <button
              onClick={handleCopy}
              title="Copy key"
              className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition text-gray-500"
            >
              {copied ? (
                <CheckCheck className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-400">No API key found.</p>
        )}
      </div>

      {/* Regenerate */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-zinc-900 mb-1">
          Regenerate API Key
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          If your key is compromised, regenerate it immediately. Your old key
          will stop working as soon as you regenerate.
        </p>
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-red-100 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${regenerating ? "animate-spin" : ""}`} />
          {regenerating ? "Regenerating..." : "Regenerate Key"}
        </button>
      </div>
    </div>
  );
}