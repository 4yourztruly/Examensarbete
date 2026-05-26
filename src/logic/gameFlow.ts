import type { Player, BotArchetype } from "../types/player";
import type { Card } from "../types/card";
import { createDeck, shuffleDeck, dealCards } from "./deck";
import { BIG_BLIND } from "./betting";
import { getHandStrength } from "./hand";

export { BIG_BLIND };
export const SMALL_BLIND = BIG_BLIND / 2;

export const CLOCKWISE: number[] = [0, 1, 3, 5, 4, 2];

function nextClockwiseActive(seatId: number, players: Player[]): number {
  const pos = CLOCKWISE.indexOf(seatId);
  for (let i = 1; i <= CLOCKWISE.length; i++) {
    const next = CLOCKWISE[(pos + i) % CLOCKWISE.length];
    if (players[next] && !players[next].eliminated) return next;
  }
  return seatId;
}

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
      name: "Jack",
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
      name: "Utopia",
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
      name: "LaFlame",
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
      name: "Travis",
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
  const startPos = CLOCKWISE.indexOf(utgSeat);
  const dealSeats: number[] = [];
  for (let i = 0; i < CLOCKWISE.length; i++) {
    const seat = CLOCKWISE[(startPos + i) % CLOCKWISE.length];
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
  raiseCount: number = 0,
  isBigBlind: boolean = false,
): "fold" | "check" | "call" | "raise" {
  const strength = getHandStrength(bot.cards, communityCards);
  const callAmount = highBet - bot.currentBet;
  const isPreflop = communityCards.length === 0;
  const rand = Math.random();
  const facingRaise = callAmount > 0;
  const raisedHeavily = raiseCount >= 2;
  const preflopCallPressure = isPreflop
    ? callAmount / Math.max(bot.balance + callAmount, 1)
    : 0;

  if (isBigBlind && !facingRaise) {
    if (strength > 0.68 || rand < 0.12) return "raise";
    return "check";
  }

  if (archetype === "passive") {
    const pressurePenalty = preflopCallPressure * 0.24 + raiseCount * 0.035;
    const raiseThreshold = (isPreflop ? 0.7 : 0.52) + pressurePenalty;
    const callThreshold = (isPreflop ? 0.5 : 0.34) + pressurePenalty;
    if (!facingRaise) {
      if (strength > raiseThreshold && rand < (isPreflop ? 0.55 : 0.72))
        return "raise";
      if (!isPreflop && strength > callThreshold && rand < 0.38) return "raise";
      return "check";
    }
    if (raisedHeavily) {
      if (strength > raiseThreshold) return rand < 0.15 ? "raise" : "call";
      return "fold";
    }
    if (strength > raiseThreshold && rand < 0.42) return "raise";
    if (strength > callThreshold) return "call";
    if (!isPreflop && strength > 0.24 && rand < 0.22) return "call";
    return "fold";
  }

  if (archetype === "aggressive") {
    const pressurePenalty = preflopCallPressure * 0.08 + raiseCount * 0.015;
    const raiseThreshold = (isPreflop ? 0.46 : 0.3) + pressurePenalty;
    const callThreshold = (isPreflop ? 0.28 : 0.18) + pressurePenalty;
    if (!facingRaise) {
      if (strength > raiseThreshold)
        return rand < (isPreflop ? 0.86 : 0.94) ? "raise" : "call";
      if (strength > callThreshold)
        return rand < (isPreflop ? 0.62 : 0.8) ? "raise" : "check";
      if (!isPreflop && strength > 0.12 && rand < 0.44) return "raise";
      return rand < (isPreflop ? 0.22 : 0.34) ? "raise" : "check";
    }
    if (raisedHeavily) {
      if (strength > raiseThreshold) return rand < 0.68 ? "raise" : "call";
      if (strength > callThreshold) return rand < 0.18 ? "raise" : "call";
      return "fold";
    }
    if (strength > raiseThreshold && rand < 0.62) return "raise";
    if (strength > callThreshold) return "call";
    if (strength > 0.22 && rand < 0.34) return "call";
    return "fold";
  }

  if (archetype === "adaptive") {
    const pressurePenalty =
      preflopCallPressure * (rand < 0.25 ? 0.08 : 0.18) + raiseCount * 0.03;
    const raiseThreshold = (isPreflop ? 0.52 : 0.34) + pressurePenalty;
    const callThreshold = (isPreflop ? 0.32 : 0.22) + pressurePenalty;
    const isBluffing = rand < (isPreflop ? 0.24 : 0.38);
    const isSlowPlaying = rand < (isPreflop ? 0.07 : 0.04);
    if (!facingRaise) {
      if (strength > raiseThreshold) return isSlowPlaying ? "check" : "raise";
      if (strength > callThreshold)
        return rand < (isPreflop ? 0.52 : 0.68) ? "raise" : "check";
      if (isBluffing) return "raise";
      return "check";
    }
    if (raisedHeavily) {
      if (strength > raiseThreshold) return rand < 0.55 ? "raise" : "call";
      if (strength > callThreshold) return rand < 0.12 ? "raise" : "call";
      return "fold";
    }
    if (strength > raiseThreshold && !isSlowPlaying && rand < 0.56)
      return "raise";
    if (strength > callThreshold) return "call";
    if (strength > 0.24 && rand < 0.36) return "call";
    return isBluffing ? "call" : "fold";
  }

  return "fold";
}
