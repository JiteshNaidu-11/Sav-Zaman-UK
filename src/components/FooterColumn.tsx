import { useEffect, useRef, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useEnquiryModal } from "@/context/EnquiryModalContext";

export type FooterLinkItem = {
  label: string;
  to: string;
  external?: boolean;
  /** Opens the enquiry modal instead of navigating (still use `to` for key/fallback). */
  enquiry?: boolean;
  enquiryDefaultType?: string;
};

const linkClass =
  "relative inline-block w-fit text-sm text-white/80 transition-colors duration-200 hover:text-blue-400 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-blue-400 after:transition-[width] after:duration-200 hover:after:w-full";

function LinkList({ links }: { links: FooterLinkItem[] }) {
  const { openEnquiry } = useEnquiryModal();

  return (
    <ul className="space-y-2">
      {links.map((item) => (
        <li key={item.label}>
          {item.enquiry ? (
            <button
              type="button"
              onClick={() =>
                openEnquiry(item.enquiryDefaultType ? { defaultEnquiryType: item.enquiryDefaultType } : null)
              }
              className={`${linkClass} cursor-pointer border-0 bg-transparent p-0 text-left font-inherit`}
            >
              {item.label}
            </button>
          ) : item.external ? (
            <a href={item.to} className={linkClass} target="_blank" rel="noopener noreferrer">
              {item.label}
            </a>
          ) : (
            <Link to={item.to} className={linkClass}>
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

type Props = {
  title: string;
  links?: FooterLinkItem[];
  children?: ReactNode;
};

export function FooterColumn({ title, links, children }: Props) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => {
      const el = detailsRef.current;
      if (el) el.open = mq.matches;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div>
      <details
        ref={detailsRef}
        className="group border-b border-white/10 pb-4 lg:border-0 lg:pb-0 [&_summary::-webkit-details-marker]:hidden"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 py-1 text-sm font-semibold text-white lg:pointer-events-none lg:hidden">
          <span>{title}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-white/50 transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <div className="mt-3 lg:mt-0">
          <p className="mb-3 hidden text-sm font-semibold text-white lg:mb-4 lg:block">{title}</p>
          {links && links.length > 0 ? <LinkList links={links} /> : children}
        </div>
      </details>
    </div>
  );
}
