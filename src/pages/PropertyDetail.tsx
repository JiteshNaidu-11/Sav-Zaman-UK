import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, MessageCircle, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { AgentContactCard } from "@/components/property-detail/AgentContactCard";
import { MortgageCalculator } from "@/components/property-detail/MortgageCalculator";
import { PropertyDescription } from "@/components/property-detail/PropertyDescription";
import { PropertyDetailHeader } from "@/components/property-detail/PropertyDetailHeader";
import { PropertyFeatures } from "@/components/property-detail/PropertyFeatures";
import { PropertyGallery } from "@/components/property-detail/PropertyGallery";
import { PropertyKeyInfo } from "@/components/property-detail/PropertyKeyInfo";
import { PropertyMapSection } from "@/components/property-detail/PropertyMapSection";
import { SimilarProperties } from "@/components/property-detail/SimilarProperties";
import CTABanner from "@/components/CTABanner";
import PropertyInquiryDialog, { type PropertyInquiryFormState } from "@/components/PropertyInquiryDialog";
import { siteContent } from "@/content/site";
import { useEnquiryModal } from "@/context/EnquiryModalContext";
import { usePropertyStore } from "@/context/PropertyStoreContext";
import { propertyDetailPath } from "@/data/properties";
import { isPropertySlugSaved, toggleSavedPropertySlug } from "@/lib/searchSavedStorage";
import { notifyInquiryByEmail } from "@/lib/inquiryNotifications";
import { saveLocalInquiry } from "@/lib/inquiries";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const defaultPropertyVideoEmbed = "https://www.youtube.com/embed/ysz5S6PUM-U?rel=0";

function toYouTubeWatchUrl(value: string): string {
  try {
    const parsed = new URL(value);
    const pathParts = parsed.pathname.split("/").filter(Boolean);

    if (parsed.hostname.includes("youtube.com") && pathParts[0] === "embed" && pathParts[1]) {
      return `https://www.youtube.com/watch?v=${pathParts[1]}`;
    }

    return value;
  } catch {
    return value;
  }
}

function normalizeWhatsAppNumber(value: string): string {
  return value.replace(/\(0\)/g, "").replace(/\D/g, "");
}

function buildWhatsAppUrl(number: string | undefined, message: string): string | null {
  if (!number) return null;
  const normalized = normalizeWhatsAppNumber(number);
  if (!normalized) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

function formatListedAt(iso?: string): string {
  if (!iso) return "Recently";
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "Recently";
  }
}

const emptyInquiryForm: PropertyInquiryFormState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  message: "",
};

