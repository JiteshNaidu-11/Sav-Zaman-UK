import { getApprovedProperties, type NormalizedProperty } from "@/services/propertyService";

export type MatchFilters = {
  transactionType?: "Rent" | "Sale" | null;
  city?: string | null;
  type?: string | null;
  minPriceRaw?: number | null;
  maxPriceRaw?: number | null;
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function parseBudgetRange(budgetRaw: string | null | undefined): { min: number | null; max: number | null; midpoint: number | null } {
  const raw = (budgetRaw ?? "").trim().toLowerCase();
  if (!raw || raw.includes("not sure")) return { min: null, max: null, midpoint: null };
  const normalized = raw.replace(/[–—]/g, "-").replace(/,/g, "");

  const parseOne = (s: string): number | null => {
    const m = s.match(/(\d+(?:\.\d+)?)/);
    if (!m) return null;
    let n = Number(m[1]);
    if (!Number.isFinite(n)) return null;
    if (/\bk\b/.test(s) && n < 10_000) n *= 1000;
    if (/\bm\b/.test(s) && n < 10_000_000) n *= 1_000_000;
    return n;
  };

  if (normalized.includes("+")) {
    const min = parseOne(normalized);
    return { min, max: null, midpoint: min };
  }

  if (normalized.includes("-")) {
    const [a, b] = normalized.split("-", 2);
    const min = parseOne(a);
    const max = parseOne(b);
    const midpoint = min != null && max != null ? (min + max) / 2 : min ?? max;
    return { min, max, midpoint };
  }

  const max = parseOne(normalized);
  return { min: null, max, midpoint: max };
}

export async function matchProperties(filters: MatchFilters, limit = 6): Promise<{ data: NormalizedProperty[]; error: string | null }> {
  const approved = await getApprovedProperties();
  if (approved.error) return { data: [], error: approved.error };

  const budget = parseBudgetRange(filters.maxPriceRaw != null ? String(filters.maxPriceRaw) : null);
  const midpoint = budget.midpoint;

  let items = [...approved.data];

  if (filters.transactionType) {
    items = items.filter((p) => p.transactionType === filters.transactionType);
  }

  if (filters.city?.trim()) {
    const needle = normalize(filters.city);
    items = items.filter((p) => normalize(p.city).includes(needle));
  }

  if (filters.type?.trim()) {
    const needle = normalize(filters.type);
    items = items.filter((p) => normalize(p.type).includes(needle) || normalize(p.projectName).includes(needle));
  }

  if (filters.minPriceRaw != null) items = items.filter((p) => p.priceRaw >= filters.minPriceRaw!);
  if (filters.maxPriceRaw != null) items = items.filter((p) => p.priceRaw <= filters.maxPriceRaw!);

  if (midpoint != null) {
    items.sort((a, b) => Math.abs(a.priceRaw - midpoint) - Math.abs(b.priceRaw - midpoint));
  }

  return { data: items.slice(0, limit), error: null };
}

export function buildPrefilledWhatsAppMessage(input: { propertyType?: string | null; location?: string | null; budget?: string | null }): string {
  return `Hi, I'm looking for ${input.propertyType || "a property"} in ${input.location || "your preferred area"} with budget ${input.budget || "Not sure"}.`;
}

