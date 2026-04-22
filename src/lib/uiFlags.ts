const STORAGE_KEY = "sav-zaman.ui-flags";

type Flags = {
  show_sell_house_section?: boolean;
};

function readFlags(): Flags {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Flags;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeFlags(next: Flags): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function getShowSellHouseSection(): boolean {
  const flags = readFlags();
  return flags.show_sell_house_section ?? true;
}

export function setShowSellHouseSection(value: boolean): void {
  const flags = readFlags();
  writeFlags({ ...flags, show_sell_house_section: value });
}

