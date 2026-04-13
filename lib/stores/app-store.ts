import { create } from "zustand";
import type { AppNotification, Market, Position, Side, Topic, User } from "@/types";
import { stories, markets as initialMarkets, initialUser, lessons } from "@/lib/mock-data";
import { clampProbability } from "@/lib/price-utils";

const initialNotifications: AppNotification[] = [
  {
    id: "n1",
    message: "Your hunch resolved: Warsaw team acqui-hired before Q3",
    detail: "You backed Yes · $5 → +$2.12",
    timestamp: "2026-04-10T00:00:00Z",
    read: false,
  },
  {
    id: "n2",
    message: "You were wrong: Fed cuts rates by April 15",
    detail: "You backed Yes · $1 → −$1.00",
    timestamp: "2026-04-08T00:00:00Z",
    read: false,
  },
  {
    id: "n3",
    message: "New lesson unlocked: What's a stablecoin?",
    detail: "You completed 3 predictions",
    timestamp: "2026-04-07T14:00:00Z",
    read: true,
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
};

export const useAppStore = create<AppState>((set, get) => ({
  user: initialUser,
  markets: initialMarkets,
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
}));
