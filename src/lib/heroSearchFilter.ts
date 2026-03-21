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

    if (sector !== "Any Sector" && property.type !== sector) return false;

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
