import { SlidersHorizontal } from "lucide-react";
import { HERO_SECTOR_OPTIONS } from "@/lib/propertyHeroSearch";
import type { ParsedSearchURL } from "@/lib/searchURLState";
import { SearchFilterModal } from "./SearchFilterModal";

const PROPERTY_TYPES = ["Any", "Office", "Retail", "Warehouse", "Leisure", "Land", "Mixed Use", "Flat", "House"] as const;
const RADII = [
  { value: "0", label: "This area" },
  { value: "1", label: "1 mile" },
  { value: "3", label: "3 miles" },
  { value: "5", label: "5 miles" },
  { value: "10", label: "10 miles" },
  { value: "25", label: "25 miles" },
] as const;

type Props = {
  draft: ParsedSearchURL;
  setDraft: React.Dispatch<React.SetStateAction<ParsedSearchURL>>;
  onApply: () => void;
};

export function SearchFilterBar({ draft, setDraft, onApply }: Props) {
  return (
    <div className="sticky top-[5.25rem] z-40 -mx-4 border-b border-slate-200/80 bg-white/90 px-4 py-3 shadow-md backdrop-blur-xl md:mx-0 md:rounded-2xl md:border md:px-4">
      <div className="flex min-w-0 items-end gap-2 overflow-x-auto pb-1 md:gap-3 md:pb-0 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300">
        <label className="flex min-w-[140px] shrink-0 flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Location</span>
          <input
            type="text"
            value={draft.location}
            onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
            placeholder="City or area"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </label>

        <label className="flex min-w-[110px] shrink-0 flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Radius</span>
          <select
            value={draft.radius}
            onChange={(e) => setDraft((d) => ({ ...d, radius: e.target.value }))}
            className="rounded-xl border border-slate-200 bg-[#0B1A2F] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            {RADII.map((r) => (
              <option key={r.value} value={r.value} className="bg-[#0B1A2F]">
                {r.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-[100px] shrink-0 flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Min £</span>
          <input
            type="text"
            inputMode="numeric"
            value={draft.minPrice}
            onChange={(e) => setDraft((d) => ({ ...d, minPrice: e.target.value }))}
            placeholder="Min"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </label>

        <label className="flex min-w-[100px] shrink-0 flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Max £</span>
          <input
            type="text"
            inputMode="numeric"
            value={draft.maxPrice}
            onChange={(e) => setDraft((d) => ({ ...d, maxPrice: e.target.value }))}
            placeholder="Max"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </label>

        <label className="flex min-w-[120px] shrink-0 flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Property type</span>
          <select
            value={draft.propertyType}
            onChange={(e) => setDraft((d) => ({ ...d, propertyType: e.target.value }))}
            className="rounded-xl border border-slate-200 bg-[#0B1A2F] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t} className="bg-[#0B1A2F]">
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-[130px] shrink-0 flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Sector</span>
          <select
            value={draft.sector}
            onChange={(e) => setDraft((d) => ({ ...d, sector: e.target.value }))}
            className="rounded-xl border border-slate-200 bg-[#0B1A2F] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            {HERO_SECTOR_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-[#0B1A2F]">
                {s}
              </option>
            ))}
          </select>
        </label>

        <SearchFilterModal draft={draft} setDraft={setDraft} />

        <button
          type="button"
          onClick={onApply}
          className="mb-0.5 shrink-0 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
        >
          Search
        </button>
      </div>
    </div>
  );
}
