import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { type Session } from "@supabase/supabase-js";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Inbox,
  LogOut,
  Mail,
  MessageSquareText,
  Phone,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import AnimatedSection from "@/components/AnimatedSection";
import {
  formatInquiryTimestamp,
  formatPreferredCallSlot,
  inquiryTypeLabel,
  type InquiryType,
  type LeadInquiryRecord,
} from "@/lib/inquiries";
import { supabase, supabaseConfigured } from "@/lib/supabase";

const inquiryFilters: Array<{ label: string; value: InquiryType | "all" }> = [
  { label: "All", value: "all" },
  { label: "Contact", value: "contact_message" },
  { label: "Call Requests", value: "property_call_request" },
];

const AdminInquiries = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquiries, setInquiries] = useState<LeadInquiryRecord[]>([]);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<InquiryType | "all">("all");

  useEffect(() => {
    if (!supabaseConfigured || !supabase) {
      setAuthLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = Boolean(session);

  useEffect(() => {
    if (!isAuthenticated) {
      setInquiries([]);
      setInquiriesLoading(false);
      return;
    }

    if (!supabaseConfigured || !supabase) return;

    let active = true;

    const loadInquiries = async () => {
      setInquiriesLoading(true);

      try {
        const { data, error } = await supabase
          .from("lead_inquiries")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) throw error;

        if (active) {
          setInquiries((data ?? []) as LeadInquiryRecord[]);
        }
      } catch (error) {
        if (import.meta.env.DEV) console.error("Failed to load lead inquiries:", error);
        if (active) {
          setInquiries([]);
        }
      } finally {
        if (active) {
          setInquiriesLoading(false);
        }
      }
    };

    void loadInquiries();

    const channel = supabase
      .channel("public:lead_inquiries")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lead_inquiries" },
        () => {
          void loadInquiries();
        },
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, [isAuthenticated, session]);

  const handleSignOut = async () => {
    if (!supabaseConfigured || !supabase) {
      toast.error("Supabase is not configured.");
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      if (import.meta.env.DEV) console.error(error);
      toast.error("Could not sign out.");
      return;
    }

    toast.success("Signed out from admin.");
  };

  if (authLoading) {
    return (
      <main>
        <section className="container-custom py-20">
          <p className="text-lg text-muted-foreground">Checking admin session...</p>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const normalizedQuery = query.trim().toLowerCase();
  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesFilter = activeFilter === "all" || inquiry.inquiry_type === activeFilter;
    const matchesQuery =
      !normalizedQuery ||
      inquiry.name.toLowerCase().includes(normalizedQuery) ||
      inquiry.email?.toLowerCase().includes(normalizedQuery) ||
      inquiry.phone?.toLowerCase().includes(normalizedQuery) ||
      inquiry.property_title?.toLowerCase().includes(normalizedQuery) ||
      inquiry.subject?.toLowerCase().includes(normalizedQuery) ||
      inquiry.message.toLowerCase().includes(normalizedQuery);

    return matchesFilter && matchesQuery;
  });

  const contactMessageCount = inquiries.filter((item) => item.inquiry_type === "contact_message").length;
  const callRequestCount = inquiries.filter((item) => item.inquiry_type === "property_call_request").length;
  const todayCount = inquiries.filter((item) => {
    const created = new Date(item.created_at);
    const now = new Date();
    return (
      created.getFullYear() === now.getFullYear() &&
      created.getMonth() === now.getMonth() &&
      created.getDate() === now.getDate()
    );
  }).length;

  return (
    <main>
      <section className="relative overflow-hidden bg-primary section-padding-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--accent)/0.28),transparent_35%)]" />
        <div className="container-custom relative z-10">
          <AnimatedSection className="max-w-5xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/80">
              <Inbox className="h-4 w-4 text-accent" />
              Client Queries
            </span>
            <h1 className="mt-5 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
              Review contact messages and property call requests
            </h1>
	            <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/75 md:text-lg">
	              Every inquiry from the public website lands here. This page is focused only on client communication.
	            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Listings
              </Link>
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-5 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                View Public Listings
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding bg-warm">
        <div className="container-custom">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Inquiries", value: inquiries.length.toString(), icon: Inbox },
              { label: "Contact Messages", value: contactMessageCount.toString(), icon: Mail },
              { label: "Call Requests", value: callRequestCount.toString(), icon: Phone },
              { label: "Today", value: todayCount.toString(), icon: CalendarDays },
            ].map((item) => (
              <AnimatedSection key={item.label}>
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-3 font-heading text-3xl font-bold text-foreground">{item.value}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
                      <item.icon className="h-5 w-5 text-accent" />
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="mt-8">
            <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-2xl">
              <div className="border-b border-border/70 px-6 py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Client Queries</p>
                    <h2 className="mt-2 font-heading text-2xl font-bold text-foreground">Inbox Dashboard</h2>
	                    <p className="mt-2 text-sm text-muted-foreground">
	                      Search and filter every contact form message or property call request from the website.
	                    </p>
                  </div>
                  <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
                    <div className="relative min-w-[280px]">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search by name, email, phone, property..."
                        className="h-11 w-full rounded-xl border border-border/70 bg-background pl-10 pr-4 text-sm outline-none transition-colors focus:border-accent"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {inquiryFilters.map((filter) => (
                        <button
                          key={filter.value}
                          type="button"
                          onClick={() => setActiveFilter(filter.value)}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                            activeFilter === filter.value
                              ? "bg-accent text-accent-foreground"
                              : "bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {inquiriesLoading ? (
                  <div className="rounded-3xl border border-border/70 bg-background/70 px-6 py-12 text-center">
                    <p className="font-heading text-xl font-semibold text-foreground">Loading client inquiries...</p>
	                    <p className="mt-2 text-sm text-muted-foreground">
	                      Pulling fresh contact messages and call requests from Supabase.
	                    </p>
                  </div>
                ) : null}

                {!inquiriesLoading && filteredInquiries.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-border/80 bg-background/70 px-6 py-12 text-center">
                    <p className="font-heading text-xl font-semibold text-foreground">No client inquiries matched.</p>
	                    <p className="mt-2 text-sm text-muted-foreground">
	                      New messages and call requests from the website will appear here.
	                    </p>
                  </div>
                ) : null}

                {!inquiriesLoading && filteredInquiries.length > 0 ? (
                  <div className="space-y-4">
                    {filteredInquiries.map((inquiry) => {
                      const preferredSlot = formatPreferredCallSlot(inquiry.preferred_date, inquiry.preferred_time);

                      return (
                        <div
                          key={inquiry.id}
                          className="rounded-3xl border border-border/70 bg-background/75 p-5 shadow-sm transition-colors hover:border-accent/25"
                        >
                          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                                  {inquiryTypeLabel[inquiry.inquiry_type]}
                                </span>
                                {inquiry.property_title ? (
                                  <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                                    {inquiry.property_title}
                                  </span>
                                ) : null}
                              </div>
                              <h3 className="mt-3 font-heading text-xl font-bold text-foreground">{inquiry.name}</h3>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Received {formatInquiryTimestamp(inquiry.created_at)}
                              </p>
                            </div>

                            {preferredSlot ? (
                              <div className="rounded-2xl border border-border/70 bg-card px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                  Preferred Call Slot
                                </p>
                                <p className="mt-2 text-sm font-medium text-foreground">{preferredSlot}</p>
                              </div>
                            ) : null}
                          </div>

                          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {inquiry.phone ? (
                              <a href={`tel:${inquiry.phone}`} className="inline-flex items-center gap-2 hover:text-accent transition-colors">
                                <Phone className="h-4 w-4 text-accent" />
                                {inquiry.phone}
                              </a>
                            ) : null}
                            {inquiry.email ? (
                              <a href={`mailto:${inquiry.email}`} className="inline-flex items-center gap-2 hover:text-accent transition-colors">
                                <Mail className="h-4 w-4 text-accent" />
                                {inquiry.email}
                              </a>
                            ) : null}
                            {inquiry.subject ? (
                              <span className="inline-flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-accent" />
                                {inquiry.subject}
                              </span>
                            ) : null}
                          </div>

                          <div className="mt-4 rounded-2xl bg-muted/45 p-4">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                              <MessageSquareText className="h-4 w-4 text-accent" />
                              Message
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{inquiry.message}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
};

export default AdminInquiries;
