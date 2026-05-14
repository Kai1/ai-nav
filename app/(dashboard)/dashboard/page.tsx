import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import ToolCard from "@/components/tools/ToolCard";
import type { Tool } from "@/lib/types";

export const metadata: Metadata = {
  title: "我的收藏 — AI Nav",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/dashboard");

  const { data: bookmarks } = await supabase
    .from("user_bookmarks")
    .select("*, tool:tools(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const tools = (bookmarks ?? []).map(b => b.tool).filter(Boolean) as Tool[];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 20px 80px" }}>
      <div style={{ marginBottom: "36px" }}>
        <h1 style={{
          fontSize: "clamp(24px, 4vw, 34px)",
          fontWeight: 900,
          marginBottom: "8px",
          background: "linear-gradient(135deg, var(--grad-from), var(--grad-to))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          我的收藏
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "14px" }}>
          {user.email} · {tools.length} 款工具
        </p>
      </div>

      {tools.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "16px",
        }}>
          {tools.map(tool => <ToolCard key={tool.id} tool={tool} lang="zh" />)}
        </div>
      ) : (
        <div style={{
          textAlign: "center",
          padding: "80px 20px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⭐</div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text)", marginBottom: "8px" }}>
            还没有收藏任何工具
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "24px" }}>
            浏览工具库，点击 ☆ 收藏你喜欢的工具
          </p>
          <Link href="/tools" style={{
            background: "var(--accent)",
            color: "#fff",
            padding: "10px 22px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 700,
            textDecoration: "none",
          }}>
            去发现工具 →
          </Link>
        </div>
      )}
    </div>
  );
}
