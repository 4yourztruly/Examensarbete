import { useGameStore } from "./store/gameStore";
import StartScreen from "./screens/StartScreen";
import GameScreen from "./screens/GameScreen";

export default function App() {
  const phase = useGameStore((s) => s.phase);
  return phase === "idle" ? <StartScreen /> : <GameScreen />;
}
