import type { PricePoint } from "@/types";

// Seeded pseudo-random for deterministic data across server/client
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

// Fixed reference time to avoid server/client mismatch
const REFERENCE_TIME = new Date("2026-04-13T12:00:00Z").getTime();

export function generatePriceHistory(
  baseProb: number,
  points: number = 30,
  daysBack: number = 7,
): PricePoint[] {
  const rand = seededRandom(Math.round(baseProb * 10000));
  const interval = (daysBack * 24 * 60 * 60 * 1000) / points;
  let current = baseProb + (rand() - 0.5) * 0.2;
  current = Math.max(0.05, Math.min(0.95, current));

  const history: PricePoint[] = [];

  for (let i = 0; i < points; i++) {
    const t = new Date(REFERENCE_TIME - (points - i) * interval).toISOString();
    history.push({ t, p: Math.round(current * 1000) / 1000 });

    const drift = (baseProb - current) * 0.05;
    const noise = (rand() - 0.5) * 0.04;
    current = Math.max(0.05, Math.min(0.95, current + drift + noise));
  }

  history.push({ t: new Date(REFERENCE_TIME).toISOString(), p: baseProb });
  return history;
}

export function clampProbability(p: number): number {
  return Math.max(0.05, Math.min(0.95, p));
}

export function formatProbability(p: number): string {
  return `${Math.round(p * 100)}%`;
}

export function formatRelativeTime(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffHours < 48) return "Yesterday";
  const days = Math.floor(diffHours / 24);
  return `${days}d ago`;
}
