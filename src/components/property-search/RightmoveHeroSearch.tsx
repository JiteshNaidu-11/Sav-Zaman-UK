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
  compact,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`relative flex w-full items-center justify-center rounded-full border border-white/20 bg-[#0B1A2F]/75 p-0.5 backdrop-blur-md lg:justify-start ${compact ? "h-7" : "h-8"}`}
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
  compact,
}: {
  sector: HeroSector;
  onChange: (s: HeroSector) => void;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">Sector</p>
        <div className="-mx-0.5 flex gap-1.5 overflow-x-auto pb-0.5 pt-0.5 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/30">
          {HERO_SECTOR_OPTIONS.map((label) => {
            const active = sector === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => onChange(label)}
                className={`shrink-0 rounded-full px-3 py-1 text-left text-xs font-medium transition ${
                  active
                    ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-md"
                    : "border border-white/20 bg-[#152a45]/80 text-white/95 hover:bg-[#1a3f62]/95"
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
  solid,
}: {
  value: string;
  onChange: (v: string) => void;
  solid?: boolean;
}) {
  return (
    <label className="block w-full space-y-1">
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">Area / radius</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full cursor-pointer appearance-none rounded-full border pl-4 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400/45 ${
            solid
              ? "border-white/25 bg-[#152a45]/95 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              : "border-white/20 bg-white/10 py-2.5 backdrop-blur-sm focus:ring-blue-400/50"
          }`}
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

const rootClass: Record<"default" | "overlay", string> = {
  default:
    "mx-auto w-full max-w-xl rounded-2xl border border-white/20 bg-white/10 p-5 text-white shadow-2xl backdrop-blur-xl md:p-6",
  overlay:
    "isolate mx-auto w-full rounded-2xl border border-white/20 bg-gradient-to-b from-[#0f2744]/[0.98] via-[#0c1f38]/[0.98] to-[#081426]/[0.99] p-3.5 text-white shadow-[0_24px_56px_-20px_rgba(0,0,0,0.72),inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-white/10 backdrop-blur-md md:p-4",
};

type RightmoveHeroSearchProps = { variant?: "default" | "overlay" };

export function RightmoveHeroSearch({ variant = "default" }: RightmoveHeroSearchProps) {
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

  const isOverlay = variant === "overlay";
  const block = isOverlay ? "mt-2.5 border-t border-white/10 pt-2.5" : "mt-4 border-t border-white/10 pt-4";

  return (
    <div className={rootClass[variant]}>
      <ListingTypeTabs
        compact={isOverlay}
        tab={tab}
        onChange={(t) => {
          setTab(t);
        }}
      />

      <div className={block}>
        <SectorSelector compact={isOverlay} sector={sector} onChange={setSector} />
      </div>

      <div className={`${block} space-y-1`}>
        <p
          className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${isOverlay ? "text-left text-white/85" : "text-center text-white/55 lg:text-left"}`}
        >
          Location
        </p>
        <LocationAutocomplete
          variant={isOverlay ? "heroOverlay" : "heroGlass"}
          value={locationInput}
          onChange={setLocationInput}
          onPick={setPickedLocation}
          onClearPick={() => setPickedLocation(null)}
        />
      </div>

      <div className={block}>
        <RadiusDropdown solid={isOverlay} value={radius} onChange={setRadius} />
      </div>

      <button
        type="button"
        onClick={runSearch}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#14B8A6] px-4 text-sm font-medium text-white shadow-lg transition hover:scale-[1.02] active:scale-[0.98] ${isOverlay ? "mt-2.5 py-2" : "mt-4 py-2.5"}`}
      >
        <Search className="h-3.5 w-3.5" />
        Search properties
      </button>
    </div>
  );
}
