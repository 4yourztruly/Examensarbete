import type { Player, BotArchetype } from "../types/player";
import type { Card } from "../types/card";
import { createDeck, shuffleDeck, dealCards } from "./deck";
import { BIG_BLIND } from "./betting";
import { getHandStrength } from "./hand";

export { BIG_BLIND };
export const SMALL_BLIND = BIG_BLIND / 2; // 25

export const CLOCKWISE: number[] = [0, 1, 3, 5, 4, 2];

function nextClockwise(seatId: number, players: Player[]): number {
  const pos = CLOCKWISE.indexOf(seatId);
  for (let i = 1; i <= CLOCKWISE.length; i++) {
    const next = CLOCKWISE[(pos + i) % CLOCKWISE.length];
    const p = players[next];
    if (p && !p.eliminated && !p.folded && !p.allIn) return next;
  }
  return seatId;
}

function nextClockwiseActive(seatId: number, players: Player[]): number {
  const pos = CLOCKWISE.indexOf(seatId);
  for (let i = 1; i <= CLOCKWISE.length; i++) {
    const next = CLOCKWISE[(pos + i) % CLOCKWISE.length];
    if (players[next] && !players[next].eliminated) return next;
  }
  return seatId;
}

export { nextClockwise };

export function initializePlayers(
  previousBalances?: number[],
  previousEliminated?: boolean[],
): Player[] {
  return [
    {
      id: 0,
      name: "You",
      isUser: true,
      archetype: undefined,
      eliminated: previousEliminated?.[0] ?? false,
      balance: previousBalances?.[0] ?? 1000,
      cards: [],
      currentBet: 0,
      folded: false,
      isDealer: false,
      allIn: false,
      lastAction: null,
    },
    {
      id: 1,
      name: "Utopia",
      isUser: false,
      archetype: "aggressive" as BotArchetype,
      eliminated: previousEliminated?.[1] ?? false,
      balance: previousBalances?.[1] ?? 1000,
      cards: [],
      currentBet: 0,
      folded: false,
      isDealer: false,
      allIn: false,
      lastAction: null,
    },
    {
      id: 2,
      name: "Jack",
      isUser: false,
      archetype: "passive" as BotArchetype,
      eliminated: previousEliminated?.[2] ?? false,
      balance: previousBalances?.[2] ?? 1000,
      cards: [],
      currentBet: 0,
      folded: false,
      isDealer: false,
      allIn: false,
      lastAction: null,
    },
    {
      id: 3,
      name: "Travis",
      isUser: false,
      archetype: "adaptive" as BotArchetype,
      eliminated: previousEliminated?.[3] ?? false,
      balance: previousBalances?.[3] ?? 1000,
      cards: [],
      currentBet: 0,
      folded: false,
      isDealer: false,
      allIn: false,
      lastAction: null,
    },
    {
      id: 4,
      name: "LaFlame",
      isUser: false,
      archetype: "aggressive" as BotArchetype,
      eliminated: previousEliminated?.[4] ?? false,
      balance: previousBalances?.[4] ?? 1000,
      cards: [],
      currentBet: 0,
      folded: false,
      isDealer: false,
      allIn: false,
      lastAction: null,
    },
    {
      id: 5,
      name: "Scott",
      isUser: false,
      archetype: "passive" as BotArchetype,
      eliminated: previousEliminated?.[5] ?? false,
      balance: previousBalances?.[5] ?? 1000,
      cards: [],
      currentBet: 0,
      folded: false,
      isDealer: false,
      allIn: false,
      lastAction: null,
    },
  ];
}

