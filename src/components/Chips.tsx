import { breakIntoChips, type ChipValue } from "../logic/chips";

interface ChipConfig {
  main: string;
  dark: string;
  light: string;
  text: string;
  label: string;
}

const CHIP_CONFIG: Record<ChipValue, ChipConfig> = {
  1: {
    main: "#d1d5db",
    dark: "#9ca3af",
    light: "#f3f4f6",
    text: "#374151",
    label: "1",
  },
  5: {
    main: "#dc2626",
    dark: "#991b1b",
    light: "#fca5a5",
    text: "#ffffff",
    label: "5",
  },
  10: {
    main: "#2563eb",
    dark: "#1e40af",
    light: "#93c5fd",
    text: "#ffffff",
    label: "10",
  },
  25: {
    main: "#16a34a",
    dark: "#14532d",
    light: "#86efac",
    text: "#ffffff",
    label: "25",
  },
  50: {
    main: "#7c3aed",
    dark: "#4c1d95",
    light: "#c4b5fd",
    text: "#ffffff",
    label: "50",
  },
  100: {
    main: "#d97706",
    dark: "#92400e",
    light: "#fcd34d",
    text: "#ffffff",
    label: "100",
  },
  500: {
    main: "#1e293b",
    dark: "#0f172a",
    light: "#475569",
    text: "#fbbf24",
    label: "500",
  },
  1000: {
    main: "#db2777",
    dark: "#831843",
    light: "#f9a8d4",
    text: "#ffffff",
    label: "1k",
  },
};

function ChipFace({ value, size = 48 }: { value: ChipValue; size?: number }) {
  const { main, dark, light, text, label } = CHIP_CONFIG[value];
  const r = size / 2;
  const strokeW = size * 0.08;
  const innerR = r * 0.72;
  const notchR = r * 0.88;
  const notchSize = size * 0.07;
  const notchCount = 8;
  const fontSize = size * (label.length > 2 ? 0.22 : 0.26);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={r} cy={r} r={r - 1} fill={dark} />
      <circle cx={r} cy={r} r={r - strokeW * 0.6} fill={main} />
      {[...Array(notchCount)].map((_, i) => {
        const angle = (i / notchCount) * Math.PI * 2 - Math.PI / 2;
        const x = r + Math.cos(angle) * notchR;
        const y = r + Math.sin(angle) * notchR;
        return (
          <rect
            key={i}
            x={x - notchSize / 2}
            y={y - notchSize / 2}
            width={notchSize}
            height={notchSize}
            fill={light}
            rx={notchSize * 0.2}
            transform={`rotate(${(i / notchCount) * 360},${x},${y})`}
            opacity={0.9}
          />
        );
      })}
      <circle
        cx={r}
        cy={r}
        r={innerR}
        fill="none"
        stroke={light}
        strokeWidth={strokeW * 0.5}
        opacity={0.6}
      />
      <circle cx={r} cy={r} r={innerR * 0.78} fill={dark} opacity={0.3} />
      <text
        x={r}
        y={r + fontSize * 0.38}
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight="700"
        fill={text}
        fontFamily="monospace"
        letterSpacing={label.length > 2 ? "-0.5" : "0"}
      >
        {label}
      </text>
    </svg>
  );
}

function ChipColumn({
  value,
  count,
  size = 1,
}: {
  value: ChipValue;
  count: number;
  size?: number;
}) {
  const chips = Math.min(4, Math.max(1, Math.ceil(Math.log2(count + 1))));
  const chipSize = Math.round(28 * size);
  const xStep = Math.round(3 * size);
  const yStep = Math.round(3 * size);
  const width = chipSize + xStep * (chips - 1);
  const height = chipSize + yStep * (chips - 1);

  return (
    <div
      className="relative"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {[...Array(chips)].map((_, i) => {
        const layer = chips - i - 1;
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${layer * xStep}px`,
              top: `${i * yStep}px`,
              zIndex: i,
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.55))",
              transform: `rotate(${-10 + i * 4}deg)`,
            }}
          >
            <ChipFace value={value} size={chipSize} />
          </div>
        );
      })}
    </div>
  );
}

function ChipPile({ chips }: { chips: Partial<Record<ChipValue, number>> }) {
  const entries = Object.entries(chips) as [string, number][];
  const positions = [
    { x: 10, y: 8, r: 0 },
    { x: 28, y: 12, r: 15 },
    { x: 2, y: 22, r: -20 },
    { x: 22, y: 4, r: 10 },
    { x: 16, y: 24, r: -8 },
    { x: 6, y: 36, r: 25 },
    { x: 30, y: 30, r: -12 },
    { x: 18, y: 40, r: 18 },
  ];
  let posIndex = 0;
  const allChips: { value: ChipValue; pos: (typeof positions)[0] }[] = [];
  for (const [val, count] of entries) {
    const chipVal = Number(val) as ChipValue;
    for (let i = 0; i < Math.min(count, 2); i++) {
      if (posIndex < positions.length)
        allChips.push({ value: chipVal, pos: positions[posIndex++] });
    }
  }
  return (
    <div className="relative" style={{ width: "72px", height: "80px" }}>
      {allChips.map((c, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${c.pos.x}px`,
            top: `${c.pos.y}px`,
            transform: `rotate(${c.pos.r}deg)`,
            zIndex: i,
            filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.5))",
          }}
        >
          <ChipFace value={c.value} size={36} />
        </div>
      ))}
    </div>
  );
}

function PlayerStack({
  balance,
  size = 1,
}: {
  balance: number;
  size?: number;
}) {
  const chips = breakIntoChips(balance);
  const entries = (Object.entries(chips) as [string, number][]).filter(
    ([, count]) => count > 0,
  );
  if (entries.length === 0)
    return <p style={{ color: "#9ca3af", fontSize: "12px" }}>No chips</p>;
  return (
    <div className="flex items-end" style={{ padding: "1px 0" }}>
      {entries.map(([val, count], index) => (
        <div
          key={val}
          style={{
            marginLeft: index === 0 ? 0 : `${Math.round(-8 * size)}px`,
          }}
        >
          <ChipColumn
            value={Number(val) as ChipValue}
            count={count}
            size={size}
          />
        </div>
      ))}
    </div>
  );
}

interface ChipProps {
  variant: "pile" | "stack";
  balance?: number;
  chips?: Partial<Record<ChipValue, number>>;
  size?: number;
}

export default function Chip({
  variant,
  balance = 0,
  chips,
  size = 1,
}: ChipProps) {
  if (variant === "stack") return <PlayerStack balance={balance} size={size} />;
  const pileChips = chips ?? breakIntoChips(balance);
  return <ChipPile chips={pileChips} />;
}

export { ChipFace, ChipColumn, ChipPile, PlayerStack };
export type { ChipValue };
