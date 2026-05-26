import type { Player, BotArchetype } from "../types/player";
import type { Card } from "../types/card";
import { createDeck, shuffleDeck, dealCards } from "./deck";
import { BIG_BLIND } from "./betting";
import { getHandStrength } from "./hand";

export { BIG_BLIND };
export const SMALL_BLIND = BIG_BLIND / 2;

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
      balance: previousBalances?.[0] ?? 10000,
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
      balance: previousBalances?.[1] ?? 10000,
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
      balance: previousBalances?.[2] ?? 10000,
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
      balance: previousBalances?.[3] ?? 10000,
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
      balance: previousBalances?.[4] ?? 10000,
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
      balance: previousBalances?.[5] ?? 10000,
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
  raiseCount: number,
  isBigBlind: boolean,
): "fold" | "check" | "call" | "raise" {
  const strength = getHandStrength(bot.cards, communityCards);
  const callAmount = highBet - bot.currentBet;
  const isPreflop = communityCards.length === 0;
  const rand = Math.random();
  const facingReraise = raiseCount >= 2;
  const facingReReRaise = raiseCount >= 3;

  if (isPreflop) {
    if (facingReReRaise) {
      if (strength >= 1.0) return rand < 0.7 ? "raise" : "call";
      if (strength >= 0.94) return rand < 0.15 ? "call" : "fold";
      return "fold";
    }

    if (facingReraise) {
      if (strength >= 1.0) return rand < 0.6 ? "raise" : "call";
      if (strength >= 0.94) return rand < 0.25 ? "call" : "fold";
      return "fold";
    }

    if (archetype === "passive") {
      if (isBigBlind && callAmount === 0) {
        return strength >= 1.0 ? "raise" : "check";
      }
      if (callAmount === 0) {
        return strength >= 1.0 ? (rand < 0.5 ? "raise" : "check") : "check";
      }
      if (strength >= 1.0) return rand < 0.35 ? "raise" : "call";
      if (strength >= 0.86) return "call";
      return "fold";
    }

    if (archetype === "aggressive") {
      if (isBigBlind && callAmount === 0) {
        return strength >= 0.94 ? "raise" : "check";
      }
      if (callAmount === 0) {
        if (strength >= 0.94) return rand < 0.65 ? "raise" : "check";
        return "check";
      }
      if (strength >= 1.0) return rand < 0.55 ? "raise" : "call";
      if (strength >= 0.94) return rand < 0.3 ? "raise" : "call";
      if (strength >= 0.79) return "call";
      if (strength >= 0.65) return rand < 0.25 ? "call" : "fold";
      return "fold";
    }

    if (archetype === "adaptive") {
      const bluff = rand < 0.08;
      if (isBigBlind && callAmount === 0) {
        if (strength >= 1.0) return rand < 0.45 ? "raise" : "check";
        if (strength >= 0.94 && rand < 0.4) return "raise";
        return "check";
      }
      if (callAmount === 0) {
        if (strength >= 1.0) return rand < 0.55 ? "raise" : "check";
        if (strength >= 0.86 && rand < 0.3) return "raise";
        if (bluff) return "raise";
        return "check";
      }
      if (strength >= 1.0) return rand < 0.5 ? "raise" : "call";
      if (strength >= 0.94) return rand < 0.35 ? "raise" : "call";
      if (strength >= 0.79) return rand < 0.15 ? "raise" : "call";
      if (strength >= 0.65) return rand < 0.2 ? "call" : "fold";
      return bluff ? "call" : "fold";
    }
  } else {
    if (facingReReRaise) {
      if (strength >= 0.56) return rand < 0.6 ? "call" : "raise";
      if (strength >= 0.44) return rand < 0.3 ? "call" : "fold";
      return "fold";
    }
    if (facingReraise) {
      if (strength >= 0.44) return rand < 0.55 ? "call" : "raise";
      if (strength >= 0.33) return rand < 0.35 ? "call" : "fold";
      return "fold";
    }

    if (archetype === "passive") {
      if (callAmount === 0) {
        if (strength >= 0.33) return rand < 0.55 ? "raise" : "check";
        if (strength >= 0.22) return rand < 0.3 ? "raise" : "check";
        return "check";
      }
      if (strength >= 0.33) return rand < 0.35 ? "raise" : "call";
      if (strength >= 0.11) return "call";
      return rand < 0.15 ? "call" : "fold";
    }

    if (archetype === "aggressive") {
      if (callAmount === 0) {
        if (strength >= 0.22) return rand < 0.8 ? "raise" : "check";
        if (strength >= 0.11) return rand < 0.55 ? "raise" : "check";
        return rand < 0.25 ? "raise" : "check";
      }
      if (strength >= 0.22) return rand < 0.5 ? "raise" : "call";
      if (strength >= 0.11) return rand < 0.2 ? "raise" : "call";
      return rand < 0.2 ? "call" : "fold";
    }

    if (archetype === "adaptive") {
      const bluff = rand < 0.12;
      const slowPlay = strength >= 0.67 && rand < 0.15;
      if (callAmount === 0) {
        if (slowPlay) return "check";
        if (strength >= 0.33) return rand < 0.7 ? "raise" : "check";
        if (strength >= 0.22) return rand < 0.5 ? "raise" : "check";
        if (strength >= 0.11) return rand < 0.3 ? "raise" : "check";
        return bluff ? "raise" : "check";
      }
      if (strength >= 0.33) return rand < 0.45 ? "raise" : "call";
      if (strength >= 0.22) return rand < 0.25 ? "raise" : "call";
      if (strength >= 0.11) return rand < 0.15 ? "raise" : "call";
      return bluff ? "call" : "fold";
    }
  }

  return "fold";
}
