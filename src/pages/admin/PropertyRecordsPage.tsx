import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { type Session } from "@supabase/supabase-js";
import { ArrowUpRight, HousePlus, LogOut, Mail, RefreshCcw, TableProperties } from "lucide-react";
import { toast } from "sonner";
import AnimatedSection from "@/components/AnimatedSection";
import { PropertyRecordsTable } from "@/components/admin/PropertyRecordsTable";
import type { Property } from "@/data/properties";
import { usePropertyStore } from "@/context/PropertyStoreContext";
import { supabase, supabaseConfigured } from "@/lib/supabase";

/**
 * Standalone admin page: property records table only (no listing form).
 */
export default function PropertyRecordsPage() {
  const navigate = useNavigate();
  const { properties, loading, deleteProperty, refreshProperties, resetProperties } = usePropertyStore();
  const [recordQuery, setRecordQuery] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

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

  const handleResetListings = async () => {
    const confirmed = window.confirm("Reset all property listings back to the default Sav Zaman data?");
    if (!confirmed) return;

    try {
      await resetProperties();
      toast.success("Property listings reset to defaults.");
    } catch (error) {
      if (import.meta.env.DEV) console.error(error);
      toast.error("Could not reset the property listings.");
    }
  };

  const handleEdit = (property: Property) => {
    navigate(`/admin?edit=${encodeURIComponent(property.slug)}`);
  };

  const handleDelete = async (property: Property) => {
    const confirmed = window.confirm(`Delete "${property.title}" from the property listings?`);
    if (!confirmed) return;

    try {
      await deleteProperty(property.slug);
      toast.success("Property removed from listings.");
    } catch (error) {
      if (import.meta.env.DEV) console.error(error);
      toast.error("Could not delete that property.");
    }
  };

  if (authLoading) {
    return (
      <main>
        <section className="container-custom py-20">
          <p className="text-muted-foreground text-lg">Checking admin access...</p>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <main>
      <section className="relative overflow-hidden bg-primary section-padding-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--accent)/0.28),transparent_35%)]" />
        <div className="absolute -bottom-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
        <div className="container-custom relative z-10">
          <AnimatedSection className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/80">
              <TableProperties className="h-4 w-4 text-accent" />
              Admin — Property records
            </span>
            <h1 className="mt-5 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
              Property records
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/75 md:text-lg">
              Review, approve, and manage all listings in one table. Use the main dashboard to create or edit full
              listing details.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/admin"
                className="btn-accent inline-flex min-w-[160px] items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm"
              >
                <HousePlus className="h-4 w-4" />
                New Listing
              </Link>
              <button
                type="button"
                onClick={() => handleResetListings()}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-white/10"
              >
                <RefreshCcw className="h-4 w-4" />
                Reset Defaults
              </button>
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-5 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                View Public Listings
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/admin/inquiries"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-white/10"
              >
                <Mail className="h-4 w-4 text-accent" />
                Client Queries
              </Link>
              <span className="inline-flex items-center gap-2 rounded-xl border border-accent/50 bg-white/10 px-5 py-3 text-sm font-medium text-primary-foreground">
                <TableProperties className="h-4 w-4 text-accent" />
                Property Records
              </span>
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
          <AnimatedSection>
            <PropertyRecordsTable
              properties={properties}
              loading={loading}
              query={recordQuery}
              onQueryChange={setRecordQuery}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRefresh={refreshProperties}
            />
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
