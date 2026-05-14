"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function grantConsent() {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });
  }
  localStorage.setItem("ai_nav_consent", "granted");
}

function denyConsent() {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
  }
  localStorage.setItem("ai_nav_consent", "denied");
}

export default function CookieBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ai_nav_consent");
    if (!stored) setVisible(true);

    // Listen for "open-cookie-settings" from Footer
    const handler = () => setVisible(true);
    window.addEventListener("open-cookie-settings", handler);
    return () => window.removeEventListener("open-cookie-settings", handler);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(600px, calc(100vw - 32px))",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "18px 22px",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,.5)",
        flexWrap: "wrap",
      }}
    >
      <p style={{ flex: 1, fontSize: "13.5px", color: "var(--muted)", minWidth: "200px" }}>
        {t("cookie_msg")}{" "}
        <Link href="/privacy" style={{ color: "var(--accent)", fontSize: "13px" }}>
          {t("cookie_learn_more")}
        </Link>
      </p>
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <button
          onClick={() => { denyConsent(); setVisible(false); }}
          style={{
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            borderRadius: "8px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {t("cookie_essential")}
        </button>
        <button
          onClick={() => { grantConsent(); setVisible(false); }}
          style={{
            background: "var(--accent)",
            border: "none",
            color: "#fff",
            borderRadius: "8px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background .2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--accent-h)")}
          onMouseLeave={e => (e.currentTarget.style.background = "var(--accent)")}
        >
          {t("cookie_accept_all")}
        </button>
      </div>
    </div>
  );
}
