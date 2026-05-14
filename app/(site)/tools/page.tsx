import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import ToolCard from "@/components/tools/ToolCard";
import { CATEGORIES } from "@/lib/types";
import type { Tool } from "@/lib/types";
import Link from "next/link";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "AI工具库 — 50+款精选AI工具评测",
  description: "浏览50+款精选AI工具，按类别筛选，包含ChatGPT、Claude、Midjourney等评分与免费额度说明。",
};

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ToolsPage({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("tools").select("*").eq("published", true);
  if (category && category !== "all") {
    query = query.eq("category", category);
  }
  const { data } = await query.order("featured", { ascending: false }).order("rating", { ascending: false });
  const tools = (data ?? []) as Tool[];

  const activeCat = category ?? "all";

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 20px 80px" }}>
      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <h1 style={{
          fontSize: "clamp(26px, 4vw, 38px)",
          fontWeight: 900,
          marginBottom: "8px",
          background: "linear-gradient(135deg, var(--grad-from), var(--grad-to))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          AI 工具库
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "15px" }}>
          {tools.length} 款工具 · 独立评测 · 真实使用体验
        </p>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "32px" }}>
        <FilterChip href="/tools" active={activeCat === "all"} label="全部" />
        {CATEGORIES.map(cat => (
          <FilterChip
            key={cat.key}
            href={`/tools?category=${cat.key}`}
            active={activeCat === cat.key}
            label={`${cat.icon} ${cat.label_zh}`}
          />
        ))}
      </div>

      {/* Grid */}
      {tools.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "16px",
        }}>
          {tools.map(tool => <ToolCard key={tool.id} tool={tool} lang="zh" />)}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--subtle)" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
          <p>该分类暂无工具，<Link href="/submit" style={{ color: "var(--accent)" }}>推荐一款</Link>？</p>
        </div>
      )}
    </div>
  );
}

function FilterChip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      style={{
        background: active ? "var(--accent)" : "var(--surface)",
        border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
        color: active ? "#fff" : "var(--muted)",
        borderRadius: "20px",
        padding: "6px 14px",
        fontSize: "12.5px",
        fontWeight: 600,
        textDecoration: "none",
        transition: "all .15s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Link>
  );
}
