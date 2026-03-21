import { describe, expect, it } from "vitest";
import {
  createPropertySlug,
  ensureUniquePropertySlug,
  normalizeVideoEmbedUrl,
  type Property,
} from "@/data/properties";

const sampleProperties: Property[] = [
  {
    slug: "premium-villa",
    image: "/villa.jpg",
    gallery: ["/villa.jpg"],
    title: "Premium Villa",
    location: "Nashik",
    address: "Nashik, Maharashtra",
    price: "INR 1 Cr",
    type: "For Sale",
    area: "2000 Sqft",
    category: "Residential",
    overview: "Sample overview",
    amenities: ["Amenity"],
    status: "For Sale",
  },
];

describe("property helpers", () => {
  it("creates clean slugs from property titles", () => {
    expect(createPropertySlug(" Premium 3BHK Apartment @ Gangapur Road ")).toBe(
      "premium-3bhk-apartment-gangapur-road",
    );
  });

  it("generates a unique slug when a listing already exists", () => {
    expect(ensureUniquePropertySlug("premium-villa", sampleProperties)).toBe("premium-villa-2");
    expect(ensureUniquePropertySlug("premium-villa", sampleProperties, "premium-villa")).toBe("premium-villa");
  });

  it("normalizes standard youtube links into embed urls", () => {
    expect(normalizeVideoEmbedUrl("https://www.youtube.com/watch?v=abc123xyz")).toBe(
      "https://www.youtube.com/embed/abc123xyz",
    );
    expect(normalizeVideoEmbedUrl("https://youtu.be/abc123xyz")).toBe("https://www.youtube.com/embed/abc123xyz");
  });
});
