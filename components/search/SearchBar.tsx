"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
  size?: "sm" | "lg";
  defaultValue?: string;
}

export default function SearchBar({
  placeholder = "搜索 AI 工具或评测...",
  autoFocus = false,
  size = "lg",
  defaultValue = "",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (val.trim().length >= 2) {
      timeoutRef.current = setTimeout(() => {
        router.push(`/search?q=${encodeURIComponent(val.trim())}`);
      }, 400);
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const isLg = size === "lg";

  return (
    <form onSubmit={handleSubmit} style={{ position: "relative", width: "100%" }}>
      <span style={{
        position: "absolute",
        left: isLg ? "18px" : "12px",
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: isLg ? "18px" : "14px",
        pointerEvents: "none",
        color: "var(--subtle)",
      }}>
        🔍
      </span>
      <input
        type="search"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          width: "100%",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: isLg ? "14px" : "10px",
          padding: isLg ? "14px 54px 14px 50px" : "9px 40px 9px 36px",
          fontSize: isLg ? "15px" : "13.5px",
          color: "var(--text)",
          outline: "none",
          transition: "border-color .2s, box-shadow .2s",
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = "var(--accent)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,.15)";
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          style={{
            position: "absolute",
            right: isLg ? "18px" : "12px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "var(--subtle)",
            cursor: "pointer",
            fontSize: "16px",
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      )}
    </form>
  );
}
