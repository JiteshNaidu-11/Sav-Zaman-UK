import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ParsedSearchURL } from "@/lib/searchURLState";

const BEDS = ["any", "0", "1", "2", "3", "4", "5+"] as const;

type Props = {
  draft: ParsedSearchURL;
  setDraft: React.Dispatch<React.SetStateAction<ParsedSearchURL>>;
};

export function SearchFilterModal({ draft, setDraft }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="mb-0.5 flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50"
        >
          <SlidersHorizontal className="h-4 w-4" />
          More filters
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md border-slate-200 bg-white sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Additional filters</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Bedrooms</span>
            <select
              value={draft.beds}
              onChange={(e) => setDraft((d) => ({ ...d, beds: e.target.value }))}
              className="rounded-xl border border-slate-200 bg-[#0B1A2F] px-3 py-2.5 text-sm text-white"
            >
              {BEDS.map((b) => (
                <option key={b} value={b} className="bg-[#0B1A2F]">
                  {b === "any" ? "Any" : b === "5+" ? "5+" : `${b} bed`}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Listing</span>
            <select
              value={draft.listing}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  listing: e.target.value as ParsedSearchURL["listing"],
                }))
              }
              className="rounded-xl border border-slate-200 bg-[#0B1A2F] px-3 py-2.5 text-sm text-white"
            >
              <option value="buy" className="bg-[#0B1A2F]">
                Buy
              </option>
              <option value="rent" className="bg-[#0B1A2F]">
                Rent
              </option>
              <option value="sold" className="bg-[#0B1A2F]">
                Sold
              </option>
            </select>
          </label>
        </div>
        <DialogClose asChild>
          <Button
            type="button"
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 font-semibold text-white hover:brightness-110"
          >
            Done
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
