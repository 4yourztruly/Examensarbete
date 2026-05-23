import { useGameStore } from "../store/gameStore";

export default function StartScreen() {
  const startGame = useGameStore((s) => s.startGame);
  const highScore = useGameStore((s) => s.highScore);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at center, #0f4c2a 0%, #052e16 60%, #020f0a 100%)",
      }}
    >
      <h1
        className="text-6xl font-black text-white tracking-[0.15em] mb-2"
        style={{
          fontFamily: "Georgia,serif",
          textShadow: "0 2px 20px rgba(0,0,0,0.8)",
        }}
      >
        ♠ POKER ♠
      </h1>

      <p className="text-green-400 tracking-widest text-sm uppercase font-semibold mb-2">
        Texas Hold'em
      </p>

      {highScore > 0 && (
        <div
          className="mb-8 px-6 py-2 rounded-full flex items-center gap-2"
          style={{
            background: "rgba(251,191,36,0.1)",
            border: "1px solid rgba(251,191,36,0.3)",
          }}
        >
          <span className="text-yellow-400 text-sm">🏆 High Score</span>
          <span className="text-white font-black text-sm">
            ${highScore.toLocaleString()}
          </span>
        </div>
      )}

      <button
        onClick={startGame}
        className="px-12 py-4 text-black font-black text-lg rounded-xl tracking-widest uppercase transition-all hover:scale-105 active:scale-95 mb-12"
        style={{
          background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
          boxShadow: "0 4px 24px rgba(251,191,36,0.4)",
        }}
      >
        Deal Cards
      </button>

      <div className="flex gap-6 text-center">
        {[
          {
            name: "Jack",
            type: "Aggressive",
            color: "#ef4444",
            desc: "Raises often, rarely folds",
          },
          {
            name: "Utopia",
            type: "Passive",
            color: "#22c55e",
            desc: "Only bets strong hands",
          },
          {
            name: "Travis",
            type: "Adaptive",
            color: "#a855f7",
            desc: "Unpredictable — bluffs & slow plays",
          },
          {
            name: "LaFlame",
            type: "Aggressive",
            color: "#ef4444",
            desc: "Raises often, rarely folds",
          },
          {
            name: "Scott",
            type: "Passive",
            color: "#22c55e",
            desc: "Only bets strong hands",
          },
        ].map((bot) => (
          <div key={bot.name} className="flex flex-col items-center gap-1">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm"
              style={{
                background: bot.color + "22",
                border: `2px solid ${bot.color}`,
              }}
            >
              {bot.name[0]}
            </div>
            <span className="text-white text-xs font-bold">{bot.name}</span>
            <span
              className="text-xs font-semibold"
              style={{ color: bot.color }}
            >
              {bot.type}
            </span>
            <span className="text-gray-500 text-[10px] max-w-[80px] leading-tight">
              {bot.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
