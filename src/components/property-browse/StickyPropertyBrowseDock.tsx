import { useState } from "react";
import { LocationAutocomplete } from "@/components/hero-search";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePropertyBrowse } from "@/context/PropertyBrowseContext";
import { BROWSE_AREA_RADIUS_OPTIONS } from "@/lib/propertyBrowseFilter";
import type { PropertyBrowseSort } from "@/lib/propertyBrowseFilter";
import { HERO_SECTOR_OPTIONS, type HeroSector } from "@/lib/propertyHeroSearch";
import { SlidersHorizontal } from "lucide-react";
import {
  BROWSE_CATEGORY_OPTIONS,
  BROWSE_PCM_MAX_OPTIONS,
  BROWSE_PCM_MIN_OPTIONS,
  BROWSE_SALE_MAX_OPTIONS,
  BROWSE_SALE_MIN_OPTIONS,
} from "./HomePropertiesFiltersBar";
import { PROPERTY_BROWSE_SORT_LABELS } from "./HomePropertiesSortRow";

const selectPill =
  "h-9 min-w-0 shrink-0 cursor-pointer appearance-none rounded-full border-0 bg-white py-2 pl-3.5 pr-8 text-sm text-slate-900 shadow-sm ring-1 ring-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500/35";

function scrollToBrowseResults() {
  document.getElementById("property-browse-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function StickyPropertyBrowseDock() {
  const { filters, setFilters, resetFilters, resultCount, sort, setSort, viewMode, setViewMode, isFallbackResults } =
    usePropertyBrowse();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isRent = filters.listing === "rent";
  const minOpts = isRent ? BROWSE_PCM_MIN_OPTIONS : BROWSE_SALE_MIN_OPTIONS;
  const maxOpts = isRent ? BROWSE_PCM_MAX_OPTIONS : BROWSE_SALE_MAX_OPTIONS;
  const radiusSelectValue = BROWSE_AREA_RADIUS_OPTIONS.some((o) => o.value === filters.radius)
    ? filters.radius
    : "this_area";

  return (
    <div className="bg-[#0B1A2F] shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
      <div className="mx-auto flex max-w-[1200px] flex-nowrap items-center gap-3 overflow-x-auto px-5 py-3 [scrollbar-width:thin]">
        <div className="min-w-[min(100%,220px)] max-w-[280px] shrink-0">
          <LocationAutocomplete
            variant="stickyBar"
            placeholder="City or area"
            value={filters.location}
            onChange={(v) => setFilters((f) => ({ ...f, location: v }))}
            onPick={(picked) => setFilters((f) => ({ ...f, location: picked }))}
            onClearPick={() => {}}
          />
        </div>

        <select
          aria-label="Radius"
          value={radiusSelectValue}
          onChange={(e) => setFilters((f) => ({ ...f, radius: e.target.value }))}
          className={`${selectPill} min-w-[118px]`}
        >
          {BROWSE_AREA_RADIUS_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        <select
          aria-label={isRent ? "Minimum rent (pcm)" : "Minimum price"}
          value={filters.minPrice}
          onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
          className={`${selectPill} min-w-[104px]`}
        >
          {minOpts.map((o) => (
            <option key={o.value || "any-min"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          aria-label={isRent ? "Maximum rent (pcm)" : "Maximum price"}
          value={filters.maxPrice}
          onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
          className={`${selectPill} min-w-[104px]`}
        >
          {maxOpts.map((o) => (
            <option key={o.value || "any-max"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          aria-label="Property type"
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          className={`${selectPill} min-w-[132px]`}
        >
          <option value="">Any type</option>
          {BROWSE_CATEGORY_OPTIONS.filter(Boolean).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-white px-3.5 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200/80 transition hover:bg-slate-50"
            >
              <SlidersHorizontal className="h-4 w-4 text-slate-600" aria-hidden />
              Filters
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="z-[60] w-[min(100vw-2rem,380px)] border-slate-200 p-4" sideOffset={8}>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Listing</p>
                <div className="mt-2 inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
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
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
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

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sector</p>
                <div className="mt-2 flex max-h-32 flex-wrap gap-2 overflow-y-auto">
                  {HERO_SECTOR_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFilters((f) => ({ ...f, sector: s as HeroSector }))}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition sm:text-sm ${
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

              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  setFiltersOpen(false);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                Reset filters
              </button>
            </div>
          </PopoverContent>
        </Popover>

        <button
          type="button"
          onClick={scrollToBrowseResults}
          className="inline-flex h-9 shrink-0 items-center rounded-full bg-gradient-to-r from-[#2563EB] to-[#14B8A6] px-[18px] text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
        >
          Search
        </button>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-5 py-2.5 text-sm text-white/90 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-semibold text-white">{resultCount}</span>{" "}
            {resultCount === 1 ? "property" : "properties"} found
            {isFallbackResults ? (
              <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] font-medium text-amber-100">
                demo sample
              </span>
            ) : null}
            <span className="mx-2 text-white/35" aria-hidden>
              |
            </span>
            <span className="text-white/80">Sort:</span>{" "}
            <span className="font-medium text-white">{PROPERTY_BROWSE_SORT_LABELS[sort]}</span>
            <span className="mx-2 text-white/35" aria-hidden>
              |
            </span>
            <span className="text-white/80">{viewMode === "map" ? "Map view" : "Grid view"}</span>
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-white/90">
              <span className="text-white/70">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as PropertyBrowseSort)}
                className="h-9 cursor-pointer rounded-full border-0 bg-white/10 py-1 pl-3 pr-8 text-sm font-medium text-white ring-1 ring-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
              >
                {(Object.keys(PROPERTY_BROWSE_SORT_LABELS) as PropertyBrowseSort[]).map((key) => (
                  <option key={key} value={key} className="bg-[#0B1A2F] text-white">
                    {PROPERTY_BROWSE_SORT_LABELS[key]}
                  </option>
                ))}
              </select>
            </label>

            <div className="inline-flex rounded-full bg-white/10 p-0.5 ring-1 ring-white/15">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                  viewMode === "grid" ? "bg-white text-[#0B1A2F] shadow-sm" : "text-white/85 hover:text-white"
                }`}
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                  viewMode === "map" ? "bg-white text-[#0B1A2F] shadow-sm" : "text-white/85 hover:text-white"
                }`}
              >
                Map
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
