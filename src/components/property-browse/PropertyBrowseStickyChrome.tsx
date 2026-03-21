import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { PropertyBrowseStickyProvider } from "@/context/PropertyBrowseStickyContext";
import { StickyPropertyBrowseDock } from "./StickyPropertyBrowseDock";

const SECTION_THRESHOLD = 80;

function useBrowseDockActive(): boolean {
  const location = useLocation();
  const [active, setActive] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    const enabled = path === "/properties";

    if (!enabled) {
      setActive(false);
      return;
    }

    const update = () => {
      const section = document.getElementById("properties");
      if (!section) {
        setActive(false);
        return;
      }
      setActive(section.getBoundingClientRect().top <= SECTION_THRESHOLD);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [location.pathname]);

  return active;
}

type Props = {
  navbar: ReactNode;
  children: ReactNode;
};

/**
 * Scroll-synced shell: on `/properties`, when `#properties` crosses the threshold the main navbar
 * slides away and the fixed property dock slides in (Rightmove-style).
 */
export function PropertyBrowseStickyChrome({ navbar, children }: Props) {
  const dockActive = useBrowseDockActive();

  return (
    <PropertyBrowseStickyProvider value={dockActive}>
      <div
        className={`fixed left-0 right-0 top-0 z-40 transition-all duration-300 ease-out ${
          dockActive ? "pointer-events-none -translate-y-full" : "translate-y-0"
        }`}
      >
        {navbar}
      </div>

      <div
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ease-out ${
          dockActive ? "translate-y-0" : "pointer-events-none -translate-y-full"
        }`}
      >
        <StickyPropertyBrowseDock />
      </div>

      {children}
    </PropertyBrowseStickyProvider>
  );
}
