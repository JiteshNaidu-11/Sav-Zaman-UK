import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import type { HeroSector } from "@/lib/propertyHeroSearch";
import { HERO_SECTOR_OPTIONS } from "@/lib/propertyHeroSearch";
import type { Property } from "./properties";
import { SEARCH_LOCATION_HUBS } from "./searchCatalogProperties";
import { UK_LOCATIONS } from "./ukLocations";

const images = [property1, property2, property3, property4, hero1, hero2, hero3] as const;
const CATEGORIES = ["Residential", "Commercial", "Investment", "Luxury"] as const;
const BED_ROTATION = ["Studio", "1 Bed", "2 Bed", "3 Bed", "4 Bed", "5+ Bed", "6 Bed"] as const;

const SALE_BRACKETS = [
  [100_000, 280_000],
  [300_000, 580_000],
  [620_000, 980_000],
  [1_000_000, 2_800_000],
  [3_100_000, 5_200_000],
] as const;

const ARCHETYPES = [
  "Apartment",
  "Penthouse",
  "Office Space",
  "Retail Shop",
  "Warehouse",
  "Commercial Land",
  "Villa",
  "Studio",
  "Building",
  "Showroom",
] as const;

const TENURES = ["Freehold", "Leasehold", "Share of freehold", "Long leasehold"] as const;

const EXTRA_FEATURES = [
  "Recently refurbished",
  "24-hour concierge",
  "Parking available",
  "Balcony or terrace",
  "City view",
  "Investment opportunity",
  "High rental yield potential",
  "EPC information on request",
] as const;

function hubFor(location: string): { lat: number; lng: number } {
  const direct = SEARCH_LOCATION_HUBS.find((h) => h.location === location);
  if (direct) return { lat: direct.lat, lng: direct.lng };
  const head = location.split(",")[0].trim();
  const fuzzy = SEARCH_LOCATION_HUBS.find(
    (h) => h.location.startsWith(head) || head === h.location.split(",")[0].trim(),
  );
  return fuzzy ? { lat: fuzzy.lat, lng: fuzzy.lng } : { lat: 53.5, lng: -2.25 };
}

function sectorContent(
  sector: HeroSector,
  location: string,
  copy: 0 | 1,
): { title: string; overview: string } {
  const locShort = location.split(",")[0];
  switch (sector) {
    case "Offices":
      return copy === 0
        ? {
            title: `Serviced office floor near ${locShort} — HQ-ready workspace`,
            overview: `Prime office workspace with headquarters-style reception, meeting suites, and serviced office flexibility across ${location}.`,
          }
        : {
            title: `Business suite tower plaza — commercial floor ${location}`,
            overview: `Corporate office tower with plaza access, business suite planning, and professional workspace standards.`,
          };
    case "Retail":
      return copy === 0
        ? {
            title: `Retail shop frontage on high street — ${locShort}`,
            overview: `High-footfall retail shop with showroom frontage, store visibility, and strong high street positioning.`,
          }
        : {
            title: `Flagship showroom store unit — retail ${location}`,
            overview: `Customer-facing retail showroom with premium store layout and brand-ready shop frontage.`,
          };
    case "Leisure / Hospitality":
      return copy === 0
        ? {
            title: `Restaurant bar leasehold — hospitality venue ${locShort}`,
            overview: `Hospitality venue combining restaurant and bar service with leisure-focused guest experience.`,
          }
        : {
            title: `Hotel café gym spa — leisure hub ${location}`,
            overview: `Leisure-led hotel-style hub with café, gym, and spa hospitality programming for guests.`,
          };
    case "Industrial / Warehousing":
      return copy === 0
        ? {
            title: `Industrial warehouse logistics unit — ${locShort}`,
            overview: `Warehouse logistics unit with industrial yard access, distribution planning, and loading capability.`,
          }
        : {
            title: `Distribution yard warehouse — industrial ${location}`,
            overview: `Industrial distribution warehouse with yard space and logistics unit efficiency.`,
          };
    case "Land / Development":
      return copy === 0
        ? {
            title: `Development land plot — investment-led scheme ${locShort}`,
            overview: `Land plot suited to development schemes and investment-led repositioning with clear site potential.`,
          }
        : {
            title: `Build-to-rent site — land and development ${location}`,
            overview: `Development site with build-to-rent narrative and scheme-ready land assembly.`,
          };
    case "Other":
    default:
      return copy === 0
        ? {
            title: `Mixed-use ancillary building — alternative use ${locShort}`,
            overview: `Mixed-use ancillary layout for alternative operators needing flexible miscellaneous commercial use.`,
          }
        : {
            title: `Miscellaneous commercial opportunity — other use ${location}`,
            overview: `Miscellaneous opportunity with mixed ancillary planning suitable for other specialised use cases.`,
          };
  }
}

function formatSalePrice(n: number) {
  return `GBP ${n.toLocaleString("en-GB")}`;
}

function formatPcm(n: number) {
  return `GBP ${n.toLocaleString("en-GB")} pcm`;
}

function formatPa(n: number) {
  return `GBP ${n.toLocaleString("en-GB")} pa`;
}

function bathsFromBeds(beds?: string): string {
  if (!beds) return "0";
  if (beds.includes("Studio")) return "1";
  if (beds.includes("5+") || beds.includes("6")) return "4";
  const n = Number.parseInt(beds, 10);
  if (Number.isFinite(n)) return String(Math.max(1, Math.min(6, n)));
  return "2";
}

/**
 * Dense catalogue: every UK autocomplete location × every hero sector × (2 buy + 2 rent + 2 sold).
 * Sector keywords are embedded so `matchesHeroSector` always passes for that row’s sector.
 */
