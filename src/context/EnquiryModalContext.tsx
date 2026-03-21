import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type EnquiryPrefill = {
  title?: string;
  location?: string;
  price?: string;
  slug?: string | null;
  /** Pre-select enquiry type when opening from CTAs */
  defaultEnquiryType?: string;
};

type EnquiryModalContextValue = {
  open: boolean;
  prefill: EnquiryPrefill | null;
  openEnquiry: (prefill?: EnquiryPrefill | null) => void;
  closeEnquiry: () => void;
};

const EnquiryModalContext = createContext<EnquiryModalContextValue | undefined>(undefined);

export function EnquiryModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState<EnquiryPrefill | null>(null);

  const openEnquiry = useCallback((next?: EnquiryPrefill | null) => {
    setPrefill(next ?? null);
    setOpen(true);
  }, []);

  const closeEnquiry = useCallback(() => {
    setOpen(false);
    setPrefill(null);
  }, []);

  const value = useMemo(
    () => ({ open, prefill, openEnquiry, closeEnquiry }),
    [open, prefill, openEnquiry, closeEnquiry],
  );

  return <EnquiryModalContext.Provider value={value}>{children}</EnquiryModalContext.Provider>;
}

export function useEnquiryModal(): EnquiryModalContextValue {
  const ctx = useContext(EnquiryModalContext);
  if (!ctx) {
    throw new Error("useEnquiryModal must be used within EnquiryModalProvider");
  }
  return ctx;
}
