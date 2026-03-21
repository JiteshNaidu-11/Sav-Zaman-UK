import { type InquiryType } from "@/lib/inquiries";
import { supabase, supabaseConfigured } from "@/lib/supabase";

interface InquiryNotificationPayload {
  inquiryType: InquiryType;
  propertyTitle?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  subject?: string | null;
  message: string;
  preferredDate?: string | null;
  preferredTime?: string | null;
}

export async function notifyInquiryByEmail(payload: InquiryNotificationPayload): Promise<void> {
  if (!supabaseConfigured || !supabase) {
    return;
  }

  try {
    const { error } = await supabase.functions.invoke("send-inquiry-email", {
      body: payload,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    if (import.meta.env.DEV) console.warn("Inquiry email notification failed:", error);
  }
}
