import type { Card } from "../types/card";
import type { Player } from "../types/player";
import type { EvaluatedHand, HandRank } from "../types/hand";

const RANK_VALUES: Record<string, number> = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

const HAND_NAMES: HandRank[] = [
  "High Card",
  "One Pair",
  "Two Pair",
  "Three of a Kind",
  "Straight",
  "Flush",
  "Full House",
  "Four of a Kind",
  "Straight Flush",
  "Royal Flush",
];

function getCombinations(cards: Card[], k: number): Card[][] {
  if (k === 0) return [[]];
  if (cards.length === 0) return [];
  const [first, ...rest] = cards;
  return [
    ...getCombinations(rest, k - 1).map((c) => [first, ...c]),
    ...getCombinations(rest, k),
  ];
}

function scoreFiveCards(cards: Card[]): number {
  const vals = cards.map((c) => RANK_VALUES[c.rank]).sort((a, b) => b - a);
  const suits = cards.map((c) => c.suit);
  const flush = suits.every((s) => s === suits[0]);
  const sorted = [...vals].sort((a, b) => a - b);
  const straight =
    sorted.every((v, i) => i === 0 || v === sorted[i - 1] + 1) ||
    JSON.stringify(sorted) === JSON.stringify([2, 3, 4, 5, 14]);
  const counts: Record<number, number> = {};
  vals.forEach((v) => (counts[v] = (counts[v] || 0) + 1));
  const groups = Object.values(counts).sort((a, b) => b - a);
  const tiebreak = vals.reduce((acc, v, i) => acc + v * Math.pow(15, 4 - i), 0);
  const score = (base: number) => base * 1e8 + tiebreak;
  if (flush && straight) {
    const isRoyal =
      JSON.stringify(vals) === JSON.stringify([14, 13, 12, 11, 10]);
    return score(isRoyal ? 9 : 8);
  }
  if (groups[0] === 4) return score(7);
  if (groups[0] === 3 && groups[1] === 2) return score(6);
  if (flush) return score(5);
  if (straight) return score(4);
  if (groups[0] === 3) return score(3);
  if (groups[0] === 2 && groups[1] === 2) return score(2);
  if (groups[0] === 2) return score(1);
  return score(0);
}

export function evaluateHand(
  holeCards: Card[],
  communityCards: Card[],
): EvaluatedHand {
  const all = [...holeCards, ...communityCards];
  const combos = getCombinations(all, 5);
  let bestScore = -1;
  for (const combo of combos) {
    const s = scoreFiveCards(combo);
    if (s > bestScore) bestScore = s;
  }
  return { rank: HAND_NAMES[Math.floor(bestScore / 1e8)], score: bestScore };
}

export function determineWinners(
  players: Player[],
  communityCards: Card[],
): Player[] {
  const active = players.filter((p) => !p.folded);
  if (active.length === 1) return active;
  let best = -1;
  active.forEach((p) => {
    const { score } = evaluateHand(p.cards, communityCards);
    if (score > best) best = score;
  });
  return active.filter(
    (p) => evaluateHand(p.cards, communityCards).score === best,
  );
}

export function getHandStrength(
  holeCards: Card[],
  communityCards: Card[],
): number {
  if (communityCards.length === 0) {
    const vals = holeCards.map((c) => RANK_VALUES[c.rank]);
    const high = Math.max(...vals);
    const isPair = vals[0] === vals[1];
    const isSuited = holeCards[0].suit === holeCards[1].suit;
    let score = high / 14;
    if (isPair) score += 0.3;
    if (isSuited) score += 0.1;
    return Math.min(score, 1);
  }
  const { score } = evaluateHand(holeCards, communityCards);
  const MAX_SCORE =
    9 * 1e8 +
    14 * Math.pow(15, 4) +
    13 * Math.pow(15, 3) +
    12 * Math.pow(15, 2) +
    11 * 15 +
    10;
  return Math.min(score / MAX_SCORE, 1);
}
