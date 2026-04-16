import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BotMessageSquare } from "lucide-react";
import { GuidedFinder } from "@/components/chatbot/GuidedFinder";
import { WebsiteAssistantModal } from "@/components/chatbot/WebsiteAssistantModal";
import { siteContent } from "@/content/site";
import { useEnquiryModal } from "@/context/EnquiryModalContext";

function normalizeWhatsAppNumber(value: string): string {
  return value.replace(/\(0\)/g, "").replace(/\D/g, "");
}

function buildWhatsAppHref(number: string, message: string): string {
  const normalized = normalizeWhatsAppNumber(number);
  const text = encodeURIComponent(message);
  return `https://wa.me/${normalized}?text=${text}`;
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M20.52 3.48A11.86 11.86 0 0 0 12.01 0C5.39 0 0 5.39 0 12.01c0 2.12.56 4.19 1.62 6.01L0 24l6.15-1.61a12 12 0 0 0 5.86 1.49h.01c6.62 0 12.01-5.39 12.01-12.01 0-3.21-1.25-6.23-3.51-8.39ZM12.02 21.9h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.65.96.97-3.56-.24-.37a9.88 9.88 0 0 1-1.52-5.33C2.16 6.56 6.58 2.13 12.02 2.13c2.1 0 4.07.82 5.55 2.3a7.8 7.8 0 0 1 2.3 5.55c0 5.44-4.42 9.92-9.85 9.92Zm5.62-7.4c-.31-.16-1.82-.9-2.1-1-.28-.1-.48-.16-.68.16-.2.31-.78 1-.96 1.2-.18.2-.36.23-.67.08-.31-.16-1.31-.48-2.5-1.55-.92-.82-1.55-1.84-1.73-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.2-.31.31-.52.1-.2.05-.39-.03-.55-.08-.16-.68-1.65-.93-2.26-.24-.58-.48-.5-.68-.51h-.58c-.2 0-.52.08-.79.39-.27.31-1.04 1.02-1.04 2.48s1.06 2.87 1.2 3.07c.14.2 2.08 3.18 5.05 4.46.71.31 1.27.49 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.82-.74 2.07-1.46.25-.72.25-1.33.18-1.46-.07-.13-.26-.2-.57-.36Z"
      />
    </svg>
  );
}

export function FloatingActions() {
  const [visible, setVisible] = useState(false);
  const [finderOpen, setFinderOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const { openEnquiry } = useEnquiryModal();

  useEffect(() => {
    const delayMs = 2400;
    const t = window.setTimeout(() => setVisible(true), delayMs);
    return () => window.clearTimeout(t);
  }, []);

  const whatsappHref = useMemo(() => {
    const number = siteContent.whatsappNumber ?? "";
    return buildWhatsAppHref(
      number,
      "Hi Sav Zaman,\n\nI’m interested in your property deals.\n\nPlease share available options for:\n- Budget:\n- Location:\n- Property type:\n\nThanks.",
    );
  }, []);

  if (!visible) return null;

  return (
    <>
      <GuidedFinder open={finderOpen} onClose={() => setFinderOpen(false)} />
      <WebsiteAssistantModal
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        onOpenFinder={() => setFinderOpen(true)}
      />

      <div
        className="fixed bottom-5 right-5 z-[9999] flex flex-col items-center gap-3"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="group relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_22px_54px_-34px_rgba(0,0,0,0.55)] transition will-change-transform hover:scale-[1.05] focus:outline-none focus:ring-2 focus:ring-white/30 sm:h-14 sm:w-14 fab-pulse"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
        >
          <span
            role="tooltip"
            className="pointer-events-none absolute right-[calc(100%+12px)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-[rgba(8,18,48,0.92)] px-3 py-2 text-xs font-semibold text-white/90 shadow-[0_22px_60px_-30px_rgba(2,6,23,0.85)] backdrop-blur-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:block"
          >
            Chat on WhatsApp
          </span>
          <WhatsAppIcon />
        </a>

        <button
          type="button"
          onClick={() => openEnquiry({ defaultEnquiryType: "General Enquiry" })}
          className="group relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--accent))] text-white shadow-[0_22px_54px_-34px_rgba(0,0,0,0.55)] transition will-change-transform hover:scale-[1.05] focus:outline-none focus:ring-2 focus:ring-white/30 sm:h-14 sm:w-14 fab-pulse"
          aria-label="Quick enquiry"
          title="Quick enquiry"
        >
          <span
            role="tooltip"
            className="pointer-events-none absolute right-[calc(100%+12px)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-[rgba(8,18,48,0.92)] px-3 py-2 text-xs font-semibold text-white/90 shadow-[0_22px_60px_-30px_rgba(2,6,23,0.85)] backdrop-blur-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:block"
          >
            Quick enquiry
          </span>
          <ArrowUpRight className="h-6 w-6" aria-hidden />
        </button>

        <button
          type="button"
          onClick={() => setAssistantOpen((v) => !v)}
          className="group relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-[0_22px_54px_-34px_rgba(0,0,0,0.55)] transition will-change-transform hover:scale-[1.05] focus:outline-none focus:ring-2 focus:ring-white/30 sm:h-14 sm:w-14 fab-pulse"
          aria-label="Open guided property finder"
          title="Open guided property finder"
        >
          <span
            role="tooltip"
            className="pointer-events-none absolute right-[calc(100%+12px)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-[rgba(8,18,48,0.92)] px-3 py-2 text-xs font-semibold text-white/90 shadow-[0_22px_60px_-30px_rgba(2,6,23,0.85)] backdrop-blur-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:block"
          >
            Sav Zaman Assistant
          </span>
          <BotMessageSquare className="h-6 w-6" aria-hidden />
        </button>
      </div>
    </>
  );
}

