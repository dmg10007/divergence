export interface LocalRunEntry {
  runId: string;
  scenarioId: string;
  createdAt: string;
}

const STORAGE_KEY = "divergence:runHistory";
const LEGACY_STORAGE_KEY = "yourStory:runHistory";

export function getRunHistory(): LocalRunEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRunToHistory(entry: LocalRunEntry) {
  if (typeof window === "undefined") return;
  try {
    const history = getRunHistory();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...history].slice(0, 50)));
  } catch {
    // Gracefully ignore storage restrictions (e.g. private mode or quota limit)
  }
}

export function removeRunFromHistory(runId: string) {
  if (typeof window === "undefined") return;
  const history = getRunHistory().filter((entry) => entry.runId !== runId);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}
