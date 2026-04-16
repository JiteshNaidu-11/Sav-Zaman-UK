export type LeadIntent = "Buy" | "Rent" | "Invest";

export type Lead = {
  id: number;
  intent: LeadIntent | "";
  propertyType: string;
  location: string;
  budget: string;
  timeline: string;
  name: string;
  contact: string;
  createdAt: string;
};

export const LEADS_STORAGE_KEY = "sav_zaman_leads";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadLeads(): Lead[] {
  if (typeof window === "undefined") return [];
  const parsed = safeParse<Lead[]>(window.localStorage.getItem(LEADS_STORAGE_KEY));
  return Array.isArray(parsed) ? parsed : [];
}

export function saveLeads(next: Lead[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(next));
}

export function upsertLead(lead: Lead): Lead[] {
  const current = loadLeads();
  const normalizedContact = lead.contact.trim().toLowerCase();

  const existingIndex = current.findIndex((l) => {
    if (l.id === lead.id) return true;
    if (!normalizedContact) return false;
    return (l.contact || "").trim().toLowerCase() === normalizedContact;
  });

  const next = [...current];
  if (existingIndex >= 0) {
    next[existingIndex] = lead;
  } else {
    next.push(lead);
  }

  saveLeads(next);
  return next;
}

