import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { propertyDetailPath, type Property } from "@/data/properties";

type Props = {
  items: Property[];
};

export function SimilarProperties({ items }: Props) {
  if (!items.length) return null;

  return (
    <section className="rounded-2xl border border-border/70 bg-[#F8FAFC] p-5 md:p-8">
      <h2 className="font-heading text-xl font-semibold md:text-2xl">Similar properties</h2>
      <p className="mt-1 text-sm text-muted-foreground">Same area or category — curated for this listing.</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p, index) => (
          <AnimatedSection key={p.slug} delay={index * 0.05}>
            <Link
              to={propertyDetailPath(p)}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="aspect-[16/11] overflow-hidden bg-muted">
                <img src={p.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="font-heading text-lg font-semibold text-[hsl(var(--accent))]">{p.price}</p>
                <p className="mt-1 line-clamp-2 text-sm font-semibold text-foreground">{p.title}</p>
                <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="line-clamp-1">{p.location}</span>
                </p>
                <div className="mt-auto flex gap-3 pt-3 text-xs text-muted-foreground">
                  {p.beds ? <span>{p.beds}</span> : null}
                  {p.baths ? <span>{p.baths} baths</span> : null}
                </div>
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
