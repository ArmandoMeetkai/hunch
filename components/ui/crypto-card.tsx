"use client";

import { useState } from "react";
import type { CryptoAsset, CryptoHolding } from "@/types";
import { CRYPTO_GLYPHS } from "@/lib/mock-crypto";
import { PriceNumber } from "./price-number";
import { Sparkline } from "./sparkline";
import { BuyCryptoModal } from "./buy-crypto-modal";
import { SellCryptoModal } from "./sell-crypto-modal";
import { EditorialOverline } from "./editorial-overline";

type CryptoCardProps = {
  asset: CryptoAsset;
  holding?: CryptoHolding;
};

export function CryptoCard({ asset, holding }: CryptoCardProps) {
  const [showBuy, setShowBuy] = useState(false);
  const [showSell, setShowSell] = useState(false);

  const isUp = asset.change24h >= 0;
  const changeColor = isUp ? "text-accent-signal" : "text-accent-cool";
  const sparklineColor = isUp
    ? "var(--color-accent-signal)"
    : "var(--color-accent-cool)";

  const holdingValue = holding ? holding.quantity * asset.price : 0;
  const holdingPnl = holding
    ? holdingValue - holding.quantity * holding.avgBuyPrice
    : 0;

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border-soft bg-bg-surface transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(28,26,23,0.08)]">
        {/* Top section with padding */}
        <div className="p-6">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-bg-sunken">
                <span className="font-serif text-2xl text-accent-ink">
                  {CRYPTO_GLYPHS[asset.id]}
                </span>
              </div>
              <div>
                <h3 className="font-serif text-lg text-ink-primary">{asset.name}</h3>
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-tertiary">{asset.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <PriceNumber value={asset.price} size={28} colorize={false} />
              <p className={`mt-1 font-mono text-[13px] ${changeColor}`}>
                {isUp ? "↗" : "↘"} {isUp ? "+" : ""}{asset.change24h.toFixed(1)}% <span className="text-ink-tertiary">24h</span>
              </p>
            </div>
          </div>
        </div>

        {/* Sparkline — full width, no padding */}
        <div className="px-6">
          <Sparkline
            data={asset.history}
            width={600}
            height={80}
            color={sparklineColor}
            className="w-full"
          />
        </div>

        {/* Holding section */}
        {holding ? (
          <div className="mx-6 mt-4 mb-6 rounded-xl bg-bg-sunken p-4">
            <div className="flex items-center justify-between">
              <div>
                <EditorialOverline>Your holding</EditorialOverline>
                <p className="mt-1 font-mono text-[15px] font-light tracking-[-0.02em] text-ink-primary">
                  {holding.quantity.toFixed(6)} {asset.symbol}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[15px] font-light tracking-[-0.02em] text-ink-primary">
                  ${holdingValue.toFixed(2)}
                </p>
                <p className={`mt-0.5 font-mono text-[12px] ${holdingPnl >= 0 ? "text-accent-signal" : "text-accent-cool"}`}>
                  {holdingPnl >= 0 ? "↗ +" : "↘ "}${Math.abs(holdingPnl).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-6 mt-4 mb-6 rounded-xl border border-dashed border-border-soft p-4 text-center">
            <p className="font-serif text-[15px] italic text-ink-tertiary">
              You don&apos;t own any {asset.name} yet.
            </p>
          </div>
        )}

        {/* Actions — full width bottom bar */}
        <div className="flex border-t border-border-soft">
          <button
            onClick={() => setShowBuy(true)}
            className={`flex-1 cursor-pointer py-3.5 text-center text-sm font-medium text-bg-canvas bg-accent-ink transition-colors hover:opacity-90 ${holding ? "rounded-bl-2xl" : "rounded-b-2xl"}`}
          >
            Buy {asset.name}
          </button>
          {holding && (
            <button
              onClick={() => setShowSell(true)}
              className="flex-1 cursor-pointer rounded-br-2xl border-l border-border-soft py-3.5 text-center text-sm font-medium text-ink-primary transition-colors hover:bg-bg-sunken"
            >
              Sell
            </button>
          )}
        </div>
      </div>

      <BuyCryptoModal
        isOpen={showBuy}
        onClose={() => setShowBuy(false)}
        asset={asset}
      />
      {holding && (
        <SellCryptoModal
          isOpen={showSell}
          onClose={() => setShowSell(false)}
          asset={asset}
          holding={holding}
        />
      )}
    </>
  );
}
