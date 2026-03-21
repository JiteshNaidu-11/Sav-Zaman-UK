export const ENQUIRY_TYPE_OPTIONS = [
  "Buying a Property",
  "Selling a Property",
  "Property Investment",
  "Property Management",
  "Book Consultation",
  "General Enquiry",
] as const;

export const BUDGET_OPTIONS = [
  "Prefer not to say",
  "Under £250,000",
  "£250,000 – £500,000",
  "£500,000 – £1,000,000",
  "£1,000,000 – £2,500,000",
  "£2,500,000+",
] as const;

export const TIMELINE_OPTIONS = [
  "Immediately",
  "1–3 months",
  "3–6 months",
  "6–12 months",
  "Exploring only",
] as const;

export type EnquiryTypeOption = (typeof ENQUIRY_TYPE_OPTIONS)[number];
