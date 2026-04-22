import type { Property } from "@/data/properties";

export const HERO_SECTOR_OPTIONS = [
  "Any Sector",
  "Residential",
  "Commercial",
  "Offices",
  "Retail",
  "Leisure",
  "Industrial",
  "Land",
  "Development",
  "Other",
] as const;

export type HeroSector = (typeof HERO_SECTOR_OPTIONS)[number];
export type HeroListingMode = "rent" | "buy";

export function parseHeroListingMode(value: string | null): HeroListingMode {
  return value === "rent" ? "rent" : "buy";
}

export function parseHeroSector(value: string | null): HeroSector {
  if (value && HERO_SECTOR_OPTIONS.includes(value as HeroSector)) {
    return value as HeroSector;
  }
  return "Any Sector";
}

export function matchesHeroListingMode(property: Property, mode: HeroListingMode): boolean {
  if (mode === "buy") return property.type === "For Sale";
  return property.type === "For Rent";
}

export function matchesHeroSector(property: Property, sector: HeroSector): boolean {
  if (sector === "Any Sector") return true;
  const text = `${property.title} ${property.overview} ${property.location} ${property.category}`.toLowerCase();
  switch (sector) {
    case "Residential":
      return (
        property.category === "Residential" ||
        /\bresidential\b|apartment|flat\b|house\b|home\b|studio\b|duplex|terrace|semi-?detached|detached|bungalow|bedroom/.test(
          text,
        )
      );
    case "Commercial":
      return (
        property.category === "Commercial" ||
        /\bcommercial\b|office|workspace|retail|showroom|industrial|warehouse|logistics|hospitality|hotel|restaurant|bar\b|gym|spa/.test(
          text,
        )
      );
    case "Offices":
      return /office|workspace|headquarters|\bhq\b|serviced office|commercial floor|tower|plaza|business suite/.test(text);
    case "Retail":
      return /retail|showroom|shop|store|frontage|high street/.test(text);
    case "Leisure":
      return /leisure|hospitality|hotel|restaurant|bar\b|café|cafe|gym|spa/.test(text);
    case "Industrial":
      return /industrial|warehouse|logistics|distribution|yard|unit\b/.test(text);
    case "Land":
      return /\bland\b|plot|site\b|acre|hectare|greenfield|brownfield/.test(text);
    case "Development":
      return (
        /development|scheme|planning|redevelopment|conversion|build-to-rent|\bbtr\b|new build|construction/.test(text) ||
        property.category === "Investment"
      );
    case "Other":
      return (
        /mixed|miscellaneous|ancillary|alternative|other use/.test(text) ||
        (property.category === "Commercial" &&
          !/office|workspace|retail|showroom|industrial|warehouse|leisure|hospitality|hotel|land\b|development|planning|construction/.test(
            text,
          ))
      );
    default:
      return true;
  }
}

export function matchesHeroArea(property: Property, areaScope: string, query: string): boolean {
  if (areaScope === "Nationwide") return true;
  if (areaScope === "This area only") {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      property.location.toLowerCase().includes(q) ||
      property.address.toLowerCase().includes(q) ||
      property.title.toLowerCase().includes(q)
    );
  }
  return (
    property.location === areaScope ||
    property.location.toLowerCase().includes(areaScope.toLowerCase()) ||
    property.address.toLowerCase().includes(areaScope.toLowerCase())
  );
}
