import { Bell } from "lucide-react";
import { toast } from "sonner";

export function CreateAlertButton() {
  return (
    <button
      type="button"
      onClick={() =>
        toast.message("Email alert created", {
          description: "We’ll email you when new listings match this search (demo).",
        })
      }
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50"
    >
      <Bell className="h-4 w-4 text-blue-600" />
      Create alert
    </button>
  );
}
