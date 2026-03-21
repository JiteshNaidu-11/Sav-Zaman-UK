import type { HeroSector } from "@/lib/propertyHeroSearch";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

export type HeroSearchPropertySector = Exclude<HeroSector, "Any Sector">;

export interface HeroSearchDemoProperty {
  id: number;
  title: string;
  location: string;
  type: HeroSearchPropertySector;
  listingType: "Buy" | "Rent";
  price: string;
  image: string;
}

const img = [property1, property2, property3, property4, hero1, hero2, hero3] as const;
const pick = (i: number) => img[i % img.length];

/** 28 demo commercial / mixed-use listings for hero search (UK-wide) */
export const HERO_SEARCH_DEMO_PROPERTIES: HeroSearchDemoProperty[] = [
  { id: 1, title: "Canary Wharf Office Floor", location: "Canary Wharf, London", type: "Offices", listingType: "Rent", price: "£45,000 / year", image: pick(0) },
  { id: 2, title: "Manchester Retail Unit", location: "Manchester City Centre", type: "Retail", listingType: "Rent", price: "£30,000 / year", image: pick(1) },
  { id: 3, title: "Birmingham Warehouse", location: "Birmingham", type: "Industrial / Warehousing", listingType: "Buy", price: "£1,200,000", image: pick(2) },
  { id: 4, title: "Kensington Boutique Office", location: "Kensington, London", type: "Offices", listingType: "Buy", price: "£3,400,000", image: pick(3) },
  { id: 5, title: "Leeds Serviced Suites", location: "Leeds", type: "Offices", listingType: "Rent", price: "£28,500 / year", image: pick(4) },
  { id: 6, title: "Liverpool Waterfront Retail", location: "Liverpool", type: "Retail", listingType: "Buy", price: "£890,000", image: pick(5) },
  { id: 7, title: "Nottingham Student Hub", location: "Nottingham", type: "Leisure / Hospitality", listingType: "Buy", price: "£1,650,000", image: pick(6) },
  { id: 8, title: "Reading Logistics Unit", location: "Reading", type: "Industrial / Warehousing", listingType: "Rent", price: "£52,000 / year", image: pick(0) },
  { id: 9, title: "Chelsea Showroom Space", location: "Chelsea, London", type: "Retail", listingType: "Rent", price: "£62,000 / year", image: pick(1) },
  { id: 10, title: "Westminster Flagship Office", location: "Westminster, London", type: "Offices", listingType: "Buy", price: "£5,200,000", image: pick(2) },
  { id: 11, title: "Bristol Harbourside Restaurant", location: "Bristol", type: "Leisure / Hospitality", listingType: "Rent", price: "£38,000 / year", image: pick(3) },
  { id: 12, title: "Sheffield Trade Park Unit", location: "Sheffield", type: "Industrial / Warehousing", listingType: "Buy", price: "£720,000", image: pick(4) },
  { id: 13, title: "Leicester Retail Parade", location: "Leicester", type: "Retail", listingType: "Buy", price: "£540,000", image: pick(5) },
  { id: 14, title: "Oxford Innovation Offices", location: "Oxford", type: "Offices", listingType: "Rent", price: "£41,000 / year", image: pick(6) },
  { id: 15, title: "Cambridge Lab Conversion", location: "Cambridge", type: "Other", listingType: "Buy", price: "£2,100,000", image: pick(0) },
  { id: 16, title: "Milton Keynes Distribution Hub", location: "Milton Keynes", type: "Industrial / Warehousing", listingType: "Rent", price: "£118,000 / year", image: pick(1) },
  { id: 17, title: "Edinburgh Hotel Opportunity", location: "Edinburgh", type: "Leisure / Hospitality", listingType: "Buy", price: "£4,800,000", image: pick(2) },
  { id: 18, title: "Glasgow City Retail", location: "Glasgow", type: "Retail", listingType: "Rent", price: "£34,000 / year", image: pick(3) },
  { id: 19, title: "Battersea Mixed-Use Corner", location: "Battersea, London", type: "Other", listingType: "Buy", price: "£1,950,000", image: pick(4) },
  { id: 20, title: "Birmingham Land Assembly", location: "Birmingham", type: "Land / Development", listingType: "Buy", price: "£3,100,000", image: pick(5) },
  { id: 21, title: "Manchester Co-Working Floor", location: "Manchester", type: "Offices", listingType: "Rent", price: "£55,000 / year", image: pick(6) },
  { id: 22, title: "Leeds Hotel & Bar", location: "Leeds", type: "Leisure / Hospitality", listingType: "Buy", price: "£980,000", image: pick(0) },
  { id: 23, title: "London Bridge Retail Pod", location: "London", type: "Retail", listingType: "Rent", price: "£48,000 / year", image: pick(1) },
  { id: 24, title: "Liverpool Development Site", location: "Liverpool", type: "Land / Development", listingType: "Buy", price: "£2,400,000", image: pick(2) },
  { id: 25, title: "Nottingham Office Campus", location: "Nottingham", type: "Offices", listingType: "Buy", price: "£1,420,000", image: pick(3) },
  { id: 26, title: "Reading Riverside Leisure", location: "Reading", type: "Leisure / Hospitality", listingType: "Rent", price: "£29,000 / year", image: pick(4) },
  { id: 27, title: "Bristol Office Conversion", location: "Bristol", type: "Offices", listingType: "Buy", price: "£1,100,000", image: pick(5) },
  { id: 28, title: "Sheffield Retail Warehouse", location: "Sheffield", type: "Retail", listingType: "Rent", price: "£22,000 / year", image: pick(6) },
];
