import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "联系我们 — AI Nav",
  description: "联系 AI Nav 团队：提交AI工具推荐、报告评测错误、广告合作咨询或任何反馈。",
};

const email = "sovincents69@gmail.com";

const reasons = [
  { icon: "🔧", title: "提交新工具", desc: "发现一款优质 AI 工具，想让我们评测并收录？告诉我们工具名称和官网链接。", subject: "提交AI工具推荐" },
  { icon: "✏️", title: "纠错与更新", desc: "发现某篇评测内容有误、价格变动或功能已更新？请告诉我们文章标题和具体问题。", subject: "评测内容纠错" },
  { icon: "💼", title: "广告与合作", desc: "希望在 AI Nav 展示你的产品或开展内容合作？请说明合作类型和预算范围。", subject: "广告合作咨询" },
  { icon: "💬", title: "一般反馈", desc: "对网站设计、内容质量或功能有任何建议？我们认真对待每一条用户反馈。", subject: "用户反馈" },
];

export default function ContactPage() {
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "56px 24px 80px" }}>
      <h1 style={{
        fontSize: "clamp(24px, 4vw, 34px)",
        fontWeight: 900,
        marginBottom: "8px",
        background: "linear-gradient(135deg, var(--grad-from), var(--grad-to))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>
        联系我们
      </h1>
      <p style={{ color: "var(--muted)", fontSize: "15px", marginBottom: "40px" }}>
        有问题、建议或合作需求？我们很乐意听到你的声音。
      </p>

      {/* Email block */}
      <div style={{
        background: "linear-gradient(135deg, rgba(26,26,46,.8), rgba(24,24,24,.8))",
        border: "1px solid rgba(99,102,241,.2)",
        borderRadius: "16px",
        padding: "32px",
        textAlign: "center",
        marginBottom: "32px",
      }}>
        <p style={{ color: "var(--muted)", fontSize: "14px" }}>所有事项请发送邮件至：</p>
        <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--grad-from)", margin: "12px 0 20px", letterSpacing: ".02em" }}>
          {email}
        </div>
        <a href={`mailto:${email}`} style={{
          background: "var(--accent)", color: "#fff",
          padding: "10px 24px", borderRadius: "9px",
          fontSize: "14px", fontWeight: 600, textDecoration: "none", display: "inline-block",
        }}>
          📧 立即发送邮件
        </a>
      </div>

      {/* Response time */}
      <div style={{
        background: "var(--surface)", borderLeft: "3px solid var(--success)",
        borderRadius: "0 10px 10px 0", padding: "14px 18px", marginBottom: "36px",
        fontSize: "13.5px", color: "var(--muted)",
      }}>
        <strong style={{ color: "var(--success)" }}>⏱ 回复时间：</strong>我们通常在 <strong style={{ color: "var(--text)" }}>1-2 个工作日</strong>内回复所有邮件。
      </div>

      {/* Reason cards */}
      <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text)", marginBottom: "16px" }}>联系原因</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "48px" }}>
        {reasons.map(r => (
          <div key={r.title} style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "14px", padding: "20px",
          }}>
            <div style={{ fontSize: "26px", marginBottom: "10px" }}>{r.icon}</div>
            <h3 style={{ fontSize: "14.5px", fontWeight: 700, color: "var(--text)", marginBottom: "6px" }}>{r.title}</h3>
            <p style={{ fontSize: "13px", color: "var(--subtle)", lineHeight: 1.6, marginBottom: "12px" }}>{r.desc}</p>
            <a href={`mailto:${email}?subject=${encodeURIComponent(r.subject)}`} style={{ fontSize: "13px", color: "var(--accent)", fontWeight: 600 }}>
              发送邮件 →
            </a>
          </div>
        ))}
      </div>

      {/* Or submit tool link */}
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "12px" }}>
          想推荐一款工具？可以直接使用我们的提交表单：
        </p>
        <Link href="/submit" style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          color: "var(--text)", padding: "9px 20px", borderRadius: "8px",
          fontSize: "13.5px", fontWeight: 600, textDecoration: "none",
        }}>
          🔧 前往提交表单
        </Link>
      </div>
    </div>
  );
}
