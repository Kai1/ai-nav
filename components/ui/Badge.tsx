import React from "react";

type BadgeColor = "indigo" | "green" | "amber" | "red" | "gray" | "purple" | "pink";

const colorMap: Record<BadgeColor, { bg: string; color: string }> = {
  indigo: { bg: "rgba(99,102,241,.15)", color: "#818cf8" },
  green:  { bg: "rgba(16,185,129,.15)", color: "#34d399" },
  amber:  { bg: "rgba(245,158,11,.15)", color: "#fbbf24" },
  red:    { bg: "rgba(239,68,68,.15)",  color: "#f87171" },
  gray:   { bg: "rgba(107,114,128,.15)", color: "#9ca3af" },
  purple: { bg: "rgba(192,132,252,.15)", color: "#c084fc" },
  pink:   { bg: "rgba(236,72,153,.15)", color: "#f472b6" },
};

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  style?: React.CSSProperties;
}

export default function Badge({ children, color = "indigo", style }: BadgeProps) {
  const { bg, color: textColor } = colorMap[color];
  return (
    <span style={{
      background: bg,
      color: textColor,
      fontSize: "11px",
      fontWeight: 700,
      padding: "2px 8px",
      borderRadius: "20px",
      display: "inline-flex",
      alignItems: "center",
      letterSpacing: ".02em",
      ...style,
    }}>
      {children}
    </span>
  );
}
