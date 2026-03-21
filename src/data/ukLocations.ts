/** Canonical UK locations for hero search autocomplete, area scope, and dummy catalogue hubs */
export const UK_LOCATIONS = [
  "London",
  "Central London",
  "North London",
  "South London",
  "East London",
  "West London",
  "Canary Wharf, London",
  "Kensington, London",
  "Chelsea, London",
  "Wimbledon, London",
  "Richmond, London",
  "Bromley, London",
  "Manchester",
  "Manchester City Centre",
  "Birmingham",
  "Leeds",
  "Liverpool",
  "Nottingham",
  "Reading",
  "Bristol",
  "Sheffield",
  "Oxford",
  "Cambridge",
  "Nationwide",
] as const;

export type UKLocation = (typeof UK_LOCATIONS)[number];

/** Demo/browse alias — same strings as `UK_LOCATIONS`. */
export const locations = [...UK_LOCATIONS] as readonly string[];

export const AREA_SCOPE_OPTIONS = ["This area only", "Nationwide", ...UK_LOCATIONS.filter((l) => l !== "Nationwide")] as const;
