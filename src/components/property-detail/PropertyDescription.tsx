import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  overview: string;
  extraBody?: string;
};

export function PropertyDescription({ overview, extraBody }: Props) {
  const [open, setOpen] = useState(false);
  const teaserLen = 320;
  const longText = useMemo(() => {
    const extra =
      extraBody?.trim() ||
      "This is a demonstration listing presented in a Rightmove-style layout. Sav Zaman UK can tailor copy, floorplans, and data fields for your live stock. Expect premium photography, structured amenities, and enquiry flows aligned with your advisory process.";
    return `${overview.trim()}\n\n${extra}`;
  }, [overview, extraBody]);

  const needsToggle = longText.length > teaserLen;
  const teaser = needsToggle ? `${longText.slice(0, teaserLen).trim()}…` : longText;

  return (
    <section className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-sm md:p-6">
      <h2 className="font-heading text-lg font-semibold md:text-xl">Description</h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p className="whitespace-pre-line">{open ? longText : teaser}</p>
        {needsToggle ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[hsl(var(--accent))] transition hover:underline"
          >
            {open ? "Show less" : "Read more"}
            <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
          </button>
        ) : null}
      </div>
    </section>
  );
}
