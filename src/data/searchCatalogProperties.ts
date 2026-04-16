import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import type { CatalogListingType, SearchCatalogProperty } from "./searchCatalogTypes";

const images = [property1, property2, property3, property4, hero1, hero2, hero3];

export const SEARCH_LOCATION_HUBS = [
  { location: "Central London", lat: 51.5155, lng: -0.0922 },
  { location: "North London", lat: 51.555, lng: -0.124 },
  { location: "South London", lat: 51.45, lng: -0.12 },
  { location: "East London", lat: 51.52, lng: -0.03 },
  { location: "West London", lat: 51.5, lng: -0.25 },
  { location: "Canary Wharf, London", lat: 51.5054, lng: -0.0235 },
  { location: "Kensington, London", lat: 51.5028, lng: -0.1877 },
  { location: "Chelsea, London", lat: 51.4875, lng: -0.1687 },
  { location: "Wimbledon, London", lat: 51.434, lng: -0.214 },
  { location: "Richmond, London", lat: 51.461, lng: -0.292 },
  { location: "Bromley, London", lat: 51.406, lng: 0.021 },
  { location: "London", lat: 51.5074, lng: -0.1278 },
  { location: "Manchester City Centre", lat: 53.4808, lng: -2.2426 },
  { location: "Manchester", lat: 53.4808, lng: -2.2426 },
  { location: "Birmingham", lat: 52.4862, lng: -1.8904 },
  { location: "Leeds", lat: 53.8008, lng: -1.5491 },
  { location: "Liverpool", lat: 53.4084, lng: -2.9916 },
  { location: "Nottingham", lat: 52.9548, lng: -1.1581 },
  { location: "Reading", lat: 51.4543, lng: -0.9781 },
  { location: "Bristol", lat: 51.4545, lng: -2.5879 },
  { location: "Sheffield", lat: 53.3811, lng: -1.4701 },
  { location: "Leicester", lat: 52.6369, lng: -1.1398 },
  { location: "Oxford", lat: 51.752, lng: -1.2577 },
  { location: "Cambridge", lat: 52.2053, lng: 0.1218 },
  { location: "Milton Keynes", lat: 52.0406, lng: -0.7594 },
  { location: "Edinburgh", lat: 55.9533, lng: -3.1883 },
  { location: "Glasgow", lat: 55.8642, lng: -4.2518 },
  { location: "Nationwide", lat: 53.4808, lng: -2.2426 },
] as const;

const sectors = [
  "Offices",
  "Retail",
  "Leisure / Hospitality",
  "Industrial / Warehousing",
  "Land / Development",
  "Other",
] as const;

const propTypes = ["Office", "Retail", "Warehouse", "Leisure", "Land", "Mixed Use", "Flat", "House"] as const;

const titles = [
  "Premium {sector} in {short}",
  "Modern {sector} — {short}",
  "Investment {sector}, {short}",
  "Refurbished {sector} | {short}",
  "Flagship {sector} Space, {short}",
  "City {sector} Opportunity, {short}",
];

function slugify(part: string) {
  return part
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function buildCatalog(): SearchCatalogProperty[] {
  const list: SearchCatalogProperty[] = [];
  for (let i = 1; i <= 48; i++) {
    const hub = SEARCH_LOCATION_HUBS[(i - 1) % SEARCH_LOCATION_HUBS.length];
    const sector = sectors[(i + 2) % sectors.length];
    const propertyType = propTypes[(i + 3) % propTypes.length];
    const listingType: CatalogListingType =
      i % 12 === 0 ? "Sold" : i % 5 === 0 ? "Rent" : "Buy";
    const short = hub.location.split(",")[0];
    const titleTpl = titles[(i - 1) % titles.length];
    const title = titleTpl.replace("{sector}", sector).replace("{short}", short);
    const base =
      listingType === "Rent"
        ? 15000 + (i % 9) * 8500 + (i % 3) * 1200
        : 320000 + i * 47500 + (i % 7) * 12000;
    const price = listingType === "Sold" ? Math.round(base * 0.92) : Math.round(base);
    const priceDisplay =
      listingType === "Rent"
        ? `£${price.toLocaleString("en-GB")} / year`
        : `£${price.toLocaleString("en-GB")}`;
    const lat = hub.lat + ((i % 5) - 2) * 0.012;
    const lng = hub.lng + ((i % 7) - 3) * 0.012;
    const listedAt = new Date(2024, (i % 11) + 1, (i % 26) + 1).toISOString();
    const slug = `${slugify(title)}-${i}`;
    list.push({
      id: i,
      slug,
      title,
      location: hub.location,
      price,
      priceDisplay,
      listingType,
      propertyType,
      sector,
      bedrooms: sector === "Offices" || sector === "Retail" ? 0 : (i % 4) + 1,
      area: `${(i % 8) * 400 + 1200} sq ft`,
      agent: "Sav Zaman",
      image: images[(i - 1) % images.length],
      coordinates: { lat, lng },
      featured: i % 9 === 1,
      listedAt,
    });
  }
  return list;
}

export const SEARCH_CATALOG_PROPERTIES: SearchCatalogProperty[] = buildCatalog();

export function getSearchCatalogBySlug(slug: string): SearchCatalogProperty | undefined {
  return SEARCH_CATALOG_PROPERTIES.find((p) => p.slug === slug);
}
