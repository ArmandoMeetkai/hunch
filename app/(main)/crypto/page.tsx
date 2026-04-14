"use client";

import { useAppStore } from "@/lib/stores/app-store";
import { useLiveCryptoPrice } from "@/hooks/use-live-crypto-price";
import { EditorialOverline } from "@/components/ui/editorial-overline";
import { CryptoCard } from "@/components/ui/crypto-card";

export default function CryptoPage() {
  const cryptoAssets = useLiveCryptoPrice();
  const cryptoHoldings = useAppStore((s) => s.cryptoHoldings);

  const totalCryptoValue = cryptoHoldings.reduce((sum, h) => {
    const asset = cryptoAssets.find((a) => a.id === h.assetId);
    return sum + (asset ? h.quantity * asset.price : 0);
  }, 0);

  const totalCost = cryptoHoldings.reduce(
    (sum, h) => sum + h.quantity * h.avgBuyPrice,
    0,
  );
  const totalPnl = totalCryptoValue - totalCost;
  const hasHoldings = cryptoHoldings.length > 0;

  return (
    <div className="mx-auto max-w-[680px] px-6 py-10">
      <div className="mb-10">
        <EditorialOverline>Practice portfolio</EditorialOverline>
        <h1 className="mt-3 font-serif text-5xl leading-[1.05] tracking-[-0.015em] text-ink-primary">
          Get to know <em className="italic">crypto.</em>
        </h1>
        <p className="mt-3 text-lg text-ink-secondary">
          Buy and sell with practice money. No real funds, no risk.
        </p>
      </div>

      {/* Portfolio summary */}
      {hasHoldings && (
        <div className="mb-8 rounded-2xl border border-border-soft bg-bg-surface p-6">
          <EditorialOverline>Your crypto</EditorialOverline>
          <p className="mt-2 font-mono text-4xl font-light tracking-[-0.03em] text-ink-primary">
            ${totalCryptoValue.toFixed(2)}
          </p>
          <p
            className={`mt-1 text-[13px] ${totalPnl >= 0 ? "text-accent-signal" : "text-accent-cool"}`}
          >
            {totalPnl >= 0 ? "↗" : "↘"} {totalPnl >= 0 ? "+" : ""}$
            {totalPnl.toFixed(2)} (
            {totalCost > 0
              ? `${totalPnl >= 0 ? "+" : ""}${((totalPnl / totalCost) * 100).toFixed(1)}%`
              : "0%"}
            )
          </p>

          {/* Breakdown by asset */}
          <div className="mt-4 flex gap-6 border-t border-border-soft pt-4">
            {cryptoHoldings.map((h) => {
              const asset = cryptoAssets.find((a) => a.id === h.assetId);
              if (!asset) return null;
              const value = h.quantity * asset.price;
              const pnl = value - h.quantity * h.avgBuyPrice;
              return (
                <div key={h.assetId} className="flex items-center gap-2">
                  <span className="font-serif text-lg text-ink-tertiary">
                    {h.assetId === "btc" ? "₿" : "Ξ"}
                  </span>
                  <div>
                    <p className="font-mono text-sm text-ink-primary">
                      ${value.toFixed(2)}
                    </p>
                    <p className={`font-mono text-[11px] ${pnl >= 0 ? "text-accent-signal" : "text-accent-cool"}`}>
                      {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Asset cards */}
      <div className="flex flex-col gap-4">
        {cryptoAssets.map((asset) => {
          const holding = cryptoHoldings.find((h) => h.assetId === asset.id);
          return (
            <CryptoCard key={asset.id} asset={asset} holding={holding} />
          );
        })}
      </div>

      {/* Educational note */}
      <p className="mt-10 text-center text-[13px] italic text-ink-tertiary">
        This is a simulation. Prices move like real markets but aren&apos;t
        connected to actual exchanges.
      </p>
    </div>
  );
}
