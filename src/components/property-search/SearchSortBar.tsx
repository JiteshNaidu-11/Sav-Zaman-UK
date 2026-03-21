import type { SearchSortOption } from "@/data/searchCatalogTypes";
import type { ParsedSearchURL } from "@/lib/searchURLState";
import { CreateAlertButton } from "./CreateAlertButton";
import { SaveSearchButton } from "./SaveSearchButton";

const SORT_LABELS: Record<SearchSortOption, string> = {
  price_desc: "Highest price",
  price_asc: "Lowest price",
  newest: "Newest listed",
  oldest: "Oldest listed",
};

type Props = {
  parsed: ParsedSearchURL;
  resultCount: number;
  onSortChange: (sort: SearchSortOption) => void;
  onToggleMap: () => void;
  queryString: string;
};

export function SearchSortBar({ parsed, resultCount, onSortChange, onToggleMap, queryString }: Props) {
  return (
    <div className="mt-6 flex flex-col gap-4 border-b border-slate-200/90 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-slate-700">
        <span className="text-lg font-semibold text-slate-900">{resultCount}</span> results
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <span className="font-medium">Sort</span>
          <select
            value={parsed.sort}
            onChange={(e) => onSortChange(e.target.value as SearchSortOption)}
            className="rounded-xl border border-slate-200 bg-[#0B1A2F] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            {(Object.keys(SORT_LABELS) as SearchSortOption[]).map((key) => (
              <option key={key} value={key} className="bg-[#0B1A2F]">
                {SORT_LABELS[key]}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={onToggleMap}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50"
        >
          {parsed.map ? "Hide map" : "Map view"}
        </button>

        <SaveSearchButton queryString={queryString} />
        <CreateAlertButton />
      </div>
    </div>
  );
}
