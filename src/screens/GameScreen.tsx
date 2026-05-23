import { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { getHighBet } from "../logic/betting";
import { evaluateHand } from "../logic/hand";
import PlayerSeat from "../components/PlayerSeat";
import Card from "../components/Card";
import Chip, { breakIntoChips } from "../components/Chips";

const SEATS = [
  { id: 0, className: "bottom-0 left-1/2 -translate-x-1/2 translate-y-full" },
  { id: 1, className: "bottom-6 left-6 translate-y-1/4 -translate-x-1/4" },
  { id: 2, className: "bottom-6 right-6 translate-y-1/4 translate-x-1/4" },
  { id: 3, className: "top-6 left-6 -translate-y-1/4 -translate-x-1/4" },
  { id: 4, className: "top-6 right-6 -translate-y-1/4 translate-x-1/4" },
  { id: 5, className: "top-0 left-1/2 -translate-x-1/2 -translate-y-full" },
];

const ARCHETYPE_COLORS: Record<string, string> = {
  aggressive: "#ef4444",
  passive: "#22c55e",
  adaptive: "#a855f7",
};

export default function GameScreen() {
  const {
    players,
    communityCards,
    pot,
    phase,
    currentPlayerIndex,
    winners,
    log,
    fold,
    call,
    raise,
    check,
    startGame,
  } = useGameStore();

  const [raiseAmount, setRaiseAmount] = useState(100);

  const user = players[0];
  const highBet = players.length > 0 ? getHighBet(players) : 0;
  const callAmount = user
    ? Math.min(highBet - user.currentBet, user.balance)
    : 0;
  const canCheck = callAmount === 0;
  const isUserTurn =
    phase !== "showdown" &&
    phase !== "idle" &&
    currentPlayerIndex === 0 &&
    !user?.folded &&
    !user?.allIn;

  const userHand =
    user?.cards.length === 2 && communityCards.length > 0
      ? evaluateHand(user.cards, communityCards).rank
      : "";

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{
        background:
          "radial-gradient(ellipse at center, #0f4c2a 0%, #052e16 60%, #020f0a 100%)",
      }}
    >
      <div
        className="mt-52 relative flex items-center justify-center"
        style={{
          width: "700px",
          height: "380px",
          borderRadius: "50%",
          background: "#5a3e2b",
          boxShadow: "0 0 0 6px #3b2410, 0 16px 48px rgba(0,0,0,0.8)",
        }}
      >
        <div
          className="relative flex flex-col items-center justify-center gap-2"
          style={{
            width: "640px",
            height: "320px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, #2d6a4f, #1b4332)",
            boxShadow: "inset 0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          {pot > 0 && (
            <div className="flex items-center gap-3">
              <Chip variant="pile" chips={breakIntoChips(pot)} />
              <div className="flex flex-col items-center">
                <span className="text-yellow-400 font-black text-sm tracking-wider">
                  POT
                </span>
                <span className="text-white font-bold text-lg">${pot}</span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((i) =>
              communityCards[i] ? (
                <Card
                  key={i}
                  suit={communityCards[i].suit}
                  rank={communityCards[i].rank}
                  faceUp={communityCards[i].faceUp}
                  size="md"
                />
              ) : (
                <div
                  key={i}
                  className="w-10 h-14 rounded-lg border border-white/10"
                  style={{ background: "rgba(0,0,0,0.15)" }}
                />
              ),
            )}
          </div>

          <span className="text-green-300/40 text-xs uppercase tracking-[0.2em] font-semibold">
            {phase}
          </span>
        </div>

        {players.length > 0 &&
          SEATS.map((seat) => {
            const p = players[seat.id];
            return (
              <div key={seat.id} className={`absolute ${seat.className}`}>
                <PlayerSeat
                  id={p.id}
                  name={p.name}
                  balance={p.balance}
                  cards={p.cards}
                  isUser={p.isUser}
                  isActive={
                    currentPlayerIndex === seat.id && phase !== "showdown"
                  }
                  isDealer={p.isDealer}
                  folded={p.folded}
                  allIn={p.allIn}
                  lastAction={p.lastAction}
                  handName={seat.id === 0 ? userHand : ""}
                  archetypeColor={
                    p.archetype ? ARCHETYPE_COLORS[p.archetype] : undefined
                  }
                />
              </div>
            );
          })}
      </div>

      <div className="mt-30 w-full flex flex-col items-center gap-4">
        {phase === "showdown" && winners.length > 0 && (
          <div className="flex flex-col items-center gap-3">
            <div
              className="px-8 py-3 rounded-2xl text-center"
              style={{
                background: "rgba(0,0,0,0.7)",
                border: "1px solid rgba(251,191,36,0.4)",
              }}
            >
              <div className="text-yellow-400 font-black text-2xl mb-1">
                {winners.length > 1
                  ? "Split Pot! 🤝"
                  : `${winners[0].name} Wins! 🏆`}
              </div>
              {winners.map((w) => (
                <div key={w.id} className="text-green-300 text-sm">
                  {evaluateHand(w.cards, communityCards).rank}
                </div>
              ))}
            </div>
            <button
              onClick={startGame}
              className="px-8 py-2.5 rounded-xl font-black text-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(135deg,#fbbf24,#f59e0b)" }}
            >
              Next Hand
            </button>
          </div>
        )}

        {phase !== "showdown" && (
          <div className="flex items-center justify-center gap-3 h-12">
            {isUserTurn ? (
              <>
                <button
                  onClick={fold}
                  className="px-6 py-2.5 rounded-xl font-bold text-white uppercase tracking-wider text-sm transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: "rgba(185,28,28,0.85)",
                    border: "1px solid #ef4444",
                  }}
                >
                  Fold
                </button>

                {canCheck ? (
                  <button
                    onClick={check}
                    className="px-6 py-2.5 rounded-xl font-bold text-white uppercase tracking-wider text-sm transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: "rgba(30,64,175,0.85)",
                      border: "1px solid #3b82f6",
                    }}
                  >
                    Check
                  </button>
                ) : (
                  <button
                    onClick={call}
                    className="px-6 py-2.5 rounded-xl font-bold text-white uppercase tracking-wider text-sm transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: "rgba(30,64,175,0.85)",
                      border: "1px solid #3b82f6",
                    }}
                  >
                    Call ${callAmount}
                  </button>
                )}

                <button
                  onClick={() => raise(raiseAmount)}
                  className="px-6 py-2.5 rounded-xl font-bold text-black uppercase tracking-wider text-sm transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
                  }}
                >
                  Raise ${raiseAmount}
                </button>

                <select
                  value={raiseAmount}
                  onChange={(e) => setRaiseAmount(Number(e.target.value))}
                  className="bg-black/50 text-white text-sm rounded-lg px-2 py-2 border border-white/20 outline-none"
                >
                  {[50, 100, 150, 200, 300, 500].map((v) => (
                    <option key={v} value={v}>
                      ${v}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <div className="text-white/30 text-sm italic">
                {currentPlayerIndex >= 0 &&
                players[currentPlayerIndex] &&
                !players[currentPlayerIndex].isUser
                  ? `${players[currentPlayerIndex].name} is thinking...`
                  : ""}
              </div>
            )}
          </div>
        )}

        <div
          className="w-full max-w-xl rounded-xl overflow-hidden"
          style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="h-28 overflow-y-auto flex flex-col-reverse gap-0.5 px-3 py-2">
            {[...log].reverse().map((m, i) => (
              <div key={i} className="text-xs text-slate-400 font-mono">
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
