import { supabase, supabaseConfigured } from "@/lib/supabaseClient";

export type PropertyInquirySource = "property_inquiry" | "contact";

export type InquiryLeadInput = {
  intent: string | null;
  propertyType: string | null;
  location: string | null;
  budget: string | null;
  timeline?: string | null;
};

export type PropertyInquiryRow = {
  id: string;
  source: PropertyInquirySource;
  property_id: string | null;
  property_title: string | null;
  customer_name: string;
  contact_email: string;
  phone_number: string;
  message: string;
  preferred_date: string | null;
  created_at: string;
};

export async function createInquiryLead(input: InquiryLeadInput): Promise<PropertyInquiryRow | null> {
  if (!supabaseConfigured || !supabase) return null;

  try {
    const payload = {
      intent: input.intent ?? "",
      propertyType: input.propertyType ?? "",
      location: input.location ?? "",
      budget: input.budget ?? "",
      timeline: input.timeline ?? "",
    };

    const { data, error } = await supabase
      .from("property_inquiries")
      .insert({
        source: "property_inquiry",
        property_id: null,
        property_title: "Guided Finder Lead",
        customer_name: "Website Visitor",
        contact_email: "not_provided@savzaman.com",
        phone_number: "not_provided",
        message: JSON.stringify(payload),
        preferred_date: null,
      })
      .select("*")
      .single();

    if (error) throw error;
    return (data as PropertyInquiryRow) ?? null;
  } catch (e) {
    console.error("createInquiryLead failed:", e);
    return null;
  }
}

export async function getInquiryLeads(): Promise<{ data: PropertyInquiryRow[]; error: string | null }> {
  if (!supabaseConfigured || !supabase) {
    return { data: [], error: "Supabase is not configured." };
  }

  try {
    const { data, error } = await supabase
      .from("property_inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { data: (data as PropertyInquiryRow[]) ?? [], error: null };
  } catch (e) {
    console.error("getInquiryLeads failed:", e);
    return { data: [], error: "Unable to fetch leads right now." };
  }
}

