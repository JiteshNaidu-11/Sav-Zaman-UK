import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  PROPERTY_STORAGE_KEY,
  Property,
  ensureUniquePropertySlug,
  getFeaturedPropertiesFromList,
  getPropertyByIdFromList,
  getPropertyBySlugFromList,
  getRelatedPropertiesFromList,
  getSimilarPropertiesFromList,
  properties as seedProperties,
} from "@/data/properties";
import { propertyModelToRecord, propertyRecordToModel, hydrateProperty, type PropertyRecord } from "@/lib/propertyRecords";
import { supabase, supabaseConfigured } from "@/lib/supabase";

interface PropertyStoreContextValue {
  properties: Property[];
  featuredProperties: Property[];
  loading: boolean;
  usingRemote: boolean;
  getPropertyBySlug: (slug: string) => Property | undefined;
  getPropertyById: (id: number) => Property | undefined;
  getRelatedProperties: (slug: string, limit?: number) => Property[];
  getSimilarProperties: (property: Property, limit?: number) => Property[];
  refreshProperties: () => Promise<void>;
  upsertProperty: (property: Property, previousSlug?: string) => Promise<void>;
  deleteProperty: (slug: string) => Promise<void>;
  resetProperties: () => Promise<void>;
}

const PropertyStoreContext = createContext<PropertyStoreContextValue | undefined>(undefined);

