import { useCallback, useDeferredValue, useMemo, useState, type FormEvent } from "react";
import { filterHeroSearchDemoProperties } from "@/lib/heroSearchFilter";
import { HERO_SEARCH_DEMO_PROPERTIES } from "@/data/heroSearchDemoProperties";
import type { HeroListingMode, HeroSector } from "@/lib/propertyHeroSearch";

export function useHeroSearchFilters() {
  const [locationInput, setLocationInput] = useState("");
  const [pickedLocation, setPickedLocation] = useState<string | null>(null);
  const [listingMode, setListingMode] = useState<HeroListingMode>("buy");
  const [sector, setSector] = useState<HeroSector>("Any Sector");
  const [areaScope, setAreaScope] = useState("This area only");

  const locationNeedle = (pickedLocation ?? locationInput).trim();

  const deferredListing = useDeferredValue(listingMode);
  const deferredSector = useDeferredValue(sector);
  const deferredArea = useDeferredValue(areaScope);
  const deferredNeedle = useDeferredValue(locationNeedle);

  const isStale =
    listingMode !== deferredListing ||
    sector !== deferredSector ||
    areaScope !== deferredArea ||
    locationNeedle !== deferredNeedle;

  const filtered = useMemo(
    () =>
      filterHeroSearchDemoProperties(HERO_SEARCH_DEMO_PROPERTIES, {
        listingMode: deferredListing,
        sector: deferredSector,
        areaScope: deferredArea,
        locationNeedle: deferredNeedle,
      }),
    [deferredListing, deferredSector, deferredArea, deferredNeedle],
  );

  const handleSearchSubmit = useCallback((event?: FormEvent) => {
    event?.preventDefault();
    document.getElementById("hero-search-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const clearPickedLocation = useCallback(() => {
    setPickedLocation(null);
  }, []);

  return {
    locationInput,
    setLocationInput,
    pickedLocation,
    setPickedLocation,
    clearPickedLocation,
    listingMode,
    setListingMode,
    sector,
    setSector,
    areaScope,
    setAreaScope,
    filtered,
    isStale,
    handleSearchSubmit,
  };
}
