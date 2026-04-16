import {
  Property,
  createPropertySlug,
  normalizeVideoEmbedUrl,
} from "@/data/properties";

export interface PropertyRecord {
  id?: string;
  slug: string;
  title: string;
  location: string;
  address: string;
  price: string;
  type: string;
  area: string;
  beds: string | null;
  baths: string | null;
  category: string;
  overview: string;
  amenities: string[] | null;
  status: string;
  record_status?: string | null;
  is_upcoming?: boolean | null;
  show_home_rental?: boolean | null;
  hidden_from_public?: boolean | null;
  created_by?: string | null;
  created_by_label?: string | null;
  featured: boolean | null;
  hero_featured?: boolean | null;
  image_url: string;
  gallery_urls: string[] | null;
  video_embed_url: string | null;
  created_at?: string;
  updated_at?: string;
}

function uniqueStrings(items: string[]): string[] {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

export function hydrateProperty(property: Property, fallbackImage: string): Property {
  const title = property.title?.trim() || "Property";
  const cleanedGallery = uniqueStrings(Array.isArray(property.gallery) ? property.gallery : []);
  const image = property.image?.trim() || cleanedGallery[0] || fallbackImage;
  const gallery = uniqueStrings([image, ...cleanedGallery]);
  const amenities = uniqueStrings(property.amenities ?? []);

  const featureLines = uniqueStrings(property.features ?? []);

  return {
    ...property,
    id: property.id,
    slug: createPropertySlug(property.slug || title) || "property",
    title,
    image,
    gallery,
    videoEmbedUrl: normalizeVideoEmbedUrl(property.videoEmbedUrl),
    location: property.location?.trim() || "London",
    address: property.address?.trim() || "United Kingdom",
    price: property.price?.trim() || "Price on request",
    type: property.type?.trim() || "For Sale",
    area: property.area?.trim() || "NA",
    beds: property.beds?.trim() || undefined,
    baths: property.baths?.trim() || undefined,
    category: property.category?.trim() || "Residential",
    propertyTypeLabel: property.propertyTypeLabel?.trim() || undefined,
    tenure: property.tenure?.trim() || undefined,
    listedAt: property.listedAt?.trim() || undefined,
    features: featureLines.length ? featureLines : undefined,
    overview: property.overview?.trim() || "Presented by Sav Zaman.",
    amenities: amenities.length ? amenities : ["Presented by Sav Zaman."],
    status: property.status?.trim() || "For Sale",
    recordStatus: property.recordStatus === "pending" ? "pending" : "approved",
    isUpcoming: Boolean(property.isUpcoming),
    homeRental: Boolean(property.homeRental),
    hiddenFromPublic: Boolean(property.hiddenFromPublic),
    createdByLabel: property.createdByLabel?.trim() || undefined,
    featured: Boolean(property.featured),
    heroFeatured: Boolean(property.heroFeatured),
    coordinates: property.coordinates,
  };
}

export function propertyRecordToModel(record: PropertyRecord, fallbackImage: string): Property {
  return hydrateProperty(
    {
      slug: record.slug,
      image: record.image_url,
      gallery: record.gallery_urls ?? [],
      videoEmbedUrl: record.video_embed_url ?? undefined,
      title: record.title,
      location: record.location,
      address: record.address,
      price: record.price,
      type: record.type,
      area: record.area,
      beds: record.beds ?? undefined,
      baths: record.baths ?? undefined,
      category: record.category,
      overview: record.overview,
      amenities: record.amenities ?? [],
      status: record.status,
      recordStatus: record.record_status === "pending" ? "pending" : "approved",
      isUpcoming: Boolean(record.is_upcoming),
      homeRental: Boolean(record.show_home_rental),
      hiddenFromPublic: Boolean(record.hidden_from_public),
      createdByLabel: record.created_by_label ?? undefined,
      listedAt: record.created_at,
      featured: Boolean(record.featured),
      heroFeatured: Boolean(record.hero_featured),
    },
    fallbackImage,
  );
}

export function propertyModelToRecord(property: Property): PropertyRecord {
  const recordStatus = property.recordStatus === "pending" ? "pending" : "approved";
  return {
    slug: createPropertySlug(property.slug || property.title),
    title: property.title.trim(),
    location: property.location.trim(),
    address: property.address.trim(),
    price: property.price.trim(),
    type: property.type.trim(),
    area: property.area.trim(),
    beds: property.beds?.trim() || null,
    baths: property.baths?.trim() || null,
    category: property.category.trim(),
    overview: property.overview.trim(),
    amenities: uniqueStrings(property.amenities ?? []),
    status: property.status.trim(),
    record_status: recordStatus,
    is_upcoming: Boolean(property.isUpcoming),
    show_home_rental: Boolean(property.homeRental),
    hidden_from_public: Boolean(property.hiddenFromPublic),
    featured: Boolean(property.featured),
    hero_featured: Boolean(property.heroFeatured),
    image_url: property.image.trim(),
    gallery_urls: uniqueStrings(property.gallery ?? []),
    video_embed_url: normalizeVideoEmbedUrl(property.videoEmbedUrl) ?? null,
  };
}
