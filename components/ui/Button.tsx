"use client";

import React from "react";

type ButtonVariant = "primary" | "ghost" | "danger" | "success";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: "var(--accent)", color: "#fff", border: "none" },
  ghost:   { background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" },
  danger:  { background: "#ef4444", color: "#fff", border: "none" },
  success: { background: "var(--success)", color: "#fff", border: "none" },
};

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: "5px 12px", fontSize: "12px" },
  md: { padding: "8px 18px", fontSize: "13.5px" },
  lg: { padding: "11px 26px", fontSize: "15px" },
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        borderRadius: "8px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "opacity .15s, background .15s",
        lineHeight: 1.4,
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        ...style,
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
    >
      {children}
    </button>
  );
}
