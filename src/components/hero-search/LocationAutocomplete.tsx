import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { UK_LOCATIONS } from "@/data/ukLocations";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onPick: (canonical: string) => void;
  onClearPick: () => void;
  /** `dark` = hero on imagery; `light` = filter bar; `heroGlass` = full glass pill on hero; `heroOverlay` = solid-tint field on floating hero search; `stickyBar` = compact pill in fixed browse header. */
  variant?: "dark" | "light" | "heroGlass" | "heroOverlay" | "stickyBar";
  /** Overrides default location hint copy. */
  placeholder?: string;
};

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Rightmove-style: every case-insensitive match wrapped in <strong> (React, no innerHTML). */
function highlightMatch(text: string, query: string): ReactNode {
  const q = query.trim();
  if (!q) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <strong key={i} className="font-semibold text-blue-600">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function LocationAutocomplete({
  value,
  onChange,
  onPick,
  onClearPick,
  variant = "dark",
  placeholder = "Search by city or area (e.g. London, Manchester)",
}: Props) {
  const listId = useId();
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return [];
    return UK_LOCATIONS.filter((loc) => loc.toLowerCase().includes(q));
  }, [value]);

  const queryActive = value.trim().length > 0;
  const showPanel = open && queryActive;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selectIndex = useCallback(
    (index: number) => {
      const s = suggestions[index];
      if (!s) return;
      onPick(s);
      onChange(s);
      setOpen(false);
      setHighlighted(-1);
    },
    [suggestions, onChange, onPick],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      if (suggestions.length === 0) return;
      setOpen(true);
      setHighlighted(e.key === "ArrowDown" ? 0 : suggestions.length - 1);
      e.preventDefault();
      return;
    }
    if (!showPanel) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length === 0) return;
      setHighlighted((i) => Math.min(i < 0 ? 0 : i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (suggestions.length === 0) return;
      setHighlighted((i) => Math.max((i < 0 ? suggestions.length : i) - 1, 0));
    } else if (e.key === "Enter") {
      if (suggestions.length === 0) return;
      e.preventDefault();
      selectIndex(highlighted >= 0 ? highlighted : 0);
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlighted(-1);
    }
  };

  const isLight = variant === "light";
  const isHeroGlass = variant === "heroGlass";
  const isHeroOverlay = variant === "heroOverlay";
  const isStickyBar = variant === "stickyBar";
  const iconLeft = isHeroGlass || isHeroOverlay ? "left-4" : "left-3";
  const inputPadLeft = "pl-10";

  return (
    <div ref={wrapRef} className="relative z-50 min-w-0 w-full">
      <Search
        className={`pointer-events-none absolute top-1/2 z-[1] -translate-y-1/2 ${iconLeft} ${
          isHeroGlass || isHeroOverlay ? "h-3.5 w-3.5" : "h-4 w-4"
        } ${
          isLight || isStickyBar
            ? "text-slate-400"
            : isHeroGlass || isHeroOverlay
              ? "text-white/75"
              : "text-[#D1C9C0]/80"
        }`}
      />
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        role="combobox"
        aria-expanded={showPanel}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={highlighted >= 0 ? `${listId}-opt-${highlighted}` : undefined}
        value={value}
        onChange={(e) => {
          onClearPick();
          onChange(e.target.value);
          setOpen(true);
          setHighlighted(-1);
        }}
        onFocus={() => setOpen(value.trim().length > 0)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        className={
          isHeroOverlay
            ? `relative z-[1] w-full rounded-full border border-white/25 bg-[#152a45]/95 ${inputPadLeft} pr-4 py-2 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400/45`
            : isHeroGlass
              ? `relative z-[1] w-full rounded-full border border-white/20 bg-white/10 ${inputPadLeft} pr-4 py-2.5 text-sm text-white placeholder:text-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50`
            : isStickyBar
              ? `relative z-[1] w-full rounded-full border-0 bg-white py-2 ${inputPadLeft} pr-3 text-sm text-slate-900 shadow-sm ring-1 ring-slate-200/80 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/35`
              : isLight
                ? `relative z-[1] w-full rounded-xl border border-slate-200 bg-white py-2.5 ${inputPadLeft} pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30`
                : `relative z-[1] w-full rounded-2xl border border-white/20 bg-white/10 py-3 ${inputPadLeft} pr-4 text-sm text-white placeholder:text-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50`
        }
      />

      {showPanel ? (
        <div
          className="absolute left-0 top-full z-[60] mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          id={listId}
          role="listbox"
        >
          <div className="max-h-72 overflow-y-auto py-2">
            {suggestions.length > 0 ? (
              suggestions.map((loc, index) => {
                const active = index === highlighted;
                return (
                  <div
                    key={loc}
                    id={`${listId}-opt-${index}`}
                    role="option"
                    aria-selected={active}
                    className={`cursor-pointer px-5 py-3 text-sm text-gray-800 transition-colors ${
                      active ? "bg-gray-100" : "hover:bg-gray-100"
                    }`}
                    onMouseEnter={() => setHighlighted(index)}
                    onMouseDown={(ev) => {
                      ev.preventDefault();
                      selectIndex(index);
                    }}
                  >
                    {highlightMatch(loc, value)}
                  </div>
                );
              })
            ) : (
              <div className="px-5 py-3 text-sm text-gray-500">No locations found</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
