import type { Card } from "./card";
import type { Player } from "./player";

export type GamePhase =
  | "idle"
  | "preflop"
  | "flop"
  | "turn"
  | "river"
  | "showdown";

export interface GameState {
  phase: GamePhase;
  pot: number;
  deck: Card[];
  communityCards: Card[];
  players: Player[];
  currentPlayerIndex: number;
  dealerIndex: number;
  winners: Player[];
  log: string[];
}
