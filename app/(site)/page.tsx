import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";
import ToolCard from "@/components/tools/ToolCard";
import ArticleCard from "@/components/articles/ArticleCard";
import SearchBar from "@/components/search/SearchBar";
import { CATEGORIES } from "@/lib/types";
import type { Tool, Article } from "@/lib/types";

export const revalidate = 3600; // ISR — refresh every hour

export const metadata: Metadata = {
  title: "AI Nav — AI工具导航与深度评测",
  description: "发现最好的 AI 工具。110+ 篇深度评测，50+ 款精选工具，覆盖写作、编程、图像、视频等12大类别，每周持续更新。",
};

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: featuredTools }, { data: latestArticles }, { data: statsViews }] = await Promise.all([
    supabase
      .from("tools")
      .select("*")
      .eq("published", true)
      .eq("featured", true)
      .order("rating", { ascending: false })
      .limit(6),
    supabase
      .from("articles")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(8),
    supabase.from("page_views").select("id", { count: "exact", head: true }),
  ]);

  const tools = (featuredTools ?? []) as Tool[];
  const articles = (latestArticles ?? []) as Article[];
  const totalViews = statsViews?.length ?? 0; // fallback

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
      {/* ── HERO ── */}
      <section style={{ textAlign: "center", padding: "80px 0 60px" }}>
        {/* Tag */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          background: "rgba(99,102,241,.12)",
          border: "1px solid rgba(99,102,241,.25)",
          borderRadius: "20px",
          padding: "5px 14px",
          fontSize: "12.5px",
          color: "var(--accent)",
          fontWeight: 600,
          marginBottom: "24px",
        }}>
          ✦ 2026年最全 AI 工具导航
        </div>

        <h1 style={{
          fontSize: "clamp(32px, 5vw, 58px)",
          fontWeight: 900,
          lineHeight: 1.15,
          marginBottom: "18px",
          background: "linear-gradient(135deg, var(--grad-from), var(--grad-to))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          发现最好的 AI 工具
        </h1>

        <p style={{
          fontSize: "clamp(14px, 2vw, 18px)",
          color: "var(--muted)",
          marginBottom: "36px",
          maxWidth: "560px",
          margin: "0 auto 36px",
        }}>
          110+ 篇深度评测 · 50+ 款精选工具 · 覆盖12大类别 · 每周更新
        </p>

        {/* Search */}
        <div style={{ maxWidth: "600px", margin: "0 auto 36px" }}>
          <SearchBar placeholder="搜索 AI 工具或评测文章..." />
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/tools" style={{
            background: "var(--accent)",
            color: "#fff",
            padding: "12px 28px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 700,
            textDecoration: "none",
            transition: "background .2s",
          }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--accent-h)")}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--accent)")}
          >
            🔧 浏览工具库
          </Link>
          <Link href="/articles" style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            padding: "12px 28px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 700,
            textDecoration: "none",
            transition: "border-color .2s",
          }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)")}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)")}
          >
            📖 查看评测文章
          </Link>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "24px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "0",
        marginBottom: "64px",
        textAlign: "center",
      }}>
        {[
          { num: "110+", label: "深度评测" },
          { num: "50+",  label: "精选工具" },
          { num: "12",   label: "工具类别" },
          { num: "每周", label: "持续更新" },
        ].map((stat, i) => (
          <div key={i} style={{ padding: "8px 16px", borderRight: i < 3 ? "1px solid var(--border)" : "none" }}>
            <div style={{ fontSize: "26px", fontWeight: 900, color: "var(--accent)", marginBottom: "4px" }}>
              {stat.num}
            </div>
            <div style={{ fontSize: "12px", color: "var(--faint)" }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ marginBottom: "64px" }}>
        <SectionHeader title="🗂 工具分类" href="/tools" linkLabel="查看全部 →" />
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
          gap: "12px",
        }}>
          {CATEGORIES.map(cat => (
            <Link
              key={cat.key}
              href={`/tools?category=${cat.key}`}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "16px 12px",
                textAlign: "center",
                textDecoration: "none",
                transition: "border-color .2s, transform .2s",
                color: "inherit",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "var(--accent)";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "var(--border)";
                el.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: "26px", marginBottom: "6px" }}>{cat.icon}</div>
              <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--muted)" }}>{cat.label_zh}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED TOOLS ── */}
      {tools.length > 0 && (
        <section style={{ marginBottom: "64px" }}>
          <SectionHeader title="⭐ 精选工具" href="/tools" linkLabel="查看全部工具 →" />
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          }}>
            {tools.map(tool => (
              <ToolCard key={tool.id} tool={tool} lang="zh" />
            ))}
          </div>
        </section>
      )}

      {/* ── LATEST ARTICLES ── */}
      {articles.length > 0 && (
        <section style={{ marginBottom: "64px" }}>
          <SectionHeader title="📖 最新评测" href="/articles" linkLabel="查看全部评测 →" />
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}>
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} lang="zh" />
            ))}
          </div>
        </section>
      )}

      {/* ── SUBMIT CTA ── */}
      <section style={{
        background: "linear-gradient(135deg, rgba(99,102,241,.15), rgba(192,132,252,.1))",
        border: "1px solid rgba(99,102,241,.25)",
        borderRadius: "20px",
        padding: "48px 32px",
        textAlign: "center",
        marginBottom: "80px",
      }}>
        <h2 style={{
          fontSize: "clamp(20px, 3vw, 28px)",
          fontWeight: 900,
          marginBottom: "12px",
          background: "linear-gradient(135deg, var(--grad-from), var(--grad-to))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          发现好工具？告诉我们！
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "14.5px", marginBottom: "24px" }}>
          我们会在 3 个工作日内审核，优质工具将被收录并发布深度评测。
        </p>
        <Link href="/submit" style={{
          background: "var(--accent)",
          color: "#fff",
          padding: "12px 28px",
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: 700,
          textDecoration: "none",
          transition: "background .2s",
          display: "inline-block",
        }}
          onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--accent-h)")}
          onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--accent)")}
        >
          🔧 提交工具推荐
        </Link>
      </section>
    </div>
  );
}

function SectionHeader({ title, href, linkLabel }: { title: string; href: string; linkLabel: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
      <h2 style={{ fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 800, color: "var(--text)" }}>
        {title}
      </h2>
      <Link href={href} style={{ fontSize: "13px", color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
        {linkLabel}
      </Link>
    </div>
  );
}
