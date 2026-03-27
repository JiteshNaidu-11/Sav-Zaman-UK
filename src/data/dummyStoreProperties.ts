import type { Property } from "./properties";

// Import all numbered property folders (P1..P11) so each deal can render its image gallery.
const propertyFolderImages = import.meta.glob("@/assets/P*/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function folderFromKey(key: string): string | null {
  const normalized = key.replace(/\\/g, "/");
  const parts = normalized.split("/");
  return parts.find((p) => /^P\d+$/.test(p)) ?? null;
}

function fileNumberFromKey(key: string): number {
  const normalized = key.replace(/\\/g, "/");
  const base = normalized.split("/").pop() || "";
  const numPart = base.replace(/\.[^.]+$/, "");
  const n = Number.parseInt(numPart, 10);
  return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER;
}

function galleryForFolder(folder: string): string[] {
  return Object.entries(propertyFolderImages)
    .filter(([key]) => folderFromKey(key) === folder)
    .sort(([aKey], [bKey]) => fileNumberFromKey(aKey) - fileNumberFromKey(bKey))
    .map(([, src]) => src);
}

function createPropertyFromFolder(input: {
  id: number;
  slug: string;
  folder: string;
  title: string;
  location: string;
  address: string;
  price: string;
  type: string;
  area: string;
  beds?: string;
  baths?: string;
  category: string;
  propertyTypeLabel?: string;
  tenure?: string;
  listedAt?: string;
  features?: string[];
  overview: string;
  amenities: string[];
  status: string;
  featured?: boolean;
  heroFeatured?: boolean;
  newDevelopment?: boolean;
  coordinates?: { lat: number; lng: number };
}): Property {
  const gallery = galleryForFolder(input.folder);
  const image = gallery[0] || "";

  return {
    id: input.id,
    slug: input.slug,
    image,
    gallery,
    title: input.title,
    location: input.location,
    address: input.address,
    price: input.price,
    type: input.type,
    area: input.area,
    beds: input.beds,
    baths: input.baths,
    category: input.category,
    propertyTypeLabel: input.propertyTypeLabel,
    tenure: input.tenure,
    listedAt: input.listedAt ?? new Date("2026-03-27").toISOString(),
    features: input.features,
    overview: input.overview,
    amenities: input.amenities,
    status: input.status,
    featured: Boolean(input.featured),
    heroFeatured: Boolean(input.heroFeatured),
    newDevelopment: input.newDevelopment,
    coordinates: input.coordinates,
  };
}

