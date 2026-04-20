import { create } from "zustand";
import type { AppNotification, CryptoAsset, CryptoHolding, Market, Position, ResolvedPosition, Side, Topic, User } from "@/types";
import { stories as baseStories, markets as baseMarkets, initialUser, lessons } from "@/lib/mock-data";
import { extraStories, extraMarkets } from "@/lib/mock-stories-extra";
import { initialCryptoAssets } from "@/lib/mock-crypto";

const stories = [...baseStories, ...extraStories];
const initialMarkets = [...baseMarkets, ...extraMarkets];
import { clampProbability } from "@/lib/price-utils";

const initialNotifications: AppNotification[] = [
  {
    id: "n1",
    message: "Your hunch resolved: Warsaw team acqui-hired before Q3",
    detail: "You backed Yes · $5 → +$2.12",
    timestamp: "2026-04-10T00:00:00Z",
    read: false,
    href: "/track-record",
  },
  {
    id: "n2",
    message: "You were wrong: Fed cuts rates by April 15",
    detail: "You backed Yes · $1 → −$1.00",
    timestamp: "2026-04-08T00:00:00Z",
    read: false,
    href: "/track-record",
  },
  {
    id: "n3",
    message: "New lesson unlocked: What's a stablecoin?",
    detail: "You completed 3 predictions",
    timestamp: "2026-04-07T14:00:00Z",
    read: true,
    href: "/learn",
  },
  {
    id: "n4",
    message: "Welcome to Hunch",
    detail: "You have $10 of practice money to start exploring.",
    timestamp: "2026-04-06T10:00:00Z",
    read: true,
  },
];

