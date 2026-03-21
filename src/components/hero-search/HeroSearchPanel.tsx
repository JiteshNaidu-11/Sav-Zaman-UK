import { ChevronDown } from "lucide-react";
import { Search } from "lucide-react";
import { AREA_SCOPE_OPTIONS } from "@/data/ukLocations";
import { BuyRentToggle } from "./BuyRentToggle";
import { LocationAutocomplete } from "./LocationAutocomplete";
import { PropertyTypeSelector } from "./PropertyTypeSelector";
import type { HeroListingMode, HeroSector } from "@/lib/propertyHeroSearch";
import type { FormEvent } from "react";

type Props = {
  locationInput: string;
  setLocationInput: (v: string) => void;
  setPickedLocation: (v: string) => void;
  clearPickedLocation: () => void;
  listingMode: HeroListingMode;
  setListingMode: (v: HeroListingMode) => void;
  sector: HeroSector;
  setSector: (v: HeroSector) => void;
  areaScope: string;
  setAreaScope: (v: string) => void;
  onSearchSubmit: (e?: FormEvent) => void;
};

export function HeroSearchPanel({
  locationInput,
  setLocationInput,
  setPickedLocation,
  clearPickedLocation,
  listingMode,
  setListingMode,
  sector,
  setSector,
  areaScope,
  setAreaScope,
  onSearchSubmit,
}: Props) {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-xl">
      <div className="flex justify-center lg:justify-start">
        <BuyRentToggle value={listingMode} onChange={setListingMode} />
      </div>

      <div className="mt-6">
        <PropertyTypeSelector value={sector} onChange={setSector} />
      </div>

      <form onSubmit={onSearchSubmit} className="mt-6 flex flex-col gap-3">
        <LocationAutocomplete
          value={locationInput}
          onChange={setLocationInput}
          onPick={setPickedLocation}
          onClearPick={clearPickedLocation}
        />

        <div className="relative w-full">
          <label htmlFor="hero-area-scope" className="sr-only">
            Area
          </label>
          <select
            id="hero-area-scope"
            value={areaScope}
            onChange={(e) => setAreaScope(e.target.value)}
            aria-label="Area scope"
            className="h-full w-full cursor-pointer appearance-none rounded-2xl border border-white/20 bg-[#0B1A2F]/90 py-3 pl-4 pr-10 text-sm text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            {AREA_SCOPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-[#0B1A2F] text-white">
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-6 py-3.5 text-sm font-semibold tracking-wide text-white shadow-lg transition hover:brightness-110 sm:w-auto sm:self-start"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </form>
    </div>
  );
}
