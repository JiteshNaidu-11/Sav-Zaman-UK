import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LocationAutocomplete } from "@/components/hero-search";
import { BROWSE_AREA_RADIUS_OPTIONS } from "@/lib/propertyBrowseFilter";
import { HERO_SECTOR_OPTIONS, type HeroSector } from "@/lib/propertyHeroSearch";

type Tab = "buy" | "rent" | "sold";

function ListingTypeTabs({
  tab,
  onChange,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <div
      className="relative flex h-8 w-full items-center justify-center rounded-full border border-white/20 bg-[#0B1A2F]/60 p-0.5 backdrop-blur-md lg:justify-start"
      role="tablist"
      aria-label="Listing type"
    >
      {(
        [
          { id: "buy" as const, label: "Buy" },
          { id: "rent" as const, label: "Rent" },
          { id: "sold" as const, label: "Sold" },
        ] as const
      ).map(({ id, label }) => {
        const active = tab === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className="relative flex-1 rounded-full py-1 text-xs font-semibold leading-none tracking-wide transition-colors sm:flex-none sm:px-4 sm:py-1.5 sm:text-sm"
          >
            {active ? (
              <motion.span
                layoutId="hero-listing-tab"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 shadow-md"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            ) : null}
            <span className={`relative z-10 ${active ? "text-white" : "text-white/75 hover:text-white"}`}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function SectorSelector({
  sector,
  onChange,
}: {
  sector: HeroSector;
  onChange: (s: HeroSector) => void;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55 lg:text-left">Sector</p>
      <div className="flex max-h-[120px] flex-wrap justify-center gap-1.5 overflow-y-auto pr-1 lg:max-h-none lg:justify-start [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/25">
        {HERO_SECTOR_OPTIONS.map((label) => {
          const active = sector === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => onChange(label)}
              className={`rounded-full px-4 py-1.5 text-left text-sm font-medium transition ${
                active
                  ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-md"
                  : "border border-white/15 bg-white/10 text-white/90 hover:bg-white/20"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RadiusDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block w-full space-y-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">Area / radius</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none rounded-full border border-white/20 bg-white/10 py-2.5 pl-4 pr-10 text-sm text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50"
        >
          {BROWSE_AREA_RADIUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#0B1A2F] text-white">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/60" />
      </div>
    </label>
  );
}

export function RightmoveHeroSearch() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("buy");
  const [sector, setSector] = useState<HeroSector>("Any Sector");
  const [locationInput, setLocationInput] = useState("");
  const [pickedLocation, setPickedLocation] = useState<string | null>(null);
  const [radius, setRadius] = useState<string>("this_area");

  const runSearch = () => {
    const location = (pickedLocation ?? locationInput).trim();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    params.set("listing", tab);
    params.set("sector", sector);
    params.set("radius", radius);
    const qs = params.toString();
    navigate(qs ? `/properties?${qs}` : "/properties");
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-white/20 bg-white/10 p-5 text-white shadow-2xl backdrop-blur-xl md:p-6">
      <ListingTypeTabs
        tab={tab}
        onChange={(t) => {
          setTab(t);
        }}
      />

      <div className="mt-4 border-t border-white/10 pt-4">
        <SectorSelector sector={sector} onChange={setSector} />
      </div>

      <div className="mt-4 space-y-1.5 border-t border-white/10 pt-4">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55 lg:text-left">
          Location
        </p>
        <LocationAutocomplete
          variant="heroGlass"
          value={locationInput}
          onChange={setLocationInput}
          onPick={setPickedLocation}
          onClearPick={() => setPickedLocation(null)}
        />
      </div>

      <div className="mt-4 border-t border-white/10 pt-4">
        <RadiusDropdown value={radius} onChange={setRadius} />
      </div>

      <button
        type="button"
        onClick={runSearch}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#14B8A6] px-5 py-2.5 text-sm font-medium text-white shadow-lg transition hover:scale-[1.02] active:scale-[0.98]"
      >
        <Search className="h-3.5 w-3.5" />
        Search properties
      </button>
    </div>
  );
}
