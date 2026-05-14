"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Badge from "@/components/ui/Badge";
import type { Tool } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";

const EMPTY_TOOL: Partial<Tool> = {
  name: "", slug: "", category: "writing", description: "",
  website_url: "", logo_url: "", rating: undefined,
  is_free: false, has_free_tier: true, pricing_note: "",
  featured: false, published: true, tags: [],
};

export default function AdminToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Tool> | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from("tools").select("*").order("created_at", { ascending: false });
    setTools((data ?? []) as Tool[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const supabase = createClient();
    const { id, created_at, updated_at, ...payload } = editing as Tool;

    if (id) {
      await supabase.from("tools").update(payload).eq("id", id);
      setMsg("✅ 已保存");
    } else {
      // auto-generate slug
      const slug = payload.slug || payload.name!.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      await supabase.from("tools").insert({ ...payload, slug });
      setMsg("✅ 已新增");
    }
    setSaving(false);
    setEditing(null);
    await load();
    setTimeout(() => setMsg(""), 3000);
  };

  const togglePublish = async (tool: Tool) => {
    const supabase = createClient();
    await supabase.from("tools").update({ published: !tool.published }).eq("id", tool.id);
    await load();
  };

  const deleteTool = async (id: string) => {
    if (!confirm("确定删除这个工具？")) return;
    const supabase = createClient();
    await supabase.from("tools").delete().eq("id", id);
    await load();
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 900, color: "var(--text)" }}>🔧 工具管理</h1>
        <button onClick={() => setEditing({ ...EMPTY_TOOL })} style={{
          background: "var(--accent)", color: "#fff", border: "none",
          borderRadius: "8px", padding: "8px 18px", fontSize: "13.5px", fontWeight: 700, cursor: "pointer",
        }}>
          ➕ 新增工具
        </button>
      </div>

      {msg && <div style={{ color: "var(--success)", fontSize: "13.5px", marginBottom: "12px" }}>{msg}</div>}

      {/* Table */}
      {loading ? (
        <p style={{ color: "var(--muted)" }}>加载中...</p>
      ) : (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["名称", "类别", "评分", "状态", "操作"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "var(--subtle)", textTransform: "uppercase" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tools.map(tool => {
                const cat = CATEGORIES.find(c => c.key === tool.category);
                return (
                  <tr key={tool.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>{tool.name}</div>
                      <div style={{ fontSize: "11.5px", color: "var(--faint)" }}>{tool.slug}</div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Badge color="indigo">{cat?.icon} {cat?.label_zh ?? tool.category}</Badge>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--muted)" }}>
                      {tool.rating ? `★ ${tool.rating}` : "—"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Badge color={tool.published ? "green" : "gray"}>
                        {tool.published ? "已发布" : "已下架"}
                      </Badge>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Btn onClick={() => setEditing(tool)}>编辑</Btn>
                        <Btn onClick={() => togglePublish(tool)} variant="ghost">
                          {tool.published ? "下架" : "发布"}
                        </Btn>
                        <Btn onClick={() => deleteTool(tool.id)} variant="danger">删除</Btn>
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
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9000, padding: "20px",
        }}>
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "560px",
            maxHeight: "90vh", overflowY: "auto",
          }}>
            <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text)", marginBottom: "20px" }}>
              {(editing as Tool).id ? "编辑工具" : "新增工具"}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <Field label="工具名称 *">
                <Input value={editing.name ?? ""} onChange={v => setEditing(e => ({ ...e!, name: v }))} />
              </Field>
              <Field label="Slug (URL)">
                <Input value={editing.slug ?? ""} onChange={v => setEditing(e => ({ ...e!, slug: v }))} />
              </Field>
              <Field label="类别 *">
                <select
                  value={editing.category ?? "writing"}
                  onChange={ev => setEditing(e => ({ ...e!, category: ev.target.value }))}
                  style={selectStyle}
                >
                  {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label_zh}</option>)}
                </select>
              </Field>
              <Field label="官网地址">
                <Input value={editing.website_url ?? ""} onChange={v => setEditing(e => ({ ...e!, website_url: v }))} />
              </Field>
              <Field label="评分 (0-10)">
                <Input type="number" value={editing.rating?.toString() ?? ""} onChange={v => setEditing(e => ({ ...e!, rating: v ? parseFloat(v) : undefined }))} />
              </Field>
              <Field label="Logo URL">
                <Input value={editing.logo_url ?? ""} onChange={v => setEditing(e => ({ ...e!, logo_url: v }))} />
              </Field>
            </div>

            <Field label="描述">
              <textarea
                value={editing.description ?? ""}
                onChange={ev => setEditing(e => ({ ...e!, description: ev.target.value }))}
                rows={3}
                style={{ ...selectStyle, resize: "vertical" }}
              />
            </Field>

            <Field label="定价说明">
              <Input value={editing.pricing_note ?? ""} onChange={v => setEditing(e => ({ ...e!, pricing_note: v }))} />
            </Field>

            <div style={{ display: "flex", gap: "16px", margin: "12px 0 20px" }}>
              <CheckBox label="免费工具" checked={editing.is_free ?? false} onChange={v => setEditing(e => ({ ...e!, is_free: v }))} />
              <CheckBox label="有免费额度" checked={editing.has_free_tier ?? false} onChange={v => setEditing(e => ({ ...e!, has_free_tier: v }))} />
              <CheckBox label="精选推荐" checked={editing.featured ?? false} onChange={v => setEditing(e => ({ ...e!, featured: v }))} />
              <CheckBox label="已发布" checked={editing.published ?? true} onChange={v => setEditing(e => ({ ...e!, published: v }))} />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={save} disabled={saving} style={{
                flex: 1, background: "var(--accent)", color: "#fff", border: "none",
                borderRadius: "8px", padding: "10px", fontSize: "14px", fontWeight: 700, cursor: "pointer",
              }}>
                {saving ? "保存中..." : "💾 保存"}
              </button>
              <button onClick={() => setEditing(null)} style={{
                flex: 1, background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)",
                borderRadius: "8px", padding: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer",
              }}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--surface2)", border: "1px solid var(--border)",
  borderRadius: "8px", padding: "9px 12px", fontSize: "13.5px", color: "var(--text)", outline: "none",
};
const selectStyle: React.CSSProperties = { ...inputStyle };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "4px" }}>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted)", marginBottom: "5px" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = "text" }: { value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} style={inputStyle} />
  );
}

function CheckBox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--muted)", cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function Btn({ children, onClick, variant = "primary" }: { children: React.ReactNode; onClick: () => void; variant?: "primary" | "ghost" | "danger" }) {
  const bg = variant === "primary" ? "rgba(99,102,241,.15)" : variant === "danger" ? "rgba(239,68,68,.15)" : "var(--surface2)";
  const color = variant === "primary" ? "var(--accent)" : variant === "danger" ? "#f87171" : "var(--muted)";
  return (
    <button onClick={onClick} style={{
      background: bg, color, border: "none", borderRadius: "6px",
      padding: "4px 10px", fontSize: "12px", fontWeight: 600, cursor: "pointer",
    }}>
      {children}
    </button>
  );
}
