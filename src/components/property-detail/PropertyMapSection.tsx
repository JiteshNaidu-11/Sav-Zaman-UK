import { ExternalLink, MapPin, Scan } from "lucide-react";
import type { Property } from "@/data/properties";

type Props = {
  property: Property;
};

export function PropertyMapSection({ property }: Props) {
  const q = encodeURIComponent(property.address || property.location);
  const coords = property.coordinates;
  const embedSrc = coords
    ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`
    : `https://www.google.com/maps?q=${q}&output=embed`;
  const mapsHref = coords
    ? `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`
    : `https://www.google.com/maps/search/${q}`;
  const streetHref = coords
    ? `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${coords.lat},${coords.lng}`
    : `https://www.google.com/maps/search/${q}`;

  return (
    <section className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-sm md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-lg font-semibold md:text-xl">Location</h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />
            {property.address}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={mapsHref}
            target="_blank"
            rel="noreferrer"
            className="btn-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
          >
            <ExternalLink className="h-4 w-4" />
            Open map
          </a>
          <a
            href={streetHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            <Scan className="h-4 w-4" />
            Street View
          </a>
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-border ring-1 ring-black/5">
        <iframe
          src={embedSrc}
          width="100%"
          height={320}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Property location map"
          className="w-full"
        />
      </div>
    </section>
  );
}
