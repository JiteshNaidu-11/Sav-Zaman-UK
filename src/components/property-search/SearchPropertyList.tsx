import { AnimatePresence, motion } from "framer-motion";
import type { SearchCatalogProperty } from "@/data/searchCatalogTypes";
import { SearchPropertyCard } from "./SearchPropertyCard";

type Props = {
  properties: SearchCatalogProperty[];
  highlightedId: number | null;
  onHover: (id: number | null) => void;
  loading?: boolean;
  /** When false, list spans full width (map hidden). */
  withMap?: boolean;
};

export function SearchPropertyList({ properties, highlightedId, onHover, loading, withMap = true }: Props) {
  const listColClass = withMap ? "lg:w-[70%] lg:max-w-none" : "w-full";

  if (loading) {
    return (
      <div className={`grid grid-cols-1 gap-5 ${listColClass}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-80 animate-pulse rounded-xl bg-slate-200/80" />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/80 p-10 text-center ${listColClass}`}
      >
        <p className="text-lg font-semibold text-slate-800">No properties found</p>
        <p className="mt-2 max-w-md text-sm text-slate-600">
          Adjust your filters, widen the radius, or try a different location. You can also switch listing type to Rent or
          Sold.
        </p>
      </motion.div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-5 ${listColClass}`}>
      <AnimatePresence mode="popLayout">
        {properties.map((p) => (
          <SearchPropertyCard key={p.id} property={p} isHighlighted={highlightedId === p.id} onHover={onHover} />
        ))}
      </AnimatePresence>
    </div>
  );
}
