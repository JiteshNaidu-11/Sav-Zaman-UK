export const ENQUIRY_LEADS_STORAGE_KEY = "sav-zaman-uk.enquiries";

export type StoredEnquiryLead = {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  phone: string;
  enquiryType: string;
  propertySummary: string;
  message: string;
  budget: string;
  timeline: string;
  propertySlug: string | null;
};

export function readEnquiryLeads(): StoredEnquiryLead[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ENQUIRY_LEADS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredEnquiryLead[]) : [];
  } catch {
    return [];
  }
}

export function saveEnquiryLead(input: Omit<StoredEnquiryLead, "id" | "createdAt">): StoredEnquiryLead {
  const record: StoredEnquiryLead = {
    ...input,
    id: `enq-${crypto.randomUUID()}`,
    createdAt: new Date().toISOString(),
  };
  const next = [record, ...readEnquiryLeads()].slice(0, 200);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ENQUIRY_LEADS_STORAGE_KEY, JSON.stringify(next));
  }
  return record;
}
