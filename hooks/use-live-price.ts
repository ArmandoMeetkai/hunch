"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/stores/app-store";

const INTERVAL_MS = 8000;

export function useLivePrice() {
  const updatePrices = useAppStore((s) => s.updatePrices);
  const markets = useAppStore((s) => s.markets);

  useEffect(() => {
    const id = setInterval(updatePrices, INTERVAL_MS);
    return () => clearInterval(id);
  }, [updatePrices]);

  return markets;
}
