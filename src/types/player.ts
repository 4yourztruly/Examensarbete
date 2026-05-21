import type { Card } from "./card";

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
}
