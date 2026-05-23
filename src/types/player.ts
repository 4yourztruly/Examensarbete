import type { Card } from "./card";

export type BotArchetype = "passive" | "aggressive" | "adaptive";

export interface Player {
  id: number;
  name: string;
  balance: number;
  cards: Card[];
  currentBet: number;
  folded: boolean;
  isUser: boolean;
  isDealer: boolean;
  allIn: boolean;
  archetype?: BotArchetype;
  lastAction: string | null;
}
