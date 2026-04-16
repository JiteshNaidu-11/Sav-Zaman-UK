import { Link } from "react-router-dom";
import { Eye, EyeOff, PencilLine, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Property } from "@/data/properties";
import { propertyDetailPath } from "@/data/properties";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  properties: Property[];
  loading: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
  onRefresh: () => Promise<void>;
};

function initials(label: string | undefined): string {
  const t = (label ?? "").trim();
  if (!t) return "?";
  return t[0]!.toUpperCase();
}

function formatCreated(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "numeric", day: "numeric" });
  } catch {
    return "—";
  }
}

export function PropertyRecordsTable({
  properties,
  loading,
  query,
  onQueryChange,
  onEdit,
  onDelete,
  onRefresh,
}: Props) {
  const filtered = properties.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.price.toLowerCase().includes(q)
    );
  });

  const patch = async (slug: string, data: Record<string, unknown>) => {
    if (!supabaseConfigured || !supabase) {
      toast.error("Supabase is not configured.");
      return;
    }
    try {
      const { error } = await supabase.from("properties").update(data).eq("slug", slug);
      if (error) throw error;
      await onRefresh();
      toast.success("Updated.");
    } catch (e) {
      if (import.meta.env.DEV) console.error(e);
      toast.error("Could not update. Run `add_property_records_columns.sql` if columns are missing.");
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-border/70 px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">Property Records</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Moderate visibility, workflow status, and home placement — same idea as your reference dashboard.
            </p>
          </div>
          <label className="w-full max-w-xs text-sm">
            <span className="mb-1.5 block font-medium text-foreground">Search</span>
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Filter by title, location, price…"
              className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-accent"
            />
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border/70 bg-muted/30 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <th className="px-4 py-3 font-semibold">Property Title</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Added By</th>
              <th className="px-4 py-3 font-semibold">Created</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Upcoming</th>
              <th className="px-4 py-3 font-semibold">Home Rental</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                  Loading property records…
                </td>
              </tr>
            ) : null}
            {!loading && filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                  No properties match this filter.
                </td>
              </tr>
            ) : null}
            {filtered.map((p) => {
              const raw = p.createdByLabel?.trim();
              const isEmail = Boolean(raw?.includes("@"));
              const displayName = isEmail ? (raw!.split("@")[0] ?? raw) : raw || "Unknown";
              const subLine = isEmail ? raw : "No email";
              const recordStatus = p.recordStatus === "pending" ? "pending" : "approved";
              const hidden = Boolean(p.hiddenFromPublic);
              const upcoming = Boolean(p.isUpcoming);
              const rental = Boolean(p.homeRental);

              return (
                <tr key={p.slug} className="border-b border-border/50 transition-colors hover:bg-muted/20">
                  <td className="px-4 py-3 align-middle">
                    <p className="font-semibold text-foreground">{p.title}</p>
                  </td>
                  <td className="px-4 py-3 align-middle text-muted-foreground">{p.location}</td>
                  <td className="px-4 py-3 align-middle font-medium text-foreground">{p.price}</td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {initials(displayName)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium capitalize text-foreground">{displayName}</p>
                        <p className="truncate text-xs text-muted-foreground">{subLine}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle text-muted-foreground">{formatCreated(p.listedAt)}</td>
                  <td className="px-4 py-3 align-middle">
                    <Select
                      value={recordStatus}
                      onValueChange={(v) => void patch(p.slug, { record_status: v })}
                      disabled={!supabaseConfigured}
                    >
                      <SelectTrigger className="h-9 w-[128px] rounded-lg border-border/70 text-xs font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <button
                      type="button"
                      onClick={() => void patch(p.slug, { is_upcoming: !upcoming })}
                      disabled={!supabaseConfigured}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                        upcoming ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {upcoming ? "Yes" : "No"}
                    </button>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <button
                      type="button"
                      onClick={() => void patch(p.slug, { show_home_rental: !rental })}
                      disabled={!supabaseConfigured}
                      className={`text-xs font-medium ${
                        rental ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {rental ? "Rent" : "Not Rent"}
                    </button>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                      <button
                        type="button"
                        title={hidden ? "Show on public site" : "Hide from public site"}
                        onClick={() => void patch(p.slug, { hidden_from_public: !hidden })}
                        disabled={!supabaseConfigured}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-background text-foreground transition-colors hover:border-accent/40 hover:bg-accent/5"
                      >
                        {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        title={p.featured ? "Remove featured" : "Feature listing"}
                        onClick={() => void patch(p.slug, { featured: !p.featured })}
                        disabled={!supabaseConfigured}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-background text-foreground transition-colors hover:border-accent/40 hover:bg-accent/5"
                      >
                        <Star className={`h-4 w-4 ${p.featured ? "fill-accent text-accent" : ""}`} />
                      </button>
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => onEdit(p)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-background transition-colors hover:border-accent/40"
                      >
                        <PencilLine className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={() => onDelete(p)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-destructive/30 bg-background text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <Link
                        to={propertyDetailPath(p)}
                        className="inline-flex h-9 items-center rounded-lg border border-border/70 px-2 text-xs font-medium text-muted-foreground hover:border-accent/40 hover:text-accent"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
