import { Link } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";
import { FooterBottom } from "@/components/FooterBottom";
import { FooterColumn, type FooterLinkItem } from "@/components/FooterColumn";
import { siteContent } from "@/content/site";

const company: FooterLinkItem[] = [
  { label: "About Us", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
  { label: "Book Consultation", to: "/contact", enquiry: true, enquiryDefaultType: "Book Consultation" },
  { label: "Enquire Now", to: "/contact", enquiry: true, enquiryDefaultType: "General Enquiry" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms of Use", to: "/terms-of-use" },
];

const properties: FooterLinkItem[] = [
  { label: "Search Properties", to: "/properties" },
  { label: "Commercial Properties", to: "/properties?type=commercial" },
  { label: "Residential Properties", to: "/properties?type=residential" },
  { label: "Investment Properties", to: "/properties?type=investment" },
  { label: "New Developments", to: "/properties?type=new" },
  { label: "Featured Properties", to: "/properties?type=featured" },
];

const services: FooterLinkItem[] = [
  { label: "Buy & Sell a Property", to: "/services#buy-sell-property" },
  { label: "Property Consultation", to: "/services#property-consultation" },
  { label: "Investment Advisory", to: "/services#investment-advisory" },
  { label: "Property Management", to: "/services#property-management" },
  { label: "Digital Marketing for Properties", to: "/services#digital-marketing" },
  { label: "Property Listing Service", to: "/services#property-listing" },
];

const loc = (name: string): FooterLinkItem => ({
  label: name,
  to: `/properties?location=${encodeURIComponent(name)}`,
});

const locations: FooterLinkItem[] = [
  loc("London"),
  loc("Manchester"),
  loc("Birmingham"),
  loc("Leeds"),
  loc("Liverpool"),
  loc("Nottingham"),
  loc("Reading"),
  loc("Bristol"),
  loc("Nationwide"),
  loc("Overseas"),
];

const telDigits = siteContent.phone.replace(/\D/g, "");
const telHref = telDigits ? `tel:+${telDigits.replace(/^\+?/, "")}` : "tel:";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#0B1A2F] text-white/80">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 lg:grid-cols-6">
          <div className="min-w-0">
            <Link to="/" className="inline-block">
              <BrandLogo theme="dark" size="footer" inlineTagline />
            </Link>
          </div>
          <FooterColumn title="Company" links={company} />
          <FooterColumn title="Properties" links={properties} />
          <FooterColumn title="Services" links={services} />
          <FooterColumn title="Locations" links={locations} />
          <FooterColumn title="Contact">
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${siteContent.email}`}
                  className="relative inline-block text-white/80 transition-colors hover:text-blue-400 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-blue-400 after:transition-[width] after:duration-200 hover:after:w-full"
                >
                  {siteContent.email}
                </a>
              </li>
              <li>
                <a
                  href={telHref}
                  className="relative inline-block text-white/80 transition-colors hover:text-blue-400 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-blue-400 after:transition-[width] after:duration-200 hover:after:w-full"
                >
                  {siteContent.phone}
                </a>
              </li>
              <li className="leading-relaxed text-white/80">{siteContent.address}</li>
            </ul>
          </FooterColumn>
        </div>

        <div className="mt-14">
          <FooterBottom />
        </div>

        <div className="mt-8 text-center lg:hidden">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xs text-white/50 transition-colors hover:text-blue-400"
          >
            Back to top
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
