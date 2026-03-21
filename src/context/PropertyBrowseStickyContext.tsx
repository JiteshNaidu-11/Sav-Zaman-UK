import { createContext, useContext, type ReactNode } from "react";

const PropertyBrowseStickyContext = createContext(false);

export function PropertyBrowseStickyProvider({
  value,
  children,
}: {
  value: boolean;
  children: ReactNode;
}) {
  return <PropertyBrowseStickyContext.Provider value={value}>{children}</PropertyBrowseStickyContext.Provider>;
}

/** True when the fixed property browse header is active (properties section reached). */
export function usePropertyBrowseStickyActive(): boolean {
  return useContext(PropertyBrowseStickyContext);
}
