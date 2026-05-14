"use client";

import { useState } from "react";
import type { Metadata } from "next";

export default function SubmitPage() {
  const [form, setForm] = useState({ tool_name: "", website_url: "", description: "", submitter_email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "11px 14px",
    fontSize: "14px",
    color: "var(--text)",
    outline: "none",
    marginBottom: "16px",
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "56px 20px 80px" }}>
      <h1 style={{
        fontSize: "clamp(24px, 4vw, 34px)",
        fontWeight: 900,
        marginBottom: "8px",
        background: "linear-gradient(135deg, var(--grad-from), var(--grad-to))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>
        推荐 AI 工具
      </h1>
      <p style={{ color: "var(--muted)", fontSize: "15px", marginBottom: "40px" }}>
        发现一款好工具？告诉我们，我们会在 3 个工作日内审核。
      </p>

      {status === "success" ? (
        <div style={{
          background: "rgba(16,185,129,.1)",
          border: "1px solid rgba(16,185,129,.3)",
          borderRadius: "14px",
          padding: "32px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎉</div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text)", marginBottom: "8px" }}>提交成功！</h2>
          <p style={{ color: "var(--muted)", fontSize: "14px" }}>
            我们会在 3 个工作日内审核。优质工具将被收录并发布深度评测。
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "32px",
        }}>
          <label style={{ display: "block", fontSize: "13.5px", fontWeight: 600, color: "var(--text)", marginBottom: "6px" }}>
            工具名称 *
          </label>
          <input required style={inputStyle} value={form.tool_name} onChange={update("tool_name")} placeholder="例：Perplexity AI" />

          <label style={{ display: "block", fontSize: "13.5px", fontWeight: 600, color: "var(--text)", marginBottom: "6px" }}>
            官网地址 *
          </label>
          <input required type="url" style={inputStyle} value={form.website_url} onChange={update("website_url")} placeholder="https://..." />

          <label style={{ display: "block", fontSize: "13.5px", fontWeight: 600, color: "var(--text)", marginBottom: "6px" }}>
            简短描述（可选）
          </label>
          <textarea style={{ ...inputStyle, resize: "vertical" }} rows={3} value={form.description} onChange={update("description")} placeholder="这款工具的主要功能和亮点..." />

          <label style={{ display: "block", fontSize: "13.5px", fontWeight: 600, color: "var(--text)", marginBottom: "6px" }}>
            你的邮箱（可选，审核通过后通知你）
          </label>
          <input type="email" style={inputStyle} value={form.submitter_email} onChange={update("submitter_email")} placeholder="your@email.com" />

          {status === "error" && (
            <p style={{ color: "#f87171", fontSize: "13px", marginBottom: "12px" }}>提交失败，请稍后重试。</p>
          )}

          <button type="submit" disabled={status === "loading"} style={{
            width: "100%",
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "12px",
            fontSize: "15px",
            fontWeight: 700,
            cursor: status === "loading" ? "wait" : "pointer",
            opacity: status === "loading" ? 0.7 : 1,
          }}>
            {status === "loading" ? "提交中..." : "🚀 提交推荐"}
          </button>
        </form>
      )}
    </div>
  );
}
