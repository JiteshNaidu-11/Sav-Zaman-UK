import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Check, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { siteContent } from "@/content/site";
import { matchProperties } from "@/utils/matchProperties";
import type { Lead } from "@/utils/leadStorage";
import { NormalizedPropertyCard } from "@/components/chatbot/NormalizedPropertyCard";
import { createInquiryLead } from "@/services/leadService";

type Intent = "Buy" | "Rent" | "Invest" | "Sell";
type PropertyType = "Apartment" | "House" | "Commercial" | "Land";
type LocationChoice = "London" | "Manchester" | "Birmingham" | "Other";
type BudgetChoice = "£200k–£400k" | "£400k–£800k" | "£800k+" | "Not sure";

type FinderData = {
  intent: Intent | null;
  propertyType: PropertyType | null;
  location: LocationChoice | null;
  budget: BudgetChoice | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

function normalizeWhatsAppNumber(value: string): string {
  return value.replace(/\(0\)/g, "").replace(/\D/g, "");
}

function buildWhatsAppHref(number: string, message: string): string {
  const normalized = normalizeWhatsAppNumber(number);
  const text = encodeURIComponent(message);
  return `https://wa.me/${normalized}?text=${text}`;
}

function toLead(data: FinderData): Lead {
  const id = Date.now();
  return {
    id,
    intent: (data.intent === "Buy" || data.intent === "Rent" || data.intent === "Invest" ? data.intent : "") as Lead["intent"],
    propertyType: data.propertyType ?? "",
    location: data.location && data.location !== "Other" ? data.location : "",
    budget: data.budget && data.budget !== "Not sure" ? data.budget : "",
    timeline: "",
    name: "",
    contact: "",
    createdAt: new Date(id).toISOString(),
  };
}

function ChipButton(props: {
  label: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={[
        "group inline-flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition",
        props.selected
          ? "border-white/20 bg-white/10 text-white shadow-[0_18px_44px_-30px_rgba(2,6,23,0.85)]"
          : "border-white/10 bg-white/5 text-white/90 hover:bg-white/10",
        "focus:outline-none focus:ring-2 focus:ring-white/20",
      ].join(" ")}
      aria-pressed={Boolean(props.selected)}
    >
      <span className="truncate">{props.label}</span>
      <span
        className={[
          "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border transition",
          props.selected ? "border-white/20 bg-white/10" : "border-white/10 bg-white/5 group-hover:bg-white/10",
        ].join(" ")}
      >
        {props.selected ? <Check className="h-4 w-4 text-teal-200" /> : <ArrowUpRight className="h-4 w-4 text-white/80" />}
      </span>
    </button>
  );
}

export function GuidedFinder({ open, onClose }: Props) {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [data, setData] = useState<FinderData>({
    intent: null,
    propertyType: null,
    location: null,
    budget: null,
  });
  const [resultLoading, setResultLoading] = useState(false);
  const [resultError, setResultError] = useState<string | null>(null);
  const [resultMatches, setResultMatches] = useState<any[]>([]);

  const lead = useMemo(() => toLead(data), [data]);
  useEffect(() => {
    if (step !== 5) return;
    if (data.intent === "Sell") return;

    let cancelled = false;
    setResultLoading(true);
    setResultError(null);

    (async () => {
      const transactionType =
        data.intent === "Rent" ? "Rent" : data.intent === "Buy" || data.intent === "Invest" ? "Sale" : null;

      const budgetKey = (data.budget ?? "").toLowerCase();
      const minPriceRaw =
        budgetKey.includes("200") && budgetKey.includes("400")
          ? 200_000
          : budgetKey.includes("400") && budgetKey.includes("800")
            ? 400_000
            : budgetKey.includes("800") && budgetKey.includes("+")
              ? 800_000
              : null;
      const maxPriceRaw =
        budgetKey.includes("200") && budgetKey.includes("400")
          ? 400_000
          : budgetKey.includes("400") && budgetKey.includes("800")
            ? 800_000
            : null;

      // 1) Match properties (Home Ambit: fetch approved properties, apply filters)
      const { data: matched, error: matchError } = await matchProperties(
        {
          transactionType,
          city: data.location && data.location !== "Other" ? data.location : null,
          type: data.propertyType,
          minPriceRaw,
          maxPriceRaw,
        },
        6,
      );

      if (cancelled) return;

      if (matchError) {
        setResultError(matchError);
        setResultMatches([]);
        setResultLoading(false);
        // Insert should never block UI
        void createInquiryLead({
          intent: data.intent,
          propertyType: data.propertyType,
          location: data.location,
          budget: data.budget,
          timeline: null,
        });
        return;
      }

      setResultMatches(matched);
      setResultLoading(false);

      // 2) Create inquiry lead (non-blocking)
      void createInquiryLead({
        intent: data.intent,
        propertyType: data.propertyType,
        location: data.location,
        budget: data.budget,
        timeline: null,
      });
    })().catch((e) => {
      if (import.meta.env.DEV) console.error(e);
      if (cancelled) return;
      setResultError("Could not load matches right now.");
      setResultMatches([]);
      setResultLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [step, data.intent, data.propertyType, data.location, data.budget]);

  const progressLabel = useMemo(() => {
    const map: Record<number, string> = { 1: "Step 1 / 4", 2: "Step 2 / 4", 3: "Step 3 / 4", 4: "Step 4 / 4", 5: "Results" };
    return map[step] ?? "Guided Finder";
  }, [step]);

  const whatsappHref = useMemo(() => {
    const msg = `Hi, I'm looking for ${data.propertyType ?? "a property"} in ${data.location ?? "your preferred area"} with budget ${data.budget ?? "Not sure"}.`;
    return buildWhatsAppHref(siteContent.whatsappNumber ?? "", msg);
  }, [data]);

  const viewAllHref = useMemo(() => {
    const type = encodeURIComponent(data.propertyType ?? "");
    const location = encodeURIComponent(data.location && data.location !== "Other" ? data.location : "");
    const budget = encodeURIComponent(data.budget ?? "");
    return `/properties?type=${type}&location=${location}&budget=${budget}`;
  }, [data]);

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const pickIntent = (intent: Intent) => {
    setData((d) => ({ ...d, intent }));
    setStep(2);
  };
  const pickType = (propertyType: PropertyType) => {
    setData((d) => ({ ...d, propertyType }));
    setStep(3);
  };
  const pickLocation = (location: LocationChoice) => {
    setData((d) => ({ ...d, location }));
    setStep(4);
  };
  const pickBudget = (budget: BudgetChoice) => {
    setData((d) => ({ ...d, budget }));
    setStep(5);
  };

  const modalBottomClass =
    "fixed bottom-[188px] left-5 right-5 z-[9999] w-auto sm:bottom-[212px] sm:left-auto sm:right-5 sm:w-[380px]";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="guided-finder"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className={modalBottomClass}
          role="dialog"
          aria-modal="false"
          aria-label="Guided Property Finder"
        >
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[rgba(8,18,48,0.92)] shadow-[0_32px_80px_-42px_rgba(2,6,23,0.9)] backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">Guided Property Finder</p>
                <p className="truncate text-xs text-white/65">Fast matching — no typing required</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/85 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/25"
                aria-label="Close finder"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85">
                  <Search className="h-4 w-4 text-white/70" />
                  {progressLabel}
                </div>
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                    aria-label="Back"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                ) : null}
              </div>

              <div className="mt-4">
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-4"
                    >
                      <div>
                        <p className="text-lg font-semibold text-white">What are you looking for?</p>
                        <p className="mt-1 text-sm text-white/65">Choose one to continue.</p>
                      </div>
                      <div className="grid gap-2">
                        {(["Buy", "Rent", "Invest", "Sell"] as const).map((v) => (
                          <ChipButton key={v} label={v} selected={data.intent === v} onClick={() => pickIntent(v)} />
                        ))}
                      </div>
                    </motion.div>
                  ) : null}

                  {step === 2 ? (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-4"
                    >
                      <div>
                        <p className="text-lg font-semibold text-white">What type of property?</p>
                        <p className="mt-1 text-sm text-white/65">Pick what fits best.</p>
                      </div>
                      <div className="grid gap-2">
                        {(["Apartment", "House", "Commercial", "Land"] as const).map((v) => (
                          <ChipButton key={v} label={v} selected={data.propertyType === v} onClick={() => pickType(v)} />
                        ))}
                      </div>
                    </motion.div>
                  ) : null}

                  {step === 3 ? (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-4"
                    >
                      <div>
                        <p className="text-lg font-semibold text-white">Select location</p>
                        <p className="mt-1 text-sm text-white/65">Choose a major area (or Other).</p>
                      </div>
                      <div className="grid gap-2">
                        {(["London", "Manchester", "Birmingham", "Other"] as const).map((v) => (
                          <ChipButton key={v} label={v} selected={data.location === v} onClick={() => pickLocation(v)} />
                        ))}
                      </div>
                    </motion.div>
                  ) : null}

                  {step === 4 ? (
                    <motion.div
                      key="step-4"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-4"
                    >
                      <div>
                        <p className="text-lg font-semibold text-white">Your budget?</p>
                        <p className="mt-1 text-sm text-white/65">Pick a range — we’ll match instantly.</p>
                      </div>
                      <div className="grid gap-2">
                        {(["£200k–£400k", "£400k–£800k", "£800k+", "Not sure"] as const).map((v) => (
                          <ChipButton key={v} label={v} selected={data.budget === v} onClick={() => pickBudget(v)} />
                        ))}
                      </div>
                    </motion.div>
                  ) : null}

                  {step === 5 ? (
                    <motion.div
                      key="step-5"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-4"
                    >
                      <div>
                        <p className="text-lg font-semibold text-white">Matches</p>
                        <p className="mt-1 text-sm text-white/65">
                          {data.intent === "Sell"
                            ? "For selling, our team will guide you personally."
                            : resultLoading
                              ? "Finding the best matches for you…"
                              : resultMatches.length
                              ? "Top matches based on your selections."
                              : "No direct matches found — we can help you via WhatsApp."}
                        </p>
                      </div>

                      {data.intent !== "Sell" && resultLoading ? (
                        <div className="grid gap-3">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div
                              key={i}
                              className="h-28 animate-pulse rounded-2xl border border-white/10 bg-white/5"
                              aria-hidden
                            />
                          ))}
                        </div>
                      ) : null}

                      {data.intent !== "Sell" && !resultLoading && resultError ? (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                          {resultError}
                        </div>
                      ) : null}

                      {data.intent !== "Sell" && !resultLoading && !resultError && resultMatches.length ? (
                        <div className="grid gap-3">
                          {resultMatches.slice(0, 6).map((p) => (
                            <NormalizedPropertyCard key={p.slug ?? p.id} property={p} />
                          ))}
                        </div>
                      ) : null}

                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => {
                            navigate(viewAllHref);
                            onClose();
                          }}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                          <Search className="h-4 w-4" />
                          View All Properties
                        </button>
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                        >
                          Talk on WhatsApp
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

