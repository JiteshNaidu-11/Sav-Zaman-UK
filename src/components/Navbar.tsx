import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { NavbarMobileMenu } from "@/components/NavbarMobileMenu";
import { useEnquiryModal } from "@/context/EnquiryModalContext";
import { navItems, siteContent } from "@/content/site";

function isNavActive(path: string, pathname: string): boolean {
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

const Navbar = () => {
  const location = useLocation();
  const { openEnquiry } = useEnquiryModal();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.search]);

  return (
    <>
      <header className="relative z-40 px-3 pt-3 md:px-5">
        <div
          className={`mx-auto flex max-w-[1380px] items-center justify-between gap-4 rounded-[28px] border px-4 py-3 transition-all duration-500 md:px-6 ${
            scrolled
              ? "border-[hsl(var(--accent)/0.2)] bg-[rgba(6,18,48,0.94)] shadow-[0_24px_70px_-32px_rgba(15,23,42,0.78)] backdrop-blur-2xl"
              : "border-white/16 bg-[rgba(6,18,48,0.86)] shadow-[0_18px_50px_-30px_rgba(15,23,42,0.66)] backdrop-blur-xl"
          }`}
        >
          <Link to="/" className="shrink-0">
            <BrandLogo theme="dark" size="nav" />
          </Link>

          <nav className="hidden flex-1 items-center justify-center lg:flex">
            <div className="flex items-center gap-1 rounded-full border border-white/12 bg-white/[0.06] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            {navItems.map((item) => {
              const active = isNavActive(item.path, location.pathname);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                    className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                    active
                        ? "bg-[hsl(var(--accent))] text-white shadow-[0_16px_36px_-20px_rgba(37,99,235,0.95)]"
                        : "text-white hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            </div>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={`mailto:${siteContent.email}`}
              className="hidden rounded-full border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white transition-colors hover:border-white/18 hover:text-white 2xl:inline-flex"
            >
              {siteContent.email}
            </a>
            <Link
              to="/admin"
              className="rounded-full border border-white/14 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-white"
            >
              Admin
            </Link>
            <button
              type="button"
              onClick={() => openEnquiry({ defaultEnquiryType: "Book Consultation" })}
              className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm"
            >
              Book Consultation
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-white transition-colors hover:bg-white/10 lg:hidden"
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {isOpen ? (
          <NavbarMobileMenu
            key="navbar-mobile-menu"
            pathname={location.pathname}
            onBookConsultation={() => {
              openEnquiry({ defaultEnquiryType: "Book Consultation" });
              setIsOpen(false);
            }}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
