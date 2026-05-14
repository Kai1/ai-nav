"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Badge from "@/components/ui/Badge";
import type { Article } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Article> | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from("articles").select("*").order("published_at", { ascending: false });
    setArticles((data ?? []) as Article[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const supabase = createClient();
    const { id, search_vector, ...payload } = editing as Article & { search_vector?: unknown };

    if (id) {
      await supabase.from("articles").update(payload).eq("id", id);
      setMsg("✅ 已保存");
    } else {
      await supabase.from("articles").insert(payload);
      setMsg("✅ 已新增");
    }
    setSaving(false);
    setEditing(null);
    await load();
    setTimeout(() => setMsg(""), 3000);
  };

  const togglePublish = async (article: Article) => {
    const supabase = createClient();
    await supabase.from("articles").update({ published: !article.published }).eq("id", article.id);
    await load();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "9px 12px",
    fontSize: "13.5px",
    color: "var(--text)",
    outline: "none",
    marginBottom: "14px",
  };

  const EMPTY: Partial<Article> = {
    slug: "", title: "", description: "", category: "chat",
    lang: "zh", content_type: "db", html_content: "",
    published: true, featured: false,
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 900, color: "var(--text)" }}>📖 文章管理</h1>
        <button onClick={() => setEditing({ ...EMPTY })} style={{
          background: "var(--accent)", color: "#fff", border: "none",
          borderRadius: "8px", padding: "8px 18px", fontSize: "13.5px", fontWeight: 700, cursor: "pointer",
        }}>
          ➕ 新增文章
        </button>
      </div>

      {msg && <div style={{ color: "var(--success)", fontSize: "13.5px", marginBottom: "12px" }}>{msg}</div>}

      {loading ? <p style={{ color: "var(--muted)" }}>加载中...</p> : (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["标题", "类别", "类型", "浏览量", "状态", "操作"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "var(--subtle)", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articles.map(article => {
                const cat = CATEGORIES.find(c => c.key === article.category);
                return (
                  <tr key={article.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 16px", maxWidth: "300px" }}>
                      <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{article.title}</div>
                      <div style={{ fontSize: "11.5px", color: "var(--faint)" }}>{article.slug}</div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Badge color="indigo">{cat?.icon ?? "📄"} {cat?.label_zh ?? article.category}</Badge>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Badge color={article.content_type === "db" ? "purple" : "gray"}>
                        {article.content_type}
                      </Badge>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--muted)" }}>
                      {article.view_count.toLocaleString()}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Badge color={article.published ? "green" : "gray"}>
                        {article.published ? "已发布" : "已下架"}
                      </Badge>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <a href={`/articles/${article.slug}`} target="_blank" style={{ background: "rgba(99,102,241,.15)", color: "var(--accent)", borderRadius: "6px", padding: "4px 10px", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}>预览</a>
                        {article.content_type === "db" && (
                          <button onClick={() => setEditing(article)} style={{ background: "rgba(99,102,241,.15)", color: "var(--accent)", border: "none", borderRadius: "6px", padding: "4px 10px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>编辑</button>
                        )}
                        <button onClick={() => togglePublish(article)} style={{ background: "var(--surface2)", color: "var(--muted)", border: "none", borderRadius: "6px", padding: "4px 10px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                          {article.published ? "下架" : "发布"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9000, padding: "20px" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "700px", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text)", marginBottom: "20px" }}>
              {(editing as Article).id ? "编辑文章" : "新增文章"}
            </h2>

            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)", marginBottom: "5px", display: "block" }}>标题 *</label>
            <input style={inputStyle} value={editing.title ?? ""} onChange={e => setEditing(ed => ({ ...ed!, title: e.target.value }))} placeholder="文章标题" />

            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)", marginBottom: "5px", display: "block" }}>Slug *</label>
            <input style={inputStyle} value={editing.slug ?? ""} onChange={e => setEditing(ed => ({ ...ed!, slug: e.target.value }))} placeholder="url-slug" />

            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)", marginBottom: "5px", display: "block" }}>描述</label>
            <input style={inputStyle} value={editing.description ?? ""} onChange={e => setEditing(ed => ({ ...ed!, description: e.target.value }))} placeholder="文章简介（用于SEO和卡片展示）" />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)", marginBottom: "5px", display: "block" }}>类别</label>
                <select value={editing.category ?? "chat"} onChange={e => setEditing(ed => ({ ...ed!, category: e.target.value }))}
                  style={{ ...inputStyle, marginBottom: 0 }}>
                  {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label_zh}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)", marginBottom: "5px", display: "block" }}>语言</label>
                <select value={editing.lang ?? "zh"} onChange={e => setEditing(ed => ({ ...ed!, lang: e.target.value }))}
                  style={{ ...inputStyle, marginBottom: 0 }}>
                  <option value="zh">中文</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)", marginBottom: "5px", display: "block" }}>HTML 内容</label>
            <textarea
              style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: "12px" }}
              rows={12}
              value={editing.html_content ?? ""}
              onChange={e => setEditing(ed => ({ ...ed!, html_content: e.target.value }))}
              placeholder="<h1>文章标题</h1><p>正文内容...</p>"
            />

            <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
              {[
                { label: "已发布", key: "published" as const },
                { label: "精选", key: "featured" as const },
              ].map(({ label, key }) => (
                <label key={key} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--muted)", cursor: "pointer" }}>
                  <input type="checkbox" checked={(editing as Article)[key] ?? false} onChange={e => setEditing(ed => ({ ...ed!, [key]: e.target.checked }))} />
                  {label}
                </label>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={save} disabled={saving} style={{ flex: 1, background: "var(--accent)", color: "#fff", border: "none", borderRadius: "8px", padding: "10px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
                {saving ? "保存中..." : "💾 保存"}
              </button>
              <button onClick={() => setEditing(null)} style={{ flex: 1, background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
