import type { SearchSortOption } from "@/data/searchCatalogTypes";

export interface ParsedSearchURL {
  location: string;
  listing: "buy" | "rent" | "sold";
  radius: string;
  minPrice: string;
  maxPrice: string;
  propertyType: string;
  sector: string;
  beds: string;
  sort: SearchSortOption;
  page: number;
  map: boolean;
}

const SORTS: SearchSortOption[] = ["price_desc", "price_asc", "newest", "oldest"];

function parseListing(v: string | null): "buy" | "rent" | "sold" {
  if (v === "rent" || v === "sold") return v;
  return "buy";
}

function parseSort(v: string | null): SearchSortOption {
  if (v && SORTS.includes(v as SearchSortOption)) return v as SearchSortOption;
  return "price_desc";
}

export function defaultParsedSearch(partial: Partial<ParsedSearchURL> = {}): ParsedSearchURL {
  return {
    location: partial.location ?? "",
    listing: partial.listing ?? "buy",
    radius: partial.radius ?? "0",
    minPrice: partial.minPrice ?? "",
    maxPrice: partial.maxPrice ?? "",
    propertyType: partial.propertyType ?? "Any",
    sector: partial.sector ?? "Any Sector",
    beds: partial.beds ?? "any",
    sort: partial.sort ?? "price_desc",
    page: partial.page ?? 1,
    map: partial.map ?? true,
  };
}

export function parseSearchURLParams(searchParams: URLSearchParams): ParsedSearchURL {
  return {
    location: searchParams.get("location") ?? "",
    listing: parseListing(searchParams.get("listing")),
    radius: searchParams.get("radius") ?? "0",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    propertyType: searchParams.get("type") ?? "Any",
    sector: searchParams.get("sector") ?? "Any Sector",
    beds: searchParams.get("beds") ?? "any",
    sort: parseSort(searchParams.get("sort")),
    page: Math.max(1, Number(searchParams.get("page") || "1") || 1),
    map: searchParams.get("map") !== "0",
  };
}

export function buildSearchURLParams(state: ParsedSearchURL): URLSearchParams {
  const p = new URLSearchParams();
  if (state.location) p.set("location", state.location);
  p.set("listing", state.listing);
  if (state.radius && state.radius !== "0") p.set("radius", state.radius);
  if (state.minPrice) p.set("minPrice", state.minPrice);
  if (state.maxPrice) p.set("maxPrice", state.maxPrice);
  if (state.propertyType && state.propertyType !== "Any") p.set("type", state.propertyType);
  if (state.sector && state.sector !== "Any Sector") p.set("sector", state.sector);
  if (state.beds && state.beds !== "any") p.set("beds", state.beds);
  if (state.sort !== "price_desc") p.set("sort", state.sort);
  if (state.page > 1) p.set("page", String(state.page));
  if (!state.map) p.set("map", "0");
  return p;
}

export function patchSearchURL(current: ParsedSearchURL, patch: Partial<ParsedSearchURL>): ParsedSearchURL {
  const next = { ...current, ...patch };
  const resetsPage =
    patch.page === undefined &&
    (patch.location !== undefined ||
      patch.minPrice !== undefined ||
      patch.maxPrice !== undefined ||
      patch.sector !== undefined ||
      patch.propertyType !== undefined ||
      patch.beds !== undefined ||
      patch.radius !== undefined ||
      patch.listing !== undefined);
  if (resetsPage) next.page = 1;
  return next;
}
