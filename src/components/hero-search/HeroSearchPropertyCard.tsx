import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { HeroSearchDemoProperty } from "@/data/heroSearchDemoProperties";
import { toPublicUrl } from "@/lib/toPublicUrl";

type Props = {
  property: HeroSearchDemoProperty;
  index: number;
};

export function HeroSearchPropertyCard({ property, index }: Props) {
  const isRent = property.listingType === "Rent";
  const imgSrc = property.image.startsWith("/projects/") ? toPublicUrl(property.image) : property.image;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={{ scale: 1.03 }}
      className="group overflow-hidden rounded-2xl border border-white/15 bg-white/[0.07] shadow-xl backdrop-blur-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imgSrc}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = toPublicUrl("placeholder.svg");
          }}
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#0B1A2F]/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            {property.type}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm ${
              isRent ? "bg-teal-600/90 text-white" : "bg-blue-600/90 text-white"
            }`}
          >
            {isRent ? "Rent" : "Buy"}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-luxury text-base font-semibold tracking-wide text-white">{property.title}</h3>
        <p className="mt-2 flex items-start gap-1.5 text-sm font-light text-[#D1C9C0]">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-400/90" />
          <span>{property.location}</span>
        </p>
        <p className="mt-3 font-luxury text-lg font-semibold tracking-wide text-white">{property.price}</p>
      </div>
    </motion.article>
  );
}
