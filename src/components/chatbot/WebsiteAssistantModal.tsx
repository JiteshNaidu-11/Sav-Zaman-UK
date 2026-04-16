import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, BotMessageSquare, ExternalLink, MessageCircle, Search, X } from "lucide-react";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { siteContent } from "@/content/site";

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenFinder: () => void;
};

function normalizeWhatsAppNumber(value: string): string {
  return value.replace(/\(0\)/g, "").replace(/\D/g, "");
}

function buildWhatsAppHref(number: string, message: string): string {
  const normalized = normalizeWhatsAppNumber(number);
  const text = encodeURIComponent(message);
  return `https://wa.me/${normalized}?text=${text}`;
}

function ActionCard(props: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  href?: string;
  rightLabel?: string;
}) {
  const Icon = props.icon;
  const content = (
    <div className="group flex w-full items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20">
      <div className="flex min-w-0 items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/90">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{props.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-white/65">{props.description}</p>
        </div>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-xs font-semibold text-white/80">
        {props.rightLabel ?? "Open"}
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </div>
  );

  if (props.href) {
    return (
      <a href={props.href} target={props.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={props.onClick} className="w-full text-left">
      {content}
    </button>
  );
}

export function WebsiteAssistantModal({ open, onClose, onOpenFinder }: Props) {
  const navigate = useNavigate();

  const modalBottomClass =
    "fixed bottom-[188px] left-5 right-5 z-[9999] w-auto sm:bottom-[212px] sm:left-auto sm:right-5 sm:w-[380px]";

  const whatsappHref = useMemo(() => {
    return buildWhatsAppHref(
      siteContent.whatsappNumber ?? "",
      "Hi Sav Zaman, I have a question about your properties. Can you help?",
    );
  }, []);

  const body = (
    <div className="space-y-3">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-semibold text-white">Quick help</p>
        <p className="mt-1 text-sm leading-relaxed text-white/65">
          I can guide you around the website, help you browse listings, and connect you to WhatsApp for anything specific.
        </p>
      </div>

      <div className="grid gap-3">
        <ActionCard
          icon={Search}
          title="Browse all properties"
          description="Open the full listings page with filters and map view."
          onClick={() => {
            navigate("/properties");
            onClose();
          }}
          rightLabel="Browse"
        />
        <ActionCard
          title="Guided Property Finder"
          description="Answer 4 quick steps and see best matches instantly."
          icon={BotMessageSquare}
          onClick={() => {
            onClose();
            onOpenFinder();
          }}
          rightLabel="Start"
        />
        <ActionCard
          icon={MessageCircle}
          title="Talk on WhatsApp"
          description="Get direct help from Sav for the fastest response."
          href={whatsappHref}
          rightLabel="Chat"
        />
        <ActionCard
          icon={ExternalLink}
          title="Contact page"
          description="Email, phone, WhatsApp and enquiry form."
          onClick={() => {
            navigate("/contact");
            onClose();
          }}
          rightLabel="Open"
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">What we do</p>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          Sav Zaman helps with pre-auction deals, direct-to-vendor opportunities, and below market value properties.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            to="/services"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/85 transition hover:bg-white/10"
          >
            View services
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            to="/about"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/85 transition hover:bg-white/10"
          >
            About Sav
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="website-assistant"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className={modalBottomClass}
          role="dialog"
          aria-modal="false"
          aria-label="Sav Zaman Assistant"
        >
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[rgba(8,18,48,0.92)] shadow-[0_32px_80px_-42px_rgba(2,6,23,0.9)] backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
                    <BotMessageSquare className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">Sav Zaman Assistant</p>
                    <p className="truncate text-xs text-white/65">Website guidance + fast actions</p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/85 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/25"
                aria-label="Close assistant"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[520px] overflow-y-auto px-4 py-4">
              {body}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

