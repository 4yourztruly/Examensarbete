import { create } from "zustand";
import type { GamePhase } from "../types/game";
import type { Player } from "../types/player";
import type { Card } from "../types/card";
import {
  foldPlayer,
  callBet,
  raiseBy,
  resetBets,
  getHighBet,
  onePlayerLeft,
} from "../logic/betting";
import { evaluateHand, determineWinners } from "../logic/hand";
import {
  setupNewHand,
  dealFlop,
  dealTurnOrRiver,
  getBotAction,
  BIG_BLIND,
} from "../logic/gameFlow";

export interface PendingBet {
  playerId: number;
  amount: number;
}

interface GameStore {
  phase: GamePhase;
  pot: number;
  deck: Card[];
  communityCards: Card[];
  players: Player[];
  currentPlayerIndex: number;
  dealerIndex: number;
  winners: Player[];
  log: string[];
  highScore: number;
  pendingBets: PendingBet[];
  startGame: () => void;
  returnToMenu: () => void;
  fold: () => void;
  call: () => void;
  raise: (amount: number) => void;
  check: () => void;
}

function loadHighScore(): number {
  try {
    return Number(localStorage.getItem("poker_highscore") ?? 0);
  } catch {
    return 0;
  }
}
function saveHighScore(balance: number): number {
  try {
    const next = Math.max(loadHighScore(), balance);
    localStorage.setItem("poker_highscore", String(next));
    return next;
  } catch {
    return balance;
  }
}

function appendLog(log: string[], msg: string): string[] {
  return [...log.slice(-40), msg];
}

function nextActive(players: Player[], from: number): number {
  let idx = (from + 1) % players.length;
  let tries = 0;
  while (
    (players[idx].folded || players[idx].allIn || players[idx].eliminated) &&
    tries < players.length
  ) {
    idx = (idx + 1) % players.length;
    tries++;
  }
  return idx;
}

function bettingComplete(players: Player[]): boolean {
  const highBet = getHighBet(players);
  return players
    .filter((p) => !p.folded && !p.allIn && !p.eliminated)
    .every((p) => p.currentBet === highBet);
}

function everyoneAllIn(players: Player[]): boolean {
  const active = players.filter((p) => !p.folded && !p.eliminated);
  return active.length > 1 && active.every((p) => p.allIn);
}

function findFirstActive(players: Player[]): number {
  for (let i = 0; i < players.length; i++) {
    if (!players[i].folded && !players[i].allIn && !players[i].eliminated)
      return i;
  }
  return -1;
}

function clearActions(players: Player[]): Player[] {
  return players.map((p) => ({ ...p, lastAction: null }));
}

function setAction(players: Player[], idx: number, action: string): Player[] {
  return players.map((p, i) => (i === idx ? { ...p, lastAction: action } : p));
}

function markEliminated(players: Player[]): Player[] {
  return players.map((p) => ({
    ...p,
    eliminated: !p.isUser && p.balance <= 0,
  }));
}

