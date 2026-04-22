import type { HeroListingMode, HeroSector } from "@/lib/propertyHeroSearch";
import type { HeroSearchDemoProperty } from "@/data/heroSearchDemoProperties";

export interface HeroSearchFilterInput {
  listingMode: HeroListingMode;
  sector: HeroSector;
  areaScope: string;
  /** Free text or picked autocomplete value */
  locationNeedle: string;
}

export function filterHeroSearchDemoProperties(
  items: HeroSearchDemoProperty[],
  { listingMode, sector, areaScope, locationNeedle }: HeroSearchFilterInput,
): HeroSearchDemoProperty[] {
  const needle = locationNeedle.trim().toLowerCase();

  return items.filter((property) => {
    const listingOk =
      listingMode === "buy" ? property.listingType === "Buy" : property.listingType === "Rent";
    if (!listingOk) return false;

    if (sector !== "Any Sector") {
      const sectorOk = (() => {
        // Demo listings are mostly commercial sectors; keep mapping lightweight but functional.
        if (sector === "Residential") return false;
        if (sector === "Commercial") return true;
        if (sector === "Land") return property.type.includes("Land");
        if (sector === "Development") return property.type.includes("Development");
        if (sector === "Leisure") return property.type.includes("Leisure") || property.type.includes("Hospitality");
        if (sector === "Industrial") return property.type.includes("Industrial") || property.type.includes("Warehousing");
        return property.type === sector;
      })();
      if (!sectorOk) return false;
    }

    const loc = property.location.toLowerCase();
    const title = property.title.toLowerCase();

    if (areaScope === "Nationwide") {
      if (!needle) return true;
      return loc.includes(needle) || title.includes(needle);
    }

    if (areaScope === "This area only") {
      if (!needle) return true;
      return loc.includes(needle) || title.includes(needle);
    }

    const scope = areaScope.toLowerCase();
    const inScope = loc.includes(scope) || title.includes(scope);
    if (!needle) return inScope;
    return inScope && (loc.includes(needle) || title.includes(needle));
  });
}
