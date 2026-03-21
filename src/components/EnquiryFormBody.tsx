import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BUDGET_OPTIONS,
  ENQUIRY_TYPE_OPTIONS,
  TIMELINE_OPTIONS,
  type EnquiryTypeOption,
} from "@/data/enquiryFormOptions";
import type { EnquiryPrefill } from "@/context/EnquiryModalContext";
import { notifyInquiryByEmail } from "@/lib/inquiryNotifications";
import { saveLocalInquiry } from "@/lib/inquiries";
import { saveEnquiryLead } from "@/lib/enquiryLeads";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500";

function defaultPropertyLine(prefill: EnquiryPrefill | null): string {
  if (!prefill?.title && !prefill?.location && !prefill?.price) return "";
  const parts = [prefill.title, prefill.location, prefill.price].filter(Boolean);
  return parts.join(" · ");
}

function normalizeEnquiryType(value: string | undefined): EnquiryTypeOption {
  if (value && (ENQUIRY_TYPE_OPTIONS as readonly string[]).includes(value)) {
    return value as EnquiryTypeOption;
  }
  return ENQUIRY_TYPE_OPTIONS[ENQUIRY_TYPE_OPTIONS.length - 1];
}

type Props = {
  prefill: EnquiryPrefill | null;
  submitLabel: string;
  onSuccess?: () => void;
  /** Reset form when key changes (e.g. modal reopened). */
  formKey?: string;
  className?: string;
};

export function EnquiryFormBody({ prefill, submitLabel, onSuccess, formKey = "default", className }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [enquiryType, setEnquiryType] = useState<EnquiryTypeOption>(ENQUIRY_TYPE_OPTIONS[0]);
  const [propertyLine, setPropertyLine] = useState("");
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState<(typeof BUDGET_OPTIONS)[number]>(BUDGET_OPTIONS[0]);
  const [timeline, setTimeline] = useState<(typeof TIMELINE_OPTIONS)[number]>(TIMELINE_OPTIONS[0]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setPropertyLine(defaultPropertyLine(prefill));
    setEnquiryType(normalizeEnquiryType(prefill?.defaultEnquiryType));
  }, [prefill, formKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      toast.error("Please add your name, email, phone, and message.");
      return;
    }

    setSubmitting(true);
    const slug = prefill?.slug?.trim() || null;
    const composedMessage = [
      `Enquiry type: ${enquiryType}`,
      propertyLine.trim() ? `Property: ${propertyLine.trim()}` : null,
      `Budget: ${budget}`,
      `Timeline: ${timeline}`,
      "",
      message.trim(),
    ]
      .filter(Boolean)
      .join("\n");

    try {
      saveEnquiryLead({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        enquiryType,
        propertySummary: propertyLine.trim(),
        message: message.trim(),
        budget,
        timeline,
        propertySlug: slug,
      });

      if (supabaseConfigured && supabase) {
        const { error } = await supabase.from("lead_inquiries").insert({
          inquiry_type: "contact_message",
          property_slug: slug,
          property_title: prefill?.title?.trim() || null,
          name: fullName.trim(),
          email: email.trim() || null,
          phone: phone.trim() || null,
          subject: enquiryType,
          message: composedMessage,
          preferred_date: null,
          preferred_time: null,
        });
        if (error) throw error;

        void notifyInquiryByEmail({
          inquiryType: "contact_message",
          propertyTitle: prefill?.title ?? null,
          name: fullName.trim(),
          email: email.trim() || null,
          phone: phone.trim() || null,
          subject: enquiryType,
          message: composedMessage,
          preferredDate: null,
          preferredTime: null,
        });
      } else {
        saveLocalInquiry({
          inquiry_type: "contact_message",
          property_slug: slug,
          property_title: prefill?.title?.trim() || null,
          name: fullName.trim(),
          email: email.trim() || null,
          phone: phone.trim() || null,
          subject: enquiryType,
          message: composedMessage,
          preferred_date: null,
          preferred_time: null,
        });
      }

      toast.success("Thank you — your enquiry has been received.");
      setFullName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setPropertyLine(defaultPropertyLine(prefill));
      setEnquiryType(normalizeEnquiryType(prefill?.defaultEnquiryType));
      setBudget(BUDGET_OPTIONS[0]);
      setTimeline(TIMELINE_OPTIONS[0]);
      onSuccess?.();
    } catch (err) {
      if (import.meta.env.DEV) console.error(err);
      toast.error("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <label className="block space-y-1.5 text-sm font-medium text-slate-800">
        <span>Full name</span>
        <input
          type="text"
          required
          value={fullName}
          onChange={(ev) => setFullName(ev.target.value)}
          className={inputClass}
          placeholder="Your full name"
          autoComplete="name"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5 text-sm font-medium text-slate-800">
          <span>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            className={inputClass}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>
        <label className="block space-y-1.5 text-sm font-medium text-slate-800">
          <span>Phone</span>
          <input
            type="tel"
            required
            value={phone}
            onChange={(ev) => setPhone(ev.target.value)}
            className={inputClass}
            placeholder="+44 0000 000000"
            autoComplete="tel"
          />
        </label>
      </div>
      <label className="block space-y-1.5 text-sm font-medium text-slate-800">
        <span>Enquiry type</span>
        <select
          value={enquiryType}
          onChange={(ev) => setEnquiryType(ev.target.value as EnquiryTypeOption)}
          className={inputClass}
        >
          {ENQUIRY_TYPE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1.5 text-sm font-medium text-slate-800">
        <span>Property (optional)</span>
        <input
          type="text"
          value={propertyLine}
          onChange={(ev) => setPropertyLine(ev.target.value)}
          className={inputClass}
          placeholder="Property title, location, or price"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5 text-sm font-medium text-slate-800">
          <span>Budget</span>
          <select value={budget} onChange={(ev) => setBudget(ev.target.value as (typeof BUDGET_OPTIONS)[number])} className={inputClass}>
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1.5 text-sm font-medium text-slate-800">
          <span>Timeline</span>
          <select
            value={timeline}
            onChange={(ev) => setTimeline(ev.target.value as (typeof TIMELINE_OPTIONS)[number])}
            className={inputClass}
          >
            {TIMELINE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block space-y-1.5 text-sm font-medium text-slate-800">
        <span>Message</span>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(ev) => setMessage(ev.target.value)}
          className={cn(inputClass, "min-h-[120px] resize-y")}
          placeholder="Tell us what you need — we’ll respond with a clear next step."
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-105 disabled:opacity-60"
      >
        {submitting ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
