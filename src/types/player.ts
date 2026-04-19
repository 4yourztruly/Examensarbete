import type { Card } from "./card";

export interface Player {
  id: string;
  name: string;
  chips: number;
  hand: Card[];
  currentBet: number;
  folded: boolean;
  isDealer: boolean;
}
