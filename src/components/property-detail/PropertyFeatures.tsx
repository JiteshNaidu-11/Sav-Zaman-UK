import { CheckCircle2 } from "lucide-react";
import type { Property } from "@/data/properties";

type Props = {
  property: Property;
};

export function PropertyFeatures({ property }: Props) {
  const items = property.features?.length ? property.features : property.amenities;

  return (
    <section className="rounded-2xl border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(239,246,255,0.88))] p-5 shadow-md md:p-6">
      <h2 className="font-heading text-lg font-semibold md:text-xl">Key features</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-xl border border-border/60 bg-white/80 px-4 py-3 text-sm text-muted-foreground shadow-sm"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
