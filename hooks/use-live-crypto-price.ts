"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/stores/app-store";

const INTERVAL_MS = 8000;

export function useLiveCryptoPrice() {
  const updateCryptoPrices = useAppStore((s) => s.updateCryptoPrices);
  const cryptoAssets = useAppStore((s) => s.cryptoAssets);

  useEffect(() => {
    const id = setInterval(updateCryptoPrices, INTERVAL_MS);
    return () => clearInterval(id);
  }, [updateCryptoPrices]);

  return cryptoAssets;
}
