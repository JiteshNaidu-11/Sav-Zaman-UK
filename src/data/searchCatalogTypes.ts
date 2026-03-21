export type CatalogListingType = "Buy" | "Rent" | "Sold";

export type SearchSortOption = "price_desc" | "price_asc" | "newest" | "oldest";

export interface SearchCatalogProperty {
  id: number;
  slug: string;
  title: string;
  location: string;
  price: number;
  priceDisplay: string;
  listingType: CatalogListingType;
  propertyType: string;
  sector: string;
  bedrooms: number;
  area: string;
  agent: string;
  image: string;
  coordinates: { lat: number; lng: number };
  featured?: boolean;
  /** ISO date for sort */
  listedAt: string;
}
