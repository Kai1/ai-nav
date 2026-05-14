import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私政策 — AI Nav",
  description: "AI Nav 隐私政策：我们如何收集、使用和保护你的个人信息，以及你的 GDPR 权利。",
};

export default function PrivacyPage() {
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
        隐私政策
      </h1>
      <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "48px" }}>
        最后更新：2026年5月 | 生效日期：2026年5月1日
      </p>

      <Section title="1. 我们收集的信息">
        <p>我们收集以下类型的信息：</p>
        <ul>
          <li><strong>账户信息</strong>：当你通过魔法链接登录时，我们收集并存储你的邮箱地址。</li>
          <li><strong>使用数据</strong>：页面浏览记录（路径、时间戳），用于统计页面浏览量。</li>
          <li><strong>工具收藏</strong>：你收藏的工具 ID，与你的账户关联存储。</li>
          <li><strong>提交内容</strong>：工具推荐提交表单中的工具名称、网址、描述和可选邮箱。</li>
          <li><strong>Cookie</strong>：见下方 Cookie 政策。</li>
        </ul>
      </Section>

      <Section title="2. Cookie 政策">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
          <thead>
            <tr style={{ background: "var(--surface2)" }}>
              {["类型", "名称/提供方", "用途", "有效期"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "var(--text)", borderBottom: "1px solid var(--border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["必要", "ai_nav_consent", "记录 Cookie 同意状态", "永久"],
              ["必要", "ai_nav_lang", "记录语言偏好", "1年"],
              ["必要", "Supabase auth token", "维持登录状态", "Session"],
              ["广告", "Google AdSense", "展示个性化广告", "13个月"],
              ["分析", "Vercel Analytics", "统计访问量", "Session"],
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "10px 12px", color: "var(--muted)" }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="3. 我们如何使用你的信息">
        <ul>
          <li>提供网站核心功能（登录、收藏）</li>
          <li>统计页面浏览量（匿名）</li>
          <li>审核工具推荐提交</li>
          <li>通过 Google AdSense 展示广告（需你同意）</li>
          <li>改善网站内容和用户体验</li>
        </ul>
      </Section>

      <Section title="4. 你的 GDPR 权利">
        <p>如果你位于欧盟/欧洲经济区，你享有以下权利：</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginTop: "12px" }}>
          {[
            { icon: "📋", right: "知情权", desc: "了解我们收集哪些数据" },
            { icon: "📂", right: "访问权", desc: "获取你的个人数据副本" },
            { icon: "✏️", right: "更正权", desc: "更正不准确的数据" },
            { icon: "🗑️", right: "删除权", desc: "要求删除你的数据" },
            { icon: "⏸️", right: "限制权", desc: "限制我们处理你的数据" },
            { icon: "🚫", right: "反对权", desc: "反对特定数据处理" },
            { icon: "📤", right: "携带权", desc: "以机器可读格式获取数据" },
            { icon: "↩️", right: "撤回同意权", desc: "随时撤回对 Cookie 的同意" },
          ].map(item => (
            <div key={item.right} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px" }}>
              <div style={{ fontSize: "20px", marginBottom: "6px" }}>{item.icon}</div>
              <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text)", marginBottom: "4px" }}>{item.right}</div>
              <div style={{ fontSize: "12.5px", color: "var(--subtle)" }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: "16px" }}>行使上述权利，请发邮件至 <a href="mailto:sovincents69@gmail.com" style={{ color: "var(--accent)" }}>sovincents69@gmail.com</a>，我们将在30天内回复。</p>
      </Section>

      <Section title="5. Google AdSense 广告">
        <p>本网站使用 Google AdSense 展示广告。Google 可能会根据你的浏览历史使用 Cookie 展示个性化广告。</p>
        <ul>
          <li>如需退出个性化广告：<a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>Google 广告设置</a></li>
          <li>欧盟用户另可使用：<a href="https://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>Your Online Choices</a></li>
          <li>我们已实施 Google Consent Mode v2，在你同意之前不会加载个性化广告</li>
        </ul>
      </Section>

      <Section title="6. 数据存储与安全">
        <p>用户数据存储在 Supabase（美国/欧盟数据中心），页面托管于 Vercel。我们采用以下安全措施：</p>
        <ul>
          <li>所有传输通过 HTTPS 加密</li>
          <li>数据库行级安全（RLS）策略，用户只能访问自己的数据</li>
          <li>服务密钥仅在服务端使用，不暴露给客户端</li>
        </ul>
      </Section>

      <Section title="7. 联系我们">
        <p>对本隐私政策有任何疑问，请联系：<a href="mailto:sovincents69@gmail.com" style={{ color: "var(--accent)" }}>sovincents69@gmail.com</a></p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "40px" }}>
      <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text)", borderTop: "1px solid var(--border)", paddingTop: "24px", marginBottom: "14px" }}>
        {title}
      </h2>
      <div style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.8 }}>{children}</div>
    </section>
  );
}
