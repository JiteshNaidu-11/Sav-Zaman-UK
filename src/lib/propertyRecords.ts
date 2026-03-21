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
    overview: property.overview?.trim() || "Presented by Sav Zaman UK.",
    amenities: amenities.length ? amenities : ["Presented by Sav Zaman UK."],
    status: property.status?.trim() || "For Sale",
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
      featured: Boolean(record.featured),
      heroFeatured: Boolean(record.hero_featured),
    },
    fallbackImage,
  );
}

export function propertyModelToRecord(property: Property): PropertyRecord {
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
    featured: Boolean(property.featured),
    hero_featured: Boolean(property.heroFeatured),
    image_url: property.image.trim(),
    gallery_urls: uniqueStrings(property.gallery ?? []),
    video_embed_url: normalizeVideoEmbedUrl(property.videoEmbedUrl) ?? null,
  };
}
