import { AnimatePresence, motion } from "framer-motion";
import type { HeroSearchDemoProperty } from "@/data/heroSearchDemoProperties";
import { HeroSearchPropertyCard } from "./HeroSearchPropertyCard";

type Props = {
  results: HeroSearchDemoProperty[];
  isStale: boolean;
};

export function SearchResults({ results, isStale }: Props) {
  return (
    <div id="hero-search-results" className="mt-14 w-full scroll-mt-24">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-luxury text-xl font-semibold tracking-[0.08em] text-white md:text-2xl">Matching listings</h2>
          <p className="mt-1 text-sm font-light tracking-wide text-[#D1C9C0]/90">
            Live results from the Sav Zaman preview catalogue
          </p>
        </div>
        <p className="text-sm font-medium text-white/80">
          <span className="text-teal-300">{results.length}</span> propert{results.length === 1 ? "y" : "ies"}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isStale ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
                aria-hidden
              />
            ))}
          </motion.div>
        ) : results.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-white/15 bg-white/5 px-6 py-14 text-center backdrop-blur-md"
          >
            <p className="font-luxury text-lg font-medium text-white">No properties found</p>
            <p className="mt-2 text-sm font-light text-[#D1C9C0]">
              Try widening the area, switching sector to &ldquo;Any Sector&rdquo;, or choosing Nationwide.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {results.map((property, index) => (
              <HeroSearchPropertyCard key={property.id} property={property} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
