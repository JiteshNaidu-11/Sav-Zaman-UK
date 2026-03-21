import type { HeroSector } from "@/lib/propertyHeroSearch";
import { HERO_SECTOR_OPTIONS } from "@/lib/propertyHeroSearch";

type Props = {
  value: HeroSector;
  onChange: (sector: HeroSector) => void;
};

export function PropertyTypeSelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 lg:justify-start" role="list" aria-label="Property sectors">
      {HERO_SECTOR_OPTIONS.map((sector) => {
        const active = value === sector;
        return (
          <button
            key={sector}
            type="button"
            role="listitem"
            onClick={() => onChange(sector)}
            aria-pressed={active}
            className={`rounded-full px-3 py-2 text-left text-[11px] font-semibold leading-snug tracking-wide transition-all duration-200 sm:text-xs ${
              active
                ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg ring-1 ring-white/20"
                : "bg-white/10 text-white hover:bg-white/15"
            }`}
          >
            {sector}
          </button>
        );
      })}
    </div>
  );
}
