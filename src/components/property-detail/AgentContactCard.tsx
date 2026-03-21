import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";
import { siteContent } from "@/content/site";

type Props = {
  onRequestDetails: () => void;
  onRequestCallback: () => void;
  whatsappHref: string;
};

export function AgentContactCard({ onRequestDetails, onRequestCallback, whatsappHref }: Props) {
  const tel = siteContent.phone.replace(/\s+/g, "");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-[linear-gradient(180deg,rgba(5,16,44,0.98),rgba(19,53,121,0.94))] p-5 text-white shadow-[0_24px_60px_-32px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-6">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/10 p-1.5">
            <img src="/logo.image.transparent.png" alt="" className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/55">Listing agent</p>
            <p className="font-heading text-lg font-semibold">{siteContent.name}</p>
          </div>
        </div>

        <a href={`tel:${tel}`} className="mt-4 flex items-center gap-2 text-sm text-white/85 transition hover:text-white">
          <Phone className="h-4 w-4 shrink-0 text-teal-300" />
          {siteContent.phone}
        </a>
        <a
          href={`mailto:${siteContent.email}`}
          className="mt-2 flex items-center gap-2 text-sm text-white/85 transition hover:text-white"
        >
          <Mail className="h-4 w-4 shrink-0 text-teal-300" />
          {siteContent.email}
        </a>

        <div className="mt-5 grid gap-2">
          <a
            href={`tel:${tel}`}
            className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold"
          >
            <Phone className="h-4 w-4" />
            Call agent
          </a>
          <button
            type="button"
            onClick={onRequestDetails}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Request Details
            <ArrowRight className="h-4 w-4" />
          </button>
          <a
            href={whatsappHref}
            target={whatsappHref.startsWith("http") ? "_blank" : undefined}
            rel={whatsappHref.startsWith("http") ? "noreferrer" : undefined}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <MessageCircle className="h-4 w-4" />
            Enquire
          </a>
          <button
            type="button"
            onClick={onRequestCallback}
            className="text-sm font-medium text-white/70 underline-offset-4 transition hover:text-white hover:underline"
          >
            Arrange a private callback
          </button>
        </div>
      </div>
    </div>
  );
}
