"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

/**
 * The assistant is instructed to reference site pages as plain paths
 * ("/services/cloud_migration"). Turn those into real links so visitors can
 * actually navigate, rather than reading a path they'd have to type manually.
 *
 * Anchored to the site's actual top-level route prefixes (see siteContext.ts)
 * so incidental slashes in ordinary text ("24/7", "N/A") don't get linkified.
 */
const PATH_RE =
  /(\/(?:services|solutions|industries|news|about|careers|contact)(?:\/[a-z0-9_-]+)*)/gi;

function renderWithLinks(text: string) {
  return text.split(PATH_RE).map((part, i) => {
    if (i % 2 === 1) {
      return (
        <Link
          key={i}
          href={part}
          className="font-medium text-[#FF6200] underline underline-offset-2 hover:text-[#E55500]"
        >
          {part}
        </Link>
      );
    }
    return part;
  });
}

const LOGO_SRC = "/images/intrastack-logo-assets/website/pwa-browser/pwa-icon-128x128.png";

const FALLBACK_REPLY =
  "Sorry, something went wrong on our end. You can reach IntraStack directly at 888-959-7868 or info@intrastack.com.";

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm the IntraStack assistant. Ask me about our services, or tell me what you're trying to solve and I'll help point you in the right direction.",
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          path: typeof window !== "undefined" ? window.location.pathname : null,
        }),
      });

      if (!res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: FALLBACK_REPLY }]);
        return;
      }

      const data = await res.json();
      const reply: string = data?.reply ?? FALLBACK_REPLY;
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: FALLBACK_REPLY }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen && (
        <div
          className={cn(
            "flex h-[70vh] max-h-[560px] w-[calc(100vw-2.5rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl",
            "animate-in fade-in slide-in-from-bottom-4 duration-200"
          )}
          role="dialog"
          aria-label="IntraStack chat assistant"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 bg-[#FF6200] px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white">
                <Image src={LOGO_SRC} alt="IntraStack logo" width={28} height={28} className="object-contain" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">IntraStack Assistant</p>
                <p className="text-xs text-white/80">Usually replies instantly</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1 text-white/90 transition hover:bg-white/15 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                    m.role === "user"
                      ? "rounded-br-sm bg-[#FF6200] text-white"
                      : "rounded-bl-sm border border-black/5 bg-white text-gray-800 shadow-sm"
                  )}
                >
                  {m.role === "assistant" ? renderWithLinks(m.content) : m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-black/5 bg-white px-4 py-3 shadow-sm">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-black/10 bg-white p-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={loading}
              className="min-w-0 flex-1 rounded-full border border-black/10 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#FF6200] disabled:opacity-60"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF6200] text-white transition hover:bg-[#E55500] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FF6200] text-white shadow-lg transition hover:scale-105 hover:bg-[#E55500]"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
