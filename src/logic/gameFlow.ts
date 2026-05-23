import type { Player, BotArchetype } from "../types/player";
import type { Card } from "../types/card";
import { createDeck, shuffleDeck, dealCards } from "./deck";
import { postBlinds, BIG_BLIND } from "./betting";
import { getHandStrength } from "./hand";

export function initializePlayers(previousBalances?: number[]): Player[] {
  return [
    {
      id: 0,
      name: "You",
      balance: previousBalances?.[0] ?? 1000,
      cards: [],
      currentBet: 0,
      folded: false,
      isUser: true,
      isDealer: false,
      allIn: false,
      archetype: undefined,
      lastAction: null,
    },
    {
      id: 1,
      name: "Jack",
      balance: previousBalances?.[1] ?? 1000,
      cards: [],
      currentBet: 0,
      folded: false,
      isUser: false,
      isDealer: false,
      allIn: false,
      archetype: "aggressive",
      lastAction: null,
    },
    {
      id: 2,
      name: "Utopia",
      balance: previousBalances?.[2] ?? 1000,
      cards: [],
      currentBet: 0,
      folded: false,
      isUser: false,
      isDealer: false,
      allIn: false,
      archetype: "passive",
      lastAction: null,
    },
    {
      id: 3,
      name: "Travis",
      balance: previousBalances?.[3] ?? 1000,
      cards: [],
      currentBet: 0,
      folded: false,
      isUser: false,
      isDealer: false,
      allIn: false,
      archetype: "adaptive",
      lastAction: null,
    },
    {
      id: 4,
      name: "LaFlame",
      balance: previousBalances?.[4] ?? 1000,
      cards: [],
      currentBet: 0,
      folded: false,
      isUser: false,
      isDealer: false,
      allIn: false,
      archetype: "aggressive",
      lastAction: null,
    },
    {
      id: 5,
      name: "Scott",
      balance: previousBalances?.[5] ?? 1000,
      cards: [],
      currentBet: 0,
      folded: false,
      isUser: false,
      isDealer: false,
      allIn: false,
      archetype: "passive",
      lastAction: null,
    },
  ];
}

export function setupNewHand(
  previousBalances: number[] | undefined,
  previousDealerIndex: number,
): {
  players: Player[];
  deck: Card[];
  pot: number;
  dealerIndex: number;
  firstToActIndex: number;
} {
  const deck = shuffleDeck(createDeck());
  let players = initializePlayers(previousBalances);

  const dealerIndex = (previousDealerIndex + 1) % players.length;
  players = players.map((p, i) => ({ ...p, isDealer: i === dealerIndex }));

  let remaining = deck;
  players = players.map((p) => {
    const { cards, remaining: rest } = dealCards(remaining, 2);
    remaining = rest;
    return { ...p, cards: cards.map((c) => ({ ...c, faceUp: p.isUser })) };
  });

  const { players: withBlinds, pot } = postBlinds(players, dealerIndex);
  const bbIdx = (dealerIndex + 2) % players.length;
  const firstToActIndex = (bbIdx + 1) % players.length;

  return {
    players: withBlinds,
    deck: remaining,
    pot,
    dealerIndex,
    firstToActIndex,
  };
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

    if (callAmount === 0) {
      if (strength > raiseThreshold) return "raise";
      return "check";
    }
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
      if (strength > callThreshold && rand < 0.45) return "raise"; // semi-bluff
      return "check";
    }
    if (strength > raiseThreshold) return rand < 0.6 ? "raise" : "call";
    if (strength > callThreshold) return "call";
    if (strength > foldThreshold && rand < 0.25) return "call"; // occasional float
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

export { BIG_BLIND };
