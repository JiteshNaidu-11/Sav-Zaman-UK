import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEnquiryModal } from "@/context/EnquiryModalContext";

const WhatsAppBubble = () => {
  const location = useLocation();
  const { openEnquiry } = useEnquiryModal();

  if (location.pathname === "/contact") {
    return null;
  }

  return (
    <motion.button
      type="button"
      title="Enquire about a property"
      aria-label="Enquire about a property"
      onClick={() => openEnquiry({ defaultEnquiryType: "General Enquiry" })}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="group fixed bottom-7 right-7 z-50 inline-flex items-center justify-center sm:bottom-8 sm:right-8"
    >
      <span
        className="pointer-events-none absolute bottom-[calc(100%+12px)] right-0 z-10 hidden rounded-xl border border-white/15 bg-[rgba(8,18,48,0.96)] px-3.5 py-2 text-xs font-semibold tracking-wide text-white/90 opacity-0 shadow-[0_20px_50px_-20px_rgba(2,6,23,0.85)] backdrop-blur-xl transition-opacity duration-300 group-hover:opacity-100 md:block"
        role="tooltip"
      >
        Quick Action
      </span>

      <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
        <span
          className="pointer-events-none absolute inset-0 rounded-full animate-pulse-ring opacity-40"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute -inset-3 rounded-full bg-blue-500/30 blur-xl opacity-80 animate-pulse"
          aria-hidden
        />
        <span className="contact-orb relative z-[1] flex h-full w-full items-center justify-center rounded-full text-white shadow-[0_20px_50px_-18px_rgba(59,130,246,0.45),0_0_32px_-8px_rgba(99,102,241,0.4)] transition-shadow duration-300 group-hover:shadow-[0_24px_56px_-14px_rgba(79,70,229,0.55),0_0_40px_-6px_rgba(59,130,246,0.45)]">
          <span className="absolute inset-0 rounded-full border border-white/18" />
          <ArrowUpRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </span>
    </motion.button>
  );
};

export default WhatsAppBubble;
