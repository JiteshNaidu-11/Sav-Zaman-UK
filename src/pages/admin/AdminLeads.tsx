import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Search } from "lucide-react";
import type { LeadIntent } from "@/utils/leadStorage";
import { siteContent } from "@/content/site";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { getInquiryLeads, type PropertyInquiryRow } from "@/services/leadService";

function normalizeWhatsAppNumber(value: string): string {
  return value.replace(/\(0\)/g, "").replace(/\D/g, "");
}

function buildWhatsAppHref(number: string, message: string): string {
  const normalized = normalizeWhatsAppNumber(number);
  const text = encodeURIComponent(message);
  return `https://wa.me/${normalized}?text=${text}`;
}

const intentOptions: LeadIntent[] = ["Buy", "Rent", "Invest"];

function parseLeadPayload(message: string): {
  intent?: string;
  propertyType?: string;
  location?: string;
  budget?: string;
  timeline?: string;
  contact?: string;
} {
  try {
    const parsed = JSON.parse(message) as Record<string, unknown>;
    return {
      intent: typeof parsed.intent === "string" ? parsed.intent : undefined,
      propertyType: typeof parsed.propertyType === "string" ? parsed.propertyType : undefined,
      location: typeof parsed.location === "string" ? parsed.location : undefined,
      budget: typeof parsed.budget === "string" ? parsed.budget : undefined,
      timeline: typeof parsed.timeline === "string" ? parsed.timeline : undefined,
      contact: typeof parsed.contact === "string" ? parsed.contact : undefined,
    };
  } catch {
    return {};
  }
}

export default function AdminLeads() {
  useDocumentTitle("Sav Zaman — Admin · Leads");

  const [query, setQuery] = useState("");
  const [intent, setIntent] = useState<LeadIntent | "All">("All");
  const [sort, setSort] = useState<"latest" | "oldest">("latest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<PropertyInquiryRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getInquiryLeads().then((res) => {
      if (cancelled) return;
      setLeads(res.data);
      setError(res.error);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items = [...leads];
    if (intent !== "All") {
      items = items.filter((l) => {
        const payload = parseLeadPayload(l.message || "");
        return (payload.intent || "").toLowerCase() === intent.toLowerCase();
      });
    }
    if (q) {
      items = items.filter((l) => {
        const payload = parseLeadPayload(l.message || "");
        const blob =
          `${l.name} ${l.phone ?? ""} ${l.email ?? ""} ${payload.intent ?? ""} ${payload.propertyType ?? ""} ${payload.location ?? ""} ${payload.budget ?? ""} ${payload.timeline ?? ""} ${l.message}`.toLowerCase();
        return blob.includes(q);
      });
    }
    items.sort((a, b) =>
      sort === "latest"
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
    return items;
  }, [leads, query, intent, sort]);

  return (
    <main className="section-padding bg-[#F8FAFC]">
      <div className="container-custom">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[hsl(var(--accent))]">Admin</p>
            <h1 className="mt-3 font-heading text-4xl font-bold tracking-[-0.03em] text-foreground">Lead Tracker</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
              Leads captured from the chatbot (stored locally in this browser).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-white px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Back to listings
            </Link>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-border/70 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <label className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, location, budget..."
                className="h-11 w-full rounded-xl border border-border/70 bg-background pl-9 pr-3 text-sm outline-none transition focus:border-[hsl(var(--accent)/0.5)] focus:ring-2 focus:ring-[hsl(var(--accent)/0.15)]"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <select
                value={intent}
                onChange={(e) => setIntent(e.target.value as LeadIntent | "All")}
                className="h-11 rounded-xl border border-border/70 bg-background px-3 text-sm font-semibold text-foreground outline-none"
                aria-label="Filter by intent"
              >
                <option value="All">All intents</option>
                {intentOptions.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as "latest" | "oldest")}
                className="h-11 rounded-xl border border-border/70 bg-background px-3 text-sm font-semibold text-foreground outline-none"
                aria-label="Sort"
              >
                <option value="latest">Latest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border/70 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Intent</th>
                  <th className="px-4 py-3">Property Type</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Timeline</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-muted-foreground" colSpan={9}>
                      Loading leads…
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-muted-foreground" colSpan={9}>
                      {error}
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-muted-foreground" colSpan={9}>
                      No leads found yet.
                    </td>
                  </tr>
                ) : (
                  filtered.map((l) => {
                    const payload = parseLeadPayload(l.message || "");
                    const href = buildWhatsAppHref(
                      siteContent.whatsappNumber ?? "",
                      `Hi ${l.name || "there"}, regarding your property requirement: ${payload.propertyType || "property"} in ${payload.location || "your preferred area"} with budget ${payload.budget || "TBC"}.`,
                    );
                    return (
                      <tr key={l.id} className="border-t border-border/70">
                        <td className="px-4 py-3 font-semibold text-foreground">{l.name || "-"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{l.phone || payload.contact || l.email || "-"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{payload.intent || "-"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{payload.propertyType || "-"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{payload.location || "-"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{payload.budget || "-"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{payload.timeline || "-"}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {l.created_at ? new Date(l.created_at).toLocaleDateString("en-GB") : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-3 py-2 text-xs font-semibold text-white transition hover:brightness-110"
                          >
                            Contact on WhatsApp
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

