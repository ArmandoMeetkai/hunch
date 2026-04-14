"use client";

import { useState } from "react";
import type { Market } from "@/types";
import type { Side } from "@/types";
import { useAppStore } from "@/lib/stores/app-store";
import { CRYPTO_GLYPHS } from "@/lib/mock-crypto";
import { ProbabilityNumber } from "@/components/ui/probability-number";
import { Sparkline } from "@/components/ui/sparkline";
import { PillToggle } from "@/components/ui/pill-toggle";
import { AmountStepper } from "@/components/ui/amount-stepper";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { AddFundsModal } from "@/components/ui/add-funds-modal";
import { EditorialOverline } from "@/components/ui/editorial-overline";

type PaymentMethod = "dollars" | "btc" | "eth";

type StickyMarketModuleProps = {
  market: Market;
};

export function StickyMarketModule({ market }: StickyMarketModuleProps) {
  const [side, setSide] = useState<Side>("yes");
  const [amount, setAmount] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [payWith, setPayWith] = useState<PaymentMethod>("dollars");
  const placeBet = useAppStore((s) => s.placeBet);
  const placeBetWithCrypto = useAppStore((s) => s.placeBetWithCrypto);
  const balance = useAppStore((s) => s.user.practiceBalance);
  const cryptoHoldings = useAppStore((s) => s.cryptoHoldings);
  const cryptoAssets = useAppStore((s) => s.cryptoAssets);

  const btcHolding = cryptoHoldings.find((h) => h.assetId === "btc");
  const ethHolding = cryptoHoldings.find((h) => h.assetId === "eth");
  const btcAsset = cryptoAssets.find((a) => a.id === "btc");
  const ethAsset = cryptoAssets.find((a) => a.id === "eth");

  const btcValueUSD = btcHolding && btcAsset ? btcHolding.quantity * btcAsset.price : 0;
  const ethValueUSD = ethHolding && ethAsset ? ethHolding.quantity * ethAsset.price : 0;

  const hasCrypto = btcValueUSD > 0 || ethValueUSD > 0;

  const availableBalance =
    payWith === "dollars"
      ? balance
      : payWith === "btc"
        ? btcValueUSD
        : ethValueUSD;

  const canAfford = availableBalance >= amount;

  const trendUp =
    market.history.length >= 2 &&
    market.history[market.history.length - 1].p > market.history[0].p;
  const weekChange =
    market.history.length >= 2
      ? (
          (market.history[market.history.length - 1].p - market.history[0].p) *
          100
        ).toFixed(1)
      : "0.0";
  const sparklineColor = trendUp
    ? "var(--color-accent-signal)"
    : "var(--color-accent-cool)";

  const handleBack = () => {
    if (!canAfford) return;
    if (payWith === "dollars") {
      placeBet(market.id, side, amount);
    } else {
      placeBetWithCrypto(market.id, side, amount, payWith);
    }
    setShowModal(true);
  };

  const payLabel =
    payWith === "dollars"
      ? `$${amount.toFixed(2)}`
      : payWith === "btc"
        ? `${(amount / (btcAsset?.price ?? 1)).toFixed(6)} BTC`
        : `${(amount / (ethAsset?.price ?? 1)).toFixed(6)} ETH`;

  return (
    <>
      <aside className="rounded-2xl border border-border-soft bg-bg-surface p-5 md:p-7 lg:sticky lg:top-6">
        <EditorialOverline className="mb-4 block">
          The Hunch
        </EditorialOverline>

        <h3 className="mb-5 font-serif text-[22px] leading-[1.2] text-ink-primary">
          {market.question}
        </h3>

        <ProbabilityNumber value={market.probabilityYes} size={64} />

        <p className="mt-1 mb-5 text-[13px] text-ink-tertiary">
          <span className={trendUp ? "text-accent-signal" : "text-accent-cool"}>
            {trendUp ? "↗" : "↘"} {trendUp ? "+" : ""}
            {weekChange}%
          </span>{" "}
          this week
        </p>

        <Sparkline
          data={market.history}
          width={280}
          height={60}
          color={sparklineColor}
          className="mb-6 w-full"
        />

        <PillToggle value={side} onChange={setSide} layoutId="market-module-toggle" />

        {/* Pay with selector */}
        {hasCrypto && (
          <div className="mt-4">
            <EditorialOverline className="mb-2 block">Pay with</EditorialOverline>
            <div className="flex gap-1.5 rounded-[var(--radius-pill)] bg-bg-sunken p-1">
              <button
                onClick={() => setPayWith("dollars")}
                className={`flex-1 cursor-pointer rounded-[var(--radius-pill)] px-3 py-2 text-center text-[13px] font-medium transition-all ${
                  payWith === "dollars"
                    ? "bg-bg-canvas text-ink-primary shadow-sm"
                    : "text-ink-tertiary hover:text-ink-secondary"
                }`}
              >
                Dollars
              </button>
              {btcValueUSD > 0.01 && (
                <button
                  onClick={() => setPayWith("btc")}
                  className={`flex-1 cursor-pointer rounded-[var(--radius-pill)] px-3 py-2 text-center text-[13px] font-medium transition-all ${
                    payWith === "btc"
                      ? "bg-bg-canvas text-ink-primary shadow-sm"
                      : "text-ink-tertiary hover:text-ink-secondary"
                  }`}
                >
                  {CRYPTO_GLYPHS.btc} BTC
                </button>
              )}
              {ethValueUSD > 0.01 && (
                <button
                  onClick={() => setPayWith("eth")}
                  className={`flex-1 cursor-pointer rounded-[var(--radius-pill)] px-3 py-2 text-center text-[13px] font-medium transition-all ${
                    payWith === "eth"
                      ? "bg-bg-canvas text-ink-primary shadow-sm"
                      : "text-ink-tertiary hover:text-ink-secondary"
                  }`}
                >
                  {CRYPTO_GLYPHS.eth} ETH
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <EditorialOverline>Amount</EditorialOverline>
            <span className="font-mono text-[13px] text-ink-tertiary">
              {payWith === "dollars"
                ? `Balance: $${balance.toFixed(2)}`
                : payWith === "btc"
                  ? `${btcHolding?.quantity.toFixed(6) ?? "0"} BTC (~$${btcValueUSD.toFixed(2)})`
                  : `${ethHolding?.quantity.toFixed(6) ?? "0"} ETH (~$${ethValueUSD.toFixed(2)})`}
            </span>
          </div>
          <AmountStepper value={amount} onChange={setAmount} />
        </div>

        {!canAfford && (
          <button
            onClick={() => payWith === "dollars" ? setShowAddFunds(true) : undefined}
            className={`mt-3 w-full text-center text-[13px] font-medium text-accent-signal ${
              payWith === "dollars" ? "cursor-pointer transition-colors hover:text-accent-ink" : ""
            }`}
          >
            {payWith === "dollars"
              ? "Not enough balance — Add funds →"
              : `Not enough ${payWith.toUpperCase()} — switch to Dollars or buy more`}
          </button>
        )}

        <button
          onClick={handleBack}
          disabled={!canAfford || amount <= 0 || amount > 500}
          className="mt-4 w-full cursor-pointer rounded-[var(--radius-card)] bg-accent-ink py-3.5 text-[15px] font-medium text-bg-canvas transition-transform hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Back ${payLabel} on ${side === "yes" ? "Yes" : "No"} for: ${market.question}`}
        >
          Back {payLabel} on {side === "yes" ? "Yes" : "No"}
        </button>

        <p className="mt-4 text-center font-serif text-[15px] italic text-ink-tertiary">
          You believe this more than 73% of readers.
        </p>
      </aside>

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        side={side}
        amount={amount}
        question={market.question}
      />

      <AddFundsModal
        isOpen={showAddFunds}
        onClose={() => setShowAddFunds(false)}
      />
    </>
  );
}
