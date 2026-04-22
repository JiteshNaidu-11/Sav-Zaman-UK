import { buildStorePropertyCatalog } from "./dummyStoreProperties";

export interface Property {
  /** Numeric id for `/properties/:id` URLs (seed catalogue); optional for admin-only rows. */
  id?: number;
  slug: string;
  image: string;
  gallery: string[];
  videoEmbedUrl?: string;
  title: string;
  location: string;
  address: string;
  price: string;
  type: string;
  area: string;
  beds?: string;
  baths?: string;
  category: string;
  /** Display label for key facts row, e.g. Apartment / Office Space */
  propertyTypeLabel?: string;
  tenure?: string;
  /** ISO date string when the listing was added */
  listedAt?: string;
  /** Bullet features (defaults to `amenities` in UI when omitted) */
  features?: string[];
  overview: string;
  amenities: string[];
  status: string;
  /** Admin workflow (separate from marketing `status`). */
  recordStatus?: "pending" | "approved";
  isUpcoming?: boolean;
  /** Highlight on home “rental” placements when you use that section. */
  homeRental?: boolean;
  /** When true, hidden from anonymous visitors (admin can still see). */
  hiddenFromPublic?: boolean;
  createdByLabel?: string;
  featured?: boolean;
  heroFeatured?: boolean;
  /** New-build / development-led listing (footer “New Developments” deep links). */
  newDevelopment?: boolean;
  /** Map pins and radius filtering (optional for legacy / admin rows). */
  coordinates?: { lat: number; lng: number };
}

export const PROPERTY_STORAGE_KEY = "sav-zaman.properties";
export const propertyCategories = ["Residential", "Commercial", "Investment", "Land Development"] as const;
export const propertyListingTypes = ["For Sale", "For Rent"] as const;
export const propertyStatuses = ["For Sale", "For Rent", "Reserved", "Sold"] as const;

/** Seed catalogue used by the app; currently sourced from real listing rows in `dummyStoreProperties.ts`. */
export const properties: Property[] = buildStorePropertyCatalog();

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}

export function getFeaturedProperties(): Property[] {
  return properties.filter((p) => p.featured);
}

export function getRelatedProperties(currentSlug: string, limit = 3): Property[] {
  return properties.filter((p) => p.slug !== currentSlug).slice(0, limit);
}

export function getPropertyByIdFromList(items: Property[], id: number): Property | undefined {
  return items.find((p) => p.id === id);
}

export function getSimilarPropertiesFromList(items: Property[], current: Property, limit = 4): Property[] {
  const others = items.filter((p) => p.slug !== current.slug);
  const locHead = current.location.split(",")[0].trim().toLowerCase();
  const scored = others.map((p) => {
    let score = 0;
    const pHead = p.location.split(",")[0].trim().toLowerCase();
    if (p.location.toLowerCase() === current.location.toLowerCase()) score += 4;
    else if (pHead === locHead || p.location.toLowerCase().includes(locHead) || current.location.toLowerCase().includes(pHead)) {
      score += 2;
    }
    if (p.category === current.category) score += 2;
    if (p.propertyTypeLabel && p.propertyTypeLabel === current.propertyTypeLabel) score += 1;
    return { p, score };
  });
  scored.sort((a, b) => b.score - a.score || (b.p.featured ? 1 : 0) - (a.p.featured ? 1 : 0));
  return scored.slice(0, limit).map((s) => s.p);
}

/** Prefer numeric id when present so detail URLs stay stable. */
export function propertyDetailPath(p: Pick<Property, "id" | "slug">): string {
  return `/properties/${p.id ?? p.slug}`;
}

export function getPropertyBySlugFromList(items: Property[], slug: string): Property | undefined {
  return items.find((property) => property.slug === slug);
}

export function getFeaturedPropertiesFromList(items: Property[]): Property[] {
  return items.filter((property) => property.featured);
}

export function getRelatedPropertiesFromList(items: Property[], currentSlug: string, limit = 3): Property[] {
  return items.filter((property) => property.slug !== currentSlug).slice(0, limit);
}

export function createPropertySlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ensureUniquePropertySlug(baseSlug: string, items: Property[], currentSlug?: string): string {
  const normalizedBaseSlug = createPropertySlug(baseSlug) || "property";

  if (!items.some((property) => property.slug === normalizedBaseSlug && property.slug !== currentSlug)) {
    return normalizedBaseSlug;
  }

  let counter = 2;
  let nextSlug = `${normalizedBaseSlug}-${counter}`;

  while (items.some((property) => property.slug === nextSlug && property.slug !== currentSlug)) {
    counter += 1;
    nextSlug = `${normalizedBaseSlug}-${counter}`;
  }

  return nextSlug;
}

export function normalizeVideoEmbedUrl(value?: string): string | undefined {
  if (!value) return undefined;

  const trimmedValue = value.trim();
  if (!trimmedValue) return undefined;

  if (trimmedValue.includes("youtube.com/embed/")) {
    return trimmedValue;
  }

  try {
    const parsed = new URL(trimmedValue);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const videoId = parsed.pathname.replace(/\//g, "");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : trimmedValue;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const videoId = parsed.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      const pathParts = parsed.pathname.split("/").filter(Boolean);
      if (pathParts[0] === "shorts" && pathParts[1]) {
        return `https://www.youtube.com/embed/${pathParts[1]}`;
      }

      if (pathParts[0] === "embed" && pathParts[1]) {
        return `https://www.youtube.com/embed/${pathParts[1]}`;
      }
    }
  } catch {
    return trimmedValue;
  }

  return trimmedValue;
}
