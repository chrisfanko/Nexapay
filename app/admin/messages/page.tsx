"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCheck,
  Clock3,
  Mail,
  MailOpen,
  MessageSquareText,
  Search,
} from "lucide-react";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

type MessageFilter = "all" | "unread" | "read";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [filter, setFilter] = useState<MessageFilter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadMessages() {
      try {
        const response = await fetch("/api/admin/messages");

        if (!response.ok) {
          throw new Error("Unable to load messages");
        }

        const data = await response.json();
        const receivedMessages = data.messages ?? [];

        setMessages(receivedMessages);
        setSelectedMessageId(receivedMessages[0]?._id ?? null);
      } catch {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, []);

  const filteredMessages = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return messages.filter((message) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && !message.read) ||
        (filter === "read" && message.read);

      const matchesSearch = [
        message.name,
        message.email,
        message.subject,
        message.message,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [filter, messages, search]);

  const selectedMessage =
    messages.find((message) => message._id === selectedMessageId) ?? null;

  const unreadCount = messages.filter((message) => !message.read).length;

  async function updateMessageReadState(messageId: string, read: boolean) {
    setUpdating(true);

    try {
      const response = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, read }),
      });

      if (!response.ok) {
        throw new Error("Unable to update message");
      }

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message._id === messageId ? { ...message, read } : message
        )
      );
    } finally {
      setUpdating(false);
    }
  }

  function selectMessage(message: ContactMessage) {
    setSelectedMessageId(message._id);

    if (!message.read) {
      updateMessageReadState(message._id, true);
    }
  }

  return (
    <div>
      <header className="flex flex-col gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
            Support inbox
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#0A0A0A] sm:text-4xl">
            Contact messages
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Review questions and requests submitted through the NexaPay contact
            form.
          </p>
        </div>

        <div className="border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Unread
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-[-0.035em] text-[#0A0A0A]">
            {loading ? "—" : unreadCount}
          </p>
        </div>
      </header>

      <section className="mt-8 overflow-hidden border border-slate-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row">
          <label className="relative block flex-1">
            <span className="sr-only">Search messages</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-10 w-full border border-slate-300 bg-white pl-10 pr-3 text-sm text-[#0A0A0A] outline-none placeholder:text-slate-400 focus:border-[#1E6FFF]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, subject, or message"
              value={search}
            />
          </label>

          <div className="flex border border-slate-300 bg-white p-1">
            {(
              [
                ["all", "All"],
                ["unread", "Unread"],
                ["read", "Read"],
              ] as const
            ).map(([value, label]) => (
              <button
                className={`h-8 px-3 text-xs font-semibold transition-colors ${
                  filter === value
                    ? "bg-[#0A0A0A] text-white"
                    : "text-slate-500 hover:text-[#0A0A0A]"
                }`}
                key={value}
                onClick={() => setFilter(value)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid min-h-[580px] lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="border-b border-slate-200 lg:border-b-0 lg:border-r">
            {loading &&
              Array.from({ length: 7 }).map((_, index) => (
                <div
                  className="border-b border-slate-200 p-5"
                  key={index}
                >
                  <div className="h-4 w-32 animate-pulse bg-slate-100" />
                  <div className="mt-3 h-3 w-48 animate-pulse bg-slate-100" />
                  <div className="mt-4 h-3 w-full animate-pulse bg-slate-100" />
                </div>
              ))}

            {!loading && filteredMessages.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-500">
                No messages match this view.
              </div>
            )}

            {!loading &&
              filteredMessages.map((message) => {
                const selected = message._id === selectedMessageId;

                return (
                  <button
                    className={`block w-full border-b border-slate-200 p-5 text-left transition-colors ${
                      selected
                        ? "bg-slate-50"
                        : "bg-white hover:bg-slate-50"
                    }`}
                    key={message._id}
                    onClick={() => selectMessage(message)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p
                        className={`truncate text-sm ${
                          message.read
                            ? "font-medium text-slate-700"
                            : "font-semibold text-[#0A0A0A]"
                        }`}
                      >
                        {message.name}
                      </p>
                      {!message.read && (
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#1E6FFF]" />
                      )}
                    </div>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {message.subject || "No subject"}
                    </p>
                    <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">
                      {message.message}
                    </p>
                    <p className="mt-3 text-xs text-slate-400">
                      {formatDate(message.createdAt)}
                    </p>
                  </button>
                );
              })}
          </aside>

          <div className="p-6 sm:p-8">
            {!selectedMessage && !loading && (
              <div className="flex h-full min-h-80 flex-col items-center justify-center text-center">
                <span className="flex size-11 items-center justify-center bg-slate-100 text-slate-500">
                  <MessageSquareText className="size-5" />
                </span>
                <h2 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-[#0A0A0A]">
                  Select a message
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Choose a message from the inbox to view its complete details.
                </p>
              </div>
            )}

            {selectedMessage && (
              <article>
                <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E6FFF]">
                      Contact request
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#0A0A0A]">
                      {selectedMessage.subject || "No subject"}
                    </h2>
                  </div>

                  <button
                    className="inline-flex h-9 items-center gap-2 border border-slate-300 bg-white px-3 text-sm font-semibold text-[#0A0A0A] transition-colors hover:border-[#0A0A0A] disabled:opacity-50"
                    disabled={updating}
                    onClick={() =>
                      updateMessageReadState(
                        selectedMessage._id,
                        !selectedMessage.read
                      )
                    }
                    type="button"
                  >
                    {selectedMessage.read ? (
                      <>
                        <Mail className="size-4" />
                        Mark unread
                      </>
                    ) : (
                      <>
                        <CheckCheck className="size-4" />
                        Mark read
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-6 grid gap-4 border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      From
                    </p>
                    <p className="mt-2 font-semibold text-[#0A0A0A]">
                      {selectedMessage.name}
                    </p>
                    <a
                      className="mt-1 inline-block text-sm text-[#1E6FFF] hover:text-[#175ED8]"
                      href={`mailto:${selectedMessage.email}`}
                    >
                      {selectedMessage.email}
                    </a>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      Received
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {formatDate(selectedMessage.createdAt)}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500">
                      {selectedMessage.read ? (
                        <MailOpen className="size-3.5" />
                      ) : (
                        <Clock3 className="size-3.5" />
                      )}
                      {selectedMessage.read ? "Read" : "Unread"}
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Message
                  </p>
                  <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {selectedMessage.message}
                  </div>
                </div>
              </article>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}