const PropertyDetail = () => {
  const { slug: routeParam = "" } = useParams<{ slug: string }>();
  const { openEnquiry } = useEnquiryModal();
  const { getPropertyBySlug, getPropertyById, getSimilarProperties, loading } = usePropertyStore();
  const numericId = /^\d+$/.test(routeParam) ? Number(routeParam) : NaN;
  const property = Number.isFinite(numericId) ? getPropertyById(numericId) : getPropertyBySlug(routeParam);

  useDocumentTitle(
    property ? `Sav Zaman — ${property.title}` : loading ? "Sav Zaman — Property" : "Sav Zaman — Properties",
  );

  const [callbackDialogOpen, setCallbackDialogOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState<PropertyInquiryFormState>({ ...emptyInquiryForm });
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!property?.slug) return;
    setIsSaved(isPropertySlugSaved(property.slug));
  }, [property?.slug]);

  useEffect(() => {
    if (!isShareOpen) return;
    const handleOutside = (event: MouseEvent) => {
      if (!shareMenuRef.current) return;
      if (!shareMenuRef.current.contains(event.target as Node)) {
        setIsShareOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsShareOpen(false);
      }
    };
    window.addEventListener("mousedown", handleOutside);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isShareOpen]);

  if (loading && !property) {
    return (
      <main>
        <section className="container-custom py-20">
          <p className="text-lg text-muted-foreground">Loading property details...</p>
        </section>
      </main>
    );
  }

  if (!property) {
    return <Navigate to="/properties" replace />;
  }

  const gallery = property.gallery?.length ? property.gallery : [property.image];
  const videoWatchUrl = toYouTubeWatchUrl(property.videoEmbedUrl ?? defaultPropertyVideoEmbed);
  const similar = getSimilarProperties(property, 4);
  const path = propertyDetailPath(property);
  const detailUrl =
    typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
  const whatsappMessage = `Hi, I am interested in this property and want to buy it.\n\nProperty: ${property.title}\nLocation: ${property.location}\nPrice: ${property.price}\nLink: ${detailUrl}`;
  const whatsappBuyNowUrl =
    buildWhatsAppUrl(siteContent.whatsappNumber ?? siteContent.phone, whatsappMessage) ?? "/contact";
  const shareText = `${property.title} - ${property.location}`;
  const shareUrl = detailUrl;

  const handleShareClick = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: property.title, text: shareText, url: shareUrl });
        return;
      } catch {
        // fall through to menu
      }
    }
    setIsShareOpen((prev) => !prev);
  };

  const handleCopyLink = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard.");
      setIsShareOpen(false);
      return;
    }
    toast.error("Copy not supported in this browser.");
  };

  const toggleSave = () => {
    if (!property.slug) return;
    setIsSaved(toggleSavedPropertySlug(property.slug));
  };

  const openCallbackDialog = () => {
    setCallbackDialogOpen(true);
    setInquiryForm((current) => ({
      ...current,
      message: current.message || `Please arrange a callback regarding ${property.title}.`,
    }));
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setCallbackDialogOpen(false);
      setInquiryForm({ ...emptyInquiryForm });
    }
  };

  const handleInquirySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!callbackDialogOpen) {
      return;
    }

    if (
      !inquiryForm.name.trim() ||
      !inquiryForm.email.trim() ||
      !inquiryForm.phone.trim() ||
      !inquiryForm.address.trim() ||
      !inquiryForm.message.trim()
    ) {
      toast.error("Fill in name, email, phone, address, and message.");
      return;
    }

    const requestLabel = "Callback request";
    const composedMessage = `${requestLabel}\n\nCustomer address: ${inquiryForm.address.trim()}\n\nMessage: ${inquiryForm.message.trim()}`;

    setIsSubmittingInquiry(true);

    try {
      if (supabaseConfigured && supabase) {
        const { error } = await supabase.from("lead_inquiries").insert({
          inquiry_type: "property_call_request",
          property_slug: property.slug,
          property_title: property.title,
          name: inquiryForm.name.trim(),
          email: inquiryForm.email.trim(),
          phone: inquiryForm.phone.trim(),
          subject: `${requestLabel} for ${property.title}`,
          message: composedMessage,
          preferred_date: null,
          preferred_time: null,
        });

        if (error) throw error;

        void notifyInquiryByEmail({
          inquiryType: "property_call_request",
          propertyTitle: property.title,
          name: inquiryForm.name.trim(),
          email: inquiryForm.email.trim(),
          phone: inquiryForm.phone.trim(),
          subject: `${requestLabel} for ${property.title}`,
          message: composedMessage,
          preferredDate: null,
          preferredTime: null,
        });
      } else {
        saveLocalInquiry({
          inquiry_type: "property_call_request",
          property_slug: property.slug,
          property_title: property.title,
          name: inquiryForm.name.trim(),
          email: inquiryForm.email.trim(),
          phone: inquiryForm.phone.trim(),
          subject: `${requestLabel} for ${property.title}`,
          message: composedMessage,
          preferred_date: null,
          preferred_time: null,
        });
      }

      toast.success("Callback request sent successfully.");
      setCallbackDialogOpen(false);
      setInquiryForm({ ...emptyInquiryForm });
    } catch (error) {
      if (import.meta.env.DEV) console.error(error);
      toast.error("Could not send the enquiry right now.");
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  const shareMenu = isShareOpen ? (
    <div className="absolute right-0 z-20 mt-3 w-56 rounded-2xl border border-border/70 bg-white p-3 shadow-[0_22px_50px_-32px_rgba(15,23,42,0.35)]">
      <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Share</p>
      <div className="grid gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
        >
          WhatsApp
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
        >
          Facebook
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
        >
          X (Twitter)
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
        >
          LinkedIn
        </a>
        <a
          href={`mailto:?subject=${encodeURIComponent(property.title)}&body=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
        >
          Email
        </a>
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
        >
          Copy link
        </button>
      </div>
    </div>
  ) : null;

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border/80 bg-card/50">
        <div className="container-custom py-5">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-[hsl(var(--accent))]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to properties
          </Link>
        </div>
      </div>

      <div className="container-custom py-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_min(360px,100%)] lg:items-start">
          <div className="min-w-0 space-y-8">
            <PropertyGallery title={property.title} images={gallery} />

            <PropertyDetailHeader
              property={property}
              listedLabel={formatListedAt(property.listedAt)}
              isSaved={isSaved}
              onToggleSave={toggleSave}
              onShare={handleShareClick}
              shareMenuOpen={isShareOpen}
              shareMenu={shareMenu}
              shareMenuRef={shareMenuRef}
            />

            <PropertyKeyInfo property={property} />
            <PropertyDescription overview={property.overview} />
            <PropertyFeatures property={property} />

            {property.videoEmbedUrl ? (
              <a
                href={videoWatchUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-gradient-to-r from-[#0B1A2F] to-[#132f6b] p-5 text-white shadow-md transition hover:brightness-110"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                    <PlayCircle className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Virtual tour</p>
                    <p className="font-heading text-lg font-semibold">Open presentation video</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-white/80" />
              </a>
            ) : null}

            <PropertyMapSection property={property} />
            <MortgageCalculator property={property} />
            <SimilarProperties items={similar} />
          </div>

          <aside className="min-w-0 space-y-4 lg:sticky lg:top-28 lg:self-start">
            <AgentContactCard
              onRequestDetails={() =>
                openEnquiry({
                  title: property.title,
                  location: property.location,
                  price: property.price,
                  slug: property.slug ?? null,
                  defaultEnquiryType: "Buying a Property",
                })
              }
              onRequestCallback={openCallbackDialog}
              whatsappHref={whatsappBuyNowUrl}
            />
            <a
              href={whatsappBuyNowUrl}
              target={whatsappBuyNowUrl.startsWith("http") ? "_blank" : undefined}
              rel={whatsappBuyNowUrl.startsWith("http") ? "noreferrer" : undefined}
              className="btn-primary flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold shadow-lg"
            >
              Buy now
              <MessageCircle className="h-4 w-4" />
            </a>
          </aside>
        </div>
      </div>

      <CTABanner />

      <PropertyInquiryDialog
        open={callbackDialogOpen}
        onOpenChange={handleDialogChange}
        mode="call"
        property={{
          title: property.title,
          location: property.location,
          price: property.price,
          category: property.category,
          area: property.area,
          status: property.status,
          image: gallery[0]!,
        }}
        values={inquiryForm}
        onChange={(field, value) => setInquiryForm((current) => ({ ...current, [field]: value }))}
        onSubmit={handleInquirySubmit}
        isSubmitting={isSubmittingInquiry}
      />
    </main>
  );
};

export default PropertyDetail;
