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
  CLOCKWISE,
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
  bbSeat: number;
  winners: Player[];
  log: string[];
  highScore: number;
  pendingBets: PendingBet[];
  actionsThisRound: number;
  raiseCount: number;
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

function nextActiveSeat(players: Player[], fromSeat: number): number {
  const pos = CLOCKWISE.indexOf(fromSeat);
  for (let i = 1; i <= CLOCKWISE.length; i++) {
    const seat = CLOCKWISE[(pos + i) % CLOCKWISE.length];
    const p = players[seat];
    if (p && !p.folded && !p.allIn && !p.eliminated) return seat;
  }
  return fromSeat;
}

function firstActiveSeatPostFlop(
  players: Player[],
  dealerSeat: number,
): number {
  const pos = CLOCKWISE.indexOf(dealerSeat);
  for (let i = 1; i <= CLOCKWISE.length; i++) {
    const seat = CLOCKWISE[(pos + i) % CLOCKWISE.length];
    const p = players[seat];
    if (p && !p.folded && !p.allIn && !p.eliminated) return seat;
  }
  return -1;
}

function isBettingRoundDone(
  players: Player[],
  actionsThisRound: number,
): boolean {
  const highBet = getHighBet(players);
  const canAct = players.filter((p) => !p.folded && !p.allIn && !p.eliminated);
  return (
    canAct.every((p) => p.currentBet === highBet) &&
    actionsThisRound >= canAct.length
  );
}

function everyoneAllIn(players: Player[]): boolean {
  const active = players.filter((p) => !p.folded && !p.eliminated);
  return active.length > 1 && active.every((p) => p.allIn);
}

function clearActions(players: Player[]): Player[] {
  return players.map((p) => ({ ...p, lastAction: null }));
}

