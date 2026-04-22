import { FormEvent } from "react";
import { Building2, Mail, MapPin, Phone, Send, Sparkles, UserRound } from "lucide-react";
import { Property } from "@/data/properties";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { toPublicUrl } from "@/lib/toPublicUrl";

export interface PropertyInquiryFormState {
  name: string;
  email: string;
  phone: string;
  address: string;
  message: string;
}

interface PropertyInquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "call" | "brochure";
  property: Pick<Property, "title" | "location" | "price" | "category" | "area" | "status" | "image">;
  values: PropertyInquiryFormState;
  onChange: (field: keyof PropertyInquiryFormState, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

const modeContent = {
  call: {
    kicker: "Private Callback",
    title: "Request a call about this property",
    description:
      "Share the buyer details and your message. Sav Zaman can then follow up with a cleaner, more personal property conversation.",
    submitLabel: "Send callback request",
    note: "The form is built for quick property follow-up with better presentation than a standard inline form.",
  },
  brochure: {
    kicker: "Brochure Request",
    title: "Request brochure and consultation",
    description:
      "Collect the buyer details, address, and enquiry message inside one premium modal before moving to the next step.",
    submitLabel: "Request brochure pack",
    note: "Ideal for collecting brochure interest, consultation requests, and more serious property enquiries.",
  },
} as const;

const fieldClassName =
  "h-12 w-full rounded-[18px] border border-[hsl(var(--line))] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.9))] px-4 text-sm text-foreground transition-all duration-300 placeholder:text-muted-foreground focus:border-[hsl(var(--accent)/0.4)] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]";

const PropertyInquiryDialog = ({
  open,
  onOpenChange,
  mode,
  property,
  values,
  onChange,
  onSubmit,
  isSubmitting,
}: PropertyInquiryDialogProps) => {
  const copy = modeContent[mode];
  const heroImgSrc = property.image.startsWith("/projects/") ? toPublicUrl(property.image) : property.image;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-[34px] border border-[hsl(var(--line))] bg-white p-0 shadow-[0_35px_90px_-35px_rgba(15,23,42,0.55)] sm:max-w-[980px]">
        <div className="grid overflow-hidden lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative overflow-hidden bg-[linear-gradient(160deg,rgba(5,16,44,0.98),rgba(19,53,121,0.94))] p-7 text-white md:p-9">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.28),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(125,211,252,0.14),transparent_32%)]" />
            <div className="relative">
              <span className="pill-tag border-white/14 bg-white/10 text-white">
                <Sparkles className="h-4 w-4" />
                {copy.kicker}
              </span>

              <div className="mt-6 overflow-hidden rounded-[30px] border border-white/12">
                <div className="relative aspect-[4/3]">
                  <img
                    src={heroImgSrc}
                    alt={property.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = toPublicUrl("placeholder.svg");
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,6,23,0.92)] via-[rgba(2,6,23,0.26)] to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/58">{property.category}</p>
                    <p className="mt-2 font-heading text-3xl font-semibold text-white">{property.price}</p>
                    <p className="mt-2 text-sm text-white/74">{property.location}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-white/10 bg-white/[0.06] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/52">Listing Status</p>
                  <p className="mt-2 text-sm font-semibold text-white">{property.status}</p>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/[0.06] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/52">Area</p>
                  <p className="mt-2 text-sm font-semibold text-white">{property.area}</p>
                </div>
              </div>

              <p className="mt-6 text-sm leading-7 text-white/72">{copy.note}</p>
            </div>
          </div>

          <div className="p-7 md:p-9">
            <div className="max-w-xl">
              <DialogTitle className="font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl">
                {copy.title}
              </DialogTitle>
              <DialogDescription className="mt-3 text-sm leading-7 text-muted-foreground">
                {copy.description}
              </DialogDescription>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--line))] bg-[hsl(var(--secondary))] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(var(--accent))]">
                  <Building2 className="h-4 w-4" />
                  {property.title}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--line))] bg-[hsl(var(--secondary))] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <MapPin className="h-4 w-4 text-[hsl(var(--accent))]" />
                  {property.location}
                </span>
              </div>

              <form onSubmit={onSubmit} className="mt-8 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Customer Name</span>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--accent))]" />
                      <input
                        type="text"
                        value={values.name}
                        onChange={(event) => onChange("name", event.target.value)}
                        className={`${fieldClassName} pl-11`}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Email</span>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--accent))]" />
                      <input
                        type="email"
                        value={values.email}
                        onChange={(event) => onChange("email", event.target.value)}
                        className={`${fieldClassName} pl-11`}
                        placeholder="name@email.com"
                        required
                      />
                    </div>
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Phone Number</span>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--accent))]" />
                      <input
                        type="tel"
                        value={values.phone}
                        onChange={(event) => onChange("phone", event.target.value)}
                        className={`${fieldClassName} pl-11`}
                        placeholder="+44 0000 000000"
                        required
                      />
                    </div>
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Address</span>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-[hsl(var(--accent))]" />
                      <textarea
                        value={values.address}
                        onChange={(event) => onChange("address", event.target.value)}
                        className="min-h-[108px] w-full rounded-[18px] border border-[hsl(var(--line))] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.9))] px-4 py-3 pl-11 text-sm text-foreground transition-all duration-300 placeholder:text-muted-foreground focus:border-[hsl(var(--accent)/0.4)] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
                        placeholder="Customer address or preferred correspondence address"
                        required
                      />
                    </div>
                  </label>
                </div>

                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Message</span>
                  <textarea
                    value={values.message}
                    onChange={(event) => onChange("message", event.target.value)}
                    rows={5}
                    className="w-full rounded-[22px] border border-[hsl(var(--line))] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] px-4 py-3 text-sm text-foreground transition-all duration-300 placeholder:text-muted-foreground focus:border-[hsl(var(--accent)/0.4)] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
                    placeholder="Tell us what kind of help is needed for this property."
                    required
                  />
                </label>

                <div className="rounded-[24px] border border-[hsl(var(--line))] bg-[linear-gradient(180deg,rgba(239,246,255,0.82),rgba(255,255,255,0.95))] px-5 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--accent))]">Submission Note</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    The enquiry is attached to this property so the admin panel can present it with cleaner listing context.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-accent inline-flex w-full items-center justify-center gap-2 px-6 py-4 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Sending..." : copy.submitLabel}
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyInquiryDialog;
