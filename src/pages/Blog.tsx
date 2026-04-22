import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Calendar, Clock3 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { siteDocumentTitle } from "@/content/site";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import CTABanner from "@/components/CTABanner";
import { blogPosts, type BlogPost } from "@/data/blogPosts";
import { cn } from "@/lib/utils";

const JOURNAL_TOPIC_CHIPS = [
  "All",
  "Prime Property",
  "Investment",
  "UK Market",
  "Buyers",
  "Sellers",
  "Commercial",
  "London",
  "Architecture",
  "Interior Design",
  "Case Studies",
  "Guides",
  "Design",
] as const;

const journalStats = [
  { value: "Weekly", label: "Fresh intelligence" },
  { value: "UK", label: "National lens" },
  { value: "360°", label: "Decision support" },
] as const;

function postMatchesChip(post: BlogPost, chip: string): boolean {
  if (chip === "All") return true;
  const c = chip.toLowerCase();
  if (post.category.toLowerCase() === c) return true;
  if (chip === "Guides" && post.category === "Guide") return true;
  if (post.tags.some((tag) => tag.toLowerCase() === c)) return true;
  if (chip === "Design") {
    if (post.category === "Brand Strategy") return true;
    if (post.tags.some((t) => /design/i.test(t))) return true;
  }
  return false;
}

function chipFromTopicParam(searchParams: URLSearchParams): string {
  const raw = searchParams.get("topic")?.trim();
  if (!raw) return "All";
  let decoded: string;
  try {
    decoded = decodeURIComponent(raw.replace(/\+/g, " "));
  } catch {
    decoded = raw;
  }
  const match = (JOURNAL_TOPIC_CHIPS as readonly string[]).find((c) => c.toLowerCase() === decoded.toLowerCase());
  return match ?? decoded;
}

