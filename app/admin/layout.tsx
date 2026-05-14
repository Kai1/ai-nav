import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const adminLinks = [
  { href: "/admin",              label: "📊 概览" },
  { href: "/admin/tools",        label: "🔧 工具管理" },
  { href: "/admin/articles",     label: "📖 文章管理" },
  { href: "/admin/submissions",  label: "📬 提交审核" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect("/login?redirectTo=/admin");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside style={{
        width: "220px",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        padding: "24px 16px",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}>
        <Link href="/" className="grad-text" style={{ fontSize: "16px", fontWeight: 900, marginBottom: "32px", display: "block" }}>
          ✦ AI Nav
        </Link>
        <nav style={{ flex: 1 }}>
          {adminLinks.map(link => (
            <Link key={link.href} href={link.href} style={{
              display: "block",
              color: "var(--muted)",
              fontSize: "13.5px",
              fontWeight: 600,
              padding: "9px 12px",
              borderRadius: "8px",
              marginBottom: "2px",
              textDecoration: "none",
              transition: "background .15s, color .15s",
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "var(--surface2)"; el.style.color = "var(--text)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "transparent"; el.style.color = "var(--muted)"; }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div style={{ fontSize: "11.5px", color: "var(--faint)" }}>
          Admin: {user.email}
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: "32px", overflow: "auto" }}>
        {children}
      </main>
    </div>
  );
}