export function buildStorePropertyCatalog(): Property[] {
  const sectors = HERO_SECTOR_OPTIONS.filter((s): s is HeroSector => s !== "Any Sector");
  const list: Property[] = [];
  let seq = 0;

  for (let li = 0; li < UK_LOCATIONS.length; li += 1) {
    const location = UK_LOCATIONS[li];
    const hub = hubFor(location);

    for (let si = 0; si < sectors.length; si += 1) {
      const sector = sectors[si];
      const a = sectorContent(sector, location, 0);
      const b = sectorContent(sector, location, 1);

      for (let variant = 0; variant < 6; variant += 1) {
        const mode = variant < 2 ? "buy" : variant < 4 ? "rent" : "sold";
        const twin = variant % 2;
        const isRent = mode === "rent";
        const isSold = mode === "sold";

        let titleCore: string;
        let overviewCore: string;
        if (isRent) {
          titleCore = twin === 0 ? a.title : b.title;
          overviewCore = twin === 0 ? a.overview : b.overview;
        } else if (isSold) {
          titleCore = twin === 0 ? b.title : a.title;
          overviewCore = twin === 0 ? b.overview : a.overview;
        } else if (twin === 0) {
          titleCore = a.title;
          overviewCore = a.overview;
        } else {
          titleCore = b.title;
          overviewCore = b.overview;
        }

        const cat = CATEGORIES[(li + si + variant) % CATEGORIES.length];
        const arche = ARCHETYPES[(li + si + variant) % ARCHETYPES.length];

        let title = titleCore;
        if (cat === "Luxury" && !isRent) {
          title = `Penthouse villa statement — ${titleCore}`;
        }
        if (seq % 19 === 0) {
          title = `Price reduced — ${title}`;
        }

        const bracket = SALE_BRACKETS[(li + si + variant + twin) % SALE_BRACKETS.length];
        const span = Math.max(1, bracket[1] - bracket[0]);
        const salePrice = Math.round(bracket[0] + ((seq * 7919) % span));

        const pcmPrice = 800 + (seq % 38) * 105 + ((si * 41 + li * 13) % 520) + twin * 120;
        const paPrice = 15_000 + (seq % 36) * 2900 + twin * 4500;

        let price: string;
        let type: string;
        let status: string;

        if (isSold) {
          price = formatSalePrice(Math.round(salePrice * (0.9 + twin * 0.04)));
          type = "For Sale";
          status = "Sold";
        } else if (isRent) {
          type = "For Rent";
          status = "For Rent";
          price = twin === 0 ? formatPcm(pcmPrice) : formatPa(paPrice);
        } else {
          type = "For Sale";
          status = seq % 29 === 0 ? "Reserved" : "For Sale";
          price = formatSalePrice(salePrice + twin * 17_500);
        }

        const beds =
          sector === "Industrial / Warehousing" || sector === "Land / Development"
            ? isRent
              ? "Studio"
              : undefined
            : BED_ROTATION[(li + si + variant) % BED_ROTATION.length];

        const lat = hub.lat + (variant - 2.5) * 0.0045 + (seq % 5) * 0.0014;
        const lng = hub.lng + (si % 3 - 1) * 0.007 + (seq % 7) * 0.0011 + twin * 0.00085;

        const locSlug = location
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 28);
        const sectorSlug = sector
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 22);
        const slug = `catalog-${seq}-${locSlug}-${sectorSlug}-v${variant}`;

        const img = images[seq % images.length];
        const overview = `${overviewCore} ${arche} layout emphasising ${sector.toLowerCase()} demand in ${location}. Supporting retail, office, or investor narratives where relevant.`;

        const amenitiesList = [
          `${sector}-appropriate servicing and access`,
          isRent
            ? "Flexible lease terms suited to occupiers"
            : isSold
              ? "Comparable sold benchmarks nearby"
              : "Active buyer interest and viewing availability",
          `Strong ${location.split(",")[0]} location fundamentals`,
        ];

        const featureBullets = [
          ...amenitiesList,
          EXTRA_FEATURES[seq % EXTRA_FEATURES.length],
          EXTRA_FEATURES[(seq + 3) % EXTRA_FEATURES.length],
          EXTRA_FEATURES[(seq + 5) % EXTRA_FEATURES.length],
        ];

        const g0 = img;
        const g1 = images[(seq + 1) % images.length];
        const g2 = images[(seq + 2) % images.length];
        const g3 = images[(seq + 3) % images.length];
        const gallery = [g0, g1, g2, g3];

        const listedAt = new Date(2024 + (seq % 2), (seq % 11) + 1, (seq % 26) + 1).toISOString();

        const newDevelopment =
          sector === "Land / Development" && mode === "buy" && twin === 0;

        list.push({
          id: seq,
          slug,
          image: img,
          gallery,
          title: `${arche} · ${title}`,
          location,
          address: `${location}, United Kingdom`,
          price,
          type,
          area: `${1100 + (seq % 45) * 170} Sq Ft`,
          beds,
          baths: bathsFromBeds(beds),
          category: cat,
          propertyTypeLabel: arche,
          tenure: TENURES[seq % TENURES.length],
          listedAt,
          features: featureBullets,
          status,
          overview,
          amenities: amenitiesList,
          featured: seq % 11 === 0,
          heroFeatured: seq % 29 === 0,
          newDevelopment,
          coordinates: { lat, lng },
        });

        seq += 1;
      }
    }
  }

  for (const cat of CATEGORIES) {
    let n = 0;
    for (const p of list) {
      if (p.category === cat && n < 2) {
        p.featured = true;
        n += 1;
      }
    }
  }

  let nd = list.filter((p) => p.newDevelopment).length;
  for (const p of list) {
    if (nd >= 2) break;
    if (!p.newDevelopment) {
      p.newDevelopment = true;
      nd += 1;
    }
  }

  return list;
}
