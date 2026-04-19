import type { Card } from "../types/card";

interface SeatProps {
  id: number;
  name?: string;
  balance?: number;
  cards?: Card[];
  isUser?: boolean;
}

export default function PlayerSeat({
  id,
  name = "Player",
  balance = 0,
  cards = [],
  isUser = false,
}: SeatProps) {
  return (
    <div className="relative flex flex-col items-center">
      {cards.length > 0 && (
        <div className="relative flex justify-center mb-[-18px] z-0">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`w-10 h-14 rounded-md border-2 flex items-center justify-center text-sm font-bold shadow-md bg-white
                ${i === 0 ? "-rotate-6 -mr-2" : "rotate-6"}
                ${card.suit === "♥" || card.suit === "♦" ? "text-red-500" : "text-gray-900"}
              `}
            >
              {card.faceUp ? (
                <span>
                  {card.rank}
                  {card.suit}
                </span>
              ) : (
                <span className="text-blue-900 text-lg">🂠</span>
              )}
            </div>
          ))}
        </div>
      )}

      <div
        className={`relative z-10 w-24 h-16 rounded-xl flex flex-col items-center justify-center text-white text-xs border shadow-lg
        ${isUser ? "bg-blue-900 border-blue-400" : "bg-gray-800 border-gray-600"}
      `}
      >
        <span className="font-bold text-sm truncate w-full text-center px-1">
          {name}
        </span>
        <span className="text-yellow-400 font-semibold">${balance}</span>
        <span className="text-gray-500 text-[10px]">#{id}</span>
      </div>
    </div>
  );
}
