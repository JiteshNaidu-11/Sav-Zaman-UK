import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useEnquiryModal } from "@/context/EnquiryModalContext";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Compass,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
// import Counter from "@/components/Counter";
import CTABanner from "@/components/CTABanner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  capabilityPillars,
  differentiators,
  faqItems,
  heroHighlights,
  processSteps,
} from "@/content/site";
import { blogPosts } from "@/data/blogPosts";
import { RightmoveHeroSearch } from "@/components/property-search/RightmoveHeroSearch";
import heroImg1 from "@/assets/1.jpg";
import heroImg2 from "@/assets/2.jpg";
import heroImg3 from "@/assets/3.jpeg";
import heroImg4 from "@/assets/4.jpeg";
import heroImg5 from "@/assets/5.jpg";
import heroImg6 from "@/assets/6.jpg";
import heroImg7 from "@/assets/7.jpg";
import heroImg8 from "@/assets/8.jpg";
import heroImg9 from "@/assets/9.jpg";
import heroImg10 from "@/assets/10.jpg";
import london2 from "@/assets/london-2.jpg";
import london3 from "@/assets/london 3.jpg";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

/** 1–10 plus london-2 and london 3 (12 slides). `objectPosition` tunes crop for mixed aspect ratios. */
const heroSlides = [
  { image: heroImg1, objectPosition: "center 42%" as const },
  { image: heroImg2, objectPosition: "center 38%" as const },
  { image: heroImg3, objectPosition: "center 35%" as const },
  { image: heroImg4, objectPosition: "center 40%" as const },
  { image: heroImg5, objectPosition: "center 32%" as const },
  { image: heroImg6, objectPosition: "center 42%" as const },
  { image: heroImg7, objectPosition: "center 45%" as const },
  { image: heroImg8, objectPosition: "center 40%" as const },
  { image: heroImg9, objectPosition: "center 38%" as const },
  { image: heroImg10, objectPosition: "center 30%" as const },
  { image: london2, objectPosition: "center 35%" as const },
  { image: london3, objectPosition: "center 40%" as const },
] as const;

const valueCards = [
  {
    title: "Residential and commercial focus",
    description: "A wider property mix with presentation that feels considered from first click to enquiry.",
    icon: Building2,
  },
  {
    title: "Verified, guided, and buyer-friendly",
    description: "Clients should not need to work hard to understand the opportunity in front of them.",
    icon: ShieldCheck,
  },
  {
    title: "Investor-led decision support",
    description: "Property guidance built around fit, location logic, and longer-term commercial value.",
    icon: TrendingUp,
  },
] as const;

const serviceIcons = [Compass, Building2, TrendingUp, ShieldCheck];
const processIcons = [Compass, Sparkles, Building2, ShieldCheck];

/* Stats strip (four cards) — hidden per request
const stats = [
  {
    value: "24h",
    label: "Response target",
    note: "Initial follow-up is positioned as fast, visible, and client-facing.",
  },
  {
    value: "360",
    label: "Advisory coverage",
    note: "Brief, shortlist, viewings, follow-up, negotiation, and close.",
  },
  {
    value: "18+",
    label: "Prime UK zones",
    note: "Coverage across stronger residential and commercial catchments.",
  },
  {
    value: "98%",
    label: "Presentation ready",
    note: "Listings staged with gallery, detail page, enquiry, and admin visibility.",
  },
] as const;
*/

const processNotes = [
  "Client brief locked",
  "Sharper opportunities only",
  "Viewings and follow-up aligned",
  "Decision support to completion",
] as const;

const processSupport = [
  "Budget, asset class, target area, and timing mapped early.",
  "Listings are filtered down to the options worth presenting.",
  "Stakeholders, documents, and next actions stay visible.",
  "The final move is calmer because the journey stayed structured.",
] as const;

const journalCardMotion = [
  { y: [0, -10, 0], rotate: [0, 0.45, 0] },
  { y: [0, -16, 0], rotate: [0, -0.55, 0] },
  { y: [0, -12, 0], rotate: [0, 0.35, 0] },
] as const;

