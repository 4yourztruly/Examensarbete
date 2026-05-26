import type { Card as PlayingCard } from "../types/card";
import type { GamePhase } from "../types/game";
import type { Player } from "../types/player";
import { breakIntoChips } from "../logic/chips";
import Chip from "./Chips";
import Card from "./Card";
import PlayerSeat from "./PlayerSeat";

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
  0: { top: "-95px", left: "50%", transform: "translateX(-50%)" },
  1: { top: "-72px", left: "98px", transform: "" },
  2: { top: "-72px", left: "-58px", transform: "" },
  3: { top: "82px", left: "98px", transform: "" },
  4: { top: "82px", left: "-58px", transform: "" },
  5: { top: "95px", left: "50%", transform: "translateX(-50%)" },
};

interface TableProps {
  players: Player[];
  communityCards: PlayingCard[];
  pot: number;
  phase: GamePhase;
  currentPlayerIndex: number;
  userHand: string;
}

export default function Table({
  players,
  communityCards,
  pot,
  phase,
  currentPlayerIndex,
  userHand,
}: TableProps) {
  return (
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
          const offset = BET_OFFSETS[seat.id];
          const showBet = p.currentBet > 0 && !p.folded && phase !== "showdown";

          return (
            <div key={seat.id} className={`absolute ${seat.className}`}>
              {showBet && (
                <div
                  className="absolute z-30 flex flex-col items-center gap-0.5"
                  style={{
                    top: offset.top,
                    left: offset.left,
                    transform: offset.transform,
                  }}
                >
                  <Chip variant="stack" size={1.2} balance={p.currentBet} />
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
  );
}
