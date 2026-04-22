import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import londonSkyline from "@/assets/london-2.jpg";
import londonRiver from "@/assets/london 3.jpg";
import ukHeroFrame from "@/assets/7.jpg";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";

/** Legacy stock thumbnails (not used — journal uses UK photography only). */
// import blog1 from "@/assets/blog-1.jpg";
// import blog2 from "@/assets/blog-2.jpg";

export interface BlogPost {
  slug: string;
  image: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  author: string;
  readTime: string;
  tags: string[];
  body: string[];
}

/**
 * UK-only journal: keep India-market (or other non-UK) drafts out of the live list.
 * Add slugs here to hide posts without deleting their source below.
 */
const EXCLUDED_INDIA_MARKET_SLUGS: readonly string[] = [
  // e.g. "mumbai-luxury-residential-outlook",
];

/** All editorial entries before UK-only filtering. */
const allBlogPosts: BlogPost[] = [
  {
    slug: "prime-uk-property-opportunities-in-2026",
    image: property1,
    title: "Prime UK property opportunities in 2026",
    date: "March 2026",
    category: "Investment",
    excerpt: "Where investors are focusing across London, Manchester and Birmingham.",
    author: "Sav Zaman Research",
    readTime: "5 min read",
    tags: ["Prime Property", "Investment", "UK Market", "London"],
    body: [
      "Institutional and private investors are reallocating toward well-located UK assets with clearer income stories and stronger presentation.",
      "London remains the anchor for liquidity, while Manchester and Birmingham continue to attract yield-led buyers who want scale and tenant depth.",
      "The best opportunities in 2026 combine realistic pricing, visible fundamentals, and a listing that does not hide the important questions.",
    ],
  },
  {
    slug: "how-to-evaluate-prime-uk-property-opportunities",
    image: londonSkyline,
    title: "How to evaluate prime UK property opportunities with more confidence",
    date: "08 Feb 2026",
    category: "Investment",
    excerpt:
      "A clearer framework for reviewing pricing, location quality, holding logic, and buyer fit before moving on a premium opportunity.",
    author: "Sav Zaman Advisory Desk",
    readTime: "5 min read",
    tags: ["Prime Property", "Investment", "UK Market", "London"],
    body: [
      "Premium property should never be judged on visuals alone. Strong opportunities usually reveal themselves through a clearer combination of location quality, pricing logic, future liquidity, and buyer fit.",
      "The first review should focus on whether the asset matches the client goal. A family home, a lifestyle purchase, and an investment-led acquisition all need a different lens even when the asking price sits in the same bracket.",
      "Location still matters most, but not in a generic way. The real question is whether the surrounding infrastructure, access, tenant or buyer profile, and wider market momentum support the kind of outcome the client actually wants.",
      "Presentation also plays a role. Cleaner listing structure, better image sequencing, more visible highlights, and more direct enquiry paths reduce friction and help the decision move faster.",
      "The strongest property conversations happen when design, data, and advisory are working together instead of separately.",
    ],
  },
  {
    slug: "what-buyers-should-check-before-booking-a-viewing",
    image: londonRiver,
    title: "What buyers should check before booking a property viewing",
    date: "29 Jan 2026",
    category: "Guide",
    excerpt:
      "A short checklist that helps buyers filter out weak-fit listings earlier and spend viewing time on the opportunities that matter.",
    author: "Sav Zaman Client Team",
    readTime: "4 min read",
    tags: ["Buyers", "Viewing", "Checklist", "Guides"],
    body: [
      "Too many buyers start with viewings before they have filtered the opportunity properly. That usually creates noise, not clarity.",
      "Before booking a viewing, the buyer should already understand the asset class, exact location, pricing band, internal size, and the non-negotiables around the property.",
      "It also helps to review the property presentation critically. If the listing lacks strong photography, a clear layout, or basic detail visibility, the client should ask why before committing time to the visit.",
      "Shortlisting fewer but better-fit properties creates better conversations, better comparisons, and much stronger momentum once a serious opportunity appears.",
      "Property discovery feels calmer when the first filter happens before the calendar starts filling up.",
    ],
  },
  {
    slug: "why-commercial-listings-need-better-presentation",
    image: property3,
    title: "Why commercial listings need stronger presentation than most agencies give them",
    date: "20 Jan 2026",
    category: "Commercial",
    excerpt:
      "Commercial property decisions move faster when the listing tells a clearer story around frontage, use case, location logic, and next steps.",
    author: "Sav Zaman Commercial Team",
    readTime: "6 min read",
    tags: ["Commercial", "Retail", "Presentation"],
    body: [
      "Commercial property buyers want clarity early. They need to understand exposure, access, internal flexibility, neighbourhood quality, and likely use cases before they commit to deeper review.",
      "Weak presentation slows this down. When the asset is shown with poor structure or generic copy, the buyer has to work too hard to understand whether it is even worth the next conversation.",
      "A stronger commercial listing should quickly show the asset category, surface-level fundamentals, visual identity, and the most likely occupier or investor angle.",
      "That is why commercial presentation should look sharper, read cleaner, and move more directly into enquiry than a standard residential template.",
      "Design quality does not replace fundamentals, but it does make good fundamentals easier to understand and easier to act on.",
    ],
  },
  {
    slug: "how-premium-property-brands-build-trust-faster",
    image: hero2,
    title: "How premium property brands build trust faster through structure and design",
    date: "10 Jan 2026",
    category: "Brand Strategy",
    excerpt:
      "Trust is shaped by more than reputation. Listing hierarchy, response flow, and visual control all influence how quickly a client believes the brand.",
    author: "Sav Zaman Editorial",
    readTime: "5 min read",
    tags: ["Brand", "Client Experience", "Design", "Interior Design"],
    body: [
      "Property brands often talk about trust as if it begins only after a conversation. In reality, trust usually starts forming much earlier through the website, the listing layout, and the first enquiry interaction.",
      "When a property page feels deliberate, the client reads the brand as more organised. When the navigation is clear, the content hierarchy is strong, and the enquiry options are visible, the experience feels more reliable.",
      "This matters even more in premium property because the buyer expects a higher standard before the first call happens.",
      "The strongest brands reduce visual confusion, remove dead space, and guide the user from discovery to action without making the interface feel aggressive.",
      "Presentation is not just decoration. It is one of the fastest ways to make the client feel that the business behind the listing is serious.",
    ],
  },
  {
    slug: "london-super-prime-streets-what-changed",
    image: hero1,
    title: "London super-prime streets: what changed in the last 12 months",
    date: "Feb 2026",
    category: "London",
    excerpt: "A concise read on how presentation, stock levels, and buyer behaviour shifted across key central postcodes.",
    author: "Sav Zaman Market Desk",
    readTime: "6 min read",
    tags: ["London", "UK Market", "Prime Property"],
    body: [
      "Super-prime is not one market. It is a set of micro-locations where small shifts in stock and pricing visibility change outcomes quickly.",
      "Buyers are comparing listings more aggressively online before they commit to viewings, which makes photography and narrative structure more important.",
      "When the story is clear and the fundamentals are visible, enquiry quality improves even in quieter periods.",
    ],
  },
  {
    slug: "listed-buildings-architecture-without-compromise",
    image: property2,
    title: "Listed buildings: architecture-led upgrades without losing character",
    date: "Jan 2026",
    category: "Architecture",
    excerpt: "How planning-sensitive refurbishments balance heritage constraints with modern living expectations.",
    author: "Sav Zaman Editorial",
    readTime: "7 min read",
    tags: ["Architecture", "Design", "Case Studies"],
    body: [
      "Heritage assets need a design language that respects the original fabric while making day-to-day use feel effortless.",
      "The strongest schemes start with constraints, then build a narrative that planners and buyers can both understand.",
    ],
  },
  {
    slug: "interior-staging-that-sells-premium-homes-faster",
    image: property4,
    title: "Interior staging that sells premium homes faster",
    date: "Jan 2026",
    category: "Interior Design",
    excerpt: "Staging choices that sharpen photography, widen appeal, and shorten time-to-offer without looking generic.",
    author: "Sav Zaman Presentation Team",
    readTime: "4 min read",
    tags: ["Interior Design", "Sellers", "Guides"],
    body: [
      "Premium buyers respond to space, light, and calm hierarchy more than trend-chasing decor.",
      "Staging should make the floor plan obvious in photography and help the viewer imagine a single, confident next step.",
    ],
  },
  {
    slug: "case-study-repositioning-a-mixed-use-corner",
    image: hero3,
    title: "Case study: repositioning a mixed-use corner for stronger enquiry",
    date: "Dec 2025",
    category: "Case Studies",
    excerpt: "A before-and-after style breakdown of messaging, media order, and enquiry routing for a commercial-led asset.",
    author: "Sav Zaman Advisory",
    readTime: "8 min read",
    tags: ["Case Studies", "Commercial", "UK Market"],
    body: [
      "The asset had strong fundamentals but weak narrative hierarchy, which made the first click feel uncertain.",
      "We rebuilt the listing around use-case clarity, clearer photography sequencing, and a simpler enquiry path.",
    ],
  },
  {
    slug: "sellers-checklist-before-you-instruct",
    image: ukHeroFrame,
    title: "The seller’s checklist before you instruct an agent",
    date: "Dec 2025",
    category: "Guides",
    excerpt: "Documentation, presentation, and pricing discipline that reduces friction once the listing goes live.",
    author: "Sav Zaman Client Team",
    readTime: "5 min read",
    tags: ["Sellers", "Guides", "UK Market"],
    body: [
      "Sellers who prepare early usually achieve cleaner viewings and stronger offers because buyers sense control and transparency.",
      "Start with facts: tenure, service charges, planning history, and any material information that will surface anyway.",
    ],
  },
  {
    slug: "property-investment-opportunities-in-london-2026",
    image: londonSkyline,
    title: "Property Investment Opportunities in London 2026",
    date: "Apr 2026",
    category: "London",
    excerpt: "Where the strongest 2026 London opportunities are emerging—and what to look for before you commit capital.",
    author: "Sav Zaman Market Desk",
    readTime: "6 min read",
    tags: ["London", "Investment", "UK Market", "Prime Property"],
    body: [
      "London in 2026 is less about chasing headlines and more about finding assets with clean fundamentals: transport-led micro locations, stable demand, and realistic pricing.",
      "Investors are leaning toward properties that can explain their income story quickly—either through a clear rental market, strong resale liquidity, or value-add potential that is supported by planning reality.",
      "The best listings make decision-making easier by showing the facts upfront: tenure, service charges, comparable evidence, and a transparent next step to enquiry.",
    ],
  },
  {
    slug: "uk-rental-market-trends-investors-need-to-know",
    image: hero2,
    title: "UK Rental Market Trends: What Investors Need to Know",
    date: "Apr 2026",
    category: "Investment",
    excerpt: "A practical view of demand, pricing pressure, and what tenants and investors are prioritising across key UK cities.",
    author: "Sav Zaman Research",
    readTime: "5 min read",
    tags: ["UK Market", "Investment", "Rentals", "Manchester", "London"],
    body: [
      "Across the UK, rental demand remains anchored by affordability pressure and mobility into stronger employment hubs.",
      "Investors are focusing on unit types that stay liquid: well-finished one and two beds in locations with transport access and clear tenant depth.",
      "The winning strategy in 2026 is rarely ‘highest rent’. It’s consistent occupancy, disciplined maintenance, and a property that remains easy to resell.",
    ],
  },
  {
    slug: "buying-property-in-the-uk-as-an-overseas-investor",
    image: londonRiver,
    title: "Buying Property in the UK as an Overseas Investor",
    date: "Mar 2026",
    category: "Guide",
    excerpt: "A clean overview of what overseas buyers should prepare—from compliance and financing to conveyancing and tenancy setup.",
    author: "Sav Zaman Advisory Desk",
    readTime: "7 min read",
    tags: ["Guides", "UK Market", "Investment", "London"],
    body: [
      "Overseas investment in the UK is easiest when the process is treated like a project: identity checks, proof of funds, and solicitor timelines need to be lined up early.",
      "The strongest outcomes come from choosing assets that are simple to manage remotely—clear tenant demand, clean documentation, and predictable running costs.",
      "A good advisor should reduce ambiguity: the goal is a transaction that feels controlled, not rushed.",
    ],
  },
  {
    slug: "top-areas-in-manchester-for-property-growth",
    image: property2,
    title: "Top Areas in Manchester for Property Growth",
    date: "Mar 2026",
    category: "UK Market",
    excerpt: "Neighbourhoods and signals that matter most in Manchester when you’re investing for growth and resale liquidity.",
    author: "Sav Zaman Market Desk",
    readTime: "5 min read",
    tags: ["Manchester", "UK Market", "Investment"],
    body: [
      "Manchester growth is increasingly shaped by connectivity, employment proximity, and the quality of the immediate neighbourhood experience.",
      "Look for ‘boring strength’: transport links, consistent tenant demand, and building quality that will still photograph well in two years.",
      "Avoid relying on one factor alone. Growth usually appears where multiple signals align at the same time.",
    ],
  },
  {
    slug: "uk-stamp-duty-explained-for-buyers",
    image: property4,
    title: "UK Stamp Duty Explained for Buyers",
    date: "Feb 2026",
    category: "Guide",
    excerpt: "A simple breakdown of stamp duty, what changes the bill, and how to plan for it early in the purchase journey.",
    author: "Sav Zaman Client Team",
    readTime: "4 min read",
    tags: ["Guides", "UK Market", "Buyers"],
    body: [
      "Stamp duty is not just a line item. It affects affordability, timing, and how quickly a buyer can move once a strong opportunity appears.",
      "The right approach is clarity early: understand the purchase structure, budget realistically for total costs, and align your solicitor before the offer stage.",
      "When buyers prepare properly, the transaction feels cleaner and negotiation stays focused on the property—not surprises.",
    ],
  },
];

/*
 * ── India / South Asia market (commented out — not shown on UK site) ──
 * Restore objects here if you need copy reference, then add their `slug` to
 * `EXCLUDED_INDIA_MARKET_SLUGS` above, or merge into `allBlogPosts` and tag with region.
 *
 * {
 *   slug: "example-india-market-piece",
 *   image: londonSkyline,
 *   title: "Example India market headline",
 *   date: "Jan 2026",
 *   category: "Investment",
 *   excerpt: "…",
 *   author: "…",
 *   readTime: "5 min read",
 *   tags: ["India", "Investment"],
 *   body: ["…"],
 * },
 */

function isIndiaMarketPost(post: BlogPost): boolean {
  if (EXCLUDED_INDIA_MARKET_SLUGS.includes(post.slug)) return true;
  return post.tags.some((t) => /^india$/i.test(t.trim()));
}

/** Published journal (UK positioning — India-market posts excluded). */
export const blogPosts: BlogPost[] = allBlogPosts.filter((post) => !isIndiaMarketPost(post));

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  return blogPosts.filter((post) => post.slug !== currentSlug).slice(0, limit);
}
