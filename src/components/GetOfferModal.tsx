import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { notifyInquiryByEmail } from "@/lib/inquiryNotifications";
import { saveLocalInquiry } from "@/lib/inquiries";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Ownership = "Freehold" | "Leasehold";
type PropertyType =
  | "Studio"
  | "Flat"
  | "Apartment"
  | "Townhouse"
  | "Detached"
  | "Semi Detached"
  | "Terraced"
  | "End Of Terrace"
  | "Bungalow"
  | "Cottage"
  | "Other";

type Reason =
  | "Need a Quick Sale"
  | "Divorce/Separation"
  | "Avoid Repossession"
  | "Relocation"
  | "Inherited Property"
  | "Investment Property"
  | "Struggling to Sell"
  | "Broken Chain"
  | "Other";

const propertyTypes: PropertyType[] = [
  "Studio",
  "Flat",
  "Apartment",
  "Townhouse",
  "Detached",
  "Semi Detached",
  "Terraced",
  "End Of Terrace",
  "Bungalow",
  "Cottage",
  "Other",
];

const reasons: Reason[] = [
  "Need a Quick Sale",
  "Divorce/Separation",
  "Avoid Repossession",
  "Relocation",
  "Inherited Property",
  "Investment Property",
  "Struggling to Sell",
  "Broken Chain",
  "Other",
];

const numberOptions = (max: number) => Array.from({ length: max }, (_, i) => String(i + 1));

function normalizeDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function formatPostcode(value: string): string {
  return value.toUpperCase().replace(/\s+/g, " ").trim();
}

