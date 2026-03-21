import { ArrowRight, Building2, ClipboardList, Megaphone, MessageSquare, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import CTABanner from "@/components/CTABanner";
import { processSteps, siteContent } from "@/content/site";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { cn } from "@/lib/utils";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";

const kicker = "text-sm font-semibold uppercase tracking-widest text-blue-300";

const heroHighlights = [
  { title: "Property Consultation", line: "Buying, selling, and strategic positioning with clear next steps." },
  { title: "Investment Advisory", line: "Yield, growth, and portfolio logic for serious capital." },
  { title: "Property Management", line: "Tenants, maintenance, and reporting handled with discipline." },
  { title: "Digital Marketing for Properties", line: "Creative, channels, and visibility that support serious listing performance." },
  { title: "Property Listing Service", line: "Premium presentation, distribution, and enquiry handling." },
] as const;

const overviewServices = [
  {
    sectionId: "property-consultation",
    title: "Property Consultation",
    description: "Buying, selling, strategy",
    icon: MessageSquare,
  },
  {
    sectionId: "investment-advisory",
    title: "Investment Advisory",
    description: "ROI, rental yield, investor strategy",
    icon: TrendingUp,
  },
  {
    sectionId: "property-management",
    title: "Property Management",
    description: "Tenant, operations, reporting",
    icon: Building2,
  },
  {
    sectionId: "digital-marketing",
    title: "Digital Marketing for Properties",
    description: "Creative, campaigns, and channel reach",
    icon: Megaphone,
  },
  {
    sectionId: "property-listing",
    title: "Property Listing Service",
    description: "Presentation, distribution, lead handling",
    icon: ClipboardList,
  },
] as const;

const detailBlocks = [
  {
    sectionId: "property-consultation",
    title: "Property Consultation",
    body: "We advise on buying, selling, positioning, and timing — ensuring each decision is structured and commercially sound.",
    bullets: ["Acquisition strategy", "Pricing & positioning", "Off-market opportunities", "Negotiation support"],
    image: property1,
  },
  {
    sectionId: "investment-advisory",
    title: "Investment Advisory",
    body: "We help investors identify, evaluate, and secure property opportunities aligned with yield, growth, and risk strategy.",
    bullets: ["ROI analysis", "Rental yield strategy", "Portfolio building", "UK & overseas investment"],
    image: property2,
  },
  {
    sectionId: "property-management",
    title: "Property Management",
    body: "End-to-end property management covering tenants, maintenance, reporting, and compliance.",
    bullets: ["Tenant management", "Maintenance coordination", "Financial reporting", "Compliance"],
    image: property3,
  },
  {
    sectionId: "digital-marketing",
    title: "Digital Marketing for Properties",
    body: "Campaign-ready creative and channel thinking so listings stand out in search, social, and premium property feeds.",
    bullets: ["Photography & video direction", "Portal and social campaigns", "Brand-ready collateral", "Performance insight"],
    image: property4,
  },
  {
    sectionId: "property-listing",
    title: "Property Listing Service",
    body: "Structured listing delivery, syndication, and enquiry workflows that keep serious buyers moving.",
    bullets: ["Professional presentation", "Multi-channel distribution", "Enquiry qualification", "Viewing coordination"],
    image: property2,
  },
] as const;

const cardHover = "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl";

const Services = () => {
  useDocumentTitle("Sav Zaman UK — Services");
  return (
    <main className="overflow-hidden bg-[#F4F6FA]">
      {/* 1 — Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1A2F] to-[#0E223F] py-24 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.12),transparent_36%)]" />
        <div className="hero-noise pointer-events-none absolute inset-0 opacity-[0.18]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimatedSection className="max-w-xl">
              <p className={kicker}>Services</p>
              <h1 className="mt-4 font-heading text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-white lg:text-5xl">
                Structured advisory and delivery for buyers, sellers, and investors.
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-white/70">
                {siteContent.name} provides consultancy-grade property support—clearer shortlists, stronger presentation,
                disciplined follow-up, and management you can rely on.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#0B1A2F] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Book Consultation
                </Link>
                <Link
                  to="/properties"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
                >
                  Explore Properties
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="left" delay={0.06}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {heroHighlights.map((item, index) => (
                  <div
                    key={item.title}
                    className={cn(
                      "rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-colors duration-300",
                      cardHover,
                      "hover:bg-white/10",
                    )}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-white/45">0{index + 1}</p>
                    <h2 className="mt-3 text-lg font-semibold text-white">{item.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{item.line}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 2 — Overview cards */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="mx-auto mb-10 max-w-2xl text-center lg:mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">What we offer</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold tracking-[-0.03em] text-slate-900 lg:text-5xl">
              Core services
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Five delivery lines, one consistent standard: clarity, presentation, and accountable follow-through.
            </p>
          </AnimatedSection>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {overviewServices.map((svc, index) => {
              const Icon = svc.icon;
              return (
                <AnimatedSection key={svc.sectionId} delay={index * 0.05}>
                  <div
                    className={cn(
                      "flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm",
                      cardHover,
                    )}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-slate-900">{svc.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{svc.description}</p>
                    <a
                      href={`#${svc.sectionId}`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                    >
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3 — Detailed sections (alternating) */}
      {detailBlocks.map((block, index) => {
        const imageLeft = index % 2 === 0;
        const textBlock = (
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Service detail</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold tracking-[-0.03em] text-slate-900 lg:text-5xl">
              {block.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">{block.body}</p>
            <ul className="mt-8 space-y-3">
              {block.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-gray-600">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 underline-offset-4 hover:underline"
            >
              Discuss this service
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        );
        const imageBlock = (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={block.image} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        );

        return (
          <section
            key={block.sectionId}
            id={block.sectionId}
            className={cn("scroll-mt-32 px-6 py-20", index % 2 === 0 ? "bg-white" : "bg-[#F4F6FA]")}
          >
            <div className="mx-auto max-w-7xl">
              <div className="grid items-center gap-12 lg:grid-cols-2">
                {imageLeft ? (
                  <>
                    <AnimatedSection>{imageBlock}</AnimatedSection>
                    <AnimatedSection direction="left" delay={0.06}>
                      {textBlock}
                    </AnimatedSection>
                  </>
                ) : (
                  <>
                    <AnimatedSection>{textBlock}</AnimatedSection>
                    <AnimatedSection direction="left" delay={0.06}>
                      {imageBlock}
                    </AnimatedSection>
                  </>
                )}
              </div>
            </div>
          </section>
        );
      })}

      {/* 4 — How we work */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="mx-auto mb-10 max-w-2xl text-center lg:mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">How we work</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold tracking-[-0.03em] text-slate-900 lg:text-5xl">
              A clear path from brief to completion
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Staged delivery so you always know where you are—and what happens next.
            </p>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <AnimatedSection key={step.title} delay={index * 0.06}>
                <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{`0${index + 1}`}</p>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{step.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — CTA */}
      <CTABanner
        sectionClassName="bg-[#F4F6FA] py-16 md:py-16 lg:py-16"
        pillLabel="Get in touch"
        heading="Ready to discuss your property requirements?"
        description="Speak with our team about buying, selling, investment, or property management."
      />
    </main>
  );
};

export default Services;
