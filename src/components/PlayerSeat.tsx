import type { Card } from "../types/card";
import CardComponent from "./Card";

interface SeatProps {
  id: number;
  name?: string;
  balance?: number;
  cards?: Card[];
  isUser?: boolean;
  isActive?: boolean;
  isDealer?: boolean;
  folded?: boolean;
  allIn?: boolean;
  handName?: string;
  lastAction?: string | null;
  archetypeColor?: string;
}

function actionColor(action: string): string {
  if (action.startsWith("fold")) return "#ef4444";
  if (action.startsWith("raise")) return "#f59e0b";
  if (action.startsWith("call")) return "#3b82f6";
  if (action.startsWith("check")) return "#9ca3af";
  return "#ffffff";
}

export default function PlayerSeat({
  name = "Player",
  balance = 0,
  cards = [],
  isUser = false,
  isActive = false,
  isDealer = false,
  folded = false,
  allIn = false,

  handName = "",
  lastAction = null,
  archetypeColor,
}: SeatProps) {
  return (
    <div className="relative flex flex-col items-center">
      {!folded && cards.length > 0 && (
        <div className="flex justify-center -mb-5 z-0">
          <CardComponent {...cards[0]} size="md" rotate={-6} />
          <CardComponent {...cards[1]} size="md" rotate={6} />
        </div>
      )}

      <div
        className="relative z-10 w-24 rounded-xl flex flex-col items-center justify-center border shadow-lg transition-all duration-200"
        style={{
          minHeight: "64px",
          padding: "6px 4px",
          background: folded
            ? "rgba(15,23,42,0.45)"
            : isUser
              ? "rgba(30,58,138,0.9)"
              : "rgba(15,23,42,0.85)",
          borderColor: isActive
            ? "#fbbf24"
            : archetypeColor
              ? archetypeColor + "88"
              : isUser
                ? "#3b82f6"
                : "#334155",
          boxShadow: isActive ? "0 0 14px rgba(251,191,36,0.45)" : undefined,
          opacity: folded ? 0.55 : 1,
        }}
      >
        {isDealer && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-white text-black rounded-full text-[9px] font-black flex items-center justify-center border border-gray-300 z-20 shadow">
            D
          </div>
        )}

        {archetypeColor && !isUser && (
          <div
            className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: archetypeColor }}
          />
        )}

        <span className="font-bold text-sm text-white truncate w-full text-center px-1">
          {name}
        </span>

        <span className="text-yellow-400 font-semibold text-xs">
          ${balance}
        </span>

        <span
          className="text-[10px] font-bold uppercase tracking-wide"
          style={{
            color:
              allIn && !lastAction
                ? "#f97316"
                : lastAction
                  ? actionColor(lastAction)
                  : "transparent",
          }}
        >
          {allIn && !lastAction ? "all in" : (lastAction ?? "–")}
        </span>

        {handName && isUser && !folded && (
          <span className="text-blue-300 text-[9px] truncate max-w-full px-1">
            {handName}
          </span>
        )}
      </div>
    </div>
  );
}
