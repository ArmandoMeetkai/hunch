export type Topic =
  | "politics"
  | "climate"
  | "culture"
  | "sports"
  | "tech"
  | "economy"
  | "science"
  | "entertainment"
  | "world";

export type PricePoint = {
  t: string;
  p: number;
};

export type Side = "yes" | "no";

export type Story = {
  id: string;
  topic: Topic;
  title: string;
  summary: string;
  body: string;
  publishedAt: string;
  marketId: string;
};

export type Market = {
  id: string;
  storyId: string;
  question: string;
  probabilityYes: number;
  history: PricePoint[];
  resolvesAt: string;
};

export type PaymentMethod = "dollars" | "btc" | "eth";

export type Position = {
  marketId: string;
  side: Side;
  amount: number;
  paidWith: PaymentMethod;
  takenAt: string;
  currentValue: number;
};

export type ResolvedPosition = Position & {
  resolvedAt: string;
  correct: boolean;
  payout: number;
};

export type Lesson = {
  id: number;
  romanNumeral: string;
  title: string;
  subtitle: string;
  body: string;
  unlockAfterPredictions: number;
};

export type AppNotification = {
  id: string;
  message: string;
  detail?: string;
  timestamp: string;
  read: boolean;
};

export type CryptoAsset = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  history: PricePoint[];
};

export type CryptoHolding = {
  assetId: string;
  quantity: number;
  avgBuyPrice: number;
  boughtAt: string;
};

export type User = {
  name: string;
  practiceBalance: number;
  positions: Position[];
  resolvedPositions: ResolvedPosition[];
  predictionsCompleted: number;
  accuracyRate: number;
  unlockedLessons: number[];
  selectedTopics: Topic[];
  onboardingComplete: boolean;
};
