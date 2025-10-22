import { JobStatus } from "../types/job";

export const statusStyle: Record<JobStatus, string> = {
  active: "border border-green-200 bg-green-50 text-green-700",
  inactive: "border border-red-200 bg-red-50 text-red-700",
  draft: "border border-amber-200 bg-amber-50 text-amber-700",
};

export const fIDR = (n: number | null | undefined) => {
  if (typeof n !== "number" || !Number.isFinite(n)) return "-";
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(n);
};

export const fDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }); // 1 Oct 2025

export function normalizeUrl(u?: string | null) {
  if (!u) return null;
  const s = String(u).trim();
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) return s;

  return `https://${s}`;
}

export const fallback = (v: unknown) => (v ? String(v) : "—");
