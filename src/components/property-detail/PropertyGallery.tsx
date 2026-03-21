import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  images: string[];
};

export function PropertyGallery({ title, images }: Props) {
  const list = images.length ? images : [];
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const go = useCallback(
    (dir: -1 | 1) => {
      setActive((i) => ((i + dir + list.length) % list.length));
    },
    [list.length],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  if (!list.length) {
    return <div className="rounded-2xl border border-border bg-muted/40 p-12 text-center text-sm text-muted-foreground">No images</div>;
  }

  const main = list[active]!;
  const thumbs = list.slice(0, Math.min(4, list.length));

  return (
    <>
      <div className="grid gap-3 lg:grid-cols-[1fr_120px] lg:gap-4">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen(true);
            }
          }}
          className="group relative aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-2xl bg-muted shadow-md ring-1 ring-black/5"
        >
          <img src={main} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
          <span className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            {active + 1} / {list.length}
          </span>
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0B1A2F] shadow-sm backdrop-blur">
            Open gallery
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0B1A2F] shadow-md backdrop-blur transition hover:bg-white"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0B1A2F] shadow-md backdrop-blur transition hover:bg-white"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 lg:grid-cols-1 lg:grid-rows-4 lg:gap-3">
          {thumbs.slice(0, 4).map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => {
                setActive(i);
                setOpen(true);
              }}
              className={cn(
                "aspect-[16/10] overflow-hidden rounded-xl ring-2 transition lg:aspect-square lg:max-h-[88px]",
                active === i ? "ring-[hsl(var(--accent))]" : "ring-transparent hover:ring-border",
              )}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] max-w-5xl border-0 bg-[#0B1A2F] p-0 text-white [&>button]:hidden">
          <DialogTitle className="sr-only">{title} — image gallery</DialogTitle>
          <div className="relative flex max-h-[85vh] flex-col">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <p className="text-sm font-medium text-white/90">{title}</p>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                  {active + 1} / {list.length}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close gallery"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black/40 p-4">
              <img src={list[active]} alt="" className="max-h-[min(72vh,720px)] w-full max-w-full object-contain" />
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-white/25"
                aria-label="Previous"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-white/25"
                aria-label="Next"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto border-t border-white/10 p-3">
              {list.map((src, i) => (
                <button
                  key={`modal-${src}-${i}`}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "h-16 w-24 shrink-0 overflow-hidden rounded-lg ring-2 transition",
                    active === i ? "ring-teal-400" : "ring-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
