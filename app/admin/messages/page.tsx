"use client";

import { useEffect, useState } from "react";
import { Mail, MailOpen, } from "lucide-react";
import { useTranslations } from "next-intl";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const filterTabs = ["all", "unread", "read"];

export default function AdminMessagesPage() {
  const t = useTranslations("adminMessages")
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    fetch(`/api/admin/messages?filter=${filter}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages || []);
        setUnreadCount(data.unreadCount || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter]);

  const markRead = async (messageId: string, read: boolean) => {
    await fetch("/api/admin/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId, read }),
    });

    setMessages((prev) =>
      prev.map((m) => (m._id === messageId ? { ...m, read } : m))
    );

    if (selected?._id === messageId) {
      setSelected((prev) => prev ? { ...prev, read } : null);
    }

    setUnreadCount((prev) => read ? prev - 1 : prev + 1);
  };

  const handleSelect = (msg: Message) => {
    setSelected(msg);
    if (!msg.read) markRead(msg._id, true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900">{t("title")}</h1>
          <p className="text-gray-500 mt-1">
            {t("subtitle")}
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
            {unreadCount} {t("unread")}
          </span>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => { setFilter(tab); setLoading(true); setSelected(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
              filter === tab
                ? "bg-blue-500 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t(`filters.${tab}`)}
            {tab === "unread" && unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        {/* Messages list */}
        <div className="w-2/5 space-y-2">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse h-20" />
            ))
          ) : messages.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
              <Mail className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">{t("noMessages")}</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => handleSelect(msg)}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition ${
                  selected?._id === msg._id
                    ? "border-blue-300 ring-2 ring-blue-100"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {msg.read
                      ? <MailOpen className="w-4 h-4 text-gray-300 shrink-0" />
                      : <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                    }
                    <div className="min-w-0">
                      <p className={`text-sm truncate ${!msg.read ? "font-semibold text-zinc-900" : "text-zinc-700"}`}>
                        {msg.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{msg.subject}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-2 truncate">{msg.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Message detail */}
        <div className="flex-1">
          {selected ? (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              {/* Message header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">{selected.subject}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {t("from")} <span className="font-medium text-zinc-700">{selected.name}</span>
                    {" · "}
                    <a href={`mailto:${selected.email}`} className="text-blue-500 hover:underline">
                      {selected.email}
                    </a>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(selected.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => markRead(selected._id, !selected.read)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
                  >
                    {selected.read
                      ? <><Mail className="w-3.5 h-3.5" /> {t("markUnread")}</>
                      : <><MailOpen className="w-3.5 h-3.5" />{t("markRead")}</>
                    }
                  </button>
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-xs font-medium text-white transition"
                  >
                    {t("reply")}
                  </a>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 mb-6" />

              {/* Message body */}
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selected.message}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-10 text-center h-full flex flex-col items-center justify-center">
              <Mail className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-gray-400 text-sm">{t("selectMessage")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}