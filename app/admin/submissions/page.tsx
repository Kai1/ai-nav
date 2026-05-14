"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Badge from "@/components/ui/Badge";
import type { ToolSubmission } from "@/lib/types";

export default function AdminSubmissionsPage() {
  const [items, setItems] = useState<ToolSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let q = supabase.from("tool_submissions").select("*").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setItems((data ?? []) as ToolSubmission[]);
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: "approved" | "rejected", note?: string) => {
    const supabase = createClient();
    await supabase.from("tool_submissions").update({ status, admin_note: note ?? "" }).eq("id", id);
    setMsg(status === "approved" ? "✅ 已通过" : "❌ 已拒绝");
    await load();
    setTimeout(() => setMsg(""), 3000);
  };

  const tabs: Array<{ label: string; value: typeof filter }> = [
    { label: "待审核", value: "pending" },
    { label: "已通过", value: "approved" },
    { label: "已拒绝", value: "rejected" },
    { label: "全部",   value: "all" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: "22px", fontWeight: 900, color: "var(--text)", marginBottom: "24px" }}>
        📬 提交审核
      </h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {tabs.map(tab => (
          <button key={tab.value} onClick={() => setFilter(tab.value)} style={{
            background: filter === tab.value ? "var(--accent)" : "var(--surface)",
            border: `1px solid ${filter === tab.value ? "var(--accent)" : "var(--border)"}`,
            color: filter === tab.value ? "#fff" : "var(--muted)",
            borderRadius: "20px",
            padding: "5px 14px",
            fontSize: "12.5px",
            fontWeight: 600,
            cursor: "pointer",
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {msg && <div style={{ color: "var(--success)", fontSize: "13.5px", marginBottom: "12px" }}>{msg}</div>}

      {loading ? (
        <p style={{ color: "var(--muted)" }}>加载中...</p>
      ) : items.length === 0 ? (
        <p style={{ color: "var(--subtle)", padding: "40px 0", textAlign: "center" }}>暂无记录</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {items.map(item => (
            <div key={item.id} style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "20px",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text)" }}>{item.tool_name}</h3>
                    <Badge color={item.status === "pending" ? "amber" : item.status === "approved" ? "green" : "red"}>
                      {item.status === "pending" ? "待审核" : item.status === "approved" ? "已通过" : "已拒绝"}
                    </Badge>
                  </div>
                  <a href={item.website_url} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: "13px", color: "var(--accent)", display: "block", marginBottom: "6px" }}>
                    {item.website_url}
                  </a>
                  {item.description && (
                    <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>{item.description}</p>
                  )}
                  {item.submitter_email && (
                    <p style={{ fontSize: "12px", color: "var(--faint)", marginTop: "6px" }}>
                      提交者: {item.submitter_email}
                    </p>
                  )}
                  <p style={{ fontSize: "11.5px", color: "var(--faint)", marginTop: "4px" }}>
                    {new Date(item.created_at).toLocaleString("zh-CN")}
                  </p>
                </div>

                {item.status === "pending" && (
                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    <button onClick={() => updateStatus(item.id, "approved")} style={{
                      background: "rgba(16,185,129,.15)", color: "var(--success)",
                      border: "none", borderRadius: "8px", padding: "7px 14px",
                      fontSize: "13px", fontWeight: 700, cursor: "pointer",
                    }}>
                      ✅ 通过
                    </button>
                    <button onClick={() => updateStatus(item.id, "rejected")} style={{
                      background: "rgba(239,68,68,.15)", color: "#f87171",
                      border: "none", borderRadius: "8px", padding: "7px 14px",
                      fontSize: "13px", fontWeight: 700, cursor: "pointer",
                    }}>
                      ❌ 拒绝
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