export function buildStorePropertyCatalog(): Property[] {
  return [
    // P1
    createPropertyFromFolder({
      id: 1,
      slug: "commercial-unit-apartments-95-95a-skinner-street",
      folder: "P1",
      title: "Commercial unit/apartments 12.5% Yield",
      location: "95 / 95A Skinner Street",
      address: "95 / 95A Skinner Street, United Kingdom",
      price: "GBP 125,000",
      type: "For Sale",
      area: "Semi-commercial",
      beds: "2 Bed",
      baths: "1",
      category: "Investment",
      propertyTypeLabel: "Semi-commercial",
      tenure: "Leasehold",
      listedAt: new Date("2026-03-27").toISOString(),
      features: [
        "Purchase price: GBP 125,000",
        "Buyer fee: GBP 5,000",
        "Ground-floor retail unit on 5-year lease (Fireworks shop)",
        "Retail rent: GBP 600 pcm",
        "2-bedroom apartment upstairs",
        "Apartment rent: GBP 700 pcm",
        "Total rent: GBP 1,300 pcm / GBP 15,600 pa",
        "Gross yield: 12.5%",
        "Turnkey, hands-off investment potential",
      ],
      status: "For Sale",
      overview:
        "Turnkey semi-commercial investment opportunity at 95 / 95A Skinner Street. Includes a ground-floor retail unit and a 2-bedroom apartment above, generating GBP 1,300 pcm (GBP 15,600 pa) with an estimated gross yield of 12.5%.",
      amenities: ["Retail tenant on 5-year lease", "Residential apartment above", "Income-producing from day one"],
      featured: true,
      heroFeatured: true,
      newDevelopment: false,
      coordinates: { lat: 53.8, lng: -1.55 },
    }),

    // P2
    createPropertyFromFolder({
      id: 2,
      slug: "blackford-nurseries-florist-garden-centre",
      folder: "P2",
      title: "Blackford Nurseries - Florist & Garden Centre Investment (2.5 Acres)",
      location: "Hartlepool",
      address: "25 Stockton Rd, Hartlepool TS25 2PN, UK",
      price: "GBP 350",
      type: "For Sale",
      area: "2.5 acres",
      beds: "3 Bed",
      baths: "1",
      category: "Investment",
      propertyTypeLabel: "Garden centre business",
      listedAt: new Date("2026-03-27").toISOString(),
      features: [
        "Retirement bargain: business + bungalow + land in one",
        "3-bed bungalow",
        "2-bed static caravan",
        "2.5 acres in total",
        "Fully running garden centre / nursery business",
        "Direct to vendor",
        "Purchase price: GBP 350",
        "Buyer fees: GBP 10,000",
        "Potential to keep as-is or expand (e.g., log cabin park / holiday homes)",
      ],
      status: "For Sale",
      overview:
        "A retirement-led opportunity combining a fully running garden centre/nursery business with a bungalow and static caravan on a total of 2.5 acres. Ideal for investors who want options: keep the business running or develop the site further (log cabins/holiday homes).",
      amenities: ["2.5 acres of land", "Fully running garden centre nursery business", "3-bed bungalow", "2-bed static caravan", "Direct to vendor"],
      featured: false,
      heroFeatured: false,
      newDevelopment: false,
      coordinates: { lat: 54.69, lng: -1.21 },
    }),

    // P3
    createPropertyFromFolder({
      id: 3,
      slug: "8a-seaside-lane-20-percent-yield",
      folder: "P3",
      title: "Seaside No Brainer 20% Yield",
      location: "Seaside Lane",
      address: "8A Seaside Lane, SR8 3PF, UK",
      price: "GBP 150,000",
      type: "For Sale",
      area: "Seaside investment",
      beds: "4 Bed",
      baths: "1",
      category: "Investment",
      propertyTypeLabel: "Retail + apartment (investment)",
      listedAt: new Date("2026-03-27").toISOString(),
      features: [
        "Purchase price: GBP 150,000",
        "Buyer fees: GBP 5,000",
        "2 x retail units",
        "Retail unit rented at GBP 6,000 pa (barber shop)",
        "Vacant retail unit refurbished and ready to rent at GBP 6,000 pa",
        "4-bedroom apartment producing GBP 1,500 pcm via Airbnb",
        "Potential: convert to 4-bed HMO if needed",
        "Garage and rear land rentable at GBP 200 pcm",
        "Estimated yield: 20%",
      ],
      status: "For Sale",
      overview:
        "A simple, high-yield seaside investment combining two retail units with an upstairs 4-bedroom apartment. One retail unit is already rented, the other is refurbished and ready to let, while the apartment generates strong short-stay income (with HMO potential).",
      amenities: ["2 retail units", "4-bedroom apartment (Airbnb)", "Garage + rear land", "One retail unit ready to rent"],
      featured: false,
      heroFeatured: false,
      newDevelopment: false,
    }),

    // P4
    createPropertyFromFolder({
      id: 4,
      slug: "75-77-bolckow-road-12-bed-hmo",
      folder: "P4",
      title: "12 Bed HMO with Drawings (Urgent Sale)",
      location: "Middlesbrough",
      address: "75-77 Bolckow Road, TS6 7ED, UK",
      price: "GBP 180,000",
      type: "For Sale",
      area: "12 Bed HMO (drawings)",
      beds: "12 Bed",
      category: "Investment",
      propertyTypeLabel: "HMO development opportunity",
      listedAt: new Date("2026-03-27").toISOString(),
      features: [
        "Urgent sale: make an offer",
        "2 x 6-bed HMO potential",
        "Purchase price (for both): GBP 180,000",
        "Only drawings submitted (planning not submitted)",
        "Rooms designed for ensuite facilities",
        "Each building includes office & bathroom",
        "Includes additional land to the rear",
        "Estimated renovation/finish: GBP 50,000 - GBP 70,000",
        "Potential for serviced accommodation for local contractors",
      ],
      status: "For Sale",
      overview:
        "An urgent 12-bed HMO opportunity with drawings prepared and strong serviced accommodation potential. The property includes two 6-bed HMO buildings (ensuite room design, offices, and bathroom facilities) plus additional rear land, with estimated renovation/finish costs in the GBP 50k–70k range.",
      amenities: ["2 x 6-bed HMO potential", "Ensuite room design", "Office + bathroom per building", "Rear land included", "Drawings submitted"],
      featured: false,
      heroFeatured: false,
      newDevelopment: false,
    }),

    // P5
    createPropertyFromFolder({
      id: 5,
      slug: "80-high-northgate-commercial-unit-3-apartments",
      folder: "P5",
      title: "80 High Northgate - Commercial Unit + 3 Apartments (14% - 17% Yield)",
      location: "Darlington",
      address: "80 High Northgate, DL1 1UW, UK",
      price: "GBP 210,000",
      type: "For Sale",
      area: "Commercial + apartments",
      category: "Investment",
      propertyTypeLabel: "Commercial + apartments",
      listedAt: new Date("2026-03-27").toISOString(),
      features: [
        "Purchase price: GBP 210,000",
        "Buyer fees: GBP 5,000",
        "Apartments rented via Airbnb and Booking.com",
        "Apartments income: GBP 25,000 per year",
        "Additional cash repeat bookings: GBP 5,000 per year",
        "Commercial unit currently vacant, with negotiations for new tenants (~GBP 500 - GBP 600 per calendar month)",
        "Estimated total yield: 14% - 17% (depending on commercial tenant terms)",
        "Management team available for hands-off investment",
      ],
      status: "For Sale",
      overview:
        "A high-yield mixed-use investment combining a commercial unit with three apartments. The apartments generate income via Airbnb/Booking.com, and the commercial unit is currently vacant but actively being negotiated with potential tenants, targeting an overall yield between 14% and 17%.",
      amenities: ["3 apartments (Airbnb/Booking)", "Commercial unit with tenant potential", "Yield-focused investment", "Management team available"],
      featured: false,
      heroFeatured: false,
      newDevelopment: false,
    }),

    // P6
    createPropertyFromFolder({
      id: 6,
      slug: "victoria-apartments-ts6-6lz-solid-turkey-investment",
      folder: "P6",
      title: "Victoria Apartments - Solid Turkey Investment",
      location: "Middlesbrough",
      address: "Victoria Apartments, TS6 6LZ, Middlesbrough, UK",
      price: "GBP 650,000",
      type: "For Sale",
      area: "12 Apartments",
      category: "Investment",
      propertyTypeLabel: "Leased apartments",
      listedAt: new Date("2026-03-27").toISOString(),
      features: [
        "Brand-new building",
        "12 apartments in total (10 x 2-bed, 2 x 3-bed)",
        "10-year building/structure warranty",
        "Compliant with British fire regulations",
        "Fully insulated with acoustic soundproof flooring",
        "Fully electric building (no gas)",
        "3 ground-floor apartments with disabled facilities",
        "Leased to a company on a 5-year lease (3.5 years remaining)",
        "Rent: GBP 5,500 per month",
      ],
      status: "For Sale",
      overview:
        "Victoria Apartments is a brand-new, fully leased apartment building offering stable investment income. The development comprises 12 apartments with warranties and fire compliance, a fully electric build, and disabled facilities on selected ground-floor units, leased to a company under a 5-year agreement with 3.5 years remaining.",
      amenities: ["Fully electric building", "10-year warranty", "Fire compliant", "5-year lease to company", "12 apartments"],
      featured: false,
      heroFeatured: false,
      newDevelopment: false,
    }),

    // P7
    createPropertyFromFolder({
      id: 7,
      slug: "nice-little-3-house-portfolio-11-yield",
      folder: "P7",
      title: "NICE LITTLE 3 HOUSE PORTFOLIO 11% YIELD",
      location: "Durham",
      address: "Newton Street DL17 8PW / Davy Street DL17 8PN / Eden Terrace DL17 0EJ, UK",
      price: "GBP 50k each",
      type: "For Sale",
      area: "3-house portfolio",
      beds: "2 Bed",
      category: "Investment",
      propertyTypeLabel: "Portfolio investment",
      listedAt: new Date("2026-03-27").toISOString(),
      features: [
        "Buy 1 or all 3 (discount on all 3)",
        "Newton Street DL17 8PW: 2 bedroom, rented at GBP 450 pcm",
        "Davy Street DL17 8PN: 2 bedroom, rented at GBP 475 pcm",
        "Eden Terrace DL17 0EJ: 2 bedroom, rented at GBP 450 pcm",
        "Purchaee: GBP 50k each",
        "Rent: GBP 450 / GBP 475 pcm",
        "Yield: 11%",
        "Will need a 4 week completion",
        "Can do a goid deal on all 3",
        "Managed with a letting company (8% + VAT management fee)",
      ],
      status: "For Sale",
      overview:
        "Nice little 3-house portfolio in Durham with excellent tenants and rents all up to date. Buy one or buy all three, with discount potential on a full portfolio purchase.",
      amenities: ["3 x two-bedroom houses", "Rented and managed", "Hands-off investment potential"],
      featured: false,
      heroFeatured: false,
      newDevelopment: false,
    }),

    // P8
    createPropertyFromFolder({
      id: 8,
      slug: "waterloo-terrace-shildon-14-5-yield",
      folder: "P8",
      title: "14.5% YIELD LOW ENTRY INVESTMENT",
      location: "Shildon, County Durham",
      address: "Waterloo Terrace, Shildon, County Durham, DL4 1AU, UK",
      price: "GBP 49,995 all in",
      type: "For Sale",
      area: "Terraced property",
      beds: "2 Bed",
      baths: "1",
      category: "Investment",
      propertyTypeLabel: "Terraced house",
      listedAt: new Date("2026-03-27").toISOString(),
      features: [
        "Two-bedroom terraced property",
        "Offered with vacant possession",
        "Ideal investment opportunity",
        "Scope to add value",
        "Established residential location",
        "No onward chain",
        "Purchase: GBP 49,995 all in",
        "Potential rent: GBP 600 pcm",
        "Current value: GBP 65k",
        "Yield: 14.5%",
      ],
      status: "For Sale",
      overview:
        "Low-entry investment opportunity in Waterloo Terrace, Shildon. A two-bedroom terraced property offered with vacant possession and scope to add value, suitable for investors seeking a straightforward acquisition.",
      amenities: ["Vacant possession", "No onward chain", "Established residential location"],
      featured: false,
      heroFeatured: false,
      newDevelopment: false,
    }),

    // P9
    createPropertyFromFolder({
      id: 9,
      slug: "park-lane-middlesbrough-urgent-sale-bmv",
      folder: "P9",
      title: "URGENT SALE BE QUICK BMV",
      location: "Middlesbrough",
      address: "Park Lane, Middlesbrough, TS1 3LQ, UK",
      price: "GBP 61k",
      type: "For Sale",
      area: "Two-bedroom property",
      beds: "2 Bed",
      baths: "1",
      category: "Investment",
      propertyTypeLabel: "Residential investment",
      listedAt: new Date("2026-03-27").toISOString(),
      features: [
        "2 bed",
        "Vacant",
        "Next to university",
        "New boiler",
        "Minor refurb: GBP 5k",
        "Purchase: GBP 61k",
        "Fees: GBP 3k",
        "Rent: GBP 800 pcm - GBP 1000 pcm",
        "Yeild: 15% - 20%",
        "Stone throw from university",
      ],
      status: "For Sale",
      overview:
        "Urgent BMV sale in Park Lane, Middlesbrough (TS1), close to the university and Albert Park. A two-bedroom property with strong rental demand and upside after minor refurbishment.",
      amenities: ["Close to university", "Close to local amenities", "New boiler", "Vacant now"],
      featured: false,
      heroFeatured: false,
      newDevelopment: false,
    }),

    // P10
    createPropertyFromFolder({
      id: 10,
      slug: "shaftesbury-street-8-bed-hmo-for-sale",
      folder: "P10",
      title: "8BED HMO FOR SALE",
      location: "Stockton-on-Tees",
      address: "Shaftesbury Street, Stockton-on-Tees, Cleveland, TS18 3EL, UK",
      price: "GBP 165k including fees",
      type: "For Sale",
      area: "HMO",
      beds: "8 Bed",
      category: "Investment",
      propertyTypeLabel: "HMO + flat + studio",
      listedAt: new Date("2026-03-27").toISOString(),
      features: [
        "Includes 1 bed flat + 1 bed studio (8 rooms in total)",
        "Strong cashflow HMO opportunity",
        "Two studio flats + 6 rooms producing GBP 28,387.92 PA",
        "Rent: GBP 28k per year",
        "Purchase: GBP 165k including fees",
        "Yield: 17%",
        "Key Feature 1: GBP 28,387.92 annual income",
        "Key Feature 2: 6 rooms + 1 self-contained flat + 1 studio",
        "Key Feature 3: Attractive entry point into a high-yielding rental market",
      ],
      status: "For Sale",
      overview:
        "Solid HMO investment in Stockton-on-Tees with strong cashflow profile. Includes 6 rooms, 1 self-contained flat, and 1 studio, creating a combined annual income opportunity around GBP 28k+.",
      amenities: ["8 rooms total", "Includes flat + studio", "High-yielding rental setup"],
      featured: false,
      heroFeatured: false,
      newDevelopment: false,
    }),

    // P11
    createPropertyFromFolder({
      id: 11,
      slug: "81-northgate-guisborough-development-opportunity",
      folder: "P11",
      title: "PERFECT DEVELOPMENT OPPORTUNITY",
      location: "Guisborough",
      address: "81 Northgate, Guisborough, TS14 6JR, UK",
      price: "GBP 120k",
      type: "For Sale",
      area: "Development land",
      category: "Investment",
      propertyTypeLabel: "Development opportunity",
      listedAt: new Date("2026-03-27").toISOString(),
      features: [
        "Previously known as the Globe pub in Guisbrough",
        "Now demolished and granted planning permission for 4 x 3 bed houses",
        "Ground sampling completed with relevant reports approved",
        "Nothing holding back a build start",
        "Purchase price: GBP 120k",
        "Fees: GBP 5k",
        "Value once built: GBP 130k - GBP 150k each house",
        "Rental value: GBP 750 - GBP 800 pcm each house",
      ],
      status: "For Sale",
      overview:
        "Perfect development opportunity at 81 Northgate, Guisborough. Site has been demolished, planning is granted for four 3-bed houses, and ground reports are approved, enabling immediate build-start potential.",
      amenities: ["Planning granted", "Ground reports approved", "4 x 3-bed house scheme"],
      featured: false,
      heroFeatured: false,
      newDevelopment: true,
    }),
  ];
}
