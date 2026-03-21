import type { SearchCatalogProperty, SearchSortOption } from "@/data/searchCatalogTypes";
import { SEARCH_LOCATION_HUBS } from "@/data/searchCatalogProperties";

export interface SearchCatalogFilters {
  location: string;
  listing: "buy" | "rent" | "sold";
  radiusMiles: number;
  minPrice: number | null;
  maxPrice: number | null;
  propertyType: string;
  sector: string;
  bedrooms: string;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function resolveSearchLocationCenter(locationQuery: string): { lat: number; lng: number } | null {
  const q = locationQuery.trim().toLowerCase();
  if (!q) return null;
  const match = SEARCH_LOCATION_HUBS.find(
    (h) =>
      h.location.toLowerCase().includes(q) ||
      q.includes(h.location.split(",")[0].trim().toLowerCase()),
  );
  if (match) return { lat: match.lat, lng: match.lng };
  if (q.includes("london")) return { lat: 51.5074, lng: -0.1278 };
  if (q.includes("manchester")) return { lat: 53.4808, lng: -2.2426 };
  if (q.includes("birmingham")) return { lat: 52.4862, lng: -1.8904 };
  return { lat: 54.2361, lng: -4.5481 };
}

function listingMatches(listing: SearchCatalogFilters["listing"], p: SearchCatalogProperty): boolean {
  if (listing === "buy") return p.listingType === "Buy";
  if (listing === "rent") return p.listingType === "Rent";
  return p.listingType === "Sold";
}

export function filterSearchCatalog(items: SearchCatalogProperty[], f: SearchCatalogFilters): SearchCatalogProperty[] {
  const locNeedle = f.location.trim().toLowerCase();
  const center = locNeedle ? resolveSearchLocationCenter(f.location) : null;
  const radiusKm = f.radiusMiles > 0 ? f.radiusMiles * 1.60934 : 0;

  return items.filter((p) => {
    if (!listingMatches(f.listing, p)) return false;

    if (f.sector && f.sector !== "Any Sector" && p.sector !== f.sector) return false;

    if (f.propertyType && f.propertyType !== "Any" && p.propertyType !== f.propertyType) return false;

    if (f.minPrice != null && p.price < f.minPrice) return false;
    if (f.maxPrice != null && p.price > f.maxPrice) return false;

    if (f.bedrooms && f.bedrooms !== "any") {
      if (f.bedrooms === "5+") {
        if (p.bedrooms < 5) return false;
      } else {
        const b = Number(f.bedrooms);
        if (Number.isFinite(b) && p.bedrooms !== b) return false;
      }
    }

    if (locNeedle) {
      const inText =
        p.location.toLowerCase().includes(locNeedle) || p.title.toLowerCase().includes(locNeedle);
      if (center) {
        const d = haversineKm(center.lat, center.lng, p.coordinates.lat, p.coordinates.lng);
        if (radiusKm > 0) {
          if (d > radiusKm && !inText) return false;
        } else if (!inText && d > 40) {
          return false;
        }
      } else if (!inText) {
        return false;
      }
    }

    return true;
  });
}

export function sortSearchCatalog(items: SearchCatalogProperty[], sort: SearchSortOption): SearchCatalogProperty[] {
  const copy = [...items];
  switch (sort) {
    case "price_desc":
      return copy.sort((a, b) => b.price - a.price);
    case "price_asc":
      return copy.sort((a, b) => a.price - b.price);
    case "newest":
      return copy.sort((a, b) => new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime());
    case "oldest":
      return copy.sort((a, b) => new Date(a.listedAt).getTime() - new Date(b.listedAt).getTime());
    default:
      return copy;
  }
}

export function paginateSearchCatalog<T>(items: T[], page: number, pageSize: number): { slice: T[]; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return { slice: items.slice(start, start + pageSize), totalPages };
}
