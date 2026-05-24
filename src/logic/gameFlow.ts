import type { Player, BotArchetype } from "../types/player";
import type { Card } from "../types/card";
import { createDeck, shuffleDeck, dealCards } from "./deck";
import { postBlinds, BIG_BLIND } from "./betting";
import { getHandStrength } from "./hand";

export function initializePlayers(
  previousBalances?: number[],
  previousEliminated?: boolean[],
): Player[] {
  const base = [
    {
      id: 0,
      name: "You",
      isUser: true,
      archetype: undefined,
      eliminated: false,
    },
    {
      id: 1,
      name: "Jack",
      isUser: false,
      archetype: "aggressive" as BotArchetype,
      eliminated: false,
    },
    {
      id: 2,
      name: "Utopia",
      isUser: false,
      archetype: "passive" as BotArchetype,
      eliminated: false,
    },
    {
      id: 3,
      name: "Travis",
      isUser: false,
      archetype: "adaptive" as BotArchetype,
      eliminated: false,
    },
    {
      id: 4,
      name: "LaFlame",
      isUser: false,
      archetype: "aggressive" as BotArchetype,
      eliminated: false,
    },
    {
      id: 5,
      name: "Scott",
      isUser: false,
      archetype: "passive" as BotArchetype,
      eliminated: false,
    },
  ];
  return base.map((b, i) => ({
    ...b,
    balance: previousBalances?.[i] ?? 1000,
    eliminated: previousEliminated?.[i] ?? false,
    cards: [],
    currentBet: 0,
    folded: false,
    isDealer: false,
    allIn: false,
    lastAction: null,
  }));
}

export function setupNewHand(
  previousBalances: number[] | undefined,
  previousDealerIndex: number,
  previousEliminated?: boolean[],
): {
  players: Player[];
  deck: Card[];
  pot: number;
  dealerIndex: number;
  firstToActIndex: number;
} {
  const deck = shuffleDeck(createDeck());
  let players = initializePlayers(previousBalances, previousEliminated);

  players = players.map((p) => ({
    ...p,
    eliminated: !p.isUser && p.balance <= 0,
  }));

  let dealerIndex = (previousDealerIndex + 1) % players.length;
  let tries = 0;
  while (players[dealerIndex].eliminated && tries < players.length) {
    dealerIndex = (dealerIndex + 1) % players.length;
    tries++;
  }
  players = players.map((p, i) => ({ ...p, isDealer: i === dealerIndex }));

  let remaining = deck;
  players = players.map((p) => {
    if (p.eliminated) return p;
    const { cards, remaining: rest } = dealCards(remaining, 2);
    remaining = rest;
    return { ...p, cards: cards.map((c) => ({ ...c, faceUp: p.isUser })) };
  });

  const activePlayers = players.filter((p) => !p.eliminated);
  const dealerActiveIdx = activePlayers.findIndex(
    (p) => p.id === players[dealerIndex].id,
  );
  const sbActive = activePlayers[(dealerActiveIdx + 1) % activePlayers.length];
  const bbActive = activePlayers[(dealerActiveIdx + 2) % activePlayers.length];

  let pot = 0;
  players = players.map((p) => {
    if (p.id === sbActive.id) {
      const blind = Math.min(BIG_BLIND / 2, p.balance);
      pot += blind;
      return { ...p, balance: p.balance - blind, currentBet: blind };
    }
    if (p.id === bbActive.id) {
      const blind = Math.min(BIG_BLIND, p.balance);
      pot += blind;
      return { ...p, balance: p.balance - blind, currentBet: blind };
    }
    return p;
  });

  const bbPlayerIdx = players.findIndex((p) => p.id === bbActive.id);
  let firstToActIndex = (bbPlayerIdx + 1) % players.length;
  tries = 0;
  while (players[firstToActIndex].eliminated && tries < players.length) {
    firstToActIndex = (firstToActIndex + 1) % players.length;
    tries++;
  }

  return { players, deck: remaining, pot, dealerIndex, firstToActIndex };
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

export { BIG_BLIND };
