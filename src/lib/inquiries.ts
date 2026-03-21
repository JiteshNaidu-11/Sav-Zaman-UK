export type InquiryType = "contact_message" | "property_call_request";

export interface LeadInquiryRecord {
  id: string;
  inquiry_type: InquiryType;
  property_slug: string | null;
  property_title: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  preferred_date: string | null;
  preferred_time: string | null;
  created_at: string;
}

export const LOCAL_INQUIRY_STORAGE_KEY = "sav-zaman-uk.demo-inquiries";

export const inquiryTypeLabel: Record<InquiryType, string> = {
  contact_message: "Contact Message",
  property_call_request: "Call Request",
};

export function formatInquiryTimestamp(value: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function formatPreferredCallSlot(date?: string | null, time?: string | null): string | null {
  if (!date && !time) {
    return null;
  }

  const dateLabel = date
    ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(date))
    : "Preferred day";

  if (!time) {
    return dateLabel;
  }

  const [hours, minutes] = time.split(":").map(Number);
  const slotDate = new Date();
  slotDate.setHours(hours || 0, minutes || 0, 0, 0);

  const timeLabel = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
  }).format(slotDate);

  return `${dateLabel} / ${timeLabel}`;
}

export function readLocalInquiries(): LeadInquiryRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(LOCAL_INQUIRY_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? (parsedValue as LeadInquiryRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalInquiry(
  input: Omit<LeadInquiryRecord, "id" | "created_at">,
): LeadInquiryRecord {
  const nextItem: LeadInquiryRecord = {
    ...input,
    id: `demo-${crypto.randomUUID()}`,
    created_at: new Date().toISOString(),
  };

  const currentItems = readLocalInquiries();
  const nextItems = [nextItem, ...currentItems].slice(0, 100);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCAL_INQUIRY_STORAGE_KEY, JSON.stringify(nextItems));
  }

  return nextItem;
}
