import { supabase, supabaseConfigured } from "@/lib/supabaseClient";
import { properties as seedProperties, type Property } from "@/data/properties";
import { getPublicCatalogMode, PUBLIC_DEMO_SLUGS } from "@/lib/publicCatalogMode";
import { pickFallbackPropertyImage } from "@/lib/propertyFallbackImages";

export type TransactionType = "Rent" | "Sale";

export type NormalizedProperty = {
  id: string;
  slug?: string;
  projectName: string;
  location: string;
  city: string;
  price: string;
  priceRaw: number;
  transactionType: TransactionType;
  type: string;
  image: string;
  images: string[];
};

export type PropertyFilters = {
  transactionType?: TransactionType | null;
  city?: string | null;
  minPriceRaw?: number | null;
  maxPriceRaw?: number | null;
};

function parsePriceRaw(price: string): number {
  const normalized = price.replace(/,/g, "");
  const m = normalized.match(/(\d+(?:\.\d+)?)/);
  if (!m) return 0;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : 0;
}

function cityFromLocation(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.split(",")[0].trim();
}

function normalizeRow(p: any): NormalizedProperty {
  // Supports both Supabase row shape (snake_case) and local seed model (camelCase)
  const title = (p.title ?? "").toString();
  const location = (p.location ?? "").toString();
  const address = (p.address ?? "").toString();
  const price = (p.price ?? "").toString();
  const type = (p.type ?? "").toString();

  const rawImage = (p.image_url ?? p.image ?? "").toString();
  const rawImages = (p.gallery_urls ?? p.gallery ?? []) as string[];
  const id = (p.id ?? p.slug ?? title).toString();
  const slug = (p.slug ?? "").toString() || undefined;
  const fallbackImage = pickFallbackPropertyImage(slug || id || title || location || address);
  const image = rawImage.trim() || (Array.isArray(rawImages) ? rawImages[0]?.toString().trim() : "") || fallbackImage;
  const images = Array.isArray(rawImages) && rawImages.length ? rawImages : image ? [image] : [fallbackImage];

  const transactionType: TransactionType = type === "For Rent" ? "Rent" : "Sale";

  return {
    id,
    slug,
    projectName: title,
    location: address || location,
    city: cityFromLocation(location || address),
    price,
    priceRaw: parsePriceRaw(price),
    transactionType,
    type: (p.propertyTypeLabel ?? p.category ?? "").toString() || "Property",
    image,
    images,
  };
}

export async function getApprovedProperties(): Promise<{ data: NormalizedProperty[]; error: string | null }> {
  if (typeof window !== "undefined" && getPublicCatalogMode() === "demo") {
    const demo = seedProperties.filter((p) => PUBLIC_DEMO_SLUGS.includes(p.slug as any));
    return { data: (demo.length ? demo : seedProperties.slice(0, 3)).map((p) => normalizeRow(p)), error: null };
  }

  // Home Ambit rule: fallback to mock data if not configured.
  if (!supabaseConfigured || !supabase) {
    return { data: seedProperties.map((p) => normalizeRow(p)), error: null };
  }

  try {
    // UK listings use marketing status ("For Sale", "For Rent"), same rows the public site shows.
    const { data, error } = await supabase.from("properties").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return { data: ((data as any[]) ?? []).map((p) => normalizeRow(p)), error: null };
  } catch (e) {
    console.error("getApprovedProperties failed:", e);
    return { data: seedProperties.map((p) => normalizeRow(p)), error: "Unable to fetch data. Please connect via WhatsApp." };
  }
}

export async function getFilteredProperties(filters: PropertyFilters): Promise<{ data: NormalizedProperty[]; error: string | null }> {
  const { data, error } = await getApprovedProperties();
  if (error) return { data: [], error };

  let items = [...data];
  if (filters.transactionType) {
    items = items.filter((p) => p.transactionType === filters.transactionType);
  }
  if (filters.city?.trim()) {
    const needle = filters.city.trim().toLowerCase();
    items = items.filter((p) => p.city.toLowerCase().includes(needle));
  }
  if (filters.minPriceRaw != null) items = items.filter((p) => p.priceRaw >= filters.minPriceRaw!);
  if (filters.maxPriceRaw != null) items = items.filter((p) => p.priceRaw <= filters.maxPriceRaw!);

  return { data: items, error: null };
}

