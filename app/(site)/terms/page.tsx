import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "服务条款 — AI Nav",
  description: "AI Nav 服务条款：使用本网站即表示你同意以下条款，包括内容使用、免责声明和版权政策。",
};

export default function TermsPage() {
  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "56px 24px 80px" }}>
      <h1 style={{
        fontSize: "clamp(24px, 4vw, 34px)",
        fontWeight: 900,
        marginBottom: "8px",
        background: "linear-gradient(135deg, var(--grad-from), var(--grad-to))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>
        服务条款
      </h1>
      <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "48px" }}>
        最后更新：2026年5月 | 访问本网站即表示你接受以下条款
      </p>

      <Section title="1. 条款接受">
        <p>使用 AI Nav（ai-nav.vercel.app）即表示你接受本服务条款。如不同意，请停止使用本网站。</p>
      </Section>

      <Section title="2. 网站性质">
        <p>AI Nav 是独立运营的 AI 工具评测与导航网站，与任何 AI 工具公司无隶属关系。我们的目标是提供客观、实用的工具评测内容。</p>
      </Section>

      <Section title="3. 内容准确性免责声明">
        <p>AI 产品更新极快，我们尽力保持内容的时效性，但不保证所有信息在任意时刻均完全准确。评测内容反映发布时的实际状况，价格、功能和政策可能已发生变化。</p>
        <p>本网站内容仅供参考，不构成任何商业建议。</p>
      </Section>

      <Section title="4. 推广链接披露（FTC 合规）">
        <p>根据 FTC 指南，本网站部分工具链接可能为推广联盟链接（Affiliate Links）。当你通过这些链接进行付费订阅时，我们可能获得佣金。</p>
        <p>联盟关系不影响我们的评测立场——我们只推荐我们自己真正会用的工具，且会在文章中明确标注推广链接。</p>
      </Section>

      <Section title="5. 知识产权">
        <p>本网站所有原创评测文章、图表和设计均受版权保护，© 2026 AI Nav。</p>
        <p><strong style={{ color: "var(--text)" }}>允许</strong>：</p>
        <ul>
          <li>个人学习和参考使用</li>
          <li>引用摘要（不超过300字），需标注来源和原文链接</li>
        </ul>
        <p style={{ marginTop: "8px" }}><strong style={{ color: "var(--text)" }}>禁止</strong>：</p>
        <ul>
          <li>全文复制或转载（无论是否署名）</li>
          <li>用于 AI 模型训练数据集</li>
          <li>去掉署名或来源的任何形式转载</li>
          <li>商业用途（未经书面许可）</li>
        </ul>
      </Section>

      <Section title="6. 用户提交内容">
        <p>通过工具推荐表单提交的内容，你授予我们在本网站上使用、修改和发布的权利。请确保你的提交不包含虚假信息或侵权内容。</p>
      </Section>

      <Section title="7. 第三方链接">
        <p>本网站包含指向第三方工具和服务的链接。我们不对这些外部网站的内容、隐私政策或可用性负责。</p>
      </Section>

      <Section title="8. 责任限制">
        <p>在法律允许的最大范围内，AI Nav 对因使用本网站内容或工具推荐而造成的任何直接或间接损失不承担责任。</p>
      </Section>

      <Section title="9. 条款变更">
        <p>我们保留随时更新本服务条款的权利。重大变更将在网站首页公告。继续使用本网站即表示接受更新后的条款。</p>
      </Section>

      <Section title="10. 联系方式">
        <p>如对本条款有任何疑问，请联系：<a href="mailto:sovincents69@gmail.com" style={{ color: "var(--accent)" }}>sovincents69@gmail.com</a></p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "36px" }}>
      <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text)", borderTop: "1px solid var(--border)", paddingTop: "22px", marginBottom: "12px" }}>
        {title}
      </h2>
      <div style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.8 }}>{children}</div>
    </section>
  );
}
