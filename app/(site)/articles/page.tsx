import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import ArticleCard from "@/components/articles/ArticleCard";
import { CATEGORIES } from "@/lib/types";
import type { Article } from "@/lib/types";
import Link from "next/link";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "AI工具评测文章 — 110+篇深度评测",
  description: "查看AI Nav全部深度评测文章，涵盖ChatGPT、Claude、Midjourney等100+款AI工具的真实使用体验与横向对比。",
};

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("articles").select("*").eq("published", true);
  if (category && category !== "all") {
    query = query.eq("category", category);
  }
  const { data } = await query.order("published_at", { ascending: false });
  const articles = (data ?? []) as Article[];

  const activeCat = category ?? "all";

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 20px 80px" }}>
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
          AI 工具评测
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "15px" }}>
          {articles.length} 篇深度评测 · 基于真实使用体验 · 每周更新
        </p>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "32px" }}>
        <FilterChip href="/articles" active={activeCat === "all"} label="全部" />
        {CATEGORIES.map(cat => (
          <FilterChip
            key={cat.key}
            href={`/articles?category=${cat.key}`}
            active={activeCat === cat.key}
            label={`${cat.icon} ${cat.label_zh}`}
          />
        ))}
      </div>

      {articles.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}>
          {articles.map(article => <ArticleCard key={article.id} article={article} lang="zh" />)}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--subtle)" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📄</div>
          <p>该分类暂无评测文章</p>
        </div>
      )}
    </div>
  );
}

function FilterChip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link href={href} style={{
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
    }}>
      {label}
    </Link>
  );
}
