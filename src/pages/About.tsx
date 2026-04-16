import { Compass, Eye, Quote, ShieldCheck, TimerReset } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import CTABanner from "@/components/CTABanner";
import { founderProfile, performanceSignals, values } from "@/content/site";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { cn } from "@/lib/utils";

const kickerLight = "text-sm font-semibold uppercase tracking-widest text-blue-500";
const kickerDark = "text-sm font-semibold uppercase tracking-widest text-blue-300";

const heroFeatureCards = [
  {
    title: "Property-Led Clarity",
    description: "Listings, advice, and follow-up should be easy for buyers, sellers, and investors to act on.",
    icon: Eye,
  },
  {
    title: "Presentation With Purpose",
    description: "Premium visuals matter when they support faster understanding and stronger client confidence.",
    icon: Compass,
  },
  {
    title: "Reliable By Design",
    description: "Built around trust signals: better property structure, stronger pacing, and consistent delivery control.",
    icon: ShieldCheck,
  },
] as const;

const operatingPrinciples = [
  {
    title: "Property-Led Clarity",
    description: "Listings, advice, and follow-up should be easy for buyers, sellers, and investors to act on.",
    icon: Eye,
  },
  {
    title: "Presentation With Purpose",
    description: "Premium visuals matter when they support faster understanding and stronger client confidence.",
    icon: Compass,
  },
  {
    title: "Reliable By Design",
    description: "Trust signals through structure, pacing, and delivery you can rely on.",
    icon: ShieldCheck,
  },
  {
    title: "Responsive Without Chaos",
    description: "Serious property opportunities move quickly, but never at the cost of clarity.",
    icon: TimerReset,
  },
] as const;

const cardHover =
  "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl";

function SectionRule() {
  return <div className="my-16 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />;
}

const About = () => {
  useDocumentTitle("Sav Zaman — About");
  return (
    <main className="overflow-hidden bg-[#F4F6FA]">
      {/* 1 — Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1A2F] to-[#0E223F] py-24 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.2),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.12),transparent_38%)]" />
        <div className="hero-noise pointer-events-none absolute inset-0 opacity-[0.18]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimatedSection className="max-w-xl">
              <p className={kickerDark}>About Sav Zaman</p>
              <h1 className="mt-4 font-heading text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-white lg:text-5xl">
                A real-estate approach shaped around trust, presentation, and measured delivery.
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-white/70">
                Sav Zaman exists to present property opportunities with more structure—clearer discovery, stronger
                listing presentation, better follow-up, and calmer client communication from start to finish.
              </p>
            </AnimatedSection>

            <AnimatedSection direction="left" delay={0.06}>
              <div className="space-y-4">
                {heroFeatureCards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className={cn(
                        "rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-colors duration-300",
                        cardHover,
                        "hover:bg-white/10",
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                          <p className="mt-2 text-sm leading-relaxed text-white/65">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 2 — Stats (overlap hero) */}
      <section className="relative z-10 -mt-16 px-6 py-20 md:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-10 xl:gap-12">
            {performanceSignals.map((signal, index) => (
              <AnimatedSection key={signal.label} delay={index * 0.05}>
                <div
                  className={cn(
                    "h-full rounded-[28px] border border-gray-200/90 bg-white p-7 shadow-[0_22px_56px_-28px_rgba(15,23,42,0.16)] md:p-8",
                    cardHover,
                    "hover:border-gray-200 hover:shadow-[0_28px_64px_-28px_rgba(15,23,42,0.22)]",
                  )}
                >
                  <p className="font-heading text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{signal.value}</p>
                  <p className="mt-3 text-lg font-semibold text-slate-800">{signal.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{signal.note}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6">
        <SectionRule />
      </div>

      {/* 3 — Standards */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <AnimatedSection className="max-w-lg">
              <p className={kickerLight}>Standards</p>
              <h2 className="mt-4 font-heading text-4xl font-semibold tracking-[-0.03em] text-slate-900 lg:text-5xl">
                The standards behind every property conversation, listing, and handoff.
              </h2>
              <p className="mt-5 text-xl text-gray-600">
                Elevated presentation only works when it supports practical real-estate communication underneath it.
              </p>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Sav Zaman is designed to feel consultative and calm—so clients always know what matters, what is
                available, and what happens next.
              </p>
            </AnimatedSection>

            <div className="grid gap-6 md:grid-cols-2">
              {values.map((value, index) => (
                <AnimatedSection key={value.title} delay={index * 0.06}>
                  <div
                    className={cn(
                      "h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm",
                      cardHover,
                      "hover:shadow-md",
                    )}
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest text-blue-500/90">{`0${index + 1}`}</p>
                    <h3 className="mt-3 text-lg font-semibold text-slate-900">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">{value.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6">
        <SectionRule />
      </div>

      {/* 4 — Founder */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <AnimatedSection>
              <div
                className={cn(
                  "relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-[#152a45] to-[#0B1A2F] p-8 text-white shadow-xl",
                  cardHover,
                )}
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-teal-500/10 blur-3xl" />
                <div className="relative">
                  <p className={kickerDark}>Founder</p>
                  <div className="mt-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-white/15 bg-white/10 font-heading text-2xl font-semibold tracking-[0.2em] text-white">
                    SZ
                  </div>
                  <h2 className="mt-6 font-heading text-3xl font-semibold tracking-[-0.02em] lg:text-4xl">{founderProfile.name}</h2>
                  <p className="mt-2 text-sm font-medium uppercase tracking-widest text-blue-200/90">{founderProfile.role}</p>
                  <p className="mt-5 text-base leading-relaxed text-white/75">{founderProfile.intro}</p>
                  <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
                    {founderProfile.highlights.map((line) => (
                      <li key={line} className="flex gap-3 text-sm leading-relaxed text-white/70">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="left" delay={0.08}>
              <div>
                <p className={kickerLight}>Founder perspective</p>
                <h2 className="mt-4 font-heading text-4xl font-semibold tracking-[-0.03em] text-slate-900 lg:text-5xl">
                  Built on experience, structured for clarity.
                </h2>
                <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                  <Quote className="h-8 w-8 text-blue-500" aria-hidden />
                  <p className="mt-4 text-lg font-normal leading-relaxed text-slate-700">{founderProfile.statement}</p>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {founderProfile.stats.map((item) => (
                    <div key={item.label} className="rounded-xl bg-gray-50 p-4 text-center">
                      <p className="font-heading text-xl font-semibold text-slate-900 md:text-2xl">{item.value}</p>
                      <p className="mt-2 text-xs leading-snug text-gray-500">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6">
        <SectionRule />
      </div>

      {/* 5 — Operating principles (dark band) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1A2F] to-[#0E223F] py-20 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(45,212,191,0.08),transparent_35%)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <AnimatedSection className="max-w-3xl">
            <p className={kickerDark}>Operating principles</p>
            <h2 className="mt-4 font-heading text-4xl font-semibold tracking-[-0.03em] text-white lg:text-5xl">
              Better property structure creates better client confidence.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/65">
              How we work day to day—so advisory feels composed, visible, and commercially grounded.
            </p>
          </AnimatedSection>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {operatingPrinciples.map((item, index) => {
              const Icon = item.icon;
              return (
                <AnimatedSection key={item.title} delay={index * 0.06}>
                  <div
                    className={cn(
                      "h-full rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl",
                      cardHover,
                      "hover:bg-white/[0.08]",
                    )}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/10">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{item.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6 — CTA */}
      <CTABanner sectionClassName="bg-[#F4F6FA] py-16 md:py-16 lg:py-16" />
    </main>
  );
};

export default About;
