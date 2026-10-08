const STORAGE_KEY = "kodeva:utm";

const UTM_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type UtmRecord = Partial<Record<(typeof UTM_FIELDS)[number], string>>;

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // private mode / storage full — skip tracking silently
  }
}

export function readStoredUtm(): UtmRecord {
  if (typeof window === "undefined") return {};
  const raw = safeGet(STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as UtmRecord;
    }
  } catch {
    // corrupted data — ignore it
  }
  return {};
}

/**
 * Read UTM params from the current URL; fall back to the first-touch
 * record stored in localStorage. First-touch wins so campaign
 * attribution is not lost when the user navigates between pages.
 */
export function captureUtm(search?: string): UtmRecord {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(search ?? window.location.search);
  const fresh: UtmRecord = {};
  for (const field of UTM_FIELDS) {
    const value = params.get(field);
    if (value) fresh[field] = value.slice(0, 200);
  }
  const stored = readStoredUtm();
  if (Object.keys(fresh).length > 0) {
    if (Object.keys(stored).length === 0) {
      safeSet(STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }
    return stored;
  }
  return stored;
}
