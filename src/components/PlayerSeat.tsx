import type { Card } from "../types/card";
import CardComponent from "./Card";

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
        <div className="flex justify-center -mb-5 z-0">
          <CardComponent {...cards[0]} size="md" rotate={-6} />
          <CardComponent {...cards[1]} size="md" rotate={6} />
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
