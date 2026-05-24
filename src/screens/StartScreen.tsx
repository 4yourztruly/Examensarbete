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
    </div>
  );
}
