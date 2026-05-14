import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import SearchBar from "@/components/search/SearchBar";
import ToolCard from "@/components/tools/ToolCard";
import ArticleCard from "@/components/articles/ArticleCard";
import type { Tool, Article } from "@/lib/types";
import Link from "next/link";

export const metadata: Metadata = { title: "搜索 — AI Nav" };

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  let tools: Tool[] = [];
  let articles: Article[] = [];

  if (query.length >= 2) {
    const supabase = await createClient();
    const [{ data: t }, { data: a }] = await Promise.all([
      supabase.from("tools").select("*").eq("published", true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`).limit(12),
      supabase.from("articles").select("*").eq("published", true)
        .textSearch("search_vector", query, { type: "plain" }).limit(12),
    ]);
    tools = (t ?? []) as Tool[];
    articles = (a ?? []) as Article[];
  }

  const total = tools.length + articles.length;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 20px 80px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{
          fontSize: "clamp(22px, 3.5vw, 30px)",
          fontWeight: 900,
          color: "var(--text)",
          marginBottom: "16px",
        }}>
          🔍 搜索
        </h1>
        <SearchBar placeholder="搜索 AI 工具或评测..." defaultValue={query} autoFocus />
      </div>

      {query.length >= 2 ? (
        total > 0 ? (
          <>
            <p style={{ color: "var(--muted)", fontSize: "13.5px", marginBottom: "28px" }}>
              找到 <strong style={{ color: "var(--text)" }}>{total}</strong> 条关于 "{query}" 的结果
            </p>

            {tools.length > 0 && (
              <section style={{ marginBottom: "40px" }}>
                <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text)", marginBottom: "16px" }}>
                  🔧 工具 ({tools.length})
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
                  {tools.map(tool => <ToolCard key={tool.id} tool={tool} lang="zh" />)}
                </div>
              </section>
            )}

            {articles.length > 0 && (
              <section>
                <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text)", marginBottom: "16px" }}>
                  📖 评测文章 ({articles.length})
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
                  {articles.map(article => <ArticleCard key={article.id} article={article} lang="zh" />)}
                </div>
              </section>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--subtle)" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🤔</div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text)", marginBottom: "8px" }}>
              没有找到 "{query}" 相关内容
            </h2>
            <p style={{ marginBottom: "24px" }}>试试其他关键词，或<Link href="/submit" style={{ color: "var(--accent)" }}>推荐一款新工具</Link></p>
            <Link href="/tools" style={{ color: "var(--accent)", fontSize: "14px" }}>浏览全部工具 →</Link>
          </div>
        )
      ) : (
        <div style={{ color: "var(--subtle)", textAlign: "center", padding: "60px 20px" }}>
          输入至少 2 个字符开始搜索
        </div>
      )}
    </div>
  );
}
