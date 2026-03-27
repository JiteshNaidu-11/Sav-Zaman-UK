import { describe, expect, it } from "vitest";
import { properties } from "@/data/properties";
import {
  defaultPropertyBrowseFilters,
  filterStoreProperties,
  type PropertyBrowseFilters,
} from "@/lib/propertyBrowseFilter";

const expectedSeedSlugs = ["commercial-unit-apartments-95-95a-skinner-street"];

function countFiltered(patch: Partial<PropertyBrowseFilters>) {
  return filterStoreProperties(properties, { ...defaultPropertyBrowseFilters, ...patch }).length;
}

describe("seed catalogue (real listings)", () => {
  it("exports at least one real listing", () => {
    expect(properties.length).toBeGreaterThan(0);
  });

  it("does not include legacy demo catalog rows", () => {
    for (const p of properties) {
      expect(p.slug).not.toMatch(/^catalog-/);
    }
  });

  it("contains expected seed slugs", () => {
    const slugs = new Set(properties.map((p) => p.slug));
    for (const slug of expectedSeedSlugs) {
      expect(slugs.has(slug)).toBe(true);
    }
  });

  it("filtering keeps the seed listing visible in basic buy search", () => {
    const n = countFiltered({ location: "", radius: "nationwide", listing: "buy", sector: "Any Sector" });
    expect(n).toBeGreaterThanOrEqual(1);
  });
});
