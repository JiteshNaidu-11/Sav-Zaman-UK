import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { navItems, siteContent } from "@/content/site";
import { cn } from "@/lib/utils";

function isNavActive(path: string, pathname: string): boolean {
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

const navListVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.055, delayChildren: 0.08 },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -14 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export type NavbarMobileMenuProps = {
  pathname: string;
  onBookConsultation: () => void;
};

/** Premium mobile navigation panel (lg breakpoint hidden in parent). */
export const NavbarMobileMenu = forwardRef<HTMLDivElement, NavbarMobileMenuProps>(
  function NavbarMobileMenu({ pathname, onBookConsultation }, ref) {
    return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation"
      initial={{ opacity: 0, y: -20, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
      transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-3 top-[88px] z-[45] overflow-hidden rounded-3xl border border-white/[0.18]",
        "bg-gradient-to-br from-[rgba(32,44,82,0.96)] via-[rgba(20,32,68,0.94)] to-[rgba(24,36,62,0.97)]",
        "p-5 pb-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_36px_96px_-28px_rgba(2,6,23,0.88)] backdrop-blur-2xl sm:inset-x-5 sm:p-6 lg:hidden",
      )}
    >
      {/* Soft light wash — lifts the panel without going bright */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(248,250,252,0.14)_0%,rgba(241,245,249,0.05)_28%,transparent_52%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_0%_-10%,rgba(99,102,241,0.14),transparent_55%),radial-gradient(ellipse_90%_60%_at_100%_110%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(255,255,255,0.06),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-px rounded-[calc(1.5rem-1px)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
        aria-hidden
      />

      <div className="relative">
        <motion.nav
          variants={navListVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-2.5 sm:gap-3.5"
        >
          {navItems.map((item) => {
            const active = isNavActive(item.path, pathname);
            return (
              <motion.div key={item.path} variants={navItemVariants}>
                <Link
                  to={item.path}
                  className={cn(
                    "group relative flex items-center gap-3 overflow-hidden rounded-2xl px-5 py-[1.125rem] text-[1.0625rem] font-medium leading-none tracking-tight outline-none transition-[background,box-shadow,color,transform] duration-300 focus-visible:ring-2 focus-visible:ring-sky-200/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(18,28,58,0.98)] active:scale-[0.99]",
                    active
                      ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white shadow-[0_16px_44px_-20px_rgba(59,130,246,0.55),inset_0_1px_0_rgba(255,255,255,0.2)]"
                      : "bg-white/[0.06] text-slate-100 hover:bg-white/[0.12] hover:text-white",
                  )}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-3">
                    {active ? (
                      <span
                        className="h-9 w-[3px] shrink-0 rounded-full bg-white/95 shadow-[0_0_14px_rgba(255,255,255,0.4)]"
                        aria-hidden
                      />
                    ) : null}
                    <span className="min-w-0 flex-1">{item.label}</span>
                  </span>
                  <ChevronRight
                    className={cn(
                      "h-5 w-5 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1",
                      active ? "text-white/85" : "text-slate-300/80 group-hover:text-slate-100",
                    )}
                    aria-hidden
                  />
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>

        <div
          className="my-6 h-px w-full bg-gradient-to-r from-transparent via-white/25 to-transparent sm:my-7"
          aria-hidden
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-white/[0.22] bg-gradient-to-b from-white/[0.12] to-white/[0.05] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_12px_40px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-6"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-300/90">Contact</p>
          <a
            href={`mailto:${siteContent.email}`}
            className="mt-4 block text-[15px] font-semibold text-slate-50 transition-colors hover:text-white"
          >
            {siteContent.email}
          </a>
          <button
            type="button"
            onClick={onBookConsultation}
            className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-700 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_48px_-16px_rgba(59,130,246,0.55),0_0_40px_-10px_rgba(99,102,241,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_56px_-14px_rgba(79,70,229,0.5)] active:scale-[0.98]"
          >
            Book Consultation
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
          <Link
            to="/admin"
            className="group relative mt-3 inline-flex w-full items-center justify-center overflow-hidden rounded-2xl border border-white/[0.28] bg-white/[0.08] px-5 py-3.5 text-sm font-medium text-slate-100 transition-[border-color,color,background-color] duration-300 hover:border-white/40 hover:bg-white/[0.14] hover:text-white"
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-white/[0.14] transition-transform duration-300 ease-out group-hover:scale-x-100" />
            <span className="relative z-10">Admin</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
    );
  },
);
