import { motion } from "framer-motion";
import type { HeroListingMode } from "@/lib/propertyHeroSearch";

type Props = {
  value: HeroListingMode;
  onChange: (mode: HeroListingMode) => void;
};

export function BuyRentToggle({ value, onChange }: Props) {
  return (
    <div
      className="relative inline-flex rounded-full border border-white/20 bg-[#0B1A2F]/60 p-1 backdrop-blur-md"
      role="group"
      aria-label="Listing type"
    >
      {(
        [
          { mode: "buy" as const, label: "Buy" },
          { mode: "rent" as const, label: "Rent" },
        ] as const
      ).map(({ mode, label }) => {
        const active = value === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            aria-pressed={active}
            className="relative rounded-full px-6 py-2.5 text-sm font-semibold tracking-wide"
          >
            {active ? (
              <motion.span
                layoutId="hero-buy-rent-indicator"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 shadow-md"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            ) : null}
            <span className={`relative z-10 ${active ? "text-white" : "text-white/75 hover:text-white"}`}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
