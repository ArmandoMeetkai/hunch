"use client";

import { useAppStore } from "@/lib/stores/app-store";
import { useLiveCryptoPrice } from "@/hooks/use-live-crypto-price";
import { EditorialOverline } from "@/components/ui/editorial-overline";
import { CryptoCard } from "@/components/ui/crypto-card";

export default function CryptoPage() {
  const cryptoAssets = useLiveCryptoPrice();
  const cryptoHoldings = useAppStore((s) => s.cryptoHoldings);
  const balance = useAppStore((s) => s.user.practiceBalance);

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
  const pnlPct = totalCost > 0 ? ((totalPnl / totalCost) * 100).toFixed(1) : "0.0";

  return (
    <div className="mx-auto max-w-[680px] px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <EditorialOverline>Practice portfolio</EditorialOverline>
        <h1 className="mt-3 font-serif text-4xl leading-[1.05] tracking-[-0.015em] text-ink-primary sm:text-5xl">
          Get to know <em className="italic">crypto.</em>
        </h1>
        <p className="mt-3 text-base text-ink-secondary sm:text-lg">
          Buy and sell with practice money. No real funds, no risk.
        </p>
      </div>

      {/* Portfolio summary — always visible */}
      <div className="mb-8 rounded-2xl border border-border-soft bg-bg-surface">
        <div className="p-6">
          {hasHoldings ? (
            <>
              {/* Value + P&L */}
              <div className="flex items-end justify-between">
                <div>
                  <EditorialOverline>Crypto value</EditorialOverline>
                  <p className="mt-2 font-mono text-4xl font-light tracking-[-0.03em] text-ink-primary sm:text-5xl">
                    ${totalCryptoValue.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-mono text-lg font-light ${totalPnl >= 0 ? "text-accent-signal" : "text-accent-cool"}`}>
                    {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
                  </p>
                  <p className={`font-mono text-[13px] ${totalPnl >= 0 ? "text-accent-signal" : "text-accent-cool"}`}>
                    {totalPnl >= 0 ? "↗" : "↘"} {totalPnl >= 0 ? "+" : ""}{pnlPct}%
                  </p>
                </div>
              </div>

              {/* Asset breakdown */}
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border-soft pt-5">
                {cryptoHoldings.map((h) => {
                  const asset = cryptoAssets.find((a) => a.id === h.assetId);
                  if (!asset) return null;
                  const value = h.quantity * asset.price;
                  const pnl = value - h.quantity * h.avgBuyPrice;
                  return (
                    <div key={h.assetId} className="flex items-center gap-3 rounded-xl bg-bg-sunken p-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-bg-canvas">
                        <span className="font-serif text-lg text-accent-ink">
                          {h.assetId === "btc" ? "₿" : "Ξ"}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-sm text-ink-primary">${value.toFixed(2)}</p>
                        <p className={`font-mono text-[11px] ${pnl >= 0 ? "text-accent-signal" : "text-accent-cool"}`}>
                          {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="py-4 text-center">
              <p className="font-mono text-3xl font-light text-ink-primary">${balance.toFixed(2)}</p>
              <p className="mt-1 text-[13px] text-ink-tertiary">available to invest</p>
            </div>
          )}
        </div>
      </div>

      {/* Asset cards */}
      <div className="mb-4">
        <EditorialOverline className="mb-4 block">Markets</EditorialOverline>
      </div>
      <div className="flex flex-col gap-5">
        {cryptoAssets.map((asset) => {
          const holding = cryptoHoldings.find((h) => h.assetId === asset.id);
          return <CryptoCard key={asset.id} asset={asset} holding={holding} />;
        })}
      </div>

      {/* Footer note */}
      <div className="mt-12 flex flex-col items-center gap-3">
        <div className="h-px w-16 bg-border-soft" />
        <p className="text-center font-serif text-[15px] italic text-ink-tertiary">
          This is a simulation. Prices move like real
          <br className="sm:hidden" /> markets but aren&apos;t connected to exchanges.
        </p>
      </div>
    </div>
  );
}
