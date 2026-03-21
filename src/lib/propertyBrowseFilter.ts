import type { Property } from "@/data/properties";
import { resolveSearchLocationCenter } from "@/lib/searchCatalogFilter";
import { matchesHeroSector, type HeroSector } from "@/lib/propertyHeroSearch";

export type PropertyBrowseListing = "buy" | "rent" | "sold";

export interface PropertyBrowseFilters {
  location: string;
  /** `this_area` = text match only; `nationwide` = no geo; else miles as string e.g. `3`. */
  radius: string;
  minPrice: string;
  maxPrice: string;
  type: string;
  listing: PropertyBrowseListing;
  /** Commercial sector chips; `Any Sector` skips. */
  sector: HeroSector;
  /** Footer / URL `type=featured` — only `property.featured` rows. */
  featuredOnly: boolean;
  /** Footer / URL `type=new` — only `property.newDevelopment` rows. */
  newDevelopmentOnly: boolean;
}

export type PropertyBrowseSort = "price_desc" | "price_asc" | "newest";

export const defaultPropertyBrowseFilters: PropertyBrowseFilters = {
  location: "",
  radius: "this_area",
  minPrice: "",
  maxPrice: "",
  type: "",
  listing: "buy",
  sector: "Any Sector",
  featuredOnly: false,
  newDevelopmentOnly: false,
};

/** Lowercase `?type=` values from footer deep links. */
export function parseFooterBrowseTypeFromUrl(typeParam: string | null): {
  category: string;
  featuredOnly: boolean;
  newDevelopmentOnly: boolean;
} | null {
  if (!typeParam?.trim()) return null;
  const v = typeParam.trim().toLowerCase();
  switch (v) {
    case "commercial":
      return { category: "Commercial", featuredOnly: false, newDevelopmentOnly: false };
    case "residential":
      return { category: "Residential", featuredOnly: false, newDevelopmentOnly: false };
    case "investment":
      return { category: "Investment", featuredOnly: false, newDevelopmentOnly: false };
    case "new":
      return { category: "", featuredOnly: false, newDevelopmentOnly: true };
    case "featured":
      return { category: "", featuredOnly: true, newDevelopmentOnly: false };
    default:
      return null;
  }
}

/** Non-UK / international hints for `location=Overseas` deep links (footer, etc.). */
const OVERSEAS_TEXT_HINTS = [
  "dubai",
  "uae",
  "abudhabi",
  "abu dhabi",
  "marbella",
  "spain",
  "portugal",
  "algarve",
  "france",
  "monaco",
  "caribbean",
  "miami",
  "usa",
  "u.s.",
  "international",
  "overseas",
  "singapore",
  "hong kong",
  "cyprus",
  "malta",
  "italy",
  "greece",
  "thailand",
  "bali",
  "sydney",
  "new york",
] as const;

export function propertyLooksOverseas(p: Property): boolean {
  const blob = `${p.location} ${p.address} ${p.title}`.toLowerCase();
  return OVERSEAS_TEXT_HINTS.some((hint) => blob.includes(hint));
}

/** Hero + filter bar: labels match Rightmove-style copy */
export const BROWSE_AREA_RADIUS_OPTIONS = [
  { value: "this_area", label: "This area only" },
  { value: "1", label: "+1 mile" },
  { value: "3", label: "+3 miles" },
  { value: "5", label: "+5 miles" },
  { value: "10", label: "+10 miles" },
  { value: "nationwide", label: "Nationwide" },
] as const;

function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** Parsed main numeric from price string (sale total, pcm, or per-annum rent expressed as monthly for filter math). */
export function parsePropertyNumericPrice(property: Property): { pcm: boolean; value: number } | null {
  const lower = property.price.toLowerCase();
  const normalized = property.price.replace(/,/g, "");
  const match = normalized.match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const value = Number(match[1]);
  if (!Number.isFinite(value)) return null;

  const pcm =
    lower.includes("pcm") ||
    lower.includes("per month") ||
    lower.includes("/ month") ||
    /\bmonth\b/.test(lower);

  if (pcm) {
    return { pcm: true, value };
  }

  const perAnnum = /\b(?:pa|p\.a\.|per annum)\b/.test(lower) || lower.includes("per year");
  if (perAnnum) {
    return { pcm: true, value: value / 12 };
  }

  return { pcm: false, value };
}

function listingMatches(listing: PropertyBrowseListing, p: Property): boolean {
  if (listing === "sold") return p.status === "Sold";
  if (listing === "rent") return p.type === "For Rent";
  return p.type === "For Sale" && p.status !== "Sold";
}

function priceMatches(f: PropertyBrowseFilters, p: Property): boolean {
  const parsed = parsePropertyNumericPrice(p);
  if (!parsed) return true;

  const min = f.minPrice ? Number(f.minPrice) : null;
  const max = f.maxPrice ? Number(f.maxPrice) : null;
  if (min !== null && !Number.isFinite(min)) return true;
  if (max !== null && !Number.isFinite(max)) return true;

  const v = parsed.value;
  if (parsed.pcm) {
    if (min !== null && v < min) return false;
    if (max !== null && v > max) return false;
    return true;
  }

  if (min !== null && v < min) return false;
  if (max !== null && v > max) return false;
  return true;
}