export function GetOfferModal({ open, onOpenChange }: Props) {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 (contact)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Step 2 (property)
  const [postcode, setPostcode] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [streetName, setStreetName] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [estimatedValue, setEstimatedValue] = useState("");
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [reason, setReason] = useState<Reason | null>(null);
  const [bedrooms, setBedrooms] = useState("");
  const [receptionRooms, setReceptionRooms] = useState("");
  const [gardens, setGardens] = useState("");
  const [ownership, setOwnership] = useState<Ownership | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const progress = step === 1 ? 50 : 100;

  const fullName = useMemo(() => `${firstName.trim()} ${lastName.trim()}`.trim(), [firstName, lastName]);

  const reset = () => {
    setStep(1);
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setPostcode("");
    setHouseNumber("");
    setStreetName("");
    setPropertyType(null);
    setEstimatedValue("");
    setIsOwner(null);
    setReason(null);
    setBedrooms("");
    setReceptionRooms("");
    setGardens("");
    setOwnership(null);
    setSubmitting(false);
  };

  const step1Valid = Boolean(firstName.trim() && lastName.trim() && normalizeDigits(phone).length >= 7 && isEmail(email));

  const step2Valid = Boolean(
    formatPostcode(postcode) &&
      propertyType &&
      estimatedValue.trim() &&
      isOwner !== null &&
      reason &&
      bedrooms &&
      receptionRooms &&
      gardens &&
      ownership,
  );

  const composedMessage = useMemo(() => {
    const lines = [
      "Get Offer Form Submission",
      "",
      `Name: ${fullName}`,
      `Email: ${email.trim()}`,
      `Phone: ${phone.trim()}`,
      "",
      `Postcode: ${formatPostcode(postcode)}`,
      `House number/name: ${houseNumber.trim() || "-"}`,
      `Street name: ${streetName.trim() || "-"}`,
      `Property type: ${propertyType ?? "-"}`,
      `Estimated value: ${estimatedValue.trim()}`,
      `Owner: ${isOwner === null ? "-" : isOwner ? "Yes" : "No"}`,
      `Reason for sale: ${reason ?? "-"}`,
      `Bedrooms: ${bedrooms || "-"}`,
      `Reception rooms: ${receptionRooms || "-"}`,
      `Gardens: ${gardens || "-"}`,
      `Ownership: ${ownership ?? "-"}`,
    ];
    return lines.join("\n");
  }, [
    fullName,
    email,
    phone,
    postcode,
    houseNumber,
    streetName,
    propertyType,
    estimatedValue,
    isOwner,
    reason,
    bedrooms,
    receptionRooms,
    gardens,
    ownership,
  ]);

  const submit = async () => {
    if (!step1Valid) {
      toast.error("Please complete your contact details.");
      setStep(1);
      return;
    }
    if (!step2Valid) {
      toast.error("Please complete the property details.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        inquiry_type: "contact_message" as const,
        property_slug: null,
        property_title: "Get Offer Now",
        name: fullName,
        email: email.trim() || null,
        phone: phone.trim() || null,
        subject: "Get Offer Now",
        message: composedMessage,
        preferred_date: null,
        preferred_time: null,
      };

      if (supabaseConfigured && supabase) {
        const { error } = await supabase.from("lead_inquiries").insert(payload);
        if (error) throw error;
        void notifyInquiryByEmail({
          inquiryType: "contact_message",
          propertyTitle: "Get Offer Now",
          name: fullName,
          email: email.trim() || null,
          phone: phone.trim() || null,
          subject: "Get Offer Now",
          message: composedMessage,
          preferredDate: null,
          preferredTime: null,
        });
      } else {
        saveLocalInquiry(payload);
      }

      toast.success("Thank you — we’ve received your details.");
      onOpenChange(false);
      reset();
    } catch (err) {
      if (import.meta.env.DEV) console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-[32px] border border-white/10 bg-[linear-gradient(160deg,rgba(8,18,48,0.96),rgba(11,26,47,0.92))] p-0 text-white shadow-[0_40px_100px_-40px_rgba(0,0,0,0.75)] sm:max-w-[920px]">
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <DialogTitle className="font-heading text-2xl font-semibold tracking-[-0.03em] text-white md:text-3xl">
                Get a Cash Offer for Your Home
              </DialogTitle>
              <p className="mt-2 text-sm text-white/65">Sell in as little as 7 days · No fees</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">{`Step ${step} of 2`}</p>
              <p className="mt-1 text-xs text-white/55">{`${progress}% Complete`}</p>
            </div>
          </div>

          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-400" style={{ width: `${progress}%` }} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl md:p-6">
              {step === 1 ? (
                <div className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">First Name*</span>
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/35"
                        placeholder="First name"
                        autoComplete="given-name"
                        required
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">Last Name*</span>
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/35"
                        placeholder="Last name"
                        autoComplete="family-name"
                        required
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">Phone Number*</span>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/35"
                        placeholder="07..."
                        autoComplete="tel"
                        required
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">Email*</span>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/35"
                        placeholder="name@email.com"
                        autoComplete="email"
                        required
                      />
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={!step1Valid}
                      onClick={() => setStep(2)}
                      className={cn(
                        "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition",
                        step1Valid
                          ? "bg-[#22c55e] text-white shadow-[0_18px_44px_-26px_rgba(34,197,94,0.8)] hover:brightness-105"
                          : "cursor-not-allowed bg-white/10 text-white/40",
                      )}
                    >
                      Continue
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid gap-4">
                    <label className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">Property Address / Postcode*</span>
                      <div className="flex gap-3">
                        <input
                          value={postcode}
                          onChange={(e) => setPostcode(e.target.value)}
                          className="h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/35"
                          placeholder="e.g. SW1A 1AA"
                          required
                        />
                        <button
                          type="button"
                          className="h-12 shrink-0 rounded-2xl border border-white/12 bg-white/10 px-4 text-sm font-semibold text-white/85 transition hover:bg-white/15"
                          onClick={() => toast.message("Address lookup can be wired later — for now, enter details below.")}
                        >
                          Find Address
                        </button>
                      </div>
                      <p className="text-xs text-white/55">Enter postcode, then fill the details below.</p>
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">House Number/Name</span>
                      <input
                        value={houseNumber}
                        onChange={(e) => setHouseNumber(e.target.value)}
                        className="h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/35"
                        placeholder="e.g. 49"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">Street Name</span>
                      <input
                        value={streetName}
                        onChange={(e) => setStreetName(e.target.value)}
                        className="h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/35"
                        placeholder="e.g. High Street"
                      />
                    </label>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">Property Type*</p>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {propertyTypes.map((t) => {
                        const active = propertyType === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setPropertyType(t)}
                            className={cn(
                              "rounded-xl border px-3 py-2 text-sm font-medium transition",
                              active ? "border-blue-400/50 bg-blue-500/20 text-white" : "border-white/10 bg-white/5 text-white/85 hover:bg-white/10",
                            )}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">Estimated Value*</span>
                    <input
                      value={estimatedValue}
                      onChange={(e) => setEstimatedValue(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/35"
                      placeholder="e.g. £250,000"
                      required
                    />
                  </label>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">Are you the property owner?*</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {[true, false].map((v) => {
                        const active = isOwner === v;
                        return (
                          <button
                            key={String(v)}
                            type="button"
                            onClick={() => setIsOwner(v)}
                            className={cn(
                              "rounded-xl border px-3 py-2 text-sm font-medium transition",
                              active ? "border-blue-400/50 bg-blue-500/20 text-white" : "border-white/10 bg-white/5 text-white/85 hover:bg-white/10",
                            )}
                          >
                            {v ? "Yes" : "No"}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">Reason for Sale*</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {reasons.map((r) => {
                        const active = reason === r;
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setReason(r)}
                            className={cn(
                              "rounded-xl border px-3 py-2 text-sm font-medium transition",
                              active ? "border-blue-400/50 bg-blue-500/20 text-white" : "border-white/10 bg-white/5 text-white/85 hover:bg-white/10",
                            )}
                          >
                            {r}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      { label: "Bedrooms*", value: bedrooms, set: setBedrooms },
                      { label: "Reception Rooms*", value: receptionRooms, set: setReceptionRooms },
                      { label: "Gardens*", value: gardens, set: setGardens },
                    ].map((f) => (
                      <label key={f.label} className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">{f.label}</span>
                        <select
                          value={f.value}
                          onChange={(e) => f.set(e.target.value)}
                          className="h-12 w-full cursor-pointer appearance-none rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/35"
                          required
                        >
                          <option value="" className="bg-[#0B1A2F] text-white">
                            Select
                          </option>
                          {numberOptions(10).map((opt) => (
                            <option key={opt} value={opt} className="bg-[#0B1A2F] text-white">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </label>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">Ownership Type*</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {(["Freehold", "Leasehold"] as const).map((o) => {
                        const active = ownership === o;
                        return (
                          <button
                            key={o}
                            type="button"
                            onClick={() => setOwnership(o)}
                            className={cn(
                              "rounded-xl border px-3 py-2 text-sm font-medium transition",
                              active ? "border-blue-400/50 bg-blue-500/20 text-white" : "border-white/10 bg-white/5 text-white/85 hover:bg-white/10",
                            )}
                          >
                            {o}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="rounded-2xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={submit}
                      disabled={!step2Valid || submitting}
                      className={cn(
                        "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition",
                        step2Valid && !submitting
                          ? "bg-[#22c55e] text-white shadow-[0_18px_44px_-26px_rgba(34,197,94,0.8)] hover:brightness-105"
                          : "cursor-not-allowed bg-white/10 text-white/40",
                      )}
                    >
                      {submitting ? "Submitting..." : "Get My Cash Offer"}
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden lg:block">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-5 text-white/85 backdrop-blur-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">Why this works</p>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed">
                  {[
                    "Fast",
                    "No fees",
                    "Any condition",
                    "Secure",
                    "Transparent next steps",
                  ].map((x) => (
                    <li key={x} className="flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-400/80" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-xs text-white/55">
                  This form creates an inquiry visible in the admin inquiries page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

