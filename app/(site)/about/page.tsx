import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "关于 AI Nav — AI工具导航与深度评测",
  description: "AI Nav 是独立运营的 AI 工具评测与导航网站，成立于 2025 年，收录 110+ 篇深度评测，50+ 款精选工具。",
};

export default function AboutPage() {
  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "56px 24px 80px" }}>
      <h1 style={{
        fontSize: "clamp(26px, 4vw, 36px)",
        fontWeight: 900,
        marginBottom: "8px",
        background: "linear-gradient(135deg, var(--grad-from), var(--grad-to))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>
        关于 AI Nav
      </h1>
      <p style={{ color: "var(--muted)", fontSize: "16px", marginBottom: "48px" }}>
        专注AI工具领域的独立评测与导航网站，帮你找到真正值得用的那些。
      </p>

      {/* Stats */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "20px 24px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "0",
        marginBottom: "48px",
        textAlign: "center",
      }}>
        {[
          { num: "110+", label: "深度评测文章" },
          { num: "50+",  label: "收录AI工具" },
          { num: "12",   label: "覆盖工具分类" },
          { num: "每周", label: "持续更新" },
        ].map((stat, i) => (
          <div key={i} style={{ padding: "8px 16px", borderRight: i < 3 ? "1px solid var(--border)" : "none" }}>
            <div style={{ fontSize: "24px", fontWeight: 900, color: "var(--accent)", marginBottom: "4px" }}>{stat.num}</div>
            <div style={{ fontSize: "11px", color: "var(--faint)" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <Section title="我们是谁">
        <p>AI Nav 是一个独立运营的 AI 工具评测与导航网站，成立于 2025 年初。我们致力于提供<strong style={{ color: "var(--text)" }}>客观、实用、无营销味</strong>的 AI 工具评测内容。</p>
        <p>我们不接受工具厂商的"赞助内容"或"付费排名"。所有评测均基于我们自己的使用体验、公开基准测试数据、以及社区用户反馈综合撰写。</p>
      </Section>

      <Section title="我们做什么">
        <p>AI Nav 的价值主张很简单：<strong style={{ color: "var(--text)" }}>我们替你测，你直接用结论</strong>。每篇评测文章都包含：</p>
        <ul style={{ paddingLeft: "20px" }}>
          {["实际操作测试（不只是复述官方描述）", "与竞品的横向数据对比", "真实的免费额度说明", "明确的「谁适合用」建议"].map(item => (
            <li key={item} style={{ fontSize: "14.5px", color: "var(--muted)", marginBottom: "8px", lineHeight: 1.7 }}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title="内容声明">
        <div style={{ background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.2)", borderRadius: "10px", padding: "18px 22px" }}>
          <p><strong style={{ color: "var(--grad-from)" }}>独立性声明</strong><br />
            AI Nav 是完全独立运营的网站，与任何 AI 工具公司无隶属关系，不接受付费排名或赞助评测。</p>
          <p style={{ marginTop: "12px" }}><strong style={{ color: "var(--grad-from)" }}>推广链接</strong><br />
            部分工具链接可能为推广联盟链接（affiliate links），但不影响我们的评测立场，且会在文章中明确标注。</p>
        </div>
      </Section>

      <Section title="联系我们">
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px" }}>
          <p style={{ marginBottom: "8px" }}>有好的 AI 工具想推荐？发现评测内容有误？</p>
          <p style={{ marginBottom: "16px" }}><strong style={{ color: "var(--text)" }}>sovincents69@gmail.com</strong></p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <a href="mailto:sovincents69@gmail.com" style={{ background: "var(--accent)", color: "#fff", padding: "8px 18px", borderRadius: "8px", fontSize: "13.5px", fontWeight: 700, textDecoration: "none" }}>
              📧 发送邮件
            </a>
            <Link href="/submit" style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)", padding: "8px 18px", borderRadius: "8px", fontSize: "13.5px", fontWeight: 600, textDecoration: "none" }}>
              🔧 提交新工具
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "40px" }}>
      <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text)", borderTop: "1px solid var(--border)", paddingTop: "24px", marginBottom: "14px" }}>
        {title}
      </h2>
      <div style={{ fontSize: "14.5px", color: "var(--muted)", lineHeight: 1.8 }}>{children}</div>
    </section>
  );
}
