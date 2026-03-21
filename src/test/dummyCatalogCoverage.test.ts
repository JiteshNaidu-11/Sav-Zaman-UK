import { describe, expect, it } from "vitest";
import { properties } from "@/data/properties";
import { UK_LOCATIONS } from "@/data/ukLocations";
import {
  defaultPropertyBrowseFilters,
  filterStoreProperties,
  type PropertyBrowseFilters,
} from "@/lib/propertyBrowseFilter";
import { HERO_SECTOR_OPTIONS, type HeroSector } from "@/lib/propertyHeroSearch";

const sectors = HERO_SECTOR_OPTIONS.filter((s): s is HeroSector => s !== "Any Sector");
const listings = ["buy", "rent", "sold"] as const;
const categories = ["Residential", "Commercial", "Investment", "Luxury"] as const;

function countFiltered(patch: Partial<PropertyBrowseFilters>) {
  return filterStoreProperties(properties, { ...defaultPropertyBrowseFilters, ...patch }).length;
}

describe("dummy store catalog coverage", () => {
  it("exports expected catalogue size (each location × 6 sectors × 6 rows)", () => {
    expect(properties.length).toBe(UK_LOCATIONS.length * sectors.length * 6);
  });

  it("returns multiple results for every location (this area text match)", () => {
    for (const location of UK_LOCATIONS) {
      if (location === "Nationwide") continue;
      const n = countFiltered({ location, radius: "this_area", listing: "buy", sector: "Any Sector" });
      expect(n, location).toBeGreaterThanOrEqual(2);
    }
  });

  it("returns multiple results for every sector at a fixed London sub-area", () => {
    for (const sector of sectors) {
      const n = countFiltered({
        location: "Canary Wharf, London",
        radius: "this_area",
        listing: "buy",
        sector,
      });
      expect(n, sector).toBeGreaterThanOrEqual(2);
    }
  });

  it("returns multiple results for each listing mode (nationwide)", () => {
    for (const listing of listings) {
      const n = countFiltered({ location: "", radius: "nationwide", listing, sector: "Any Sector" });
      expect(n, listing).toBeGreaterThanOrEqual(2);
    }
  });

  it("returns multiple results for rent and sold with sector + Canary Wharf", () => {
    for (const sector of sectors) {
      expect(
        countFiltered({ location: "Canary Wharf, London", radius: "this_area", listing: "rent", sector }),
        `rent ${sector}`,
      ).toBeGreaterThanOrEqual(2);
      expect(
        countFiltered({ location: "Canary Wharf, London", radius: "this_area", listing: "sold", sector }),
        `sold ${sector}`,
      ).toBeGreaterThanOrEqual(2);
    }
  });

  it("returns multiple results for each category filter", () => {
    for (const type of categories) {
      const n = countFiltered({
        location: "",
        radius: "nationwide",
        listing: "buy",
        sector: "Any Sector",
        type,
      });
      expect(n, type).toBeGreaterThanOrEqual(2);
    }
  });

  it("returns multiple results for featured-only and new-development-only browse", () => {
    expect(
      countFiltered({
        location: "",
        radius: "nationwide",
        listing: "buy",
        sector: "Any Sector",
        featuredOnly: true,
      }),
    ).toBeGreaterThanOrEqual(2);
    expect(
      countFiltered({
        location: "",
        radius: "nationwide",
        listing: "buy",
        sector: "Any Sector",
        newDevelopmentOnly: true,
      }),
    ).toBeGreaterThanOrEqual(2);
  });

  it("returns multiple results for London sub-area autocomplete locations", () => {
    for (const location of ["Central London", "North London", "Canary Wharf, London"] as const) {
      const n = countFiltered({ location, radius: "this_area", listing: "buy", sector: "Any Sector" });
      expect(n, location).toBeGreaterThanOrEqual(2);
    }
  });
});
