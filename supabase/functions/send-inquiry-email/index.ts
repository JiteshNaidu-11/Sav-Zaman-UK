import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type InquiryType = "contact_message" | "property_call_request";

interface InquiryPayload {
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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const notifyTo = Deno.env.get("INQUIRY_NOTIFY_TO") ?? "jagtapshriyash1@gmail.com";
const notifyFrom = Deno.env.get("INQUIRY_NOTIFY_FROM") ?? "More Estate <onboarding@resend.dev>";
const resendApiKey = Deno.env.get("RESEND_API_KEY");

function formatPreferredSlot(payload: InquiryPayload): string {
  if (!payload.preferredDate && !payload.preferredTime) {
    return "Not specified";
  }

  const pieces = [payload.preferredDate, payload.preferredTime].filter(Boolean);
  return pieces.join(" / ");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildHtml(payload: InquiryPayload): string {
  const title = payload.inquiryType === "property_call_request" ? "Property Call Request" : "Contact Message";
  const propertyLine = payload.propertyTitle
    ? `<p><strong>Property:</strong> ${escapeHtml(payload.propertyTitle)}</p>`
    : "";
  const emailLine = payload.email ? `<p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>` : "";
  const phoneLine = payload.phone ? `<p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>` : "";
  const subjectLine = payload.subject ? `<p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>` : "";
  const preferredLine =
    payload.inquiryType === "property_call_request"
      ? `<p><strong>Preferred Call Slot:</strong> ${escapeHtml(formatPreferredSlot(payload))}</p>`
      : "";

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; padding: 24px;">
      <div style="max-width: 640px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #111827, #7f1d1d); color: white; padding: 24px;">
          <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #fca5a5;">More Estate</p>
          <h1 style="margin: 0; font-size: 28px;">${title}</h1>
        </div>
        <div style="padding: 24px;">
          <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
          ${propertyLine}
          ${emailLine}
          ${phoneLine}
          ${subjectLine}
          ${preferredLine}
          <div style="margin-top: 20px; padding: 16px; border-radius: 14px; background: #f9fafb; border: 1px solid #e5e7eb;">
            <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #6b7280;">Message</p>
            <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(payload.message)}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  if (!resendApiKey) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY is not configured." }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const payload = (await request.json()) as InquiryPayload;
    const subject =
      payload.inquiryType === "property_call_request"
        ? `New call request for ${payload.propertyTitle ?? "property"}`
        : `New contact form message from ${payload.name}`;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: notifyFrom,
        to: [notifyTo],
        reply_to: payload.email || undefined,
        subject,
        html: buildHtml(payload),
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      throw new Error(errorText);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to send inquiry email:", error);

    return new Response(JSON.stringify({ error: "Failed to send inquiry email." }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
