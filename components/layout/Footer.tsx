"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLanguage();

  const openCookieSettings = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-cookie-settings"));
    }
  };

  return (
    <footer style={{
      background: "var(--surface)",
      borderTop: "1px solid var(--border)",
      padding: "28px 24px",
      textAlign: "center",
      marginTop: "auto",
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Logo */}
        <div className="grad-text" style={{ fontSize: "16px", fontWeight: 900, marginBottom: "16px" }}>
          ✦ AI Nav
        </div>

        {/* Links */}
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "12px" }}>
          <FooterLink href="/">{t("nav_home")}</FooterLink>
          <FooterLink href="/tools">{t("nav_tools")}</FooterLink>
          <FooterLink href="/about">{t("footer_about")}</FooterLink>
          <FooterLink href="/contact">{t("footer_contact")}</FooterLink>
          <FooterLink href="/privacy">{t("footer_privacy")}</FooterLink>
          <FooterLink href="/terms">{t("footer_terms")}</FooterLink>
          <button
            onClick={openCookieSettings}
            style={{
              background: "none",
              border: "none",
              color: "var(--faint)",
              fontSize: "12.5px",
              cursor: "pointer",
              padding: 0,
              transition: "color .15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--faint)")}
          >
            {t("footer_cookie_settings")}
          </button>
        </div>

        {/* Copyright */}
        <p style={{ fontSize: "11.5px", color: "var(--faint)" }}>
          {t("footer_copy")}
        </p>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{
      color: "var(--faint)",
      fontSize: "12.5px",
      transition: "color .15s",
    }}
      onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)")}
      onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--faint)")}
    >
      {children}
    </Link>
  );
}
