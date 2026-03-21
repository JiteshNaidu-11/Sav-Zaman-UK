const SAVED_PROPERTIES = "savzaman.savedPropertyIds";
const SAVED_SLUGS = "savzaman.savedPropertySlugs";
const SAVED_SEARCHES = "savzaman.savedSearches";

export function getSavedPropertyIds(): number[] {
  try {
    const raw = localStorage.getItem(SAVED_PROPERTIES);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is number => typeof x === "number") : [];
  } catch {
    return [];
  }
}

export function toggleSavedPropertyId(id: number): boolean {
  const cur = getSavedPropertyIds();
  const has = cur.includes(id);
  const next = has ? cur.filter((x) => x !== id) : [...cur, id];
  localStorage.setItem(SAVED_PROPERTIES, JSON.stringify(next));
  return !has;
}

export function isPropertySaved(id: number): boolean {
  return getSavedPropertyIds().includes(id);
}

export function getSavedPropertySlugs(): string[] {
  try {
    const raw = localStorage.getItem(SAVED_SLUGS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function toggleSavedPropertySlug(slug: string): boolean {
  const cur = getSavedPropertySlugs();
  const has = cur.includes(slug);
  const next = has ? cur.filter((x) => x !== slug) : [...cur, slug];
  localStorage.setItem(SAVED_SLUGS, JSON.stringify(next));
  return !has;
}

export function isPropertySlugSaved(slug: string): boolean {
  return getSavedPropertySlugs().includes(slug);
}

export function getSavedSearches(): string[] {
  try {
    const raw = localStorage.getItem(SAVED_SEARCHES);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function saveCurrentSearch(queryString: string): void {
  const q = queryString.replace(/^\?/, "");
  if (!q) return;
  const cur = getSavedSearches();
  if (cur.includes(q)) return;
  localStorage.setItem(SAVED_SEARCHES, JSON.stringify([q, ...cur].slice(0, 20)));
}
