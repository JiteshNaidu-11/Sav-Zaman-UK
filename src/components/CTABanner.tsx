import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useEnquiryModal } from "@/context/EnquiryModalContext";
import { cn } from "@/lib/utils";

function enquiryDefaultForPrimary(label: string): string {
  if (label === "Book a Viewing") return "Buying a Property";
  return "Book Consultation";
}

function enquiryDefaultForSecondary(label: string): string {
  if (label === "Contact Us") return "General Enquiry";
  if (label === "Enquire Now") return "General Enquiry";
  return "General Enquiry";
}

type CtaLink = { label: string; to: string; showArrow?: boolean };

function getCtaButtons(pathname: string): { primary: CtaLink; secondary: CtaLink } {
  if (pathname === "/") {
    return {
      primary: { label: "Book Consultation", to: "/contact" },
      secondary: { label: "Explore Properties", to: "/properties", showArrow: true },
    };
  }
  if (pathname === "/properties") {
    return {
      primary: { label: "Book Consultation", to: "/contact" },
      secondary: { label: "Enquire Now", to: "/contact", showArrow: true },
    };
  }
  if (pathname.startsWith("/properties/")) {
    return {
      primary: { label: "Book a Viewing", to: "/contact" },
      secondary: { label: "Enquire Now", to: "/contact", showArrow: true },
    };
  }
  if (pathname === "/services") {
    return {
      primary: { label: "Book Consultation", to: "/contact" },
      secondary: { label: "Contact Us", to: "/contact", showArrow: true },
    };
  }
  return {
    primary: { label: "Book Consultation", to: "/contact" },
    secondary: { label: "Explore Properties", to: "/properties", showArrow: true },
  };
}

type CTABannerProps = {
  /** Merges with default section spacing (e.g. `py-16` on the blog page). */
  sectionClassName?: string;
  /** Override default headline (e.g. Services page). */
  heading?: string;
  /** Override default supporting copy. */
  description?: string;
  /** Override pill label next to the sparkles icon. */
  pillLabel?: string;
};

const CTABanner = ({ sectionClassName, heading, description, pillLabel }: CTABannerProps) => {
  const { pathname } = useLocation();
  const { openEnquiry } = useEnquiryModal();
  const { primary, secondary } = getCtaButtons(pathname);
  const onPropertiesIndex = pathname === "/properties";

  const title = heading ?? "Ready to find the right Sav Zaman property opportunity?";
  const body =
    description ??
    "Speak with our team about off-market listings, investor opportunities, or tailored property sourcing.";
  const pill = pillLabel ?? "Property Consultation";

  return (
    <section className={cn("section-padding", sectionClassName)}>
      <div className="container-custom">
        <AnimatedSection>
          <div className="cta-panel relative overflow-hidden rounded-[36px] px-6 py-10 md:px-10 md:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.26),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_32%)]" />
            <div className="relative z-10 grid gap-10 xl:grid-cols-[1fr_auto] xl:items-end">
              <div className="max-w-2xl">
                <span className="pill-tag bg-white/10 text-white shadow-none">
                  <Sparkles className="h-4 w-4" />
                  {pill}
                </span>
                <h2 className="mt-5 font-heading text-3xl font-semibold leading-tight text-white md:text-5xl">{title}</h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/72 md:text-base">{body}</p>
                {onPropertiesIndex ? (
                  <p className="mt-3 text-sm font-medium leading-6 text-white/88 md:text-[15px]">
                    Can&apos;t find what you&apos;re looking for? Speak to our team.
                  </p>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[430px]">
                {primary.to === "/contact" ? (
                  <button
                    type="button"
                    onClick={() => openEnquiry({ defaultEnquiryType: enquiryDefaultForPrimary(primary.label) })}
                    className="inline-flex min-h-[58px] items-center justify-center rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-[hsl(var(--primary))] transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    {primary.label}
                  </button>
                ) : (
                  <Link
                    to={primary.to}
                    className="inline-flex min-h-[58px] items-center justify-center rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-[hsl(var(--primary))] transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    {primary.label}
                  </Link>
                )}
                {secondary.to === "/contact" ? (
                  <button
                    type="button"
                    onClick={() => openEnquiry({ defaultEnquiryType: enquiryDefaultForSecondary(secondary.label) })}
                    className="inline-flex min-h-[58px] items-center justify-center gap-2 rounded-full border border-white/18 px-6 py-3 text-center text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/8"
                  >
                    {secondary.label}
                    {secondary.showArrow ? <ArrowRight className="h-4 w-4 shrink-0" /> : null}
                  </button>
                ) : (
                  <Link
                    to={secondary.to}
                    className="inline-flex min-h-[58px] items-center justify-center gap-2 rounded-full border border-white/18 px-6 py-3 text-center text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/8"
                  >
                    {secondary.label}
                    {secondary.showArrow ? <ArrowRight className="h-4 w-4 shrink-0" /> : null}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CTABanner;
