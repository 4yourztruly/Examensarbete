import type { Player } from "../types/player";

export const SMALL_BLIND = 25;
export const BIG_BLIND = 50;

export function postBlinds(
  players: Player[],
  dealerIndex: number,
): { players: Player[]; pot: number } {
  const sbIdx = (dealerIndex + 1) % players.length;
  const bbIdx = (dealerIndex + 2) % players.length;
  const updated = players.map((p, i) => {
    if (i === sbIdx)
      return {
        ...p,
        balance: p.balance - SMALL_BLIND,
        currentBet: SMALL_BLIND,
      };
    if (i === bbIdx)
      return { ...p, balance: p.balance - BIG_BLIND, currentBet: BIG_BLIND };
    return p;
  });
  return { players: updated, pot: SMALL_BLIND + BIG_BLIND };
}

export function placeBet(player: Player, amount: number): Player {
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

export function callBet(
  player: Player,
  highBet: number,
): { player: Player; amount: number } {
  const amount = Math.min(highBet - player.currentBet, player.balance);
  return { player: placeBet(player, amount), amount };
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

export function getNextPlayerIndex(
  players: Player[],
  currentIndex: number,
): number {
  let next = (currentIndex + 1) % players.length;
  let loops = 0;
  while (
    (players[next].folded || players[next].allIn) &&
    loops < players.length
  ) {
    next = (next + 1) % players.length;
    loops++;
  }
  return next;
}

export function isBettingDone(players: Player[]): boolean {
  const highBet = getHighBet(players);
  return players
    .filter((p) => !p.folded && !p.allIn)
    .every((p) => p.currentBet === highBet);
}

export function onePlayerLeft(players: Player[]): boolean {
  return players.filter((p) => !p.folded).length === 1;
}
