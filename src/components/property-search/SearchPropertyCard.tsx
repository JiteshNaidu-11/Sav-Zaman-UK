import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MapPin, Phone } from "lucide-react";
import type { SearchCatalogProperty } from "@/data/searchCatalogTypes";
import { isPropertySaved, toggleSavedPropertyId } from "@/lib/searchSavedStorage";

type Props = {
  property: SearchCatalogProperty;
  isHighlighted: boolean;
  onHover: (id: number | null) => void;
};

export function SearchPropertyCard({ property, isHighlighted, onHover }: Props) {
  const [saved, setSaved] = useState(() => isPropertySaved(property.id));

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleSavedPropertyId(property.id);
    setSaved(next);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      onMouseEnter={() => onHover(property.id)}
      onMouseLeave={() => onHover(null)}
      className={`group relative overflow-hidden rounded-xl border bg-white shadow-md transition-shadow ${
        isHighlighted ? "border-blue-500 ring-2 ring-blue-400/40" : "border-slate-200 hover:shadow-xl"
      }`}
    >
      <Link to={`/listings/${property.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={property.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {property.featured ? (
            <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">
              Featured
            </span>
          ) : null}
          <button
            type="button"
            onClick={toggleSave}
            aria-label={saved ? "Remove from saved" : "Save property"}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md backdrop-blur transition hover:scale-105"
          >
            <Heart className={`h-5 w-5 ${saved ? "fill-red-500 text-red-500" : ""}`} />
          </button>
          <span
            className={`absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white ${
              property.listingType === "Rent"
                ? "bg-teal-600"
                : property.listingType === "Sold"
                  ? "bg-slate-600"
                  : "bg-blue-600"
            }`}
          >
            {property.listingType}
          </span>
        </div>

        <div className="p-4">
          <p className="text-xl font-semibold tracking-tight text-slate-900">{property.priceDisplay}</p>
          <h2 className="mt-1 text-base font-semibold text-slate-800">{property.title}</h2>
          <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-600">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            {property.location}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="rounded-lg bg-slate-100 px-2 py-1 font-medium text-slate-700">{property.propertyType}</span>
            <span className="rounded-lg bg-slate-100 px-2 py-1 font-medium text-slate-700">{property.sector}</span>
            <span className="rounded-lg bg-slate-100 px-2 py-1">
              {property.bedrooms === 0 ? "Studio / N/A beds" : `${property.bedrooms} beds`}
            </span>
            <span className="rounded-lg bg-slate-100 px-2 py-1">{property.area}</span>
          </div>
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-400">{property.agent}</p>
        </div>
      </Link>

      <div className="flex gap-2 border-t border-slate-100 px-4 py-3">
        <Link
          to={`/listings/${property.slug}`}
          className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 py-2.5 text-center text-sm font-semibold text-white transition hover:brightness-110"
        >
          View details
        </Link>
        <Link
          to={`/contact?ref=${encodeURIComponent(property.slug)}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
        >
          <Phone className="h-4 w-4" />
          Contact
        </Link>
      </div>
    </motion.article>
  );
}
