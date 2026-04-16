import type { Lead, LeadIntent } from "@/utils/leadStorage";

export type FlowStep =
  | "intent"
  | "propertyType"
  | "location"
  | "budget"
  | "timeline"
  | "name"
  | "contact"
  | "complete";

export type QuickReply = {
  id: string;
  label: string;
  value: string;
};

export function createEmptyLead(): Lead {
  const id = Date.now();
  return {
    id,
    intent: "",
    propertyType: "",
    location: "",
    budget: "",
    timeline: "",
    name: "",
    contact: "",
    createdAt: new Date(id).toISOString(),
  };
}

export function stepPrompt(step: FlowStep): { title: string; subtitle: string; quickReplies?: QuickReply[] } {
  switch (step) {
    case "intent":
      return {
        title: "What are you looking to do?",
        subtitle: "Choose one to continue.",
        quickReplies: [
          { id: "buy", label: "Buy", value: "Buy" },
          { id: "rent", label: "Rent", value: "Rent" },
          { id: "invest", label: "Invest", value: "Invest" },
        ],
      };
    case "propertyType":
      return {
        title: "What property type do you want?",
        subtitle: "For example: apartment, house, HMO, land, commercial unit.",
        quickReplies: [
          { id: "apartment", label: "Apartment", value: "Apartment" },
          { id: "house", label: "House", value: "House" },
          { id: "hmo", label: "HMO", value: "HMO" },
          { id: "commercial", label: "Commercial", value: "Commercial" },
        ],
      };
    case "location":
      return { title: "Which location are you interested in?", subtitle: "City, postcode, or area." };
    case "budget":
      return { title: "What’s your budget?", subtitle: "Example: 50k, 250000, 1200 pcm." };
    case "timeline":
      return {
        title: "What’s your timeline?",
        subtitle: "When do you want to proceed?",
        quickReplies: [
          { id: "asap", label: "ASAP", value: "ASAP" },
          { id: "30days", label: "0–30 days", value: "0–30 days" },
          { id: "1to3", label: "1–3 months", value: "1–3 months" },
          { id: "3plus", label: "3+ months", value: "3+ months" },
        ],
      };
    case "name":
      return { title: "What’s your name?", subtitle: "So we can personalise follow-up." };
    case "contact":
      return { title: "Best contact number (WhatsApp)?", subtitle: "We’ll only use this to respond to your enquiry." };
    case "complete":
    default:
      return { title: "Thanks — one moment.", subtitle: "Finding the best matches for you…" };
  }
}

export function nextStep(step: FlowStep): FlowStep {
  switch (step) {
    case "intent":
      return "propertyType";
    case "propertyType":
      return "location";
    case "location":
      return "budget";
    case "budget":
      return "timeline";
    case "timeline":
      return "name";
    case "name":
      return "contact";
    case "contact":
      return "complete";
    default:
      return "complete";
  }
}

export function applyAnswerToLead(step: FlowStep, value: string, lead: Lead): Lead {
  const v = value.trim();
  switch (step) {
    case "intent":
      return { ...lead, intent: (v as LeadIntent) ?? "" };
    case "propertyType":
      return { ...lead, propertyType: v };
    case "location":
      return { ...lead, location: v };
    case "budget":
      return { ...lead, budget: v };
    case "timeline":
      return { ...lead, timeline: v };
    case "name":
      return { ...lead, name: v };
    case "contact":
      return { ...lead, contact: v };
    default:
      return lead;
  }
}

export function leadIsComplete(lead: Lead): boolean {
  return Boolean(
    lead.intent &&
      lead.propertyType &&
      lead.location &&
      lead.budget &&
      lead.timeline &&
      lead.name &&
      lead.contact,
  );
}

