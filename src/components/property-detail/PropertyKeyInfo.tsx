import type { Property } from "@/data/properties";

type Props = {
  property: Property;
};

export function PropertyKeyInfo({ property }: Props) {
  const typeLabel = property.propertyTypeLabel ?? property.category;
  const beds = property.beds ?? "—";
  const baths = property.baths ? `${property.baths} bath${property.baths === "1" ? "" : "s"}` : "—";
  const size = property.area.replace(/sq\s*ft/i, "sq ft");
  const tenure = property.tenure ?? "On request";

  const cells = [
    { label: "Property type", value: typeLabel },
    { label: "Bedrooms", value: beds },
    { label: "Bathrooms", value: baths },
    { label: "Size", value: size },
    { label: "Tenure", value: tenure },
  ];

  return (
    <div className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur-sm md:p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Key information</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {cells.map((c) => (
          <div key={c.label} className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</p>
            <p className="mt-1.5 text-sm font-semibold text-foreground">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