function setAction(players: Player[], seat: number, action: string): Player[] {
  return players.map((p, i) => (i === seat ? { ...p, lastAction: action } : p));
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

  function scheduleBotAction(
    seat: number,
    actionsThisRound: number,
    raiseCount: number,
  ) {
    setTimeout(
      () => {
        const state = get();
        if (state.currentPlayerIndex !== seat) return;
        if (state.phase === "idle" || state.phase === "showdown") return;

        const bot = state.players[seat];
        if (!bot || bot.isUser || bot.folded || bot.allIn || bot.eliminated)
          return;

        const high = getHighBet(state.players);
        const isBigBlind = seat === state.bbSeat && state.phase === "preflop";
        const action = getBotAction(
          bot,
          state.communityCards,
          high,
          bot.archetype ?? "passive",
          raiseCount,
          isBigBlind,
        );

        let updatedPlayers = state.players;
        let newPot = state.pot;
        let msg = "";
        let newActions = actionsThisRound + 1;
        let newRaiseCount = raiseCount;

        if (action === "fold") {
          updatedPlayers = setAction(
            state.players.map((p, i) =>
              i === seat ? { ...foldPlayer(p), cards: [] } : p,
            ),
            seat,
            "fold",
          );
          msg = `${bot.name} folds`;
        } else if (action === "check") {
          updatedPlayers = setAction(state.players, seat, "check");
          msg = `${bot.name} checks`;
        } else if (action === "call") {
          const amount = Math.min(high - bot.currentBet, bot.balance);
          const updated = {
            ...bot,
            balance: bot.balance - amount,
            currentBet: bot.currentBet + amount,
            allIn: bot.balance - amount === 0,
          };
          updatedPlayers = setAction(
            state.players.map((p, i) => (i === seat ? updated : p)),
            seat,
            updated.allIn ? `all in $${amount}` : `call $${amount}`,
          );
          newPot += amount;
          flashBet(bot.id, amount);
          msg = `${bot.name} ${updated.allIn ? "all in" : "calls"} $${amount}`;
        } else {
          // raise
          const { player, amount } = raiseBy(bot, high, BIG_BLIND * 2);
          updatedPlayers = setAction(
            state.players.map((p, i) => (i === seat ? player : p)),
            seat,
            player.allIn ? `all in $${amount}` : `raise $${amount}`,
          );
          newPot += amount;
          flashBet(bot.id, amount);
          msg = `${bot.name} raises $${amount}`;
          newActions = 1;
          newRaiseCount = raiseCount + 1;
        }

        set((s) => ({
          players: updatedPlayers,
          pot: newPot,
          raiseCount: newRaiseCount,
          log: appendLog(s.log, msg),
        }));
        afterAction(
          updatedPlayers,
          seat,
          state.phase,
          state.communityCards,
          state.deck,
          newPot,
          newActions,
          newRaiseCount,
        );
      },
      700 + Math.random() * 500,
    );
  }

  function afterAction(
    players: Player[],
    actorSeat: number,
    phase: GamePhase,
    community: Card[],
    deck: Card[],
    pot: number,
    actionsThisRound: number,
    raiseCount: number,
  ) {
    if (onePlayerLeft(players)) {
      const winner = players.find((p) => !p.folded && !p.eliminated)!;
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

    if (everyoneAllIn(players)) {
      runOutBoard(players, phase, community, deck, pot);
      return;
    }

    if (isBettingRoundDone(players, actionsThisRound)) {
      set({ actionsThisRound });
      setTimeout(() => advancePhase(players, phase, community, deck, pot), 600);
      return;
    }

    const next = nextActiveSeat(players, actorSeat);
    set((s) => ({
      currentPlayerIndex: next,
      actionsThisRound,
      raiseCount,
      log: appendLog(s.log, `${players[next].name} to act`),
    }));
    if (!players[next].isUser)
      scheduleBotAction(next, actionsThisRound, raiseCount);
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
    const final = markEliminated(
      revealed.map((p) =>
        ws.some((w) => w.id === p.id)
          ? { ...p, balance: p.balance + share }
          : p,
      ),
    );
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
    const { dealerIndex } = get();
    const firstSeat = firstActiveSeatPostFlop(reset, dealerIndex);

    if (phase === "preflop") {
      const { cards, remaining } = dealFlop(deck);
      if (firstSeat === -1) {
        runOutBoard(reset, "flop", cards, remaining, pot);
        return;
      }
      set((s) => ({
        phase: "flop",
        communityCards: cards,
        deck: remaining,
        players: reset,
        currentPlayerIndex: firstSeat,
        actionsThisRound: 0,
        raiseCount: 0,
        log: appendLog(s.log, "--- Flop ---"),
      }));
      if (!reset[firstSeat].isUser) scheduleBotAction(firstSeat, 0, 0);
    } else if (phase === "flop") {
      const { card, remaining } = dealTurnOrRiver(deck);
      const newComm = [...community, card];
      if (firstSeat === -1) {
        runOutBoard(reset, "turn", newComm, remaining, pot);
        return;
      }
      set((s) => ({
        phase: "turn",
        communityCards: newComm,
        deck: remaining,
        players: reset,
        currentPlayerIndex: firstSeat,
        actionsThisRound: 0,
        raiseCount: 0,
        log: appendLog(s.log, "--- Turn ---"),
      }));
      if (!reset[firstSeat].isUser) scheduleBotAction(firstSeat, 0, 0);
    } else if (phase === "turn") {
      const { card, remaining } = dealTurnOrRiver(deck);
      const newComm = [...community, card];
      if (firstSeat === -1) {
        runOutBoard(reset, "river", newComm, remaining, pot);
        return;
      }
      set((s) => ({
        phase: "river",
        communityCards: newComm,
        deck: remaining,
        players: reset,
        currentPlayerIndex: firstSeat,
        actionsThisRound: 0,
        raiseCount: 0,
        log: appendLog(s.log, "--- River ---"),
      }));
      if (!reset[firstSeat].isUser) scheduleBotAction(firstSeat, 0, 0);
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
    dealerIndex: -1,
    bbSeat: -1,
    winners: [],
    log: [],
    highScore: loadHighScore(),
    pendingBets: [],
    actionsThisRound: 0,
    raiseCount: 0,

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
        dealerIndex: -1,
        bbSeat: -1,
        winners: [],
        log: [],
        pendingBets: [],
        actionsThisRound: 0,
        raiseCount: 0,
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

      const { players, deck, pot, dealerSeat, sbSeat, bbSeat, utgSeat } =
        setupNewHand(previousBalances, dealerIndex, previousEliminated);

      set({
        phase: "preflop",
        pot,
        deck,
        players,
        communityCards: [],
        currentPlayerIndex: utgSeat,
        dealerIndex: dealerSeat,
        bbSeat,
        winners: [],
        actionsThisRound: 0,
        raiseCount: 0,
        log: [
          `--- New Hand ---`,
          `${players[dealerSeat].name} is dealer`,
          `${players[sbSeat].name} posts small blind $${players[sbSeat].currentBet}`,
          `${players[bbSeat].name} posts big blind $${players[bbSeat].currentBet}`,
          `${players[utgSeat].name} to act`,
        ],
        pendingBets: [],
      });

      if (!players[utgSeat].isUser) scheduleBotAction(utgSeat, 0, 0);
    },

    fold: () => {
      const {
        players,
        currentPlayerIndex,
        phase,
        communityCards,
        deck,
        pot,
        actionsThisRound,
        raiseCount,
      } = get();
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
        actionsThisRound + 1,
        raiseCount,
      );
    },

    call: () => {
      const {
        players,
        currentPlayerIndex,
        phase,
        communityCards,
        deck,
        pot,
        actionsThisRound,
        raiseCount,
      } = get();
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
        actionsThisRound + 1,
        raiseCount,
      );
    },

    raise: (amount) => {
      const {
        players,
        currentPlayerIndex,
        phase,
        communityCards,
        deck,
        pot,
        raiseCount,
      } = get();
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
      const newRaiseCount = raiseCount + 1;
      flashBet(user.id, total);
      set((s) => ({
        players: updated,
        pot: newPot,
        currentPlayerIndex: -1,
        raiseCount: newRaiseCount,
        log: appendLog(s.log, `You raise $${raiseAmt}`),
      }));
      afterAction(
        updated,
        currentPlayerIndex,
        phase,
        communityCards,
        deck,
        newPot,
        1,
        newRaiseCount,
      );
    },

    check: () => {
      const {
        players,
        currentPlayerIndex,
        phase,
        communityCards,
        deck,
        pot,
        actionsThisRound,
        raiseCount,
      } = get();
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
        actionsThisRound + 1,
        raiseCount,
      );
    },
  };
});