function normalizeRadiusKey(radius: string): string {
  if (radius === "0" || radius === "") return "this_area";
  return radius;
}

export function filterStoreProperties(items: Property[], f: PropertyBrowseFilters): Property[] {
  const rawLoc = f.location.trim().toLowerCase();
  const locationTokenNationwide = rawLoc === "nationwide";
  const locationTokenOverseas = rawLoc === "overseas";

  if (locationTokenOverseas) {
    return items.filter((p) => {
      if (!listingMatches(f.listing, p)) return false;
      if (f.sector !== "Any Sector" && !matchesHeroSector(p, f.sector)) return false;
      if (f.type && p.category !== f.type) return false;
      if (f.featuredOnly && !p.featured) return false;
      if (f.newDevelopmentOnly && !p.newDevelopment) return false;
      if (!priceMatches(f, p)) return false;
      return propertyLooksOverseas(p);
    });
  }

  let locNeedle = locationTokenNationwide ? "" : rawLoc;
  const hasTextLoc = locNeedle.length > 0;
  const rKey = normalizeRadiusKey(f.radius);
  const isNationwide = rKey === "nationwide";
  const treatAsNationwide = isNationwide || locationTokenNationwide;
  const thisAreaOnly = rKey === "this_area";
  const miles = !treatAsNationwide && !thisAreaOnly ? Math.max(0, Number(rKey) || 0) : 0;
  const center =
    !treatAsNationwide && f.location.trim() && !locationTokenNationwide
      ? resolveSearchLocationCenter(f.location)
      : null;
  const useRadius = miles > 0 && center != null;

  return items.filter((p) => {
    if (!listingMatches(f.listing, p)) return false;

    if (f.sector !== "Any Sector" && !matchesHeroSector(p, f.sector)) return false;

    if (f.type && p.category !== f.type) return false;

    if (f.featuredOnly && !p.featured) return false;
    if (f.newDevelopmentOnly && !p.newDevelopment) return false;

    if (!priceMatches(f, p)) return false;

    if (treatAsNationwide) {
      return true;
    }

    if (thisAreaOnly) {
      if (!hasTextLoc) return true;
      const blob = `${p.location} ${p.address} ${p.title}`.toLowerCase();
      return blob.includes(locNeedle);
    }

    if (hasTextLoc || useRadius) {
      const blob = `${p.location} ${p.address} ${p.title}`.toLowerCase();
      const textHit = hasTextLoc && blob.includes(locNeedle);
      if (useRadius && p.coordinates) {
        const d = haversineMiles(center!.lat, center!.lng, p.coordinates.lat, p.coordinates.lng);
        if (d > miles && !textHit) return false;
      } else if (useRadius && !p.coordinates) {
        if (!textHit) return false;
      } else if (hasTextLoc && !textHit) {
        return false;
      }
    } else if (hasTextLoc) {
      const blob = `${p.location} ${p.address} ${p.title}`.toLowerCase();
      if (!blob.includes(locNeedle)) return false;
    }

    return true;
  });
}

function sortValueForPrice(p: Property): number {
  const parsed = parsePropertyNumericPrice(p);
  if (!parsed) return 0;
  if (parsed.pcm) return parsed.value * 1000;
  return parsed.value;
}

export function sortStoreProperties(
  items: Property[],
  sort: PropertyBrowseSort,
  orderIndex: Map<string, number>,
): Property[] {
  const arr = [...items];
  if (sort === "price_desc") {
    arr.sort((a, b) => sortValueForPrice(b) - sortValueForPrice(a));
  } else if (sort === "price_asc") {
    arr.sort((a, b) => sortValueForPrice(a) - sortValueForPrice(b));
  } else {
    arr.sort((a, b) => (orderIndex.get(b.slug) ?? 0) - (orderIndex.get(a.slug) ?? 0));
  }
  return arr;
}

/** When strict filters return nothing, keep listing + category/special intent without location/price/sector. */
export function pickFallbackBrowseSlice(items: Property[], f: PropertyBrowseFilters, take = 3): Property[] {
  const relaxed: PropertyBrowseFilters = {
    ...defaultPropertyBrowseFilters,
    listing: f.listing,
    type: f.type,
    featuredOnly: f.featuredOnly,
    newDevelopmentOnly: f.newDevelopmentOnly,
    location: "",
    radius: "nationwide",
    sector: "Any Sector",
    minPrice: "",
    maxPrice: "",
  };
  let pool = filterStoreProperties(items, relaxed);
  if (pool.length >= 2) return pool.slice(0, take);

  const looser: PropertyBrowseFilters = {
    ...relaxed,
    type: "",
    featuredOnly: false,
    newDevelopmentOnly: false,
  };
  pool = filterStoreProperties(items, looser);
  if (pool.length >= 2) return pool.slice(0, take);

  return items.filter((p) => listingMatches(f.listing, p)).slice(0, take);
}