function uniqueLines(items: string[]): string[] {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

const fallbackImage = seedProperties[0]?.image || "";
const defaultProperties = seedProperties.map((property) => hydrateProperty(property, fallbackImage));

function isDemoCatalogPropertySlug(slug: string | undefined): boolean {
  // Old generator slugs looked like `catalog-${seq}-...`
  return Boolean(slug && slug.startsWith("catalog-"));
}

function mergeWithSeedProperties(items: Property[]): Property[] {
  const bySlug = new Map<string, Property>();

  for (const p of items) {
    if (!p.slug) continue;
    bySlug.set(p.slug, p);
  }

  for (const seed of defaultProperties) {
    if (!seed.slug) continue;
    if (!bySlug.has(seed.slug)) {
      bySlug.set(seed.slug, seed);
    }
  }

  return Array.from(bySlug.values());
}

function readStoredProperties(): Property[] {
  if (typeof window === "undefined") {
    return defaultProperties;
  }

  try {
    const rawValue = window.localStorage.getItem(PROPERTY_STORAGE_KEY);
    if (!rawValue) {
      return defaultProperties;
    }

    const parsedValue = JSON.parse(rawValue);
    if (!Array.isArray(parsedValue)) {
      return defaultProperties;
    }

    const hydrated = parsedValue.map((property) => hydrateProperty(property as Property, fallbackImage));
    // Remove legacy demo catalog rows even if they are cached in localStorage.
    const filtered = hydrated.filter((p) => !isDemoCatalogPropertySlug(p.slug));
    return mergeWithSeedProperties(filtered.length ? filtered : defaultProperties);
  } catch {
    return defaultProperties;
  }
}

async function fetchRemoteProperties(): Promise<Property[]> {
  if (!supabaseConfigured || !supabase) {
    return readStoredProperties();
  }

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const hydrated = (data as PropertyRecord[]).map((record) => propertyRecordToModel(record, fallbackImage));
  const filtered = hydrated.filter((p) => !isDemoCatalogPropertySlug(p.slug));
  return mergeWithSeedProperties(filtered);
}

async function seedRemoteProperties(): Promise<void> {
  if (!supabaseConfigured || !supabase) {
    return;
  }

  const seedRecords = defaultProperties.map((property) => propertyModelToRecord(property));
  const { error } = await supabase.from("properties").insert(seedRecords);
  if (error) {
    throw error;
  }
}

export const PropertyStoreProvider = ({ children }: { children: ReactNode }) => {
  const [properties, setProperties] = useState<Property[]>(supabaseConfigured ? [] : readStoredProperties());
  const [loading, setLoading] = useState(supabaseConfigured);

  const refreshProperties = async () => {
    setLoading(true);

    try {
      let nextProperties = await fetchRemoteProperties();

      if (supabaseConfigured && nextProperties.length === 0) {
        await seedRemoteProperties();
        nextProperties = await fetchRemoteProperties();
      }

      setProperties(nextProperties);

      if (!supabaseConfigured && typeof window !== "undefined") {
        window.localStorage.setItem(PROPERTY_STORAGE_KEY, JSON.stringify(nextProperties));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!supabaseConfigured) {
      setProperties(readStoredProperties());
      setLoading(false);
      return;
    }

    refreshProperties().catch((error) => {
      console.error("Failed to load properties from Supabase:", error);
      setProperties(defaultProperties);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (supabaseConfigured || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(PROPERTY_STORAGE_KEY, JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    if (supabaseConfigured || typeof window === "undefined") {
      return;
    }

    const syncProperties = () => setProperties(readStoredProperties());
    window.addEventListener("storage", syncProperties);
    return () => window.removeEventListener("storage", syncProperties);
  }, []);

  useEffect(() => {
    if (!supabaseConfigured || !supabase) {
      return;
    }

    const channel = supabase
      .channel("public:properties")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "properties" },
        () => {
          refreshProperties().catch((error) => {
            if (import.meta.env.DEV) console.error("Failed to refresh properties after realtime update:", error);
          });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const featuredProperties = getFeaturedPropertiesFromList(properties);

  const getPropertyBySlug = (slug: string) => getPropertyBySlugFromList(properties, slug);

  const getPropertyById = (id: number) => getPropertyByIdFromList(properties, id);

  const getRelatedProperties = (slug: string, limit = 3) =>
    getRelatedPropertiesFromList(properties, slug, limit);

  const getSimilarProperties = (property: Property, limit = 4) =>
    getSimilarPropertiesFromList(properties, property, limit);

  const upsertProperty = async (property: Property, previousSlug?: string) => {
    if (!supabaseConfigured || !supabase) {
      setProperties((currentProperties) => {
        const targetSlug = previousSlug ?? property.slug;
        const existingIndex = currentProperties.findIndex((item) => item.slug === targetSlug);
        const normalizedProperty = hydrateProperty(
          {
            ...property,
            slug: ensureUniquePropertySlug(property.slug || property.title, currentProperties, targetSlug),
          },
          fallbackImage,
        );

        if (existingIndex === -1) {
          return [normalizedProperty, ...currentProperties];
        }

        const nextProperties = [...currentProperties];
        nextProperties[existingIndex] = normalizedProperty;
        return nextProperties;
      });
      return;
    }

    const uniqueSlug = ensureUniquePropertySlug(property.slug || property.title, properties, previousSlug);
    const record = propertyModelToRecord({ ...property, slug: uniqueSlug });

    const { data: existingRow } = await supabase
      .from("properties")
      .select("created_by, created_by_label, record_status, is_upcoming, show_home_rental, hidden_from_public")
      .eq("slug", previousSlug ?? uniqueSlug)
      .maybeSingle();

    if (existingRow) {
      const row = existingRow as Record<string, unknown>;
      if (row.created_by) record.created_by = row.created_by as string;
      if (row.created_by_label != null) record.created_by_label = row.created_by_label as string;
      if (row.record_status != null) record.record_status = row.record_status as string;
      record.is_upcoming = Boolean(row.is_upcoming);
      record.show_home_rental = Boolean(row.show_home_rental);
      record.hidden_from_public = Boolean(row.hidden_from_public);
    } else {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (user) {
        record.created_by = user.id;
        record.created_by_label = user.email ?? (user.user_metadata?.name as string | undefined) ?? null;
      }
    }

    if (previousSlug && previousSlug !== uniqueSlug) {
      const { error } = await supabase.from("properties").update(record).eq("slug", previousSlug);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("properties").upsert(record, { onConflict: "slug" });
      if (error) throw error;
    }

    await refreshProperties();
  };

  const deleteProperty = async (slug: string) => {
    if (!supabaseConfigured || !supabase) {
      setProperties((currentProperties) => currentProperties.filter((property) => property.slug !== slug));
      return;
    }

    const { error } = await supabase.from("properties").delete().eq("slug", slug);
    if (error) throw error;

    await refreshProperties();
  };

  const resetProperties = async () => {
    if (!supabaseConfigured || !supabase) {
      setProperties(defaultProperties);
      return;
    }

    const seedRecords = defaultProperties.map((property) => propertyModelToRecord(property));

    const { error: deleteError } = await supabase.from("properties").delete().neq("slug", "");
    if (deleteError) throw deleteError;

    const { error: insertError } = await supabase.from("properties").insert(seedRecords);
    if (insertError) throw insertError;

    await refreshProperties();
  };

  return (
    <PropertyStoreContext.Provider
      value={{
        properties,
        featuredProperties,
        loading,
        usingRemote: supabaseConfigured,
        getPropertyBySlug,
        getPropertyById,
        getRelatedProperties,
        getSimilarProperties,
        refreshProperties,
        upsertProperty,
        deleteProperty,
        resetProperties,
      }}
    >
      {children}
    </PropertyStoreContext.Provider>
  );
};

export function usePropertyStore(): PropertyStoreContextValue {
  const context = useContext(PropertyStoreContext);

  if (!context) {
    throw new Error("usePropertyStore must be used inside PropertyStoreProvider");
  }

  return context;
}
