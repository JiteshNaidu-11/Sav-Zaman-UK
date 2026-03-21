import { LocationAutocomplete } from "@/components/hero-search";
import { usePropertyBrowseStickyActive } from "@/context/PropertyBrowseStickyContext";
import { usePropertyBrowse } from "@/context/PropertyBrowseContext";
import { cn } from "@/lib/utils";
import { propertyCategories } from "@/data/properties";
import { BROWSE_AREA_RADIUS_OPTIONS } from "@/lib/propertyBrowseFilter";
import { HERO_SECTOR_OPTIONS, type HeroSector } from "@/lib/propertyHeroSearch";

export const BROWSE_SALE_MIN_OPTIONS = [
  { value: "", label: "Any" },
  { value: "250000", label: "£250k+" },
  { value: "500000", label: "£500k+" },
  { value: "750000", label: "£750k+" },
  { value: "1000000", label: "£1m+" },
] as const;

export const BROWSE_SALE_MAX_OPTIONS = [
  { value: "", label: "Any" },
  { value: "500000", label: "Up to £500k" },
  { value: "1000000", label: "Up to £1m" },
  { value: "2000000", label: "Up to £2m" },
  { value: "5000000", label: "Up to £5m" },
  { value: "10000000", label: "Up to £10m" },
] as const;

export const BROWSE_PCM_MIN_OPTIONS = [
  { value: "", label: "Any" },
  { value: "500", label: "£500+/pcm" },
  { value: "1000", label: "£1k+/pcm" },
  { value: "2500", label: "£2.5k+/pcm" },
  { value: "5000", label: "£5k+/pcm" },
] as const;

export const BROWSE_PCM_MAX_OPTIONS = [
  { value: "", label: "Any" },
  { value: "2000", label: "Up to £2k pcm" },
  { value: "5000", label: "Up to £5k pcm" },
  { value: "10000", label: "Up to £10k pcm" },
  { value: "25000", label: "Up to £25k pcm" },
] as const;

export const BROWSE_CATEGORY_OPTIONS = ["", ...propertyCategories] as const;

export function HomePropertiesFiltersBar() {
  const { filters, setFilters, resetFilters } = usePropertyBrowse();
  const browseStickyActive = usePropertyBrowseStickyActive();
  const isRent = filters.listing === "rent";
  const minOpts = isRent ? BROWSE_PCM_MIN_OPTIONS : BROWSE_SALE_MIN_OPTIONS;
  const maxOpts = isRent ? BROWSE_PCM_MAX_OPTIONS : BROWSE_SALE_MAX_OPTIONS;
  const radiusSelectValue = BROWSE_AREA_RADIUS_OPTIONS.some((o) => o.value === filters.radius)
    ? filters.radius
    : "this_area";

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-4 shadow-md",
        browseStickyActive ? "relative z-10" : "sticky top-20 z-30 md:top-24",
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Listing</span>
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
            {(
              [
                { id: "buy" as const, label: "Buy" },
                { id: "rent" as const, label: "Rent" },
                { id: "sold" as const, label: "Sold" },
              ] as const
            ).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() =>
                  setFilters((f) => ({
                    ...f,
                    listing: id,
                    minPrice: "",
                    maxPrice: "",
                  }))
                }
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filters.listing === id
                    ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-b border-slate-100 pb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sector</span>
          <div className="mt-2 flex max-h-28 flex-wrap gap-2 overflow-y-auto sm:max-h-none">
            {HERO_SECTOR_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilters((f) => ({ ...f, sector: s as HeroSector }))}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
                  filters.sector === s
                    ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-sm"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-wrap items-end gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300">
          <label className="flex min-w-[200px] shrink-0 flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Location</span>
            <LocationAutocomplete
              variant="light"
              value={filters.location}
              onChange={(v) => setFilters((f) => ({ ...f, location: v }))}
              onPick={(picked) => setFilters((f) => ({ ...f, location: picked }))}
              onClearPick={() => {}}
            />
          </label>

          <label className="flex min-w-[120px] shrink-0 flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Radius</span>
            <select
              value={radiusSelectValue}
              onChange={(e) => setFilters((f) => ({ ...f, radius: e.target.value }))}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {BROWSE_AREA_RADIUS_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex min-w-[140px] shrink-0 flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Property type</span>
            <select
              value={filters.type}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  type: e.target.value,
                  featuredOnly: false,
                  newDevelopmentOnly: false,
                }))
              }
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Any</option>
              {BROWSE_CATEGORY_OPTIONS
                .filter(Boolean)
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </label>

          <label className="flex min-w-[120px] shrink-0 flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Min {isRent ? "(pcm)" : ""}</span>
            <select
              value={filters.minPrice}
              onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {minOpts.map((o) => (
                <option key={o.value || "any"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex min-w-[120px] shrink-0 flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Max {isRent ? "(pcm)" : ""}</span>
            <select
              value={filters.maxPrice}
              onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {maxOpts.map((o) => (
                <option key={o.value || "any"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={resetFilters}
            className="ml-auto shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            Reset filters
          </button>
        </div>
      </div>
    </div>
  );
}
