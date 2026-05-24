interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "danger" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  fullWidth?: boolean;
}

const VARIANTS = {
  primary: {
    background: "rgba(30,64,175,0.85)",
    border: "1px solid #3b82f6",
    color: "#ffffff",
  },
  danger: {
    background: "rgba(185,28,28,0.85)",
    border: "1px solid #ef4444",
    color: "#ffffff",
  },
  ghost: {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#94a3b8",
  },
  gold: {
    background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
    border: "none",
    color: "#000000",
  },
};

const SIZES = {
  sm: { padding: "4px 12px", fontSize: "11px" },
  md: { padding: "8px 20px", fontSize: "13px" },
  lg: { padding: "12px 32px", fontSize: "15px" },
};

export default function Button({
  label,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const v = VARIANTS[variant];
  const s = SIZES[size];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: v.background,
        border: v.border,
        color: v.color,
        padding: s.padding,
        fontSize: s.fontSize,
        width: fullWidth ? "100%" : undefined,
        opacity: disabled ? 0.35 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: "10px",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        transition: "transform 0.1s, opacity 0.2s",
        transform: "scale(1)",
      }}
      onMouseEnter={(e) => {
        if (!disabled)
          (e.currentTarget as HTMLButtonElement).style.transform =
            "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      }}
      onMouseDown={(e) => {
        if (!disabled)
          (e.currentTarget as HTMLButtonElement).style.transform =
            "scale(0.96)";
      }}
      onMouseUp={(e) => {
        if (!disabled)
          (e.currentTarget as HTMLButtonElement).style.transform =
            "scale(1.05)";
      }}
    >
      {label}
    </button>
  );
}
