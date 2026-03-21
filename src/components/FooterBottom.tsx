import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { footerSocialLinks, siteContent } from "@/content/site";

const bottomLinkClass =
  "relative text-xs text-white/70 transition-colors hover:text-blue-400 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-blue-400 after:transition-[width] after:duration-200 hover:after:w-full";

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

type SocialProps = { className?: string };

export function SocialLinks({ className }: SocialProps) {
  const iconWrap =
    "flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all duration-200 hover:border-blue-400/50 hover:bg-white/10 hover:text-blue-400 hover:scale-105";

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className ?? ""}`}>
      <a
        href={footerSocialLinks.facebook}
        className={iconWrap}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
      >
        <Facebook className="h-4 w-4" />
      </a>
      <a
        href={footerSocialLinks.instagram}
        className={iconWrap}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
      >
        <Instagram className="h-4 w-4" />
      </a>
      <a
        href={footerSocialLinks.linkedin}
        className={iconWrap}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </a>
      <a
        href={footerSocialLinks.twitter}
        className={iconWrap}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="X (Twitter)"
      >
        <XIcon className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

export function FooterBottom() {
  return (
    <div className="border-t border-white/10 pt-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-xs text-white/70">
          © {new Date().getFullYear()} {siteContent.name}. All rights reserved.
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <Link to="/privacy-policy" className={bottomLinkClass}>
            Privacy Policy
          </Link>
          <span className="text-white/30" aria-hidden>
            |
          </span>
          <Link to="/terms-of-use" className={bottomLinkClass}>
            Terms
          </Link>
          <span className="text-white/30" aria-hidden>
            |
          </span>
          <Link to="/cookies" className={bottomLinkClass}>
            Cookies
          </Link>
        </div>

        <SocialLinks className="lg:justify-end" />
      </div>
    </div>
  );
}
