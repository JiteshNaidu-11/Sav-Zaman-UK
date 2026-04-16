import { AnimatePresence, motion } from "framer-motion";
import { BotMessageSquare, Send, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type ChatRole = "user" | "bot";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

function nowId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function botReplyFor(inputRaw: string): string {
  const input = inputRaw.trim().toLowerCase();
  if (!input) return "Our team will assist you shortly. You can also connect via WhatsApp.";
  if (input.includes("2bhk")) return "We have multiple 2BHK options. Please specify budget and location.";
  if (input.includes("price")) return "Prices vary based on location and property type. Can you share your preference?";
  return "Our team will assist you shortly. You can also connect via WhatsApp.";
}

export function ChatbotModal({ open, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: nowId(),
      role: "bot",
      text: "Hi! Ask me about listings, areas, or pricing.",
    },
  ]);
  const [value, setValue] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const canSend = useMemo(() => value.trim().length > 0, [value]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const send = () => {
    const text = value.trim();
    if (!text) return;

    setValue("");
    const userMsg: ChatMessage = { id: nowId(), role: "user", text };
    const botMsg: ChatMessage = { id: nowId(), role: "bot", text: botReplyFor(text) };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="chatbot-modal"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed bottom-[188px] left-5 right-5 z-[9999] w-auto sm:bottom-[212px] sm:left-auto sm:right-5 sm:w-[350px]"
          role="dialog"
          aria-modal="false"
          aria-label="Ask Sav Zaman AI"
        >
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[rgba(8,18,48,0.92)] shadow-[0_32px_80px_-42px_rgba(2,6,23,0.9)] backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
                    <BotMessageSquare className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">Ask Sav Zaman AI</p>
                    <p className="truncate text-xs text-white/65">Instant property assistance</p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/85 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/25"
                aria-label="Close chatbot"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div ref={listRef} className="h-[340px] overflow-y-auto px-4 py-4 sm:h-[380px]">
              <div className="space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={[
                        "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                        m.role === "user"
                          ? "bg-[hsl(var(--accent))] text-white shadow-[0_18px_44px_-28px_rgba(37,99,235,0.65)]"
                          : "border border-white/10 bg-white/5 text-white/90",
                      ].join(" ")}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Type a message..."
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/15"
                  aria-label="Chat message"
                />
                <button
                  type="submit"
                  disabled={!canSend}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-[0_22px_50px_-30px_rgba(37,99,235,0.8)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

