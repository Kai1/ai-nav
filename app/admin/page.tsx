import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — AI Nav" };

export default async function AdminOverviewPage() {
  const supabase = createAdminSupabase();

  const [
    { count: toolsCount },
    { count: articlesCount },
    { count: pendingCount },
    { count: viewsTotal },
    { count: views7d },
  ] = await Promise.all([
    supabase.from("tools").select("id", { count: "exact", head: true }),
    supabase.from("articles").select("id", { count: "exact", head: true }),
    supabase.from("tool_submissions").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("page_views").select("id", { count: "exact", head: true }),
    supabase.from("page_views").select("id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString()),
  ]);

  const stats = [
    { label: "工具总数",    value: toolsCount ?? 0,   icon: "🔧", color: "#6366f1" },
    { label: "文章总数",    value: articlesCount ?? 0, icon: "📖", color: "#8b5cf6" },
    { label: "待审核提交",  value: pendingCount ?? 0,  icon: "📬", color: "#f59e0b" },
    { label: "7日浏览量",   value: views7d ?? 0,       icon: "👁", color: "#10b981" },
    { label: "总浏览量",    value: viewsTotal ?? 0,    icon: "📈", color: "#3b82f6" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: "24px", fontWeight: 900, color: "var(--text)", marginBottom: "28px" }}>
        📊 管理概览
      </h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "16px",
        marginBottom: "40px",
      }}>
        {stats.map(stat => (
          <div key={stat.label} style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            padding: "20px",
          }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>{stat.icon}</div>
            <div style={{ fontSize: "28px", fontWeight: 900, color: stat.color, marginBottom: "4px" }}>
              {stat.value.toLocaleString()}
            </div>
            <div style={{ fontSize: "12.5px", color: "var(--subtle)" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "24px",
      }}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", marginBottom: "16px" }}>
          快速操作
        </h2>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {[
            { href: "/admin/tools", label: "➕ 新增工具", bg: "#6366f1" },
            { href: "/admin/articles", label: "➕ 新增文章", bg: "#8b5cf6" },
            { href: "/admin/submissions", label: "📬 审核提交", bg: "#f59e0b" },
          ].map(btn => (
            <a key={btn.href} href={btn.href} style={{
              background: btn.bg,
              color: "#fff",
              padding: "9px 18px",
              borderRadius: "8px",
              fontSize: "13.5px",
              fontWeight: 700,
              textDecoration: "none",
            }}>
              {btn.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function createAdminSupabase() {
  const { createClient: createSupabaseClient } = require("@supabase/supabase-js");
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
