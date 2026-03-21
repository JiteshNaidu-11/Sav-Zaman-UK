import { useNavigate, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { usePropertyBrowse } from "@/context/PropertyBrowseContext";
import type { PropertyBrowseFilters } from "@/lib/propertyBrowseFilter";
import { cn } from "@/lib/utils";

function buildHeadline(f: PropertyBrowseFilters, isFallback: boolean): string {
  const loc = f.location.trim();
  const lt = loc.toLowerCase();
  const nationwide = lt === "nationwide";
  const overseas = lt === "overseas";

  if (f.newDevelopmentOnly) {
    return isFallback
      ? "No exact new-development matches — showing relaxed results"
      : "Showing new developments";
  }
  if (f.featuredOnly) {
    return isFallback
      ? "Showing sample listings — widen filters for more featured matches"
      : "Showing featured properties";
  }
  if (loc) {
    if (nationwide) return "Showing properties nationwide";
    if (overseas && isFallback) {
      return "No overseas listings in this catalogue — showing featured properties";
    }
    if (f.type && !nationwide) {
      if (isFallback) return `Showing ${f.type} properties near ${loc}`;
      return `Showing ${f.type} properties in ${loc}`;
    }
    if (isFallback) return `Showing properties near ${loc}`;
    return `Showing properties in ${loc}`;
  }
  if (f.type) {
    if (isFallback) return `Showing properties near ${f.type}`;
    return `Showing ${f.type} properties`;
  }
  return "";
}

/**
 * Notice when browse state reflects URL/footer deep links (location, category, featured, new developments).
 */
export function PropertiesLocationFilterNotice({ className }: { className?: string }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { filters, resetFilters, isFallbackResults } = usePropertyBrowse();

  const hasLocation = Boolean(filters.location.trim());
  const show =
    pathname === "/properties" &&
    (hasLocation || filters.featuredOnly || filters.newDevelopmentOnly || Boolean(filters.type));

  if (!show) return null;

  const headline = buildHeadline(filters, isFallbackResults);
  if (!headline) return null;

  const clear = () => {
    resetFilters();
    navigate("/properties", { replace: true });
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-blue-200/80 bg-blue-50/90 px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between md:px-5 md:py-4",
        className,
      )}
    >
      <p className="text-sm font-medium text-slate-800 md:text-[15px]">{headline}</p>
      <button
        type="button"
        onClick={clear}
        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-400 hover:bg-slate-50 md:text-sm"
      >
        <X className="h-3.5 w-3.5 md:h-4 md:w-4" aria-hidden />
        Clear filter
      </button>
    </div>
  );
}
