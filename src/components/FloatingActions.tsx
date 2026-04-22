import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import assistantAvatar from "@/assets/animated-brand.png";
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
        // WhatsApp official mark (Simple Icons path), rendered in white on brand green.
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.768.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.762-1.653-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.67-1.612-.916-2.207-.242-.579-.487-.5-.67-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347M20.52 3.449C18.24 1.175 15.219.02 12.05.018 5.495.018.16 5.35.158 11.905c0 2.096.547 4.142 1.588 5.95L0 24l6.297-1.65a11.87 11.87 0 0 0 5.703 1.45h.005c6.554 0 11.89-5.333 11.892-11.888.001-3.17-1.152-6.193-3.377-8.463M12.005 21.79h-.004a9.86 9.86 0 0 1-5.024-1.379l-.36-.214-3.741.98.998-3.65-.235-.374a9.86 9.86 0 0 1-1.51-5.265c.003-5.45 4.439-9.884 9.896-9.884 2.64.001 5.122 1.03 6.988 2.897a9.825 9.825 0 0 1 2.889 6.994c-.003 5.45-4.438 9.884-9.897 9.884"
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
          aria-label="Open sav zaman's assistant"
          title="Open sav zaman's assistant"
        >
          <span
            role="tooltip"
            className="pointer-events-none absolute right-[calc(100%+12px)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-[rgba(8,18,48,0.92)] px-3 py-2 text-xs font-semibold text-white/90 shadow-[0_22px_60px_-30px_rgba(2,6,23,0.85)] backdrop-blur-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:block"
          >
            sav zaman&apos;s assistant
          </span>
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15 ring-2 ring-white/30 sm:h-12 sm:w-12">
            <img
              src={assistantAvatar}
              alt=""
              width={48}
              height={48}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </span>
        </button>
      </div>
    </>
  );
}

