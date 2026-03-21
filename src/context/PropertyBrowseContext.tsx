import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePropertyStore } from "@/context/PropertyStoreContext";
import type { Property } from "@/data/properties";
import {
  defaultPropertyBrowseFilters,
  filterStoreProperties,
  pickFallbackBrowseSlice,
  sortStoreProperties,
  type PropertyBrowseFilters,
  type PropertyBrowseSort,
} from "@/lib/propertyBrowseFilter";

type PropertyBrowseContextValue = {
  filters: PropertyBrowseFilters;
  setFilters: React.Dispatch<React.SetStateAction<PropertyBrowseFilters>>;
  resetFilters: () => void;
  sort: PropertyBrowseSort;
  setSort: (s: PropertyBrowseSort) => void;
  viewMode: "grid" | "map";
  setViewMode: (m: "grid" | "map") => void;
  filteredSorted: Property[];
  resultCount: number;
  /** True when filters matched nothing and we show a demo fallback slice instead of an empty grid. */
  isFallbackResults: boolean;
  loading: boolean;
};

const PropertyBrowseContext = createContext<PropertyBrowseContextValue | undefined>(undefined);

export function PropertyBrowseProvider({ children }: { children: ReactNode }) {
  const { properties, loading } = usePropertyStore();
  const [filters, setFilters] = useState<PropertyBrowseFilters>(defaultPropertyBrowseFilters);
  const [sort, setSort] = useState<PropertyBrowseSort>("price_desc");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const orderIndex = useMemo(() => new Map(properties.map((p, i) => [p.slug, i])), [properties]);

  const { filteredSorted, isFallbackResults } = useMemo(() => {
    const strict = filterStoreProperties(properties, filters);
    const sortedStrict = sortStoreProperties(strict, sort, orderIndex);
    if (sortedStrict.length > 0) {
      return { filteredSorted: sortedStrict, isFallbackResults: false };
    }
    if (loading || properties.length === 0) {
      return { filteredSorted: sortedStrict, isFallbackResults: false };
    }
    const fallbackSlice = pickFallbackBrowseSlice(properties, filters, 3);
    return {
      filteredSorted: sortStoreProperties(fallbackSlice, sort, orderIndex),
      isFallbackResults: true,
    };
  }, [properties, filters, sort, orderIndex, loading]);

  const resetFilters = useCallback(() => {
    setFilters(defaultPropertyBrowseFilters);
  }, []);

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      resetFilters,
      sort,
      setSort,
      viewMode,
      setViewMode,
      filteredSorted,
      resultCount: filteredSorted.length,
      isFallbackResults,
      loading,
    }),
    [filters, resetFilters, sort, viewMode, filteredSorted, isFallbackResults, loading],
  );

  return <PropertyBrowseContext.Provider value={value}>{children}</PropertyBrowseContext.Provider>;
}

export function usePropertyBrowse(): PropertyBrowseContextValue {
  const ctx = useContext(PropertyBrowseContext);
  if (!ctx) {
    throw new Error("usePropertyBrowse must be used within PropertyBrowseProvider");
  }
  return ctx;
}

export function usePropertyBrowseOptional(): PropertyBrowseContextValue | undefined {
  return useContext(PropertyBrowseContext);
}

export type { PropertyBrowseFilters, PropertyBrowseSort };