export function setupNewHand(
  previousBalances: number[] | undefined,
  previousDealerSeat: number,
  previousEliminated?: boolean[],
): {
  players: Player[];
  deck: Card[];
  pot: number;
  dealerSeat: number;
  sbSeat: number;
  bbSeat: number;
  utgSeat: number;
} {
  const deck = shuffleDeck(createDeck());
  let players = initializePlayers(previousBalances, previousEliminated);

  players = players.map((p) => ({
    ...p,
    eliminated: !p.isUser && p.balance <= 0,
  }));

  const prevPos =
    previousDealerSeat === -1
      ? CLOCKWISE.length - 1
      : CLOCKWISE.indexOf(previousDealerSeat);
  let dealerSeat = -1;
  for (let i = 1; i <= CLOCKWISE.length; i++) {
    const seat = CLOCKWISE[(prevPos + i) % CLOCKWISE.length];
    if (!players[seat].eliminated) {
      dealerSeat = seat;
      break;
    }
  }
  if (dealerSeat === -1) dealerSeat = 0;

  const sbSeat = nextClockwiseActive(dealerSeat, players);

  const bbSeat = nextClockwiseActive(sbSeat, players);

  const utgSeat = nextClockwiseActive(bbSeat, players);

  players = players.map((p, i) => ({ ...p, isDealer: i === dealerSeat }));

  let remaining = deck;
  const dealOrder = [...CLOCKWISE, ...CLOCKWISE]; // double for wrap-around
  const startDealPos = CLOCKWISE.indexOf(utgSeat);
  const dealSeats: number[] = [];
  for (let i = 0; i < CLOCKWISE.length; i++) {
    const seat = CLOCKWISE[(startDealPos + i) % CLOCKWISE.length];
    if (!players[seat].eliminated) dealSeats.push(seat);
  }
  for (const seat of dealSeats) {
    const { cards, remaining: rest } = dealCards(remaining, 2);
    remaining = rest;
    players = players.map((p, i) =>
      i === seat
        ? { ...p, cards: cards.map((c) => ({ ...c, faceUp: p.isUser })) }
        : p,
    );
  }

  let pot = 0;
  players = players.map((p, i) => {
    if (i === sbSeat) {
      const amount = Math.min(SMALL_BLIND, p.balance);
      pot += amount;
      return {
        ...p,
        balance: p.balance - amount,
        currentBet: amount,
        lastAction: `blind $${amount}`,
      };
    }
    if (i === bbSeat) {
      const amount = Math.min(BIG_BLIND, p.balance);
      pot += amount;
      return {
        ...p,
        balance: p.balance - amount,
        currentBet: amount,
        lastAction: `blind $${amount}`,
      };
    }
    return p;
  });

  return { players, deck: remaining, pot, dealerSeat, sbSeat, bbSeat, utgSeat };
}

export function dealFlop(deck: Card[]): { cards: Card[]; remaining: Card[] } {
  const { cards, remaining } = dealCards(deck, 3);
  return { cards: cards.map((c) => ({ ...c, faceUp: true })), remaining };
}

export function dealTurnOrRiver(deck: Card[]): {
  card: Card;
  remaining: Card[];
} {
  const { cards, remaining } = dealCards(deck, 1);
  return { card: { ...cards[0], faceUp: true }, remaining };
}

export function getBotAction(
  bot: Player,
  communityCards: Card[],
  highBet: number,
  archetype: BotArchetype,
): "fold" | "check" | "call" | "raise" {
  const strength = getHandStrength(bot.cards, communityCards);
  const callAmount = highBet - bot.currentBet;
  const isPreflop = communityCards.length === 0;
  const rand = Math.random();

  if (archetype === "passive") {
    const raiseThreshold = isPreflop ? 0.93 : 0.9;
    const callThreshold = isPreflop ? 0.88 : 0.83;
    if (callAmount === 0) return strength > raiseThreshold ? "raise" : "check";
    if (strength > raiseThreshold) return rand < 0.6 ? "raise" : "call";
    if (strength > callThreshold) return "call";
    return "fold";
  }

  if (archetype === "aggressive") {
    const raiseThreshold = isPreflop ? 0.6 : 0.55;
    const callThreshold = isPreflop ? 0.48 : 0.4;
    const foldThreshold = isPreflop ? 0.35 : 0.25;
    if (callAmount === 0) {
      if (strength > raiseThreshold) return "raise";
      if (strength > callThreshold && rand < 0.45) return "raise";
      return "check";
    }
    if (strength > raiseThreshold) return rand < 0.6 ? "raise" : "call";
    if (strength > callThreshold) return "call";
    if (strength > foldThreshold && rand < 0.25) return "call";
    return "fold";
  }

  if (archetype === "adaptive") {
    const raiseThreshold = isPreflop ? 0.72 : 0.67;
    const callThreshold = isPreflop ? 0.55 : 0.45;
    const foldThreshold = isPreflop ? 0.4 : 0.3;
    const isBluffing = rand < 0.12;
    const isSlowPlaying = rand < 0.12;
    if (callAmount === 0) {
      if (strength > raiseThreshold) return isSlowPlaying ? "check" : "raise";
      if (strength > callThreshold && rand < 0.4) return "raise";
      if (isBluffing && rand < 0.5) return "raise";
      return "check";
    }
    if (strength > raiseThreshold) return isSlowPlaying ? "call" : "raise";
    if (strength > callThreshold) return rand < 0.35 ? "raise" : "call";
    if (strength > foldThreshold) return rand < 0.25 ? "call" : "fold";
    return isBluffing ? "call" : "fold";
  }

  return "fold";
}
