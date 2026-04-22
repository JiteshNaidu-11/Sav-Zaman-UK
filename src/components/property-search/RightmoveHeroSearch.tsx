import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LocationAutocomplete } from "@/components/hero-search";
import { BROWSE_AREA_RADIUS_OPTIONS } from "@/lib/propertyBrowseFilter";
import { HERO_SECTOR_OPTIONS, type HeroSector } from "@/lib/propertyHeroSearch";
import { Slider } from "@/components/ui/slider";

type Tab = "buy" | "rent" | "sold";

function formatGBP(n: number) {
  return `£${n.toLocaleString("en-GB")}`;
}

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

function RadiusSlider({
  value,
  onChange,
  solid,
}: {
  value: string;
  onChange: (v: string) => void;
  solid?: boolean;
}) {
  const currentIndex = Math.max(
    0,
    BROWSE_AREA_RADIUS_OPTIONS.findIndex((o) => o.value === value),
  );
  const display = BROWSE_AREA_RADIUS_OPTIONS[currentIndex]?.label ?? "This area only";

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">Area / radius</span>
        <span className="text-xs font-semibold text-white/90">{display}</span>
      </div>
      <div
        className={`rounded-2xl border px-4 py-3 ${
          solid
            ? "border-white/25 bg-[#152a45]/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
            : "border-white/20 bg-white/10 backdrop-blur-sm"
        }`}
      >
        <Slider
          value={[currentIndex]}
          min={0}
          max={BROWSE_AREA_RADIUS_OPTIONS.length - 1}
          step={1}
          aria-label="Area radius"
          onValueChange={(v) => {
            const idx = Math.round(v[0] ?? 0);
            const next = BROWSE_AREA_RADIUS_OPTIONS[Math.min(Math.max(idx, 0), BROWSE_AREA_RADIUS_OPTIONS.length - 1)];
            if (next) onChange(next.value);
          }}
          className="w-full"
        />
        <div className="mt-2 flex justify-between text-[10px] font-semibold tracking-wide text-white/55">
          <span>This area</span>
          <span>Nationwide</span>
        </div>
      </div>
    </div>
  );
}

function PriceRangeSlider({
  value,
  onChange,
  compact,
  tab,
}: {
  value: [number, number];
  onChange: (v: [number, number]) => void;
  compact?: boolean;
  tab: Tab;
}) {
  const max = tab === "rent" ? 200_000 : 5_000_000;
  // Smaller steps feel smoother while dragging.
  const step = tab === "rent" ? 500 : 5_000;
  const [minV, maxV] = value;
  const minSafe = Math.min(minV, maxV);
  const maxSafe = Math.max(minV, maxV);
  const label = `${formatGBP(minSafe)} – ${formatGBP(maxSafe)}`;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
          Price {tab === "rent" ? "(per year)" : ""}
        </span>
        <span className={`font-semibold text-white/90 ${compact ? "text-xs" : "text-sm"}`}>{label}</span>
      </div>
      <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
        <Slider
          value={[minSafe, maxSafe]}
          min={0}
          max={max}
          step={step}
          minStepsBetweenThumbs={1}
          aria-label="Price range"
          onValueChange={(v) => {
            const nextMin = Math.max(0, Math.min(Number(v[0] ?? 0), max));
            const nextMax = Math.max(0, Math.min(Number(v[1] ?? max), max));
            onChange([Math.min(nextMin, nextMax), Math.max(nextMin, nextMax)]);
          }}
          className="w-full"
        />
        <div className="mt-2 flex justify-between text-[10px] font-semibold tracking-wide text-white/55">
          <span>{formatGBP(0)}</span>
          <span>{formatGBP(max)}</span>
        </div>
      </div>
    </div>
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
  const [price, setPrice] = useState<[number, number]>([0, 1_000_000]);

  // Keep the range in-bounds when switching between buy/rent/sold.
  useEffect(() => {
    const boundsMax = tab === "rent" ? 200_000 : 5_000_000;
    const defaultMax = tab === "rent" ? 60_000 : 1_000_000;
    setPrice(([minV, maxV]) => {
      const nextMin = Math.max(0, Math.min(minV, boundsMax));
      const nextMax = Math.max(nextMin, Math.min(maxV, boundsMax));
      if (nextMax !== maxV || nextMin !== minV) return [nextMin, nextMax];
      if (maxV === 1_000_000 && tab === "rent") return [minV, defaultMax];
      if (maxV === 60_000 && tab !== "rent") return [minV, defaultMax];
      return [minV, maxV];
    });
  }, [tab]);

  const runSearch = () => {
    const location = (pickedLocation ?? locationInput).trim();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    params.set("listing", tab);
    params.set("sector", sector);
    params.set("radius", radius);
    const [minPrice, maxPrice] = price;
    if (minPrice > 0) params.set("minPrice", String(minPrice));
    if (maxPrice > 0) params.set("maxPrice", String(maxPrice));
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
        <RadiusSlider solid={isOverlay} value={radius} onChange={setRadius} />
      </div>

      <div className={block}>
        <PriceRangeSlider compact={isOverlay} tab={tab} value={price} onChange={setPrice} />
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
