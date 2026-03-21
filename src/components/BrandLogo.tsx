import { siteContent } from "@/content/site";

type BrandLogoProps = {
  theme?: "light" | "dark";
  size?: "nav" | "mobile" | "footer";
  /** Single-row name + tagline (e.g. footer). Logo uses a compact 40px frame. */
  inlineTagline?: boolean;
};

const sizeMap = {
  nav: {
    iconOuter: "h-12 w-12 md:h-14 md:w-14",
    imageWrap: "p-1 md:p-1.5",
    imageScale: "scale-[1.45] md:scale-[1.6]",
    title: "text-sm md:text-base",
    subtitle: "text-[10px] md:text-[11px]",
  },
  mobile: {
    iconOuter: "h-12 w-12",
    imageWrap: "p-1",
    imageScale: "scale-[1.45]",
    title: "text-sm",
    subtitle: "text-[10px]",
  },
  footer: {
    iconOuter: "h-14 w-14 md:h-16 md:w-16",
    imageWrap: "p-1.5 md:p-2",
    imageScale: "scale-[1.35] md:scale-[1.5]",
    title: "text-base md:text-lg",
    subtitle: "text-[11px] md:text-xs",
  },
} as const;

const BrandLogo = ({ theme = "light", size = "nav", inlineTagline = false }: BrandLogoProps) => {
  const s = sizeMap[size];
  const isDark = theme === "dark";

  if (inlineTagline && isDark) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-white/10 shadow-[0_12px_32px_-18px_rgba(15,23,42,0.65)]">
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.35),transparent_58%),linear-gradient(160deg,rgba(255,255,255,0.12),transparent_60%)]" />
          <div className="relative flex h-full w-full items-center justify-center p-1">
            <img
              src="/logo.image.transparent.png"
              alt={`${siteContent.name} logo`}
              className="h-full w-full scale-125 object-contain"
            />
          </div>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-heading font-semibold uppercase tracking-wide text-white">{siteContent.name}</span>
          <span className="text-sm text-gray-400">— Premium presence, clear delivery</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className={`relative overflow-hidden rounded-2xl border shadow-[0_18px_45px_-22px_rgba(15,23,42,0.55)] ${s.iconOuter} ${
          isDark
            ? "border-white/15 bg-white/10"
            : "border-[hsl(var(--accent)/0.18)] bg-[hsl(var(--primary))]"
        }`}
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.4),transparent_58%),linear-gradient(160deg,rgba(255,255,255,0.16),transparent_60%)]" />
        <div className={`relative flex h-full w-full items-center justify-center ${s.imageWrap}`}>
          <img
            src="/logo.image.transparent.png"
            alt={`${siteContent.name} logo`}
            className={`h-full w-full object-contain ${s.imageScale}`}
          />
        </div>
      </div>
      <div className="min-w-0">
        <p
          className={`font-heading font-semibold tracking-[0.18em] uppercase ${s.title} ${
            isDark ? "text-white" : "text-foreground"
          }`}
        >
          {siteContent.name}
        </p>
        <p className={`${s.subtitle} ${isDark ? "text-white/65" : "text-muted-foreground"}`}>
          Premium presence, clear delivery
        </p>
      </div>
    </div>
  );
};

export default BrandLogo;
