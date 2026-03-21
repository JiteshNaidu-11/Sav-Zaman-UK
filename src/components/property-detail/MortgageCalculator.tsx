import { useMemo, useState } from "react";
import type { Property } from "@/data/properties";
import { parsePropertyNumericPrice } from "@/lib/propertyBrowseFilter";

function monthlyPayment(principal: number, annualRatePct: number, years: number): number {
  const n = Math.max(1, years) * 12;
  const r = annualRatePct / 100 / 12;
  if (r <= 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

type Props = {
  property: Property;
};

export function MortgageCalculator({ property }: Props) {
  const parsed = parsePropertyNumericPrice(property);
  const [depositPct, setDepositPct] = useState(10);
  const [rate, setRate] = useState(5.25);
  const [term, setTerm] = useState(28);

  const eligible = parsed && !parsed.pcm && property.type === "For Sale" && property.status !== "Sold";

  const { loan, payment } = useMemo(() => {
    if (!eligible || !parsed) return { loan: 0, payment: 0 };
    const price = parsed.value;
    const loanAmount = Math.max(0, price * (1 - depositPct / 100));
    return {
      loan: loanAmount,
      payment: monthlyPayment(loanAmount, rate, term),
    };
  }, [eligible, parsed, depositPct, rate, term]);

  if (!eligible) {
    return (
      <section className="rounded-2xl border border-dashed border-border/80 bg-muted/30 p-5 md:p-6">
        <h2 className="font-heading text-lg font-semibold">Mortgage calculator</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Illustrative mortgage figures are shown for purchase listings only. This property is rented, sold subject to contract, or needs a manual price for calculation.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border/70 bg-[#0B1A2F] p-5 text-white shadow-lg md:p-6">
      <h2 className="font-heading text-lg font-semibold md:text-xl">Mortgage calculator</h2>
      <p className="mt-1 text-sm text-white/65">Indicative only — not financial advice.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-white/70">Property price</span>
          <p className="mt-1 rounded-xl bg-white/10 px-3 py-2 font-semibold">{property.price}</p>
        </label>
        <label className="block text-sm">
          <span className="text-white/70">Deposit ({depositPct}%)</span>
          <input
            type="range"
            min={5}
            max={50}
            step={1}
            value={depositPct}
            onChange={(e) => setDepositPct(Number(e.target.value))}
            className="mt-2 w-full accent-teal-400"
          />
        </label>
        <label className="block text-sm">
          <span className="text-white/70">Interest rate (%)</span>
          <input
            type="number"
            step={0.05}
            min={0.5}
            max={15}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-white"
          />
        </label>
        <label className="block text-sm">
          <span className="text-white/70">Term (years)</span>
          <select
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-white"
          >
            {[20, 25, 28, 30, 35].map((y) => (
              <option key={y} value={y} className="bg-[#0B1A2F]">
                {y} years
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/55">Estimated monthly payment</p>
        <p className="mt-2 font-heading text-3xl font-semibold text-white">
          £{Math.round(payment).toLocaleString("en-GB")}
          <span className="text-lg font-normal text-white/60"> / month</span>
        </p>
        <p className="mt-1 text-xs text-white/50">Loan amount approx. £{Math.round(loan).toLocaleString("en-GB")}</p>
      </div>

      <button
        type="button"
        className="btn-primary mt-5 w-full rounded-full py-3 text-sm font-semibold"
        onClick={() => window.open("/contact", "_self")}
      >
        Get a mortgage in principle
      </button>
    </section>
  );
}
