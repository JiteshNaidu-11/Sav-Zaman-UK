import { motion } from "framer-motion";
import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import PropertyCard from "@/components/PropertyCard";
import { usePropertyBrowseStickyActive } from "@/context/PropertyBrowseStickyContext";
import { usePropertyBrowse } from "@/context/PropertyBrowseContext";
import { cn } from "@/lib/utils";
import { siteContent } from "@/content/site";
import { propertyDetailPath } from "@/data/properties";
import { HomePropertiesFiltersBar } from "./HomePropertiesFiltersBar";
import { PropertiesLocationFilterNotice } from "./PropertiesLocationFilterNotice";
import { HomePropertiesMapView } from "./HomePropertiesMapView";
import { HomePropertiesSortRow } from "./HomePropertiesSortRow";

type Props = {
  /** Defaults to `properties` (sticky header + in-page anchors). Override only if you embed two browse sections on one page. */
  anchorId?: string;
  className?: string;
  showIntroHeading?: boolean;
};

export function HomePropertiesSection({ anchorId, className = "", showIntroHeading = true }: Props) {
  const { filteredSorted, loading, viewMode } = usePropertyBrowse();
  const browseStickyActive = usePropertyBrowseStickyActive();
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);

  const listClass =
    viewMode === "map" ? "flex w-full flex-1 flex-col gap-4 lg:max-w-[62%]" : "flex w-full flex-col gap-4";

  return (
    <section
      id={anchorId ?? "properties"}
      className={cn(
        "section-padding bg-[#F8FAFC]",
        browseStickyActive ? "scroll-mt-[148px]" : "scroll-mt-24",
        className,
      )}
    >
      <div className="container-custom">
        {showIntroHeading ? (
          <AnimatedSection className="max-w-2xl">
            <span className="section-kicker">Browse listings</span>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl">
              Filter the full catalogue — same tools as the hero search, updated live.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Refine by location, radius, price, category, and listing type. Switch to map view to scan pins alongside
              cards.
            </p>
          </AnimatedSection>
        ) : null}

        <div id="property-filters" className={cn("scroll-mt-32", showIntroHeading ? "mt-10" : "")}>
          <HomePropertiesFiltersBar />
        </div>

        <PropertiesLocationFilterNotice className="mt-6" />

        <HomePropertiesSortRow />

        <div id="property-browse-results">
        {loading && filteredSorted.length === 0 ? (
          <div className="mt-10 flex flex-col gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-52 animate-pulse rounded-2xl bg-slate-200/90 md:h-[280px]" />
            ))}
          </div>
        ) : !loading && filteredSorted.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"
          >
            <p className="text-lg font-semibold text-slate-800">No properties match your filters</p>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              Try clearing the location, widening the radius, or switching between Buy, Rent, and Sold.
            </p>
          </motion.div>
        ) : (
          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-4">
            <div className={listClass}>
              {filteredSorted.map((property, index) => (
                <AnimatedSection key={property.slug} delay={index * 0.03}>
                  <div
                    onMouseEnter={() => setHighlightedSlug(property.slug)}
                    onMouseLeave={() => setHighlightedSlug(null)}
                    className={`rounded-2xl transition duration-200 ${
                      highlightedSlug === property.slug ? "ring-2 ring-blue-500/40 ring-offset-2" : ""
                    }`}
                  >
                    <PropertyCard
                      image={property.image}
                      title={property.title}
                      location={property.location}
                      price={property.price}
                      type={property.type}
                      area={property.area}
                      category={property.category}
                      status={property.status}
                      overview={property.overview}
                      beds={property.beds}
                      baths={property.baths}
                      slug={propertyDetailPath(property)}
                      enableWhatsAppCtas
                      whatsappNumber={siteContent.whatsappNumber}
                      showSaveHeart
                      propertySlug={property.slug}
                      featured={Boolean(property.featured)}
                      imageCount={Array.isArray(property.gallery) ? property.gallery.length : 1}
                    />
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {viewMode === "map" ? (
              <HomePropertiesMapView properties={filteredSorted} highlightedSlug={highlightedSlug} />
            ) : null}
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
