import type { SearchCatalogFilters } from "@/lib/searchCatalogFilter";
import type { ParsedSearchURL } from "@/lib/searchURLState";

function parsePrice(s: string): number | null {
  const n = Number(String(s).replace(/[^\d]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function parsedSearchToFilters(parsed: ParsedSearchURL): SearchCatalogFilters {
  return {
    location: parsed.location,
    listing: parsed.listing,
    radiusMiles: Number(parsed.radius) || 0,
    minPrice: parsed.minPrice ? parsePrice(parsed.minPrice) : null,
    maxPrice: parsed.maxPrice ? parsePrice(parsed.maxPrice) : null,
    propertyType: parsed.propertyType,
    sector: parsed.sector,
    bedrooms: parsed.beds,
  };
}
