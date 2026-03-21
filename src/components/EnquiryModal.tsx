import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { EnquiryFormBody } from "@/components/EnquiryFormBody";
import { useEnquiryModal } from "@/context/EnquiryModalContext";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function EnquiryModal() {
  const { open, prefill, closeEnquiry, openEnquiry } = useEnquiryModal();
  const [submitted, setSubmitted] = useState(false);
  const [formInstance, setFormInstance] = useState(0);

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setFormInstance((n) => n + 1);
    }
  }, [open, prefill?.slug, prefill?.title]);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && closeEnquiry()}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-[70] w-[calc(100%-2rem)] max-w-lg max-h-[min(90vh,720px)] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-2xl border border-gray-100 bg-white p-8 shadow-2xl duration-200",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          )}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogPrimitive.Title className="sr-only">Property enquiry</DialogPrimitive.Title>
          <DialogPrimitive.Close
            className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </DialogPrimitive.Close>

          {submitted ? (
            <div className="pr-8 text-center">
              <h2 className="font-heading text-2xl font-semibold text-slate-900">Thank you — your enquiry has been received.</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Our team will contact you within 24 hours.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  to="/properties"
                  onClick={() => closeEnquiry()}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:bg-gray-50"
                >
                  Back to Properties
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    openEnquiry({ defaultEnquiryType: "Book Consultation" });
                    setSubmitted(false);
                  }}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 px-5 text-sm font-semibold text-white shadow-md transition hover:brightness-105"
                >
                  Book Consultation
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="pr-8 font-heading text-2xl font-semibold text-slate-900">Send an enquiry</h2>
              <p className="mt-2 pr-8 text-sm text-gray-600">
                Share your brief — we&apos;ll respond with a clear next step.
              </p>
              <div className="mt-6">
                <EnquiryFormBody
                  key={formInstance}
                  prefill={prefill}
                  submitLabel="Submit enquiry"
                  onSuccess={() => setSubmitted(true)}
                />
              </div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
