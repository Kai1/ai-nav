"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const { lang, setLang, t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setIsAdmin(data.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
  };

  return (
    <header style={{
      height: "58px",
      background: "rgba(13,13,13,.97)",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      padding: "0 24px",
      position: "sticky",
      top: 0,
      zIndex: 100,
      gap: "8px",
    }}>
      {/* Logo */}
      <Link href="/" className="grad-text" style={{ fontSize: "17px", fontWeight: 900, flexShrink: 0 }}>
        ✦ AI Nav
      </Link>

      {/* Desktop nav */}
      <nav style={{ display: "flex", alignItems: "center", gap: "4px", marginLeft: "20px", flex: 1 }}
           className="hidden-mobile">
        <NavLink href="/tools">{t("nav_tools")}</NavLink>
        <NavLink href="/articles">{t("nav_articles")}</NavLink>
        <NavLink href="/submit">{t("nav_submit")}</NavLink>
      </nav>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
        {/* Lang toggle */}
        <button
          onClick={() => setLang(lang === "zh" ? "en" : "zh")}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--muted)",
            borderRadius: "6px",
            padding: "4px 10px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "border-color .2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          {lang === "zh" ? "EN" : "中文"}
        </button>

        {user ? (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "var(--accent)",
                border: "none",
                color: "#fff",
                borderRadius: "20px",
                padding: "5px 14px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "11px" }}>
                {user.email?.[0]?.toUpperCase()}
              </span>
              {isAdmin ? t("nav_admin") : t("nav_dashboard")}
            </button>
            {menuOpen && (
              <div style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 8px)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "6px",
                minWidth: "160px",
                zIndex: 200,
                boxShadow: "0 8px 24px rgba(0,0,0,.4)",
              }}>
                <DropdownItem href="/dashboard" onClick={() => setMenuOpen(false)}>{t("nav_dashboard")}</DropdownItem>
                {isAdmin && <DropdownItem href="/admin" onClick={() => setMenuOpen(false)}>{t("nav_admin")}</DropdownItem>}
                <div style={{ height: "1px", background: "var(--border)", margin: "4px 0" }} />
                <button onClick={handleSignOut} style={{ width: "100%", textAlign: "left", background: "none", border: "none", color: "var(--subtle)", fontSize: "13px", padding: "7px 10px", borderRadius: "6px", cursor: "pointer" }}>
                  {t("nav_logout")}
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            borderRadius: "8px",
            padding: "6px 14px",
            fontSize: "13px",
            fontWeight: 600,
            transition: "border-color .2s",
          }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)")}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)")}
          >
            {t("nav_login")}
          </Link>
        )}
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{
      color: "var(--muted)",
      fontSize: "13.5px",
      fontWeight: 500,
      padding: "5px 10px",
      borderRadius: "6px",
      transition: "color .15s, background .15s",
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text)"; (e.currentTarget as HTMLAnchorElement).style.background = "var(--surface)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
    >
      {children}
    </Link>
  );
}

function DropdownItem({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} style={{
      display: "block",
      color: "var(--text)",
      fontSize: "13px",
      padding: "7px 10px",
      borderRadius: "6px",
      transition: "background .15s",
    }}
      onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--surface2)")}
      onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = "transparent")}
    >
      {children}
    </Link>
  );
}
