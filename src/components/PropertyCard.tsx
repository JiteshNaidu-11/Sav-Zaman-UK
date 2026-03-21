import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Bath,
  BedDouble,
  Building2,
  Heart,
  Images,
  MapPin,
  Maximize,
  MessageCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEnquiryModal } from "@/context/EnquiryModalContext";
import { isPropertySlugSaved, toggleSavedPropertySlug } from "@/lib/searchSavedStorage";

function resolvePropertySlugForEnquiry(detailUrl: string | null | undefined, propertySlug: string | undefined): string | null {
  if (propertySlug?.trim()) return propertySlug.trim();
  if (!detailUrl || detailUrl === "#") return null;
  const m = detailUrl.match(/\/properties\/(.+)$/);
  return m ? decodeURIComponent(m[1]) : null;
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

export interface PropertyCardProps {
  image: string;
  title: string;
  location: string;
  price: string;
  type: string;
  area: string;
  category: string;
  status: string;
  overview: string;
  beds?: string;
  baths?: string;
  slug?: string;
  enableWhatsAppCtas?: boolean;
  whatsappNumber?: string;
  showSaveHeart?: boolean;
  propertySlug?: string;
  /** Default `horizontal` for browse listings; use `vertical` for compact grids (e.g. related properties). */
  layout?: "horizontal" | "vertical";
  featured?: boolean;
  /** Gallery image count for indicator badge. */
  imageCount?: number;
  agentLabel?: string;
}

const PropertyCard = ({
  image,
  title,
  location,
  price,
  type,
  area,
  category,
  status,
  overview,
  beds,
  baths,
  slug,
  enableWhatsAppCtas = false,
  whatsappNumber,
  showSaveHeart = false,
  propertySlug,
  layout = "horizontal",
  featured = false,
  imageCount,
  agentLabel = "Sav Zaman UK",
}: PropertyCardProps) => {
  const navigate = useNavigate();
  const { openEnquiry } = useEnquiryModal();
  const slugKey = propertySlug ?? (slug?.startsWith("/properties/") ? slug.replace(/^\/properties\//, "") : slug) ?? "";
  const [saved, setSaved] = useState(() => (slugKey ? isPropertySlugSaved(slugKey) : false));

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!slugKey) return;
    setSaved(toggleSavedPropertySlug(slugKey));
  };
  const detailUrl = slug && slug !== "#" ? slug : null;
  const summary = overview.length > 126 ? `${overview.slice(0, 123).trimEnd()}...` : overview;
  const isWholeCardClickable = Boolean(detailUrl && enableWhatsAppCtas && layout === "vertical");

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const absoluteDetailUrl = detailUrl ? (origin ? `${origin}${detailUrl}` : detailUrl) : "";
  const propertyLines = [
    `Property: ${title}`,
    `Location: ${location}`,
    `Price: ${price}`,
    absoluteDetailUrl ? `Link: ${absoluteDetailUrl}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  const buyNowMessage = `Hi, I am interested in this property and want to buy it.\n\n${propertyLines}`;
  const buyNowUrl = buildWhatsAppUrl(whatsappNumber, buyNowMessage) ?? "/contact";

  const openPropertyEnquiry = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    openEnquiry({
      title,
      location,
      price,
      slug: resolvePropertySlugForEnquiry(detailUrl, propertySlug),
      defaultEnquiryType: "Buying a Property",
    });
  };

  const specs = [
    { label: "Area", value: area, icon: Maximize },
    { label: "Type", value: type, icon: Building2 },
    { label: "Beds", value: beds ?? "On request", icon: BedDouble },
    { label: "Baths", value: baths ?? "On request", icon: Bath },
  ] as const;

  const handleOpenDetails = () => {
    if (!detailUrl) return;
    navigate(detailUrl);
  };

  const btnPrimary =
    "btn-primary inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-semibold leading-none transition hover:brightness-105";
  const btnOutline =
    "inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[hsl(var(--line))] bg-white px-4 text-sm font-semibold leading-none text-foreground transition-colors hover:bg-[hsl(var(--secondary))]";
  const btnPrimaryHorizontal =
    "btn-primary inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold leading-none transition hover:brightness-105";
  const btnOutlineHorizontal =
    "inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[hsl(var(--line))] bg-white px-4 py-2 text-sm font-semibold leading-none text-foreground transition-colors hover:bg-[hsl(var(--secondary))]";

  if (layout === "horizontal") {
    const photoCount = imageCount ?? 1;

    return (
      <motion.article
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="group flex flex-col overflow-hidden rounded-2xl border border-[hsl(var(--line))] bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:min-h-[260px] md:max-h-[280px] md:flex-row md:items-stretch"
      >
        {/* Image — 40% desktop */}
        <div className="relative w-full shrink-0 md:min-h-0 md:w-2/5 md:bg-[hsl(var(--secondary))]">
          <div className="relative h-[180px] overflow-hidden bg-[hsl(var(--secondary))] sm:h-[200px] md:h-[260px] md:min-h-[260px] md:max-h-[260px]">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/20 md:bg-gradient-to-r md:from-black/35 md:via-transparent md:to-transparent" />
            <div className="absolute left-3 right-3 top-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {featured ? (
                  <span className="rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                    Featured
                  </span>
                ) : null}
                <span className="rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                  {category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {showSaveHeart && slugKey ? (
                  <button
                    type="button"
                    onClick={toggleSave}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/55"
                    aria-label={saved ? "Remove from saved" : "Save property"}
                  >
                    <Heart className={`h-4 w-4 ${saved ? "fill-teal-400 text-teal-400" : ""}`} />
                  </button>
                ) : null}
                <span className="rounded-full border border-[hsl(var(--accent)/0.35)] bg-[hsl(var(--accent)/0.88)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white shadow-sm">
                  {status}
                </span>
              </div>
            </div>
            {photoCount > 1 ? (
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                <Images className="h-3.5 w-3.5 opacity-90" aria-hidden />
                {photoCount}
              </span>
            ) : null}
          </div>
        </div>

        {/* Details — 40% */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col border-t border-[hsl(var(--line))] p-4 md:w-2/5 md:border-l md:border-t-0 md:overflow-y-auto">
          <h3 className="font-heading text-lg font-semibold leading-snug tracking-[-0.02em] text-foreground transition-colors duration-300 group-hover:text-[hsl(var(--accent))]">
            {title}
          </h3>
          <div className="mt-1.5 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />
            <span className="line-clamp-2">{location}</span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{summary}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {specs.map((item) => (
              <div
                key={item.label}
                className="rounded-[18px] border border-[hsl(var(--line))] bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.92))] px-3 py-2"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <item.icon className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--accent))]" />
                  {item.label}
                </div>
                <p className="mt-0.5 text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Price & actions — 20% */}
        <div className="flex w-full min-h-0 flex-col justify-center gap-2 overflow-y-auto border-t border-[hsl(var(--line))] bg-[linear-gradient(180deg,rgba(248,250,252,0.5),rgba(255,255,255,0.95))] p-4 md:w-1/5 md:border-l md:border-t-0">
          <p className="font-heading text-xl font-semibold tracking-[-0.03em] text-foreground">
            {price}
          </p>
          {enableWhatsAppCtas ? (
            <>
              <a
                href={buyNowUrl}
                target={buyNowUrl.startsWith("http") ? "_blank" : undefined}
                rel={buyNowUrl.startsWith("http") ? "noreferrer" : undefined}
                className={btnPrimaryHorizontal}
                aria-label={`Buy now via WhatsApp for ${title}`}
              >
                Buy now
                <ArrowUpRight className="h-4 w-4 shrink-0" />
              </a>
              <button
                type="button"
                onClick={openPropertyEnquiry}
                className={btnOutlineHorizontal}
                aria-label={`Enquire about ${title}`}
              >
                Enquire
                <MessageCircle className="h-4 w-4 shrink-0" />
              </button>
            </>
          ) : null}
          {detailUrl ? (
            <Link
              to={detailUrl}
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[hsl(var(--accent))] transition-colors hover:underline"
            >
              View details
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
          <p className="text-center text-[11px] text-muted-foreground md:text-left">{agentLabel}</p>
        </div>
      </motion.article>
    );
  }

  /* ——— Vertical layout (related properties, legacy grid) ——— */
  const content = (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={isWholeCardClickable ? handleOpenDetails : undefined}
      onKeyDown={
        isWholeCardClickable
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleOpenDetails();
              }
            }
          : undefined
      }
      role={isWholeCardClickable ? "link" : undefined}
      tabIndex={isWholeCardClickable ? 0 : undefined}
      className={`group flex h-full flex-col overflow-hidden rounded-[30px] border border-[hsl(var(--line))] bg-white shadow-[0_26px_64px_-42px_rgba(15,23,42,0.38)] ${
        isWholeCardClickable ? "cursor-pointer" : ""
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[hsl(var(--secondary))]">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,6,23,0.88)] via-[rgba(2,6,23,0.08)] to-transparent" />
        <div className="absolute left-4 right-4 top-4 flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full border border-white/18 bg-white/12 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-xl">
            {category}
          </span>
          <div className="flex items-center gap-2">
            {showSaveHeart && slugKey ? (
              <button
                type="button"
                onClick={toggleSave}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md transition hover:bg-black/50"
                aria-label={saved ? "Remove from saved" : "Save property"}
              >
                <Heart className={`h-4 w-4 ${saved ? "fill-teal-400 text-teal-400" : ""}`} />
              </button>
            ) : null}
            <span className="rounded-full border border-[hsl(var(--accent)/0.25)] bg-[hsl(var(--accent)/0.82)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
              {status}
            </span>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/64">Sav Zaman UK Listing</p>
          <p className="mt-2 font-heading text-3xl font-semibold tracking-[-0.03em] text-white">{price}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-heading text-[28px] leading-[1.08] tracking-[-0.03em] text-foreground transition-colors duration-300 group-hover:text-[hsl(var(--accent))]">
              {title}
            </h3>
            <div className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>

        <p className="mt-5 text-sm leading-7 text-muted-foreground">{summary}</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {specs.map((item) => (
            <div
              key={item.label}
              className="rounded-[20px] border border-[hsl(var(--line))] bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.92))] px-4 py-3"
            >
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <item.icon className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
                {item.label}
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        {enableWhatsAppCtas ? (
          <div className="mt-6 border-t border-[hsl(var(--line))] pt-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--accent))]">{type}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Premium presentation, details, gallery, and enquiry flow.</p>
                </div>
                {detailUrl ? (
                  <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-[hsl(var(--accent))]">
                    View details
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap items-stretch gap-2">
                <a
                  href={buyNowUrl}
                  target={buyNowUrl.startsWith("http") ? "_blank" : undefined}
                  rel={buyNowUrl.startsWith("http") ? "noreferrer" : undefined}
                  onClick={(event) => event.stopPropagation()}
                  className="btn-primary inline-flex h-11 min-w-[140px] flex-1 items-center justify-center gap-2 whitespace-nowrap px-4 text-sm font-semibold leading-none"
                  aria-label={`Buy now via WhatsApp for ${title}`}
                >
                  Buy now
                  <ArrowUpRight className="h-4 w-4 shrink-0" />
                </a>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    openPropertyEnquiry(event);
                  }}
                  className="inline-flex h-11 min-w-[140px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[hsl(var(--line))] bg-white px-4 text-sm font-semibold leading-none text-foreground transition-colors hover:bg-[hsl(var(--secondary))]"
                  aria-label={`Enquire about ${title}`}
                >
                  Enquire
                  <MessageCircle className="h-4 w-4 shrink-0" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex items-center justify-between gap-4 border-t border-[hsl(var(--line))] pt-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--accent))]">{type}</p>
              <p className="mt-1 text-sm text-muted-foreground">Premium presentation, details, gallery, and enquiry flow.</p>
            </div>
            {detailUrl ? (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--accent))]">
                View details
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            ) : null}
          </div>
        )}
      </div>
    </motion.article>
  );

  if (detailUrl && !enableWhatsAppCtas) {
    return (
      <Link to={detailUrl} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
};

export default PropertyCard;
