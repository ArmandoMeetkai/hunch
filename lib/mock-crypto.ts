import type { CryptoAsset, PricePoint } from "@/types";

// Fixed reference time for deterministic data
const REF = new Date("2026-04-13T12:00:00Z").getTime();

// Seeded pseudo-random for deterministic data across server/client
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function generateCryptoPriceHistory(
  basePrice: number,
  volatilityPct: number = 0.02,
  points: number = 30,
  daysBack: number = 7,
): PricePoint[] {
  const rand = seededRandom(Math.round(basePrice));
  const interval = (daysBack * 24 * 60 * 60 * 1000) / points;
  let current = basePrice * (1 + (rand() - 0.5) * volatilityPct * 4);

  const history: PricePoint[] = [];

  for (let i = 0; i < points; i++) {
    const t = new Date(REF - (points - i) * interval).toISOString();
    history.push({ t, p: Math.round(current * 100) / 100 });

    const drift = (basePrice - current) * 0.03;
    const noise = (rand() - 0.5) * basePrice * volatilityPct;
    current = Math.max(basePrice * 0.8, Math.min(basePrice * 1.2, current + drift + noise));
  }

  history.push({ t: new Date(REF).toISOString(), p: basePrice });
  return history;
}

export const initialCryptoAssets: CryptoAsset[] = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    price: 68000,
    change24h: 2.3,
    history: generateCryptoPriceHistory(68000, 0.02),
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    price: 3400,
    change24h: -1.5,
    history: generateCryptoPriceHistory(3400, 0.03),
  },
];

export const CRYPTO_GLYPHS: Record<string, string> = {
  btc: "₿",
  eth: "Ξ",
};
