import type { Suit } from "../types/card";

interface CardProps {
  suit?: Suit;
  rank?: string;
  faceUp?: boolean;
  size?: "sm" | "md" | "lg";
  rotate?: number;
}

const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

const SUIT_COLORS: Record<Suit, string> = {
  hearts: "text-red-500",
  diamonds: "text-red-500",
  clubs: "text-gray-900",
  spades: "text-gray-900",
};

export default function Card({
  suit,
  rank,
  faceUp = true,
  size = "md",
  rotate = 0,
}: CardProps) {
  const symbol = suit ? SUIT_SYMBOLS[suit] : "";
  const colorClass = suit ? SUIT_COLORS[suit] : "text-gray-900";

  const sizes = {
    sm: "w-8 h-12 text-xs",
    md: "w-10 h-14 text-sm",
    lg: "w-16 h-24 text-lg",
  };

  const cornerText = {
    sm: "text-[8px]",
    md: "text-[10px]",
    lg: "text-sm",
  };

  const centerSize = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <div
      className={`relative ${sizes[size]} rounded-lg shadow-lg select-none`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {faceUp && suit && rank ? (
        <div className="w-full h-full bg-white rounded-lg border border-gray-200 flex items-center justify-center">
          <div
            className={`absolute top-1 left-1 flex flex-col items-center leading-none ${cornerText[size]} ${colorClass} font-bold`}
          >
            <span>{rank}</span>
            <span>{symbol}</span>
          </div>

          <span className={`${centerSize[size]} ${colorClass}`}>{symbol}</span>

          <div
            className={`absolute bottom-1 right-1 flex flex-col items-center leading-none ${cornerText[size]} ${colorClass} font-bold rotate-180`}
          >
            <span>{rank}</span>
            <span>{symbol}</span>
          </div>
        </div>
      ) : (
        <div
          className="w-full h-full rounded-lg border border-blue-900 overflow-hidden"
          style={{
            background:
              "repeating-linear-gradient(45deg, #1e3a8a, #1e3a8a 4px, #1e40af 4px, #1e40af 8px)",
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-[75%] h-[85%] rounded border border-blue-400/40" />
          </div>
        </div>
      )}
    </div>
  );
}
