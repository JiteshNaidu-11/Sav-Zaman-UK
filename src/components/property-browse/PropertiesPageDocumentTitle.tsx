import { useEffect } from "react";
import { usePropertyBrowse } from "@/context/PropertyBrowseContext";

/** Sets `document.title` from active browse filters (footer / URL deep links). */
export function PropertiesPageDocumentTitle() {
  const { filters } = usePropertyBrowse();

  useEffect(() => {
    const prev = document.title;
    const segments: string[] = [];

    segments.push(filters.listing === "rent" ? "Rent" : filters.listing === "sold" ? "Sold" : "Buy");

    if (filters.sector && filters.sector !== "Any Sector") {
      segments.push(filters.sector);
    }

    if (filters.newDevelopmentOnly) segments.push("New Developments");
    else if (filters.featuredOnly) segments.push("Featured Properties");
    else if (filters.type) segments.push(`${filters.type} Properties`);

    const loc = filters.location.trim();
    if (loc && loc.toLowerCase() !== "nationwide") {
      segments.push(loc);
    } else if (loc.toLowerCase() === "nationwide") {
      segments.push("Nationwide");
    }

    document.title = segments.length > 0 ? `Sav Zaman — ${segments.join(" · ")}` : "Sav Zaman — Properties";

    return () => {
      document.title = prev;
    };
  }, [filters]);

  return null;
}
