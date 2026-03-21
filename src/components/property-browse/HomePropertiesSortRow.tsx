import { usePropertyBrowseStickyActive } from "@/context/PropertyBrowseStickyContext";
import { usePropertyBrowse } from "@/context/PropertyBrowseContext";
import type { PropertyBrowseSort } from "@/lib/propertyBrowseFilter";

export const PROPERTY_BROWSE_SORT_LABELS: Record<PropertyBrowseSort, string> = {
  price_desc: "Highest price",
  price_asc: "Lowest price",
  newest: "Newest listed",
};

export function HomePropertiesSortRow() {
  const { resultCount, sort, setSort, viewMode, setViewMode, isFallbackResults } = usePropertyBrowse();
  const browseStickyActive = usePropertyBrowseStickyActive();

  if (browseStickyActive) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-slate-700">
        <p>
          Showing <span className="text-lg font-semibold text-slate-900">{resultCount}</span>{" "}
          {resultCount === 1 ? "property" : "properties"}
          {isFallbackResults ? (
            <span className="ml-2 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-900">
              Demo sample — no exact matches
            </span>
          ) : null}
        </p>
        {isFallbackResults ? (
          <p className="mt-1 max-w-xl text-xs text-slate-500">
            Adjust filters or widen the search; these listings are shown so the browse page never looks empty in the demo.
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <span className="font-medium">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as PropertyBrowseSort)}
            className="rounded-xl border border-slate-200 bg-[#0B1A2F] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            {(Object.keys(PROPERTY_BROWSE_SORT_LABELS) as PropertyBrowseSort[]).map((key) => (
              <option key={key} value={key} className="bg-[#0B1A2F]">
                {PROPERTY_BROWSE_SORT_LABELS[key]}
              </option>
            ))}
          </select>
        </label>

        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              viewMode === "grid" ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-sm" : "text-slate-600"
            }`}
          >
            Grid
          </button>
          <button
            type="button"
            onClick={() => setViewMode("map")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              viewMode === "map" ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-sm" : "text-slate-600"
            }`}
          >
            Map
          </button>
        </div>
      </div>
    </div>
  );
}
