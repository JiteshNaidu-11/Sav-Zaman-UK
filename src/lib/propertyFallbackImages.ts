import { toPublicUrl } from "@/lib/toPublicUrl";

const RAW_PUBLIC_IMAGES = [
  "property/WhatsApp Image 2026-03-27 at 2.24.59 PM (1).jpeg",
  "property/WhatsApp Image 2026-03-27 at 2.24.59 PM (2).jpeg",
  "property/WhatsApp Image 2026-03-27 at 2.24.59 PM.jpeg",
  "property/WhatsApp Image 2026-03-27 at 2.25.00 PM (1).jpeg",
  "property/WhatsApp Image 2026-03-27 at 2.25.00 PM.jpeg",
  "property/WhatsApp Image 2026-03-27 at 2.25.01 PM (1).jpeg",
  "property/WhatsApp Image 2026-03-27 at 2.25.01 PM.jpeg",
  "property/WhatsApp Image 2026-03-27 at 2.25.02 PM.jpeg",
] as const;

export const FALLBACK_PROPERTY_IMAGES = RAW_PUBLIC_IMAGES.map((path) => encodeURI(toPublicUrl(path)));

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickFallbackPropertyImage(seed?: string): string {
  const images = FALLBACK_PROPERTY_IMAGES;
  if (!images.length) {
    return encodeURI(toPublicUrl("placeholder.svg"));
  }
  const key = (seed ?? "property").trim() || "property";
  return images[hashString(key) % images.length];
}

