"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n";

interface BookmarkButtonProps {
  toolId: string;
  size?: "sm" | "md";
}

export default function BookmarkButton({ toolId, size = "md" }: BookmarkButtonProps) {
  const { t } = useLanguage();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      setLoggedIn(true);
      const { data: bm } = await supabase
        .from("user_bookmarks")
        .select("id")
        .eq("user_id", data.user.id)
        .eq("tool_id", toolId)
        .maybeSingle();
      setBookmarked(!!bm);
    });
  }, [toolId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = `/login?redirectTo=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    setLoading(true);
    if (bookmarked) {
      await supabase
        .from("user_bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("tool_id", toolId);
      setBookmarked(false);
    } else {
      await supabase
        .from("user_bookmarks")
        .insert({ user_id: user.id, tool_id: toolId });
      setBookmarked(true);
    }
    setLoading(false);
  };

  const isSmall = size === "sm";

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={bookmarked ? t("tool_bookmarked") : t("tool_bookmark")}
      style={{
        background: bookmarked ? "rgba(99,102,241,.2)" : "var(--surface2)",
        border: `1px solid ${bookmarked ? "var(--accent)" : "var(--border)"}`,
        color: bookmarked ? "var(--accent)" : "var(--subtle)",
        borderRadius: "8px",
        padding: isSmall ? "4px 8px" : "6px 12px",
        fontSize: isSmall ? "12px" : "13px",
        cursor: loading ? "wait" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        transition: "all .2s",
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {bookmarked ? "★" : "☆"}
      {!isSmall && <span>{bookmarked ? t("tool_bookmarked") : t("tool_bookmark")}</span>}
    </button>
  );
}
