import type { Player } from "../types/player";

export const BIG_BLIND = 50;

function placeBet(player: Player, amount: number): Player {
  const actual = Math.min(amount, player.balance);
  return {
    ...player,
    balance: player.balance - actual,
    currentBet: player.currentBet + actual,
    allIn: player.balance - actual === 0,
  };
}

export function foldPlayer(player: Player): Player {
  return { ...player, folded: true };
}

export function raiseBy(
  player: Player,
  highBet: number,
  raiseAmount: number,
): { player: Player; amount: number } {
  const total = Math.min(
    highBet - player.currentBet + raiseAmount,
    player.balance,
  );
  return { player: placeBet(player, total), amount: total };
}

export function resetBets(players: Player[]): Player[] {
  return players.map((p) => ({ ...p, currentBet: 0 }));
}

export function getHighBet(players: Player[]): number {
  return Math.max(...players.map((p) => p.currentBet));
}

export function onePlayerLeft(players: Player[]): boolean {
  return players.filter((p) => !p.folded && !p.eliminated).length === 1;
}
