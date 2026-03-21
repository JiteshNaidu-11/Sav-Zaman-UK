const DEMO_ADMIN_SESSION_KEY = "sav-zaman-uk.demo-admin-session";

export const DEMO_ADMIN_EMAIL = "demo@savzamanuk.com";
export const DEMO_ADMIN_PASSWORD = "savzaman123";

export function readDemoAdminSession(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(DEMO_ADMIN_SESSION_KEY) === "true";
}

export function writeDemoAdminSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DEMO_ADMIN_SESSION_KEY, "true");
}

export function clearDemoAdminSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(DEMO_ADMIN_SESSION_KEY);
}
