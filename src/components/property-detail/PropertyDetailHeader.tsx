import type { ReactNode, RefObject } from "react";
import { Heart, Share2 } from "lucide-react";
import type { Property } from "@/data/properties";

type Props = {
  property: Property;
  listedLabel: string;
  isSaved: boolean;
  onToggleSave: () => void;
  onShare: () => void;
  shareMenuOpen: boolean;
  shareMenu: ReactNode;
  shareMenuRef: RefObject<HTMLDivElement | null>;
};

export function PropertyDetailHeader({
  property,
  listedLabel,
  isSaved,
  onToggleSave,
  onShare,
  shareMenuOpen,
  shareMenu,
  shareMenuRef,
}: Props) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/80 pb-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <p className="font-heading text-3xl font-semibold tracking-[-0.03em] text-[hsl(var(--accent))] md:text-4xl">
          {property.price}
        </p>
        <h1 className="mt-2 font-heading text-2xl font-semibold tracking-[-0.02em] text-foreground md:text-3xl">{property.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{property.address}</p>
        <p className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Added {listedLabel}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onToggleSave}
          className={`rounded-full border p-2.5 transition-colors ${
            isSaved ? "border-[hsl(var(--accent))]/40 bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]" : "border-border text-muted-foreground hover:bg-muted"
          }`}
          aria-label={isSaved ? "Remove from saved" : "Save property"}
          aria-pressed={isSaved}
        >
          <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
        </button>
        <div ref={shareMenuRef} className="relative">
          <button
            type="button"
            onClick={onShare}
            className={`rounded-full border p-2.5 transition-colors ${
              shareMenuOpen ? "border-[hsl(var(--accent))]/40 bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]" : "border-border text-muted-foreground hover:bg-muted"
            }`}
            aria-label="Share"
            aria-expanded={shareMenuOpen}
          >
            <Share2 className="h-5 w-5" />
          </button>
          {shareMenu}
        </div>
      </div>
    </div>
  );
}
