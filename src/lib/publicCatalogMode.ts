export type PublicCatalogMode = "demo" | "all";

const STORAGE_KEY = "sav-zaman.public-catalog-mode";
const DEFAULT_MODE: PublicCatalogMode = "demo";

export function getPublicCatalogMode(): PublicCatalogMode {
  if (typeof window === "undefined") return DEFAULT_MODE;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw === "all" || raw === "demo" ? raw : DEFAULT_MODE;
}

export function setPublicCatalogMode(mode: PublicCatalogMode): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, mode);
}

export const PUBLIC_DEMO_SLUGS = [
  "commercial-unit-apartments-95-95a-skinner-street",
  "80-high-northgate-commercial-unit-3-apartments",
  "canary-wharf-1-bed-apartment-e14",
] as const;