export const useGameStore = create<GameStore>((set, get) => {
  function flashBet(playerId: number, amount: number) {
    if (amount <= 0) return;
    set((s) => ({ pendingBets: [...s.pendingBets, { playerId, amount }] }));
    setTimeout(() => {
      set((s) => ({
        pendingBets: s.pendingBets.filter((b) => b.playerId !== playerId),
      }));
    }, 900);
  }

  function scheduleBotAction(idx: number) {
    setTimeout(
      () => {
        const state = get();
        if (state.currentPlayerIndex !== idx) return;
        if (state.phase === "idle" || state.phase === "showdown") return;
        const bot = state.players[idx];
        if (!bot || bot.isUser || bot.folded || bot.allIn || bot.eliminated)
          return;

        const high = getHighBet(state.players);
        const callAmount = high - bot.currentBet;
        const action = getBotAction(
          bot,
          state.communityCards,
          high,
          bot.archetype ?? "passive",
        );

        let updatedPlayers = state.players;
        let newPot = state.pot;
        let msg = "";

        if (action === "fold") {
          updatedPlayers = setAction(
            state.players.map((p, i) =>
              i === idx ? { ...foldPlayer(p), cards: [] } : p,
            ),
            idx,
            "fold",
          );
          msg = `${bot.name} folds`;
        } else if (action === "check") {
          updatedPlayers = setAction(state.players, idx, "check");
          msg = `${bot.name} checks`;
        } else if (action === "call") {
          const amount = Math.min(callAmount, bot.balance);
          const updated = {
            ...bot,
            balance: bot.balance - amount,
            currentBet: bot.currentBet + amount,
            allIn: bot.balance - amount === 0,
          };
          updatedPlayers = setAction(
            state.players.map((p, i) => (i === idx ? updated : p)),
            idx,
            updated.allIn ? `all in $${amount}` : `call $${amount}`,
          );
          newPot += amount;
          flashBet(bot.id, amount);
          msg = `${bot.name} ${updated.allIn ? "all in" : "calls"} $${amount}`;
        } else {
          const { player, amount } = raiseBy(bot, high, BIG_BLIND * 2);
          updatedPlayers = setAction(
            state.players.map((p, i) => (i === idx ? player : p)),
            idx,
            player.allIn ? `all in $${amount}` : `raise $${amount}`,
          );
          newPot += amount;
          flashBet(bot.id, amount);
          msg = `${bot.name} raises $${amount}`;
        }

        set((s) => ({
          players: updatedPlayers,
          pot: newPot,
          log: appendLog(s.log, msg),
        }));
        afterAction(
          updatedPlayers,
          idx,
          state.phase,
          state.communityCards,
          state.deck,
          newPot,
        );
      },
      700 + Math.random() * 500,
    );
  }

  function afterAction(
    players: Player[],
    actorIdx: number,
    phase: GamePhase,
    community: Card[],
    deck: Card[],
    pot: number,
  ) {
    const activePlayers = players.filter((p) => !p.folded && !p.eliminated);

    if (activePlayers.filter((p) => !p.folded).length === 1) {
      const winner = activePlayers.find((p) => !p.folded)!;
      const updated = markEliminated(
        players.map((p) =>
          p.id === winner.id ? { ...p, balance: p.balance + pot } : p,
        ),
      );
      const hs = saveHighScore(updated.find((p) => p.isUser)?.balance ?? 0);
      set((s) => ({
        players: updated,
        pot: 0,
        winners: [winner],
        phase: "showdown",
        highScore: hs,
        currentPlayerIndex: -1,
        log: appendLog(s.log, `${winner.name} wins $${pot} — everyone folded`),
      }));
      return;
    }

    if (everyoneAllIn(players) || bettingComplete(players)) {
      const firstActive = findFirstActive(players);
      if (everyoneAllIn(players) || firstActive === -1) {
        runOutBoard(players, phase, community, deck, pot);
        return;
      }
      advancePhase(players, phase, community, deck, pot);
      return;
    }

    const next = nextActive(players, actorIdx);
    set((s) => ({
      currentPlayerIndex: next,
      log: appendLog(s.log, `${players[next].name} to act`),
    }));
    if (!players[next].isUser) scheduleBotAction(next);
  }

  function runOutBoard(
    players: Player[],
    phase: GamePhase,
    community: Card[],
    deck: Card[],
    pot: number,
  ) {
    const delay = 1200;
    if (phase === "preflop") {
      const { cards: flop, remaining: d1 } = dealFlop(deck);
      set((s) => ({
        communityCards: flop,
        deck: d1,
        phase: "flop",
        currentPlayerIndex: -1,
        log: appendLog(s.log, "--- Flop (all-in) ---"),
      }));
      setTimeout(() => {
        const { card: turn, remaining: d2 } = dealTurnOrRiver(d1);
        set((s) => ({
          communityCards: [...flop, turn],
          deck: d2,
          phase: "turn",
          log: appendLog(s.log, "--- Turn ---"),
        }));
        setTimeout(() => {
          const { card: river } = dealTurnOrRiver(d2);
          const finalComm = [...flop, turn, river];
          set((s) => ({
            communityCards: finalComm,
            phase: "river",
            log: appendLog(s.log, "--- River ---"),
          }));
          setTimeout(() => doShowdown(players, finalComm, pot), delay);
        }, delay);
      }, delay);
    } else if (phase === "flop") {
      const { card: turn, remaining: d1 } = dealTurnOrRiver(deck);
      set((s) => ({
        communityCards: [...community, turn],
        deck: d1,
        phase: "turn",
        currentPlayerIndex: -1,
        log: appendLog(s.log, "--- Turn (all-in) ---"),
      }));
      setTimeout(() => {
        const { card: river } = dealTurnOrRiver(d1);
        const finalComm = [...community, turn, river];
        set((s) => ({
          communityCards: finalComm,
          phase: "river",
          log: appendLog(s.log, "--- River ---"),
        }));
        setTimeout(() => doShowdown(players, finalComm, pot), delay);
      }, delay);
    } else if (phase === "turn") {
      const { card: river } = dealTurnOrRiver(deck);
      const finalComm = [...community, river];
      set((s) => ({
        communityCards: finalComm,
        phase: "river",
        currentPlayerIndex: -1,
        log: appendLog(s.log, "--- River (all-in) ---"),
      }));
      setTimeout(() => doShowdown(players, finalComm, pot), delay);
    } else {
      doShowdown(players, community, pot);
    }
  }

  function doShowdown(players: Player[], community: Card[], pot: number) {
    const revealed = players.map((p) => ({
      ...p,
      cards: p.cards.map((c) => ({ ...c, faceUp: true })),
      currentBet: 0,
    }));
    const ws = determineWinners(revealed, community);
    const share = Math.floor(pot / ws.length);
    const withWinnings = revealed.map((p) =>
      ws.some((w) => w.id === p.id) ? { ...p, balance: p.balance + share } : p,
    );
    const final = markEliminated(withWinnings);
    const hs = saveHighScore(final.find((p) => p.isUser)?.balance ?? 0);
    set((s) => {
      let newLog = s.log;
      ws.forEach((w) => {
        newLog = appendLog(
          newLog,
          `${w.name} wins $${share} with ${evaluateHand(w.cards, community).rank}`,
        );
      });
      return {
        phase: "showdown",
        players: final,
        winners: ws,
        pot: 0,
        highScore: hs,
        currentPlayerIndex: -1,
        log: newLog,
      };
    });
  }

  function advancePhase(
    players: Player[],
    phase: GamePhase,
    community: Card[],
    deck: Card[],
    pot: number,
  ) {
    const reset = clearActions(resetBets(players));
    if (phase === "preflop") {
      const { cards, remaining } = dealFlop(deck);
      const firstIdx = findFirstActive(reset);
      if (firstIdx === -1) {
        runOutBoard(reset, "flop", cards, remaining, pot);
        return;
      }
      set((s) => ({
        phase: "flop",
        communityCards: cards,
        deck: remaining,
        players: reset,
        currentPlayerIndex: firstIdx,
        log: appendLog(s.log, "--- Flop ---"),
      }));
      if (!reset[firstIdx].isUser) scheduleBotAction(firstIdx);
    } else if (phase === "flop") {
      const { card, remaining } = dealTurnOrRiver(deck);
      const newComm = [...community, card];
      const firstIdx = findFirstActive(reset);
      if (firstIdx === -1) {
        runOutBoard(reset, "turn", newComm, remaining, pot);
        return;
      }
      set((s) => ({
        phase: "turn",
        communityCards: newComm,
        deck: remaining,
        players: reset,
        currentPlayerIndex: firstIdx,
        log: appendLog(s.log, "--- Turn ---"),
      }));
      if (!reset[firstIdx].isUser) scheduleBotAction(firstIdx);
    } else if (phase === "turn") {
      const { card, remaining } = dealTurnOrRiver(deck);
      const newComm = [...community, card];
      const firstIdx = findFirstActive(reset);
      if (firstIdx === -1) {
        runOutBoard(reset, "river", newComm, remaining, pot);
        return;
      }
      set((s) => ({
        phase: "river",
        communityCards: newComm,
        deck: remaining,
        players: reset,
        currentPlayerIndex: firstIdx,
        log: appendLog(s.log, "--- River ---"),
      }));
      if (!reset[firstIdx].isUser) scheduleBotAction(firstIdx);
    } else if (phase === "river") {
      doShowdown(players, community, pot);
    }
  }

  return {
    phase: "idle",
    pot: 0,
    deck: [],
    communityCards: [],
    players: [],
    currentPlayerIndex: 0,
    dealerIndex: 0,
    winners: [],
    log: [],
    highScore: loadHighScore(),
    pendingBets: [],

    returnToMenu: () => {
      const { players: prev, highScore } = get();
      if (prev.length > 0) {
        const hs = saveHighScore(prev.find((p) => p.isUser)?.balance ?? 0);
        if (hs > highScore) set({ highScore: hs });
      }
      set({
        phase: "idle",
        pot: 0,
        deck: [],
        communityCards: [],
        players: [],
        currentPlayerIndex: 0,
        dealerIndex: 0,
        winners: [],
        log: [],
        pendingBets: [],
      });
    },

    startGame: () => {
      const { dealerIndex, players: prev, highScore } = get();
      if (prev.length > 0) {
        const hs = saveHighScore(prev.find((p) => p.isUser)?.balance ?? 0);
        if (hs > highScore) set({ highScore: hs });
      }
      const previousBalances =
        prev.length > 0 ? prev.map((p) => p.balance) : undefined;
      const previousEliminated =
        prev.length > 0 ? prev.map((p) => p.eliminated) : undefined;
      const {
        players,
        deck,
        pot,
        dealerIndex: newDealer,
        firstToActIndex,
      } = setupNewHand(previousBalances, dealerIndex, previousEliminated);
      set({
        phase: "preflop",
        pot,
        deck,
        players,
        communityCards: [],
        currentPlayerIndex: firstToActIndex,
        dealerIndex: newDealer,
        winners: [],
        log: [`--- New Hand ---`, `${players[newDealer].name} is dealer`],
        pendingBets: [],
      });
      if (!players[firstToActIndex].isUser) scheduleBotAction(firstToActIndex);
    },

    fold: () => {
      const { players, currentPlayerIndex, phase, communityCards, deck, pot } =
        get();
      const updated = setAction(
        players.map((p, i) =>
          i === currentPlayerIndex ? { ...foldPlayer(p), cards: [] } : p,
        ),
        currentPlayerIndex,
        "fold",
      );
      set((s) => ({
        players: updated,
        currentPlayerIndex: -1,
        log: appendLog(s.log, "You fold"),
      }));
      afterAction(
        updated,
        currentPlayerIndex,
        phase,
        communityCards,
        deck,
        pot,
      );
    },

    call: () => {
      const { players, currentPlayerIndex, phase, communityCards, deck, pot } =
        get();
      const user = players[currentPlayerIndex];
      if (user.balance === 0) return;
      const high = getHighBet(players);
      const amount = Math.min(high - user.currentBet, user.balance);
      const updated_player = {
        ...user,
        balance: user.balance - amount,
        currentBet: user.currentBet + amount,
        allIn: user.balance - amount === 0,
      };
      const label = updated_player.allIn
        ? `all in $${amount}`
        : `call $${amount}`;
      const updated = setAction(
        players.map((p, i) => (i === currentPlayerIndex ? updated_player : p)),
        currentPlayerIndex,
        label,
      );
      const newPot = pot + amount;
      flashBet(user.id, amount);
      set((s) => ({
        players: updated,
        pot: newPot,
        currentPlayerIndex: -1,
        log: appendLog(s.log, `You call $${amount}`),
      }));
      afterAction(
        updated,
        currentPlayerIndex,
        phase,
        communityCards,
        deck,
        newPot,
      );
    },

    raise: (amount) => {
      const { players, currentPlayerIndex, phase, communityCards, deck, pot } =
        get();
      const user = players[currentPlayerIndex];
      if (user.balance === 0 || amount <= 0) return;
      const high = getHighBet(players);
      const callAmt = Math.min(high - user.currentBet, user.balance);
      const raiseAmt = Math.min(amount, user.balance - callAmt);
      const total = callAmt + raiseAmt;
      const updated_player = {
        ...user,
        balance: user.balance - total,
        currentBet: user.currentBet + total,
        allIn: user.balance - total === 0,
      };
      const label = updated_player.allIn
        ? `all in $${total}`
        : `raise $${raiseAmt}`;
      const updated = setAction(
        players.map((p, i) => (i === currentPlayerIndex ? updated_player : p)),
        currentPlayerIndex,
        label,
      );
      const newPot = pot + total;
      flashBet(user.id, total);
      set((s) => ({
        players: updated,
        pot: newPot,
        currentPlayerIndex: -1,
        log: appendLog(s.log, `You raise $${raiseAmt}`),
      }));
      afterAction(
        updated,
        currentPlayerIndex,
        phase,
        communityCards,
        deck,
        newPot,
      );
    },

    check: () => {
      const { players, currentPlayerIndex, phase, communityCards, deck, pot } =
        get();
      const updated = setAction(players, currentPlayerIndex, "check");
      set((s) => ({
        players: updated,
        currentPlayerIndex: -1,
        log: appendLog(s.log, "You check"),
      }));
      afterAction(
        updated,
        currentPlayerIndex,
        phase,
        communityCards,
        deck,
        pot,
      );
    },
  };
});