const Index = () => {
  useDocumentTitle("Sav Zaman — Prime property advisory & listings");
  const { openEnquiry } = useEnquiryModal();
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const heroSlideCount = heroSlides.length;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroSlideCount);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [heroSlideCount]);

  const activeHeroSlide = heroSlides[heroImageIndex];

  return (
    <main className="overflow-hidden">
      <section className="page-shell relative isolate flex min-h-screen items-center overflow-hidden py-12 md:py-16">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="hero-noise absolute inset-0 opacity-[0.28]" />

          <AnimatePresence mode="sync">
            <motion.div
              key={heroImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={activeHeroSlide.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: activeHeroSlide.objectPosition }}
                decoding="async"
                fetchpriority="high"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1A2F]/80 via-[#0B1A2F]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/25" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="flex flex-col gap-8"
          >
            <div className="relative">
              <span className="inline-flex items-center rounded-full border border-[#D1C9C0]/35 bg-black/25 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.28em] text-[#D1C9C0] backdrop-blur-md">
                Explore Properties
              </span>
              <h1 className="mt-5 font-luxury text-5xl font-semibold leading-[0.98] tracking-[0.06em] text-white [text-shadow:0_2px_32px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.8)] md:mt-6 md:text-6xl lg:text-[4.1rem]">
                <span className="block">Sav Zaman</span>
                <span className="mt-3 block text-2xl font-medium tracking-[0.32em] text-[#D1C9C0]/95 md:text-3xl lg:text-[2.2rem]">
                  The Property Man
                </span>
              </h1>
              <p className="mt-5 max-w-xl font-luxury text-base font-light leading-relaxed tracking-[0.05em] text-[#D1C9C0] [text-shadow:0_1px_16px_rgba(0,0,0,0.4)] md:text-lg md:leading-8">
                From London to key regional cities, explore residential and commercial listings with structured information,
                investor guidance, and direct enquiry access.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 md:gap-3">
                {heroHighlights.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/20 bg-white/[0.08] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/95 backdrop-blur-sm md:px-4 md:py-2 md:text-[11px]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
              <button
                type="button"
                onClick={() => openEnquiry({ defaultEnquiryType: "General Enquiry" })}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#D1C9C0]/40 bg-gradient-to-b from-[#D1C9C0] to-[#c4bbb2] px-8 py-3.5 text-sm font-semibold tracking-wide text-[#1c1917] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] backdrop-blur-sm transition hover:brightness-105 sm:w-auto sm:min-w-[11rem]"
              >
                Enquire Now
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </button>
              <button
                type="button"
                onClick={() => openEnquiry({ defaultEnquiryType: "Book Consultation" })}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[0.1] px-8 py-3.5 text-sm font-medium tracking-wide text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl transition hover:border-[#D1C9C0]/35 hover:bg-white/[0.14] sm:w-auto sm:min-w-[11rem]"
              >
                Book Consultation
                <ArrowRight className="h-4 w-4 text-[#D1C9C0] transition group-hover:translate-x-0.5" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.06 }}
            className="w-full lg:justify-self-end"
          >
            <RightmoveHeroSearch />
          </motion.div>
          </div>
        </div>
      </section>

      {/* Stats strip (four cards: 24h, 360, 18+, 98%) — hidden per request
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {stats.map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 0.06}>
                <div className="relative overflow-hidden rounded-[30px] border border-[hsl(var(--line))] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,245,249,0.92))] p-6 shadow-[0_22px_60px_-38px_rgba(15,23,42,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl lg:p-8">
                  <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,rgba(37,99,235,0.95),rgba(125,211,252,0.55))]" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[hsl(var(--accent))]">{`0${index + 1}`}</p>
                  <div className="mt-4 font-heading text-5xl font-semibold tracking-[-0.04em] text-[hsl(var(--primary))]">
                    <Counter value={stat.value} />
                  </div>
                  <p className="mt-4 text-lg font-semibold text-foreground">{stat.label}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{stat.note}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
      */}

      <section className="section-padding bg-[hsl(var(--secondary))]">
        <div className="container-custom">
          <AnimatedSection className="max-w-2xl">
            <span className="section-kicker">Property Services</span>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-5xl">
              Support built around buyers, sellers, and investors.
            </h2>
          </AnimatedSection>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {capabilityPillars.map((pillar, index) => {
              const Icon = serviceIcons[index % serviceIcons.length];

              return (
                <AnimatedSection key={pillar.title} delay={index * 0.08}>
                  <div className="outline-panel h-full rounded-[30px] p-6 transition-transform duration-500 hover:-translate-y-1">
                    <div className="icon-chip">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-heading text-2xl text-foreground">{pillar.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{pillar.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding section-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.12),transparent_30%)]" />
        <div className="container-custom relative">
          <AnimatedSection className="max-w-2xl">
            <span className="section-kicker text-[hsl(var(--accent-soft))]">Why Sav Zaman</span>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
              A sharper UK-facing property experience built for higher-trust discovery.
            </h2>
          </AnimatedSection>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {differentiators.map((item, index) => (
              <AnimatedSection key={item.title} delay={index * 0.08}>
                <div className="dark-panel h-full rounded-[30px] p-6">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">{`0${index + 1}`}</p>
                  <h3 className="mt-5 font-heading text-2xl text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/64">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.07),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.06),transparent_32%)]" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[2fr_3fr]">
            <AnimatedSection className="h-full">
              <div className="grid-panel flex h-full flex-col overflow-hidden rounded-3xl p-8 shadow-xl">
                <div className="space-y-6">
                  <span className="text-sm font-semibold uppercase tracking-widest text-blue-400">How we work</span>
                  <h2 className="font-heading text-3xl font-semibold tracking-[-0.02em] text-white md:text-[2rem] md:leading-tight">
                    A property journey that feels tighter, more premium, and easier to trust.
                  </h2>
                  <p className="text-base leading-relaxed text-gray-400">
                    From first brief to final step, Sav Zaman is structured to make property discovery, follow-up, and
                    decision-making feel more controlled.
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  {processNotes.map((note, index) => (
                    <div
                      key={note}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:bg-white/[0.07]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-400/30 bg-blue-500/15 text-xs font-bold text-blue-300">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <p className="text-sm font-medium text-white">{note}</p>
                      </div>
                      <ArrowRight className="ml-2 h-4 w-4 shrink-0 text-white/40" />
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {processSteps.map((step, index) => {
                const Icon = processIcons[index % processIcons.length];

                return (
                  <AnimatedSection key={step.title} delay={index * 0.06} className="h-full">
                    <div className="relative flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <span className="pointer-events-none absolute right-4 top-4 select-none font-heading text-5xl font-bold leading-none text-gray-100">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl border border-gray-100 bg-slate-50 text-[hsl(var(--accent))]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="relative z-10 mt-5 text-xs font-semibold uppercase tracking-widest text-blue-500">
                        {processNotes[index]}
                      </p>
                      <h3 className="relative z-10 mt-2 font-heading text-lg font-semibold tracking-tight text-foreground">
                        {step.title}
                      </h3>
                      <p className="relative z-10 mt-3 flex-1 text-sm leading-relaxed text-gray-500">{step.description}</p>
                      <div className="relative z-10 mt-5 border-t border-gray-100 pt-4">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">This stage delivers</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{processSupport[index]}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[hsl(var(--secondary))]">
        <div className="container-custom grid gap-5 lg:grid-cols-3">
          {valueCards.map((item, index) => {
            const Icon = item.icon;

            return (
              <AnimatedSection key={item.title} delay={index * 0.08}>
                <div className="outline-panel h-full rounded-[30px] p-6">
                  <div className="icon-chip">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-heading text-2xl text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom grid gap-8 xl:grid-cols-[0.84fr_1.16fr]">
          <AnimatedSection className="max-w-2xl">
            <span className="section-kicker">Property Journal</span>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-5xl">
              Editorial content that adds more depth to the property brand.
            </h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              The Sav Zaman journal gives the demo a stronger editorial layer around buying, selling, commercial review, and investment thinking.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Premium article cards and full blog detail pages",
                "UK property topics with investor and buyer relevance",
                "A more complete brand story beyond listings alone",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-[22px] border border-[hsl(var(--line))] bg-white px-4 py-4 shadow-[0_16px_36px_-28px_rgba(15,23,42,0.24)]">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[hsl(var(--accent))]" />
                  <p className="text-sm leading-7 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link to="/blog" className="btn-primary inline-flex items-center gap-2 px-7 py-4 text-sm">
                Explore the journal
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </AnimatedSection>

          {/* Journal cards: keep cards comfortably wide on tablet */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post, index) => (
              <AnimatedSection key={post.slug} delay={index * 0.06}>
                <motion.div
                  animate={journalCardMotion[index % journalCardMotion.length]}
                  transition={{
                    duration: 6.8 + index,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.35,
                  }}
                  className="h-full"
                >
                  <Link to={`/blog/${post.slug}`} className="group flex h-full">
                    <article className="flex h-[400px] w-full flex-col overflow-hidden rounded-[30px] border border-[hsl(var(--line))] bg-white shadow-[0_24px_60px_-38px_rgba(15,23,42,0.28)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_34px_78px_-46px_rgba(15,23,42,0.38)] lg:h-[460px]">
                      <div className="relative h-[170px] w-full shrink-0 overflow-hidden lg:h-[215px]">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,6,23,0.78)] via-transparent to-transparent" />
                        <div className="absolute left-4 top-4 rounded-full border border-white/18 bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                          {post.category}
                        </div>
                      </div>
                      <div className="flex min-h-0 flex-1 flex-col justify-between p-5">
                        <div className="min-h-0">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--accent))]">{post.readTime}</p>
                            <span className="shrink-0 rounded-full bg-[hsl(var(--secondary))] px-3 py-1 text-[11px] text-muted-foreground">
                              Journal
                            </span>
                          </div>
                          <h3 className="mt-3 line-clamp-3 font-heading text-xl font-semibold leading-snug tracking-[-0.03em] text-foreground transition-colors group-hover:text-[hsl(var(--accent))] md:text-[22px] md:leading-tight">
                            {post.title}
                          </h3>
                          <p className="mt-3 line-clamp-2 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
                        </div>
                        <div className="shrink-0 pt-4">
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--accent))]">
                            Read article
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding section-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.1),transparent_30%)]" />
        <div className="container-custom relative grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
          <AnimatedSection className="max-w-2xl">
            <span className="section-kicker text-[hsl(var(--accent-soft))]">Frequently Asked Questions</span>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
              Answers that make the property journey easier to understand.
            </h2>
            <p className="mt-5 text-base leading-8 text-white/70">
              This section gives the homepage more credibility and helps clients understand the listing flow, advisory model, and admin-backed structure.
            </p>

            <div className="mt-8 rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <span className="icon-chip border-white/10 bg-white/10 text-white">
                  <BookOpen className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--accent-soft))]">Client-ready clarity</p>
                  <p className="mt-2 text-sm leading-7 text-white/68">
                    Short, high-signal answers to the questions buyers, sellers, and investors usually ask first.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="left">
            <div className="grid-panel rounded-[34px] p-5 md:p-6">
              <Accordion type="single" collapsible className="space-y-4">
                {faqItems.map((item, index) => (
                  <AccordionItem
                    key={item.question}
                    value={`faq-${index}`}
                    className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.05] px-5 data-[state=open]:bg-white/[0.08]"
                  >
                    <AccordionTrigger className="py-5 text-left font-heading text-xl text-white hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-sm leading-7 text-white/70">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <CTABanner />
    </main>
  );
};

export default Index;