const glassCard =
  "rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl";

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeChip, setActiveChip] = useState(() => chipFromTopicParam(searchParams));

  useEffect(() => {
    setActiveChip(chipFromTopicParam(searchParams));
  }, [searchParams]);

  const pageTitle =
    activeChip === "All"
      ? `${siteDocumentTitle} — Journal`
      : `${siteDocumentTitle} — Journal · ${activeChip}`;
  useDocumentTitle(pageTitle);

  const setChip = (chip: string) => {
    setActiveChip(chip);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (chip === "All") next.delete("topic");
        else next.set("topic", chip);
        return next;
      },
      { replace: true },
    );
  };

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => postMatchesChip(post, activeChip));
  }, [activeChip]);

  const featuredPost = filteredPosts[0] ?? blogPosts[0];
  const sidePosts = filteredPosts.slice(1, 4);
  const gridPosts = filteredPosts.slice(4);

  return (
    <main className="overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#0B1A2F] to-[#1e293b]">
      {/* —— Hero + featured —— */}
      <section className="relative overflow-hidden py-20">
        <div className="hero-noise pointer-events-none absolute inset-0 opacity-[0.18]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.1),transparent_38%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
            <AnimatedSection className="max-w-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/45">Sav Zaman Journal</p>
              <h1 className="mt-5 font-heading text-4xl font-bold leading-[1.06] tracking-[-0.035em] text-white md:text-5xl lg:text-[2.85rem]">
                Property insights built to look premium and read clearly.
              </h1>
              <p className="mt-6 text-base font-light leading-relaxed text-white/60 md:text-lg md:leading-8">
                Editorial content around buying, selling, investment trends, and premium property positioning across the UK
                market.
              </p>

              <div className="mt-10 grid gap-8 sm:grid-cols-3">
                {journalStats.map((s, i) => (
                  <div key={s.value} className={cn("p-6", glassCard, "hover:border-white/15")}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">0{i + 1}</p>
                    <p className="mt-3 font-heading text-2xl font-semibold text-white">{s.value}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/55">{s.label}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection direction="left" delay={0.06}>
              <Link to={`/blog/${featuredPost.slug}`} className="group block">
                <article
                  className={cn(
                    "overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-xl",
                    "transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-2xl hover:shadow-black/25",
                  )}
                >
                  <div className="relative min-h-[260px] w-full overflow-hidden md:min-h-[300px] lg:min-h-[320px]">
                    <img
                      src={featuredPost.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
                    <div className="absolute left-5 top-5 z-10">
                      <span className="inline-flex rounded-full border border-white/25 bg-black/35 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white shadow-sm backdrop-blur-md">
                        {featuredPost.category}
                      </span>
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 z-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-white/85">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5 text-white/70" />
                        {featuredPost.readTime}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-white/70" />
                        {featuredPost.date}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="font-heading text-2xl font-bold leading-[1.15] tracking-[-0.03em] text-white md:text-3xl lg:text-[1.85rem]">
                      {featuredPost.title}
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-white/55 md:text-[15px] md:leading-7">
                      {featuredPost.excerpt}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition-colors duration-300 group-hover:text-blue-200">
                      Read article
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </article>
              </Link>
            </AnimatedSection>
          </div>

          {/* Side articles — premium list */}
          {sidePosts.length > 0 ? (
            <div className="mt-20">
              <AnimatedSection>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">Latest</p>
                <h2 className="mt-2 font-heading text-xl font-semibold text-white md:text-2xl">More from the journal</h2>
              </AnimatedSection>
              <div
                className={cn(
                  "mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-lg backdrop-blur-xl",
                )}
              >
                {sidePosts.map((post, index) => (
                  <AnimatedSection key={post.slug} delay={index * 0.05}>
                    <Link
                      to={`/blog/${post.slug}`}
                      className={cn(
                        "group flex flex-col gap-4 border-b border-white/10 p-5 transition-all duration-300 last:border-b-0 sm:flex-row sm:items-center sm:gap-6 sm:p-6",
                        "hover:bg-white/[0.06]",
                      )}
                    >
                      <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl border border-white/10 sm:h-24 sm:w-40">
                        <img
                          src={post.image}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-200/75">
                          <span>{post.category}</span>
                          <span className="text-white/30">·</span>
                          <span className="inline-flex items-center gap-1 font-normal normal-case tracking-normal text-white/45">
                            <Clock3 className="h-3.5 w-3.5" />
                            {post.readTime}
                          </span>
                        </div>
                        <h3 className="mt-2 font-heading text-lg font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-blue-200 md:text-xl">
                          {post.title}
                        </h3>
                        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/55">{post.excerpt}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 shrink-0 text-white/35 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-blue-300 sm:ml-2" />
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* —— Topics —— */}
      <section className="mt-20 border-t border-white/10 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">Topics</p>
            <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-0.02em] text-white md:text-3xl">Browse by theme</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55 md:text-base">
              Filter articles by focus — from prime property and investment to guides and design-led case studies.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
              {JOURNAL_TOPIC_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setChip(chip)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
                    activeChip === chip
                      ? "border-blue-400/45 bg-blue-500/20 text-white shadow-lg shadow-blue-950/40 hover:border-blue-400/55 hover:bg-blue-500/25"
                      : "border-white/10 bg-white/5 text-white/85 backdrop-blur-sm hover:border-white/20 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {chip}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* —— Archive —— */}
      <section className="border-t border-white/10 bg-gradient-to-b from-[#0f172a]/90 via-[#0B1428] to-[#020617] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection className="mb-10 max-w-2xl md:mb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">Archive</p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-0.03em] text-white md:text-4xl">
              Market intelligence &amp; guides
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/55 md:text-base md:leading-7">
              Longer reads on investment briefs, buyer and seller playbooks, commercial presentation, and case-led lessons from
              the field.
            </p>
          </AnimatedSection>

          {gridPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post, index) => (
                <AnimatedSection key={post.slug} delay={index * 0.04}>
                  <Link to={`/blog/${post.slug}`} className="group flex h-full">
                    <article
                      className={cn(
                        "flex h-[420px] w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-md backdrop-blur-xl",
                        "transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-xl",
                      )}
                    >
                      <div className="relative h-[180px] w-full shrink-0 overflow-hidden bg-slate-900/50">
                        <img
                          src={post.image}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-80" />
                        <div className="absolute left-4 top-4 z-10">
                          <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex min-h-0 flex-1 flex-col justify-between p-6">
                        <div className="min-h-0 overflow-hidden">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/45">
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 shrink-0 text-blue-400/80" />
                              {post.date}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Clock3 className="h-3.5 w-3.5 shrink-0 text-blue-400/80" />
                              {post.readTime}
                            </span>
                          </div>
                          <h3 className="mt-3 line-clamp-2 font-heading text-xl font-semibold leading-snug tracking-[-0.02em] text-white group-hover:text-blue-200">
                            {post.title}
                          </h3>
                          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/55">{post.excerpt}</p>
                        </div>
                        <div className="shrink-0 pt-5">
                          <p className="line-clamp-1 text-xs font-medium text-white/40">By {post.author}</p>
                          <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition-colors group-hover:text-blue-200">
                            Read article
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection>
              <div
                className={cn(
                  "rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-lg backdrop-blur-xl md:p-10",
                  "transition-all duration-300",
                )}
              >
                <p className="font-heading text-lg text-white">All matching articles are highlighted above</p>
                <p className="mt-2 text-sm text-white/55">Try another topic or reset to &quot;All&quot; to see the full journal.</p>
                <button
                  type="button"
                  onClick={() => setActiveChip("All")}
                  className="mt-8 rounded-full border border-white/15 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/25 hover:bg-white/15"
                >
                  Show all articles
                </button>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      <div className="border-t border-white/10 bg-gradient-to-b from-[#020617] to-[#0f172a] py-20">
        <CTABanner sectionClassName="!px-0 !py-0 bg-transparent shadow-none" />
      </div>
    </main>
  );
};

export default Blog;
