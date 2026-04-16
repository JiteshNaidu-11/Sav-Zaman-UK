import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Clock3, Sparkles, Tag } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import CTABanner from "@/components/CTABanner";
import { blogPosts, getPostBySlug, getRelatedPosts } from "@/data/blogPosts";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

/** Maps post category to the journal topic chip/query value (e.g. Guide → Guides). */
function journalTopicQuery(category: string): string {
  return category === "Guide" ? "Guides" : category;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;
  const relatedPosts = post ? getRelatedPosts(post.slug) : [];

  useDocumentTitle(post ? `Sav Zaman — ${post.title}` : "Sav Zaman — Journal");

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const topicHref = `/blog?topic=${encodeURIComponent(journalTopicQuery(post.category))}`;
  const lastBody = post.body.filter((p) => p.trim()).at(-1)?.trim() ?? "";
  const keyTakeaway = lastBody.length >= 80 ? lastBody : post.excerpt;

  const currentIndex = blogPosts.findIndex((item) => item.slug === post.slug);
  const previousPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  return (
    <main className="overflow-hidden">
      <section className="page-shell relative overflow-hidden pb-20 pt-24 md:pb-24 md:pt-32">
        <div className="hero-noise absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.12),transparent_30%)]" />

        <div className="container-custom relative z-10 grid gap-8 xl:grid-cols-[0.88fr_1.12fr] xl:items-end">
          <AnimatedSection className="max-w-2xl">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/72 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Journal
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to={topicHref} className="pill-tag transition-opacity hover:opacity-90">
                {post.category}
              </Link>
              <span className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                {post.author}
              </span>
            </div>

            <h1 className="mt-6 font-heading text-5xl font-semibold leading-[0.96] tracking-[-0.03em] text-white md:text-6xl">
              {post.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/72 md:text-lg">{post.excerpt}</p>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/74">
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[hsl(var(--accent-soft))]" />
                {post.date}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-[hsl(var(--accent-soft))]" />
                {post.readTime}
              </span>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="left">
            <div className="grid-panel overflow-hidden rounded-[34px] p-4 md:p-5">
              <div className="relative overflow-hidden rounded-[28px] border border-white/10">
                <div className="relative aspect-[16/11]">
                  <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,6,23,0.92)] via-[rgba(2,6,23,0.12)] to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">Sav Zaman Editorial</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-[20px] border border-white/10 bg-white/8 px-4 py-4 backdrop-blur-xl">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">Topic</p>
                        <Link to={topicHref} className="mt-2 block text-sm font-semibold text-white hover:underline">
                          {post.category}
                        </Link>
                      </div>
                      <div className="rounded-[20px] border border-white/10 bg-white/8 px-4 py-4 backdrop-blur-xl">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">Read Time</p>
                        <p className="mt-2 text-sm font-semibold text-white">{post.readTime}</p>
                      </div>
                      <div className="rounded-[20px] border border-white/10 bg-white/8 px-4 py-4 backdrop-blur-xl">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">Published</p>
                        <p className="mt-2 text-sm font-semibold text-white">{post.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-custom grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          <AnimatedSection>
            <article className="outline-panel rounded-[32px] p-6 md:p-8 lg:p-10">
              <div className="border-b border-[hsl(var(--line))] pb-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[hsl(var(--accent))]">Article Overview</p>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-foreground">{post.excerpt}</p>
              </div>

              <div className="mt-8 space-y-6">
                {post.body.map((paragraph, index) => (
                  <motion.p
                    key={`${post.slug}-${index}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="text-base leading-8 text-muted-foreground"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>

              <div className="mt-10 rounded-[28px] border border-[hsl(var(--line))] bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(239,246,255,0.94))] p-6">
                <div className="flex items-start gap-3">
                  <span className="icon-chip h-12 w-12 rounded-[18px]">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--accent))]">Key Takeaway</p>
                    <p className="mt-3 text-lg leading-8 text-foreground">{keyTakeaway}</p>
                  </div>
                </div>
              </div>
            </article>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Tag className="h-4 w-4" />
                Tags
              </span>
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blog?topic=${encodeURIComponent(tag)}`}
                  className="rounded-full bg-white px-4 py-2 text-sm text-muted-foreground shadow-[0_16px_36px_-28px_rgba(15,23,42,0.28)] transition-colors hover:text-[hsl(var(--accent))]"
                >
                  {tag}
                </Link>
              ))}
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {previousPost ? (
                <Link
                  to={`/blog/${previousPost.slug}`}
                  className="group outline-panel rounded-[26px] p-5 transition-transform duration-300 hover:-translate-y-1"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--accent))]">Previous Article</p>
                  <h3 className="mt-3 text-lg font-semibold text-foreground transition-colors group-hover:text-[hsl(var(--accent))]">
                    {previousPost.title}
                  </h3>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--accent))]">
                    <ArrowLeft className="h-4 w-4" />
                    Open
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {nextPost ? (
                <Link
                  to={`/blog/${nextPost.slug}`}
                  className="group outline-panel rounded-[26px] p-5 text-left transition-transform duration-300 hover:-translate-y-1 sm:text-right"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--accent))]">Next Article</p>
                  <h3 className="mt-3 text-lg font-semibold text-foreground transition-colors group-hover:text-[hsl(var(--accent))]">
                    {nextPost.title}
                  </h3>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--accent))] sm:ml-auto">
                    Open
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ) : null}
            </div>
          </AnimatedSection>

          <AnimatedSection direction="left">
            <div className="xl:sticky xl:top-28">
              <div className="grid gap-5">
                <div className="grid-panel rounded-[30px] p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--accent-soft))]">Reading Panel</p>
                  <div className="mt-5 space-y-4">
                    <div className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/48">Author</p>
                      <p className="mt-2 text-sm font-semibold text-white">{post.author}</p>
                    </div>
                    <div className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/48">Category</p>
                      <Link to={topicHref} className="mt-2 block text-sm font-semibold text-white hover:underline">
                        {post.category}
                      </Link>
                    </div>
                    <div className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/48">Reading Time</p>
                      <p className="mt-2 text-sm font-semibold text-white">{post.readTime}</p>
                    </div>
                  </div>
                </div>

                {relatedPosts.length ? (
                  <div className="outline-panel rounded-[30px] p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--accent))]">Related Reading</p>
                    <div className="mt-4 space-y-4">
                      {relatedPosts.map((related) => (
                        <Link
                          key={related.slug}
                          to={`/blog/${related.slug}`}
                          className="group block overflow-hidden rounded-[24px] border border-[hsl(var(--line))] bg-white transition-colors hover:border-[hsl(var(--accent)/0.22)]"
                        >
                          <div className="aspect-[16/10] overflow-hidden bg-[hsl(var(--secondary))]">
                            <img
                              src={related.image}
                              alt={related.title}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                            />
                          </div>
                          <div className="p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--accent))]">
                              {related.category}
                            </p>
                            <h3 className="mt-2 text-base font-semibold leading-7 text-foreground transition-colors group-hover:text-[hsl(var(--accent))]">
                              {related.title}
                            </h3>
                            <p className="mt-3 text-xs text-muted-foreground">{related.date}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <CTABanner />
    </main>
  );
};

export default BlogPost;
