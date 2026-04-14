"use client";

import { useState } from "react";
import type { CryptoAsset, CryptoHolding } from "@/types";
import { CRYPTO_GLYPHS } from "@/lib/mock-crypto";
import { PriceNumber } from "./price-number";
import { Sparkline } from "./sparkline";
import { BuyCryptoModal } from "./buy-crypto-modal";
import { SellCryptoModal } from "./sell-crypto-modal";

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
      <div className="overflow-hidden rounded-2xl border border-border-soft bg-bg-surface p-6 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(28,26,23,0.08)]">
        {/* Header: glyph + name + price */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif text-3xl text-ink-tertiary">
              {CRYPTO_GLYPHS[asset.id]}
            </span>
            <div>
              <h3 className="text-[15px] font-medium text-ink-primary">
                {asset.name}
              </h3>
              <p className="text-[12px] text-ink-tertiary">{asset.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <PriceNumber value={asset.price} size={24} />
            <p className={`mt-0.5 text-[13px] ${changeColor}`}>
              {isUp ? "↗" : "↘"} {isUp ? "+" : ""}
              {asset.change24h.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Sparkline */}
        <Sparkline
          data={asset.history}
          width={280}
          height={48}
          color={sparklineColor}
          className="mb-4 w-full"
        />

        {/* Holding info */}
        {holding && (
          <div className="mb-4 rounded-lg bg-bg-sunken px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-tertiary">
                  Your holding
                </p>
                <p className="mt-0.5 font-mono text-sm text-ink-primary">
                  {holding.quantity.toFixed(6)} {asset.symbol}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm text-ink-primary">
                  ${holdingValue.toFixed(2)}
                </p>
                <p
                  className={`font-mono text-[12px] ${holdingPnl >= 0 ? "text-accent-signal" : "text-accent-cool"}`}
                >
                  {holdingPnl >= 0 ? "+" : ""}${holdingPnl.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowBuy(true)}
            className="flex-1 cursor-pointer rounded-[var(--radius-button)] bg-accent-ink py-2.5 text-center text-sm font-medium text-bg-canvas transition-transform hover:-translate-y-px"
          >
            Buy
          </button>
          {holding && (
            <button
              onClick={() => setShowSell(true)}
              className="flex-1 cursor-pointer rounded-[var(--radius-button)] border border-border-firm py-2.5 text-center text-sm font-medium text-ink-primary transition-colors hover:bg-bg-surface"
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
