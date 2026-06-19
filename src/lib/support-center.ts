export const OPEN_SUPPORT_CENTER_EVENT = "ebc:open-support-center";

export function openSupportCenter(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(OPEN_SUPPORT_CENTER_EVENT));
  }
}
