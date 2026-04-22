import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { usePropertyBrowse } from "@/context/PropertyBrowseContext";
import { propertyCategories } from "@/data/properties";
import {
  BROWSE_AREA_RADIUS_OPTIONS,
  defaultPropertyBrowseFilters,
  parseFooterBrowseTypeFromUrl,
} from "@/lib/propertyBrowseFilter";
import type { PropertyBrowseListing } from "@/lib/propertyBrowseFilter";
import { parseHeroSector } from "@/lib/propertyHeroSearch";

const categories = new Set<string>(propertyCategories);
const radiusValues = new Set<string>(BROWSE_AREA_RADIUS_OPTIONS.map((o) => o.value));

function parseListing(value: string | null): PropertyBrowseListing | null {
  if (value === "buy" || value === "rent" || value === "sold") return value;
  return null;
}

function parseNumericParam(value: string | null): string {
  if (!value) return "";
  const n = Number(String(value).replace(/[^\d]/g, ""));
  return Number.isFinite(n) && n > 0 ? String(n) : "";
}

/** True when URL carries hero/footer browse params (synced into filter state). */
function browseQueryParamsActive(sp: URLSearchParams): boolean {
  const loc = sp.get("location");
  const cat = sp.get("category");
  const typeParam = sp.get("type");
  const listing = parseListing(sp.get("listing"));
  const sectorRaw = sp.get("sector");
  const radiusRaw = sp.get("radius");
  const minPrice = sp.get("minPrice");
  const maxPrice = sp.get("maxPrice");
  return (
    Boolean(loc?.trim()) ||
    Boolean(cat) ||
    Boolean(typeParam) ||
    listing !== null ||
    Boolean(sectorRaw?.trim()) ||
    Boolean(radiusRaw?.trim()) ||
    Boolean(minPrice?.trim()) ||
    Boolean(maxPrice?.trim())
  );
}

/**
 * Applies search params when landing on `/properties` (hero search, footer deep links, shared URLs).
 * Supported: `location`, `category`, `type` (incl. lowercase footer: commercial, featured, new, …), `listing`, `sector`, `radius`.
 */
export function PropertyBrowseURLSync() {
  const [searchParams] = useSearchParams();
  const { setFilters } = usePropertyBrowse();

  useEffect(() => {
    const q = searchParams.toString();
    if (!q) {
      setFilters(defaultPropertyBrowseFilters);
      return;
    }

    const loc = searchParams.get("location");
    const cat = searchParams.get("category");
    const typeParam = searchParams.get("type");
    const listingRaw = searchParams.get("listing");
    const sectorRaw = searchParams.get("sector");
    const radiusRaw = searchParams.get("radius");
    const minPriceRaw = searchParams.get("minPrice");
    const maxPriceRaw = searchParams.get("maxPrice");

    const listing = parseListing(listingRaw);
    const footerParsed = parseFooterBrowseTypeFromUrl(typeParam);
    const parsedMinPrice = parseNumericParam(minPriceRaw);
    const parsedMaxPrice = parseNumericParam(maxPriceRaw);

    const hasAny =
      Boolean(loc?.trim()) ||
      Boolean(cat) ||
      Boolean(typeParam) ||
      listing !== null ||
      Boolean(sectorRaw?.trim()) ||
      Boolean(radiusRaw?.trim()) ||
      Boolean(parsedMinPrice) ||
      Boolean(parsedMaxPrice);

    if (!hasAny) return;

    const typeFromUrl =
      !footerParsed && typeParam && categories.has(typeParam)
        ? typeParam
        : !footerParsed && cat && categories.has(cat)
          ? cat
          : undefined;

    setFilters((f) => {
      const next = { ...f };

      if (loc) {
        next.location = decodeURIComponent(loc.replace(/\+/g, " "));
      }

      if (listing) {
        next.listing = listing;
        // Only clear price if the URL did not explicitly supply a price range.
        if (!parsedMinPrice && !parsedMaxPrice) {
          next.minPrice = "";
          next.maxPrice = "";
        }
      }

      if (footerParsed) {
        next.type = footerParsed.category;
        next.featuredOnly = footerParsed.featuredOnly;
        next.newDevelopmentOnly = footerParsed.newDevelopmentOnly;
      } else {
        next.featuredOnly = false;
        next.newDevelopmentOnly = false;
        if (typeFromUrl !== undefined) {
          next.type = typeFromUrl;
        } else if (listing && !typeParam && !cat) {
          next.type = "";
        }
      }

      if (sectorRaw?.trim()) {
        const decoded = decodeURIComponent(sectorRaw.replace(/\+/g, " "));
        next.sector = parseHeroSector(decoded);
      }

      if (radiusRaw?.trim() && radiusValues.has(radiusRaw)) {
        next.radius = radiusRaw;
      }

      if (parsedMinPrice) next.minPrice = parsedMinPrice;
      if (parsedMaxPrice) next.maxPrice = parsedMaxPrice;

      return next;
    });
  }, [searchParams.toString(), setFilters]);

  useEffect(() => {
    const q = searchParams.toString();
    if (!q || !browseQueryParamsActive(searchParams)) return;

    const scrollToFilters = () => {
      const el = document.getElementById("property-filters");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    requestAnimationFrame(() => requestAnimationFrame(scrollToFilters));
  }, [searchParams.toString()]);

  return null;
}
