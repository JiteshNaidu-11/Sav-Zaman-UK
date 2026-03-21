import { useState } from "react";
import { BookmarkPlus } from "lucide-react";
import { saveCurrentSearch } from "@/lib/searchSavedStorage";
import { toast } from "sonner";

type Props = { queryString: string };

export function SaveSearchButton({ queryString }: Props) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        saveCurrentSearch(queryString);
        setSaved(true);
        toast.success("Search saved to your device");
      }}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50"
    >
      <BookmarkPlus className={`h-4 w-4 ${saved ? "text-teal-600" : ""}`} />
      Save search
    </button>
  );
}
