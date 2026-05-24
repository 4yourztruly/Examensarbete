import { useState, useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { getHighBet } from "../logic/betting";
import { evaluateHand } from "../logic/hand";
import PlayerSeat from "../components/PlayerSeat";
import Card from "../components/Card";
import Chip, { breakIntoChips } from "../components/Chips";
import Button from "../components/Button";

const SEATS = [
  { id: 0, className: "bottom-0 left-1/2 -translate-x-1/2 translate-y-full" },
  { id: 1, className: "bottom-6 left-6 translate-y-1/4 -translate-x-1/4" },
  { id: 2, className: "bottom-6 right-6 translate-y-1/4 translate-x-1/4" },
  { id: 3, className: "top-6 left-6 -translate-y-1/4 -translate-x-1/4" },
  { id: 4, className: "top-6 right-6 -translate-y-1/4 translate-x-1/4" },
  { id: 5, className: "top-0 left-1/2 -translate-x-1/2 -translate-y-full" },
];

const BET_OFFSETS: Record<
  number,
  { top: string; left: string; transform: string }
> = {
  0: { top: "-70px", left: "50%", transform: "translateX(-50%)" },
  1: { top: "-50px", left: "80px", transform: "" },
  2: { top: "-50px", left: "-40px", transform: "" },
  3: { top: "60px", left: "80px", transform: "" },
  4: { top: "60px", left: "-40px", transform: "" },
  5: { top: "70px", left: "50%", transform: "translateX(-50%)" },
};

const ARCHETYPE_COLORS: Record<string, string> = {
  aggressive: "#ef4444",
  passive: "#22c55e",
  adaptive: "#a855f7",
};

const POT_FRACTIONS = [
  { label: "1/4", fraction: 0.25 },
  { label: "1/3", fraction: 0.33 },
  { label: "1/2", fraction: 0.5 },
  { label: "2/3", fraction: 0.67 },
  { label: "Pot", fraction: 1.0 },
];

const SMALL_BLIND = 25;

export default function GameScreen() {
  const {
    players,
    communityCards,
    pot,
    phase,
    currentPlayerIndex,
    winners,
    log,
    pendingBets,
    fold,
    call,
    raise,
    check,
    startGame,
    returnToMenu,
  } = useGameStore();

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
  const userBroke = (user?.balance ?? 0) === 0;
  const userCantAffordBlind = (user?.balance ?? 0) < SMALL_BLIND;
  const isGameOver = phase === "showdown" && userCantAffordBlind;
  const allBotsEliminated =
    phase === "showdown" &&
    players.length > 0 &&
    players.filter((p) => !p.isUser).every((p) => p.eliminated);

  const minRaise = 50;
  const maxRaise = user ? Math.max(user.balance - callAmount, 0) : 0;
  const [raiseAmount, setRaiseAmount] = useState(minRaise);

  useEffect(() => {
    if (isUserTurn) setRaiseAmount(Math.min(minRaise, maxRaise));
  }, [isUserTurn, maxRaise]);

  const totalRaiseCost = callAmount + raiseAmount;
  const canRaise = maxRaise >= minRaise;

  const userHand =
    user?.cards.length === 2 && communityCards.length > 0
      ? evaluateHand(user.cards, communityCards).rank
      : "";

  function handlePotFraction(fraction: number) {
    const amount = Math.round(pot * fraction);
    setRaiseAmount(Math.max(minRaise, Math.min(amount, maxRaise)));
  }

  function handleAllIn() {
    raise(Math.max((user?.balance ?? 0) - callAmount, 0));
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{
        background:
          "radial-gradient(ellipse at center, #0f4c2a 0%, #052e16 60%, #020f0a 100%)",
      }}
    >
      <div className="absolute top-4 left-4 z-50">
        <Button
          label="← Menu"
          variant="ghost"
          size="sm"
          onClick={returnToMenu}
        />
      </div>

      <div
        className="mt-60 relative flex items-center justify-center"
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
            const pending = pendingBets.find((b) => b.playerId === p.id);
            const offset = BET_OFFSETS[seat.id];

            return (
              <div key={seat.id} className={`absolute ${seat.className}`}>
                {pending && (
                  <div
                    className="absolute z-30 flex flex-col items-center gap-0.5"
                    style={{
                      top: offset.top,
                      left: offset.left,
                      transform: offset.transform,
                    }}
                  >
                    <Chip variant="stack" balance={pending.amount} />
                    <span className="text-yellow-400 font-black text-xs">
                      ${pending.amount}
                    </span>
                  </div>
                )}

                {!p.eliminated ? (
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
                ) : (
                  <div
                    className="w-24 h-16 rounded-xl flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(0,0,0,0.2)",
                      border: "1px dashed rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.2)",
                    }}
                  >
                    Out
                  </div>
                )}
              </div>
            );
          })}
      </div>

      <div className="mt-30 w-full flex flex-col items-center gap-3 px-4">
        {isGameOver && (
          <div className="flex flex-col items-center gap-3">
            <div
              className="px-8 py-4 rounded-2xl text-center"
              style={{
                background: "rgba(0,0,0,0.75)",
                border: "1px solid rgba(239,68,68,0.4)",
              }}
            >
              <div className="text-red-400 font-black text-3xl mb-1">
                Game Over
              </div>
              <div className="text-white/60 text-sm mb-1">
                You ran out of chips
              </div>
              {winners.length > 0 && (
                <div className="text-yellow-400 text-sm">
                  {winners[0].name} won the last hand
                </div>
              )}
            </div>
            <Button
              label="Return to Menu"
              variant="danger"
              size="lg"
              onClick={returnToMenu}
            />
          </div>
        )}

        {allBotsEliminated && (
          <div className="flex flex-col items-center gap-3">
            <div
              className="px-8 py-4 rounded-2xl text-center"
              style={{
                background: "rgba(0,0,0,0.75)",
                border: "1px solid rgba(251,191,36,0.5)",
              }}
            >
              <div className="text-yellow-400 font-black text-3xl mb-1">
                🏆 You Won!
              </div>
              <div className="text-white/60 text-sm mb-1">
                You eliminated all the bots
              </div>
              <div className="text-green-400 font-bold text-sm">
                Final balance: ${user?.balance}
              </div>
            </div>
            <Button
              label="Return to Menu"
              variant="gold"
              size="lg"
              onClick={returnToMenu}
            />
          </div>
        )}

        {phase === "showdown" &&
          winners.length > 0 &&
          !isGameOver &&
          !allBotsEliminated && (
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
              <Button
                label="Next Hand"
                variant="gold"
                size="lg"
                onClick={startGame}
              />
            </div>
          )}

        {phase !== "showdown" && phase !== "idle" && (
          <div className="w-full max-w-xl flex flex-col gap-3">
            {isUserTurn && (
              <>
                {userBroke && (
                  <div className="text-center text-orange-400 text-sm font-bold">
                    You're out of chips — check or fold only
                  </div>
                )}

                {canRaise && !userBroke && (
                  <div
                    className="rounded-xl p-3 flex flex-col gap-2"
                    style={{
                      background: "rgba(0,0,0,0.35)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div className="flex gap-2 justify-center">
                      {POT_FRACTIONS.map((f) => {
                        const amount = Math.max(
                          minRaise,
                          Math.min(Math.round(pot * f.fraction), maxRaise),
                        );
                        return (
                          <button
                            key={f.label}
                            onClick={() => handlePotFraction(f.fraction)}
                            className="px-2 py-1 rounded-lg text-[11px] font-bold text-white transition-all hover:scale-105"
                            style={{
                              background: "rgba(255,255,255,0.1)",
                              border: "1px solid rgba(255,255,255,0.15)",
                            }}
                          >
                            {f.label}
                            <span className="block text-yellow-400 text-[10px]">
                              ${amount}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-white/40 text-xs w-8 text-right">
                        ${minRaise}
                      </span>
                      <input
                        type="range"
                        min={minRaise}
                        max={maxRaise}
                        step={25}
                        value={raiseAmount}
                        onChange={(e) => setRaiseAmount(Number(e.target.value))}
                        className="flex-1 accent-yellow-400"
                        style={{ cursor: "pointer" }}
                      />
                      <span className="text-white/40 text-xs w-12">
                        ${maxRaise}
                      </span>
                    </div>

                    <div className="text-center text-yellow-400 font-black text-sm">
                      Raise: ${raiseAmount}
                      <span className="text-white/30 font-normal text-xs ml-2">
                        (total: ${totalRaiseCost})
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 justify-center flex-wrap">
                  <Button label="Fold" variant="danger" onClick={fold} />
                  {canCheck ? (
                    <Button label="Check" variant="ghost" onClick={check} />
                  ) : (
                    <Button
                      label={`Call $${callAmount}`}
                      variant="primary"
                      onClick={call}
                      disabled={userBroke && callAmount > 0}
                    />
                  )}
                  {canRaise && !userBroke && (
                    <Button
                      label={`Raise $${raiseAmount}`}
                      variant="gold"
                      onClick={() => raise(raiseAmount)}
                    />
                  )}
                  {!userBroke && (
                    <Button
                      label={`All In $${user?.balance}`}
                      variant="gold"
                      onClick={handleAllIn}
                    />
                  )}
                </div>
              </>
            )}

            {!isUserTurn && (
              <div className="text-center text-white/30 text-sm italic h-8 flex items-center justify-center">
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
