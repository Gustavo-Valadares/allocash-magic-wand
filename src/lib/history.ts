export interface HistoryRecord {
  id: string;
  createdAt: number;
  filter: string;
  capital: number;
  reserves: { name: string; percentage: number }[];
  deletedAt?: number;
}

export const HISTORY_KEY = "budget.history";

export function loadHistory(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistory(list: HistoryRecord[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}

export function addRecord(rec: Omit<HistoryRecord, "id" | "createdAt">) {
  const list = loadHistory();
  const full: HistoryRecord = { ...rec, id: crypto.randomUUID(), createdAt: Date.now() };
  saveHistory([full, ...list]);
  return full;
}

/** Signature of the current inputs; used to know if they changed since last save. */
export function recordSignature(capital: number, reserves: { name: string; percentage: number }[]) {
  return JSON.stringify([capital, reserves.map((r) => [r.name, r.percentage])]);
}
