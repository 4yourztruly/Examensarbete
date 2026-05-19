type ChipValue = 1 | 5 | 10 | 25 | 50 | 100 | 500 | 1000;

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

function breakIntoChips(amount: number): Partial<Record<ChipValue, number>> {
  const denoms: ChipValue[] = [1000, 500, 100, 50, 25, 10, 5, 1];
  const result: Partial<Record<ChipValue, number>> = {};
  let remaining = amount;
  for (const d of denoms) {
    if (remaining >= d) {
      result[d] = Math.floor(remaining / d);
      remaining = remaining % d;
    }
  }
  return result;
}

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
            transform={`rotate(${(i / notchCount) * 360}, ${x}, ${y})`}
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

function ChipSideSlice({
  value,
  width,
  height,
}: {
  value: ChipValue;
  width: number;
  height: number;
}) {
  const { main, dark, light } = CHIP_CONFIG[value];
  const cx = width / 2;
  const stripeW = width * 0.14;
  const stripeGap = width * 0.14;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: "block" }}
    >
      <rect
        x={1}
        y={0}
        width={width - 2}
        height={height}
        fill={dark}
        rx={1.5}
      />

      <rect
        x={2}
        y={0.5}
        width={width - 4}
        height={height - 1}
        fill={main}
        rx={1}
      />

      <rect
        x={cx - stripeGap - stripeW}
        y={1}
        width={stripeW}
        height={height - 2}
        fill={light}
        opacity={0.9}
        rx={0.5}
      />

      <rect
        x={cx + stripeGap}
        y={1}
        width={stripeW}
        height={height - 2}
        fill={light}
        opacity={0.9}
        rx={0.5}
      />

      <rect
        x={2}
        y={0.5}
        width={width - 4}
        height={1.5}
        fill="rgba(255,255,255,0.4)"
        rx={1}
      />

      <rect
        x={2}
        y={height - 2}
        width={width - 4}
        height={1.5}
        fill="rgba(0,0,0,0.35)"
        rx={1}
      />
    </svg>
  );
}

function ChipColumn({ value, count }: { value: ChipValue; count: number }) {
  const chips = Math.min(count, 20);
  const chipH = 11;
  const chipW = 52;
  const faceSize = chipW;
  const stackH = chips * chipH;
  const totalH = stackH + faceSize - 8;

  return (
    <div
      className="flex flex-col items-center"
      style={{ width: `${chipW + 4}px` }}
    >
      <div
        style={{
          position: "relative",
          width: `${chipW}px`,
          height: `${totalH}px`,
        }}
      >
        <div
          style={{ position: "absolute", top: 0, left: 0, zIndex: chips + 2 }}
        >
          <ChipFace value={value} size={faceSize} />
        </div>

        <div
          style={{
            position: "absolute",
            top: faceSize - 8,
            left: 0,
            width: `${chipW}px`,
            zIndex: 1,
            boxShadow: "0 8px 16px rgba(0,0,0,0.6)",
            borderRadius: "0 0 3px 3px",
          }}
        >
          {[...Array(chips)].map((_, i) => (
            <ChipSideSlice key={i} value={value} width={chipW} height={chipH} />
          ))}
          <div
            style={{
              width: `${chipW}px`,
              height: "5px",
              background: CHIP_CONFIG[value].dark,
              borderRadius: "0 0 4px 4px",
              filter: "brightness(0.6)",
            }}
          />
        </div>
      </div>

      <div
        style={{
          marginTop: "4px",
          fontSize: "10px",
          fontWeight: 700,
          color: CHIP_CONFIG[value].light,
          textShadow: "0 1px 3px rgba(0,0,0,0.9)",
          background: "rgba(0,0,0,0.45)",
          borderRadius: "4px",
          padding: "1px 6px",
          letterSpacing: "0.5px",
        }}
      >
        x{count}
      </div>
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
    const shown = Math.min(count, 2);
    for (let i = 0; i < shown; i++) {
      if (posIndex < positions.length) {
        allChips.push({ value: chipVal, pos: positions[posIndex++] });
      }
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

function PlayerStack({ balance }: { balance: number }) {
  const chips = breakIntoChips(balance);
  const entries = (Object.entries(chips) as [string, number][]).filter(
    ([, count]) => count > 0,
  );

  if (entries.length === 0) {
    return <p style={{ color: "#9ca3af", fontSize: "12px" }}>No chips</p>;
  }

  return (
    <div className="flex items-end gap-3" style={{ padding: "4px 8px" }}>
      {entries.map(([val, count]) => (
        <ChipColumn key={val} value={Number(val) as ChipValue} count={count} />
      ))}
    </div>
  );
}

interface ChipProps {
  variant: "pile" | "stack";
  balance?: number;
  chips?: Partial<Record<ChipValue, number>>;
}

export default function Chip({ variant, balance = 0, chips }: ChipProps) {
  if (variant === "stack") return <PlayerStack balance={balance} />;
  const pileChips = chips ?? breakIntoChips(balance);
  return <ChipPile chips={pileChips} />;
}

export { ChipFace, ChipColumn, ChipPile, PlayerStack, breakIntoChips };
export type { ChipValue };