type AppState = {
  user: User;
  markets: Market[];
  stories: typeof stories;
  notifications: AppNotification[];
  cryptoAssets: CryptoAsset[];
  cryptoHoldings: CryptoHolding[];

  // Actions
  placeBet: (marketId: string, side: Side, amount: number) => void;
  updatePrices: () => void;
  completeOnboarding: () => void;
  selectTopics: (topics: Topic[]) => void;
  advanceOnboarding: () => void;
  setOnboardingStep: (step: number) => void;
  getMarket: (id: string) => Market | undefined;
  getStory: (id: string) => (typeof stories)[0] | undefined;
  getPosition: (marketId: string) => Position | undefined;
  markAllNotificationsRead: () => void;
  addFunds: (amount: number) => void;
  placeBetWithCrypto: (marketId: string, side: Side, amountUSD: number, cryptoId: string) => void;
  resolveOldPositions: () => void;
  buyCrypto: (assetId: string, amountUSD: number) => void;
  sellCrypto: (assetId: string, amountUSD: number) => void;
  updateCryptoPrices: () => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  user: initialUser,
  markets: initialMarkets,
  cryptoAssets: initialCryptoAssets,
  cryptoHoldings: [],
  stories,
  notifications: initialNotifications,

  placeBet: (marketId, side, amount) => {
    set((state) => {
      const market = state.markets.find((m) => m.id === marketId);
      if (!market) return state;
      if (state.user.practiceBalance < amount) return state;

      const expectedValue =
        side === "yes"
          ? amount / market.probabilityYes
          : amount / (1 - market.probabilityYes);

      const newPosition: Position = {
        marketId,
        side,
        amount,
        paidWith: "dollars",
        takenAt: new Date().toISOString(),
        currentValue: expectedValue,
      };

      const newPredictionsCompleted = state.user.predictionsCompleted + 1;

      // Auto-unlock lessons based on new prediction count
      const newlyUnlocked = lessons
        .filter(
          (l) =>
            l.unlockAfterPredictions <= newPredictionsCompleted &&
            !state.user.unlockedLessons.includes(l.id),
        )
        .map((l) => l.id);

      const newNotifications: AppNotification[] = [
        {
          id: `n-${Date.now()}`,
          message: `Hunch recorded: ${market.question}`,
          detail: `You backed ${side === "yes" ? "Yes" : "No"} · $${amount < 1 ? amount.toFixed(2) : amount}`,
          timestamp: new Date().toISOString(),
          read: false,
          href: "/portfolio",
        },
      ];

      // Notify newly unlocked lessons
      for (const lessonId of newlyUnlocked) {
        const lesson = lessons.find((l) => l.id === lessonId);
        if (lesson) {
          newNotifications.push({
            id: `n-lesson-${lessonId}-${Date.now()}`,
            message: `New lesson unlocked: ${lesson.title}`,
            detail: `You completed ${newPredictionsCompleted} predictions`,
            timestamp: new Date().toISOString(),
            read: false,
            href: "/learn",
          });
        }
      }

      return {
        user: {
          ...state.user,
          practiceBalance: Math.round((state.user.practiceBalance - amount) * 100) / 100,
          positions: [...state.user.positions, newPosition],
          predictionsCompleted: newPredictionsCompleted,
          unlockedLessons: [...state.user.unlockedLessons, ...newlyUnlocked],
        },
        notifications: [...newNotifications, ...state.notifications],
      };
    });
  },

  placeBetWithCrypto: (marketId, side, amountUSD, cryptoId) => {
    set((state) => {
      const market = state.markets.find((m) => m.id === marketId);
      const cryptoAsset = state.cryptoAssets.find((a) => a.id === cryptoId);
      const holding = state.cryptoHoldings.find((h) => h.assetId === cryptoId);
      if (!market || !cryptoAsset || !holding) return state;

      const holdingValueUSD = holding.quantity * cryptoAsset.price;
      if (holdingValueUSD < amountUSD) return state;

      const cryptoQtyToSpend = amountUSD / cryptoAsset.price;
      const remainingQty = holding.quantity - cryptoQtyToSpend;

      const expectedValue =
        side === "yes"
          ? amountUSD / market.probabilityYes
          : amountUSD / (1 - market.probabilityYes);

      const newPosition: Position = {
        marketId,
        side,
        amount: amountUSD,
        paidWith: cryptoId as Position["paidWith"],
        takenAt: new Date().toISOString(),
        currentValue: expectedValue,
      };

      const newPredictionsCompleted = state.user.predictionsCompleted + 1;
      const newlyUnlocked = lessons
        .filter(
          (l) =>
            l.unlockAfterPredictions <= newPredictionsCompleted &&
            !state.user.unlockedLessons.includes(l.id),
        )
        .map((l) => l.id);

      const updatedHoldings =
        remainingQty < 0.000001
          ? state.cryptoHoldings.filter((h) => h.assetId !== cryptoId)
          : state.cryptoHoldings.map((h) =>
              h.assetId === cryptoId ? { ...h, quantity: remainingQty } : h,
            );

      return {
        user: {
          ...state.user,
          positions: [...state.user.positions, newPosition],
          predictionsCompleted: newPredictionsCompleted,
          unlockedLessons: [...state.user.unlockedLessons, ...newlyUnlocked],
        },
        cryptoHoldings: updatedHoldings,
        notifications: [
          {
            id: `n-bet-crypto-${Date.now()}`,
            message: `Hunch recorded: ${market.question}`,
            detail: `Paid ${cryptoQtyToSpend.toFixed(6)} ${cryptoAsset.symbol} (~$${amountUSD})`,
            timestamp: new Date().toISOString(),
            read: false,
            href: "/portfolio",
          },
          ...state.notifications,
        ],
      };
    });
  },

  resolveOldPositions: () => {
    set((state) => {
      const now = Date.now();
      const RESOLVE_AFTER_MS = 300_000; // 5 minutes

      const toResolve: Position[] = [];
      const remaining: Position[] = [];

      for (const pos of state.user.positions) {
        const age = now - new Date(pos.takenAt).getTime();
        if (age >= RESOLVE_AFTER_MS) {
          toResolve.push(pos);
        } else {
          remaining.push(pos);
        }
      }

      if (toResolve.length === 0) return state;

      const newResolved: ResolvedPosition[] = toResolve.map((pos) => {
        const market = state.markets.find((m) => m.id === pos.marketId);
        const prob = market?.probabilityYes ?? 0.5;
        // Resolve based on current probability: if prob > 0.5, "yes" wins more often
        const outcome = Math.random() < prob;
        const userCorrect =
          (pos.side === "yes" && outcome) || (pos.side === "no" && !outcome);
        const payout = userCorrect ? pos.currentValue : 0;

        return {
          ...pos,
          resolvedAt: new Date().toISOString(),
          correct: userCorrect,
          payout,
        };
      });

      // Update accuracy rate
      const allResolved = [...state.user.resolvedPositions, ...newResolved];
      const correctCount = allResolved.filter((r) => r.correct).length;
      const newAccuracy = allResolved.length > 0 ? correctCount / allResolved.length : 0;

      // Add balance back for winning bets
      const totalPayout = newResolved.reduce((sum, r) => sum + r.payout, 0);

      // Generate notifications
      const newNotifications: AppNotification[] = newResolved.map((r) => {
        const market = state.markets.find((m) => m.id === r.marketId);
        const question = market?.question ?? r.marketId;
        return {
          id: `n-resolve-${r.marketId}-${Date.now()}`,
          message: r.correct
            ? `Your hunch resolved: ${question}`
            : `You were wrong: ${question}`,
          detail: r.correct
            ? `You backed ${r.side === "yes" ? "Yes" : "No"} · $${r.amount} → +$${(r.payout - r.amount).toFixed(2)}`
            : `You backed ${r.side === "yes" ? "Yes" : "No"} · $${r.amount} → −$${r.amount.toFixed(2)}`,
          timestamp: new Date().toISOString(),
          read: false,
          href: "/track-record",
        };
      });

      return {
        user: {
          ...state.user,
          positions: remaining,
          resolvedPositions: [...state.user.resolvedPositions, ...newResolved],
          practiceBalance: Math.round((state.user.practiceBalance + totalPayout) * 100) / 100,
          accuracyRate: Math.round(newAccuracy * 100) / 100,
        },
        notifications: [...newNotifications, ...state.notifications],
      };
    });
  },

  updatePrices: () => {
    set((state) => ({
      markets: state.markets.map((market) => {
        const delta = (Math.random() - 0.5) * 0.03;
        const newProb = clampProbability(market.probabilityYes + delta);
        const now = new Date().toISOString();

        return {
          ...market,
          probabilityYes: Math.round(newProb * 1000) / 1000,
          history: [...market.history.slice(-29), { t: now, p: newProb }],
        };
      }),
    }));
  },

  completeOnboarding: () => {
    set((state) => ({
      user: { ...state.user, onboardingComplete: true },
    }));
  },

  selectTopics: (topics) => {
    set((state) => ({
      user: { ...state.user, selectedTopics: topics },
    }));
  },

  advanceOnboarding: () => {
    set((state) => ({
      user: { ...state.user },
    }));
  },

  setOnboardingStep: (_step) => {
    // Onboarding step is managed locally in the onboarding page
  },

  getMarket: (id) => get().markets.find((m) => m.id === id),
  getStory: (id) => get().stories.find((s) => s.id === id),
  getPosition: (marketId) =>
    get().user.positions.find((p) => p.marketId === marketId),

  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  addFunds: (amount) => {
    if (amount <= 0 || amount > 500) return;
    set((state) => ({
      user: {
        ...state.user,
        practiceBalance: Math.round((state.user.practiceBalance + amount) * 100) / 100,
      },
      notifications: [
        {
          id: `n-funds-${Date.now()}`,
          message: `Funds added: $${amount} to your balance`,
          detail: `New balance: $${(Math.round((state.user.practiceBalance + amount) * 100) / 100).toFixed(2)}`,
          timestamp: new Date().toISOString(),
          read: false,
          href: "/portfolio",
        },
        ...state.notifications,
      ],
    }));
  },

  buyCrypto: (assetId, amountUSD) => {
    set((state) => {
      const asset = state.cryptoAssets.find((a) => a.id === assetId);
      if (!asset) return state;
      if (state.user.practiceBalance < amountUSD) return state;

      const quantity = amountUSD / asset.price;
      const existing = state.cryptoHoldings.find((h) => h.assetId === assetId);

      let updatedHoldings: CryptoHolding[];
      if (existing) {
        const totalQty = existing.quantity + quantity;
        const totalCost = existing.avgBuyPrice * existing.quantity + amountUSD;
        updatedHoldings = state.cryptoHoldings.map((h) =>
          h.assetId === assetId
            ? { ...h, quantity: totalQty, avgBuyPrice: totalCost / totalQty, boughtAt: new Date().toISOString() }
            : h,
        );
      } else {
        updatedHoldings = [
          ...state.cryptoHoldings,
          { assetId, quantity, avgBuyPrice: asset.price, boughtAt: new Date().toISOString() },
        ];
      }

      return {
        user: {
          ...state.user,
          practiceBalance: Math.round((state.user.practiceBalance - amountUSD) * 100) / 100,
        },
        cryptoHoldings: updatedHoldings,
        notifications: [
          {
            id: `n-buy-${Date.now()}`,
            message: `Bought $${amountUSD} of ${asset.name}`,
            detail: `${quantity.toFixed(6)} ${asset.symbol} at $${asset.price.toLocaleString()}`,
            timestamp: new Date().toISOString(),
            read: false,
            href: "/crypto",
          },
          ...state.notifications,
        ],
      };
    });
  },

  sellCrypto: (assetId, amountUSD) => {
    set((state) => {
      const asset = state.cryptoAssets.find((a) => a.id === assetId);
      const holding = state.cryptoHoldings.find((h) => h.assetId === assetId);
      if (!asset || !holding) return state;

      const holdingValueUSD = holding.quantity * asset.price;
      const sellAmountUSD = Math.min(amountUSD, holdingValueUSD);
      const sellQuantity = sellAmountUSD / asset.price;
      const remainingQty = holding.quantity - sellQuantity;

      const updatedHoldings =
        remainingQty < 0.000001
          ? state.cryptoHoldings.filter((h) => h.assetId !== assetId)
          : state.cryptoHoldings.map((h) =>
              h.assetId === assetId ? { ...h, quantity: remainingQty } : h,
            );

      return {
        user: {
          ...state.user,
          practiceBalance: Math.round((state.user.practiceBalance + sellAmountUSD) * 100) / 100,
        },
        cryptoHoldings: updatedHoldings,
        notifications: [
          {
            id: `n-sell-${Date.now()}`,
            message: `Sold $${sellAmountUSD.toFixed(2)} of ${asset.name}`,
            detail: `${sellQuantity.toFixed(6)} ${asset.symbol} at $${asset.price.toLocaleString()}`,
            timestamp: new Date().toISOString(),
            read: false,
            href: "/crypto",
          },
          ...state.notifications,
        ],
      };
    });
  },

  updateCryptoPrices: () => {
    set((state) => ({
      cryptoAssets: state.cryptoAssets.map((asset) => {
        const volatility = asset.id === "btc" ? 0.002 : 0.003;
        const delta = (Math.random() - 0.5) * 2 * asset.price * volatility;
        const newPrice = Math.round((asset.price + delta) * 100) / 100;
        const oldestPrice = asset.history.length > 0 ? asset.history[0].p : asset.price;
        const change24h = Math.round(((newPrice - oldestPrice) / oldestPrice) * 10000) / 100;

        return {
          ...asset,
          price: newPrice,
          change24h,
          history: [
            ...asset.history.slice(-29),
            { t: new Date().toISOString(), p: newPrice },
          ],
        };
      }),
    }));
  },
}));
