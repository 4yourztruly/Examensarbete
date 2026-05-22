import type { Player, BotArchetype } from "../types/player";
import type { Card } from "../types/card";
import type { GamePhase } from "../types/game";
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
    },
    {
      id: 2,
      name: "Travis",
      balance: previousBalances?.[2] ?? 1000,
      cards: [],
      currentBet: 0,
      folded: false,
      isUser: false,
      isDealer: false,
      allIn: false,
      archetype: "passive",
    },
    {
      id: 3,
      name: "Laflame",
      balance: previousBalances?.[3] ?? 1000,
      cards: [],
      currentBet: 0,
      folded: false,
      isUser: false,
      isDealer: false,
      allIn: false,
      archetype: "adaptive",
    },
    {
      id: 4,
      name: "Don",
      balance: previousBalances?.[4] ?? 1000,
      cards: [],
      currentBet: 0,
      folded: false,
      isUser: false,
      isDealer: false,
      allIn: false,
      archetype: "aggressive",
    },
    {
      id: 5,
      name: "Toliver",
      balance: previousBalances?.[5] ?? 1000,
      cards: [],
      currentBet: 0,
      folded: false,
      isUser: false,
      isDealer: false,
      allIn: false,
      archetype: "passive",
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

export function getNextPhase(current: GamePhase): GamePhase {
  const order: GamePhase[] = ["preflop", "flop", "turn", "river", "showdown"];
  return order[order.indexOf(current) + 1] ?? "showdown";
}

export function getBotAction(
  bot: Player,
  communityCards: Card[],
  highBet: number,
  archetype: BotArchetype,
): "fold" | "check" | "call" | "raise" {
  const strength = getHandStrength(bot.cards, communityCards);
  const callAmount = highBet - bot.currentBet;
  const rand = Math.random();

  if (archetype === "passive") {
    if (callAmount === 0) {
      return strength > 0.6 ? "raise" : "check";
    }
    if (strength > 0.75) return rand < 0.7 ? "raise" : "call";
    if (strength > 0.5) return "call";
    return "fold";
  }

  if (archetype === "aggressive") {
    if (callAmount === 0) {
      return strength > 0.3 ? "raise" : "check";
    }
    if (strength > 0.5) return "raise";
    if (strength > 0.25) return rand < 0.5 ? "call" : "raise"; // semi-bluff
    return rand < 0.35 ? "fold" : "call"; // rarely folds
  }

  if (archetype === "adaptive") {
    const isDeceiving = rand < 0.25; // 25% chance to do the opposite of expected

    if (callAmount === 0) {
      if (isDeceiving) return strength > 0.5 ? "check" : "raise"; // slow play or bluff
      return strength > 0.5 ? "raise" : "check";
    }
    if (isDeceiving) {
      if (strength > 0.65) return "call"; // slow play strong hand
      return rand < 0.5 ? "raise" : "call"; // bluff with weak hand
    }
    if (strength > 0.65) return "raise";
    if (strength > 0.4) return "call";
    return rand < 0.3 ? "fold" : "call";
  }

  return "call";
}

export { BIG_BLIND };
