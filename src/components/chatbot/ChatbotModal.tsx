import { AnimatePresence, motion } from "framer-motion";
import { BotMessageSquare, Search, Send, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePropertyStore } from "@/context/PropertyStoreContext";
import { siteContent } from "@/content/site";
import type { Property } from "@/data/properties";
import { matchProperties, buildPrefilledWhatsAppMessage } from "@/utils/matchProperties";
import type { Lead } from "@/utils/leadStorage";
import { upsertLead } from "@/utils/leadStorage";
import {
  applyAnswerToLead,
  createEmptyLead,
  leadIsComplete,
  nextStep,
  stepPrompt,
  type FlowStep,
} from "@/components/chatbot/ChatFlow";
import { ChatbotPropertyCard } from "@/components/chatbot/PropertyCard";

type ChatRole = "user" | "bot";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text?: string;
  quickReplies?: { id: string; label: string; value: string }[];
  properties?: Property[];
  ctas?: { type: "viewAll" | "whatsapp"; label: string }[];
};

type Props = {
  open: boolean;
  onClose: () => void;
};

function nowId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeWhatsAppNumber(value: string): string {
  return value.replace(/\(0\)/g, "").replace(/\D/g, "");
}

function buildWhatsAppHref(number: string, message: string): string {
  const normalized = normalizeWhatsAppNumber(number);
  const text = encodeURIComponent(message);
  return `https://wa.me/${normalized}?text=${text}`;
}

export function ChatbotModal({ open, onClose }: Props) {
  const navigate = useNavigate();
  const { properties } = usePropertyStore();

  const [lead, setLead] = useState<Lead>(() => createEmptyLead());
  const [step, setStep] = useState<FlowStep>("intent");
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const intro = stepPrompt("intent");
    return [
      {
        id: nowId(),
        role: "bot",
        text: "Hi! I can help match you to the right deals in under a minute.",
      },
      {
        id: nowId(),
        role: "bot",
        text: `${intro.title} ${intro.subtitle}`,
        quickReplies: intro.quickReplies,
      },
    ];
  });

  const [value, setValue] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const canSend = useMemo(() => value.trim().length > 0, [value]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const modalBottomClass = "fixed bottom-[188px] left-5 right-5 z-[9999] w-auto sm:bottom-[212px] sm:left-auto sm:right-5 sm:w-[350px]";

  const pushBotPromptForStep = (next: FlowStep) => {
    const p = stepPrompt(next);
    setMessages((prev) => [
      ...prev,
      {
        id: nowId(),
        role: "bot",
        text: `${p.title} ${p.subtitle}`,
        quickReplies: p.quickReplies,
      },
    ]);
  };

  const handleCompletion = (completedLead: Lead) => {
    try {
      upsertLead(completedLead);
    } catch {
      // ignore storage failure; fall back to whatsapp
    }

    const matches = matchProperties(completedLead, properties, 6);

    if (matches.length > 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: nowId(),
          role: "bot",
          text: "I found some properties that match your requirements 👇",
          properties: matches,
          ctas: [{ type: "viewAll", label: "View All" }],
        },
      ]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: nowId(),
        role: "bot",
        text: "Let me connect you with our expert for better options.",
        ctas: [{ type: "whatsapp", label: "Chat on WhatsApp" }],
      },
    ]);
  };

  const processAnswer = async (answer: string) => {
    const trimmed = answer.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { id: nowId(), role: "user", text: trimmed }]);
    setValue("");

    setTyping(true);
    await new Promise((r) => window.setTimeout(r, 450));
    setTyping(false);

    const updatedLead = applyAnswerToLead(step, trimmed, lead);
    setLead(updatedLead);

    const next = nextStep(step);
    setStep(next);

    if (next === "complete" && leadIsComplete(updatedLead)) {
      handleCompletion(updatedLead);
      return;
    }

    pushBotPromptForStep(next);
  };

  const handleQuickReply = (value: string) => {
    void processAnswer(value);
  };

  const viewAll = () => {
    const type = encodeURIComponent(lead.propertyType || "");
    const location = encodeURIComponent(lead.location || "");
    const budget = encodeURIComponent(lead.budget || "");
    navigate(`/properties?type=${type}&location=${location}&budget=${budget}`);
    onClose();
  };

  const whatsappHref = useMemo(() => {
    const number = siteContent.whatsappNumber ?? "";
    return buildWhatsAppHref(number, buildPrefilledWhatsAppMessage(lead));
  }, [lead]);

  const fallbackWhatsAppHref = useMemo(() => {
    const number = siteContent.whatsappNumber ?? "";
    return buildWhatsAppHref(number, "Hi, I need help finding the right property options.");
  }, []);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="chatbot-modal"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className={modalBottomClass}
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
                  <div key={m.id} className="space-y-2">
                    {m.text ? (
                      <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
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
                    ) : null}

                    {m.quickReplies?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {m.quickReplies.map((qr) => (
                          <button
                            key={qr.id}
                            type="button"
                            onClick={() => handleQuickReply(qr.value)}
                            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                          >
                            {qr.label}
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {m.properties?.length ? (
                      <div className="grid gap-3">
                        {m.properties.slice(0, 6).map((p) => (
                          <ChatbotPropertyCard key={p.slug} property={p} />
                        ))}
                      </div>
                    ) : null}

                    {m.ctas?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {m.ctas.map((cta) => {
                          if (cta.type === "viewAll") {
                            return (
                              <button
                                key={cta.type}
                                type="button"
                                onClick={viewAll}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                              >
                                <Search className="h-4 w-4" />
                                {cta.label}
                              </button>
                            );
                          }
                          return (
                            <a
                              key={cta.type}
                              href={whatsappHref || fallbackWhatsAppHref}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                            >
                              {cta.label}
                            </a>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                ))}

                {typing ? (
                  <div className="flex justify-start">
                    <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/85">
                      <span className="inline-flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/70 [animation-delay:-0.2s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/70 [animation-delay:-0.1s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/70" />
                      </span>
                      Typing…
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="border-t border-white/10 p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void processAnswer(value);
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

