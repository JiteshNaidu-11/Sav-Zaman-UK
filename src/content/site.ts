/** Default `<title>` — keep in sync with `index.html`. */
export const siteDocumentTitle = "Sav Zaman | The Property Man";

/** Primary meta description — keep in sync with `index.html`. */
export const siteMetaDescription =
  "Explore premium residential and commercial properties across the UK with Sav Zaman.";

export const siteContent = {
  name: "Sav Zaman",
  shortName: "Sav Zaman",
  tagline: "Premium property advisory and listings.",
  description:
    "Explore premium residential and commercial properties across the UK with Sav Zaman.",
  primaryCta: "Book A Property Consultation",
  secondaryCta: "Explore Properties",
  email: "hello@savzamanuk.com",
  phone: "+44 (0)20 5555 0148",
  whatsappNumber: import.meta.env.VITE_CLIENT_WHATSAPP_NUMBER?.trim() || "442055550148",
  hours: "Monday to Friday, 9:00 AM to 6:00 PM",
  address: "Sav Zaman, London, United Kingdom",
} as const;

/** Footer social — replace hrefs with your real profiles when ready. */
export const footerSocialLinks = {
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/",
  linkedin: "https://www.linkedin.com/",
  twitter: "https://x.com/",
} as const;

export const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Properties", path: "/properties" },
  { label: "Blog", path: "/blog" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
] as const;

export const heroHighlights = [
  "Pre-auction deals",
  "Direct to vendors",
  "Below market value",
] as const;

export const capabilityPillars = [
  {
    title: "Property Buying Support",
    description:
      "Shortlist the right opportunities with clearer comparisons, stronger presentation, and faster decision support.",
  },
  {
    title: "Seller Representation",
    description:
      "Position listings properly, coordinate enquiries, and keep every serious lead moving with structure.",
  },
  {
    title: "Investment Advisory",
    description:
      "Identify opportunities with stronger yield, better location logic, and a more commercial long-term view.",
  },
  {
    title: "End-To-End Coordination",
    description:
      "Viewing schedules, follow-ups, documentation support, and communication flow managed with more control.",
  },
] as const;

export const performanceSignals = [
  { value: "24h", label: "Response target", note: "Fast first contact for active enquiries." },
  { value: "UK", label: "Sav Zaman identity", note: "A darker, more premium property presentation." },
  { value: "360+", label: "Listing support", note: "Discovery, viewings, follow-up, and transaction support." },
  { value: "Prime", label: "Property focus", note: "Residential, commercial, and investment-led opportunities." },
] as const;

export const founderProfile = {
  name: "Sav Zaman",
  role: "Founder & Director",
  intro:
    "A founder-led property direction focused on stronger presentation, calmer coordination, and a more premium client experience across UK listings.",
  statement:
    "The business is built around the idea that property advisory should feel sharper, more transparent, and easier to trust from first enquiry to final decision.",
  highlights: [
    "Founder-led client communication and listing direction",
    "Focus on premium residential, commercial, and investment opportunities",
    "Design-conscious presentation paired with practical real-estate delivery",
  ],
  stats: [
    { value: "12+", label: "Years around property conversations" },
    { value: "UK", label: "Market-facing brand focus" },
    { value: "1:1", label: "Founder visibility on serious enquiries" },
  ],
} as const;

export const processSteps = [
  {
    title: "Discover",
    description:
      "We understand budget, property type, location priorities, and the actual outcome the client wants.",
  },
  {
    title: "Shortlist",
    description:
      "Opportunities are filtered into a sharper, more relevant set of listings or acquisition options.",
  },
  {
    title: "Coordinate",
    description:
      "Viewings, follow-ups, documentation, and stakeholder communication are kept moving with control.",
  },
  {
    title: "Close",
    description:
      "The final stage focuses on confidence, cleaner decision-making, and a smoother route to completion.",
  },
] as const;

export const differentiators = [
  {
    title: "Premium Listing Presentation",
    description:
      "Every property and every touchpoint is presented with stronger hierarchy, better visual control, and a more premium tone.",
  },
  {
    title: "Faster, Cleaner Coordination",
    description:
      "Enquiries, follow-ups, and next steps are handled with more structure so momentum is not lost.",
  },
  {
    title: "Advisory With Accountability",
    description:
      "Clients should always know what is available, what matters most, and what the next move looks like.",
  },
] as const;

export const serviceDetails = [
  {
    title: "Residential Property Advisory",
    summary: "Helping buyers and families identify better-fit homes with clearer comparisons.",
    deliverables: ["Needs review", "Shortlisting", "Viewing support"],
  },
  {
    title: "Commercial Property Search",
    summary: "Positioning office, retail, and mixed-use opportunities with a more commercial lens.",
    deliverables: ["Market filtering", "Location review", "Commercial fit checks"],
  },
  {
    title: "Investment Opportunity Support",
    summary: "Helping investors assess listing quality, location value, and long-term potential.",
    deliverables: ["Opportunity review", "Yield perspective", "Decision support"],
  },
  {
    title: "Seller Listing Support",
    summary: "Presenting properties better and handling lead flow with more structure.",
    deliverables: ["Listing positioning", "Lead coordination", "Enquiry management"],
  },
  {
    title: "Viewing & Follow-Up Coordination",
    summary: "Keeping momentum after initial interest with better communication and scheduling.",
    deliverables: ["Viewing scheduling", "Client follow-up", "Next-step management"],
  },
  {
    title: "Transaction Support",
    summary: "Supporting the path from interest to closure with calmer, clearer communication.",
    deliverables: ["Documentation support", "Stakeholder coordination", "Completion readiness"],
  },
] as const;

export const values = [
  {
    title: "Trust",
    description: "Advice should feel credible, calm, and commercially grounded.",
  },
  {
    title: "Presentation",
    description: "Listings and communication should look as premium as the opportunity itself.",
  },
  {
    title: "Responsiveness",
    description: "Strong opportunities can be lost through slow follow-up. We keep pace visible.",
  },
  {
    title: "Clarity",
    description: "Clients need simpler guidance, not more noise around the decision.",
  },
] as const;

export const contactHighlights = [
  {
    title: "Buying, Selling, Or Investing",
    description: "Share what kind of property support you need and we will guide the next step.",
  },
  {
    title: "Viewing And Listing Support",
    description: "We can help with active listings, property discovery, and structured follow-up.",
  },
  {
    title: "Premium Property Experience",
    description: "Sav Zaman is designed to feel sharper, darker, and more premium than a standard agency template.",
  },
] as const;

export const faqItems = [
  {
    question: "What kind of properties does Sav Zaman focus on?",
    answer:
      "Sav Zaman is positioned around residential homes, commercial opportunities, and investment-led listings across stronger property categories.",
  },
  {
    question: "Can clients request brochures and callback support directly from a listing?",
    answer:
      "Yes. Each property page is designed to move from presentation into enquiry quickly, including brochure requests, callbacks, and direct contact handoff.",
  },
  {
    question: "Does the site support listing management for the admin team?",
    answer:
      "Yes. The admin panel manages property data, listing presentation, gallery media, and enquiry visibility so the public site stays current and easy to maintain.",
  },
  {
    question: "Is the service only for buying property?",
    answer:
      "No. The structure also supports seller representation, commercial search, investor guidance, and end-to-end coordination around viewings and follow-up.",
  },
  {
    question: "What makes Sav Zaman different from a typical property template?",
    answer:
      "The focus is on a darker premium presentation, cleaner visual hierarchy, clearer property information, and a more controlled client journey from discovery to enquiry.",
  },
] as const;
