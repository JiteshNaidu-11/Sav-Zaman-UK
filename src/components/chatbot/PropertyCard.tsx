import { Link } from "react-router-dom";
import type { Property } from "@/data/properties";
import { propertyDetailPath } from "@/data/properties";

type Props = {
  property: Property;
};

export function ChatbotPropertyCard({ property }: Props) {
  const href = propertyDetailPath(property);
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="flex gap-3 p-3">
        <img
          src={property.image}
          alt={property.title}
          className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-white/10"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-semibold text-white">{property.title}</p>
          <p className="mt-1 truncate text-xs text-white/70">{property.location}</p>
          <p className="mt-2 text-sm font-semibold text-white">{property.price}</p>
        </div>
      </div>
      <div className="border-t border-white/10 p-3">
        <Link
          to={href}
          className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

