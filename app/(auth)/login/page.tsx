"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      padding: "20px",
    }}>
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "20px",
        padding: "40px",
        width: "100%",
        maxWidth: "400px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <Link href="/" className="grad-text" style={{ fontSize: "20px", fontWeight: 900 }}>
            ✦ AI Nav
          </Link>
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text)", marginTop: "16px", marginBottom: "4px" }}>
            登录 AI Nav
          </h1>
          <p style={{ fontSize: "13.5px", color: "var(--subtle)" }}>收藏工具，管理书签</p>
        </div>

        {sent ? (
          <div style={{
            background: "rgba(16,185,129,.1)",
            border: "1px solid rgba(16,185,129,.3)",
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>📧</div>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", marginBottom: "8px" }}>
              请检查你的邮箱
            </h2>
            <p style={{ fontSize: "13.5px", color: "var(--muted)" }}>
              我们已发送登录链接到 <strong style={{ color: "var(--text)" }}>{email}</strong>，点击链接即可登录。
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13.5px", fontWeight: 600, color: "var(--text)" }}>
              邮箱地址
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: "100%",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "11px 14px",
                fontSize: "14px",
                color: "var(--text)",
                outline: "none",
                marginBottom: "16px",
                transition: "border-color .2s",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
            />
            {error && (
              <p style={{ color: "#f87171", fontSize: "13px", marginBottom: "12px" }}>{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || !email}
              style={{
                width: "100%",
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "12px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: loading || !email ? "not-allowed" : "pointer",
                opacity: loading || !email ? 0.7 : 1,
                transition: "opacity .2s",
              }}
            >
              {loading ? "发送中..." : "✉️ 发送登录链接"}
            </button>
          </form>
        )}

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "12.5px", color: "var(--faint)" }}>
          登录即表示你同意我们的{" "}
          <Link href="/terms" style={{ color: "var(--accent)" }}>服务条款</Link>
          {" "}和{" "}
          <Link href="/privacy" style={{ color: "var(--accent)" }}>隐私政策</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <LoginForm />
    </Suspense>
  );
}
