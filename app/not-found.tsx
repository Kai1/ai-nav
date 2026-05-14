import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "404 — 页面未找到 | AI Nav" };

export default function NotFound() {
  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "40px 20px",
    }}>
      <div style={{ fontSize: "64px", marginBottom: "20px" }}>🤖</div>
      <h1 style={{
        fontSize: "clamp(28px, 5vw, 48px)",
        fontWeight: 900,
        background: "linear-gradient(135deg, var(--grad-from), var(--grad-to))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        marginBottom: "12px",
      }}>
        404
      </h1>
      <p style={{ fontSize: "18px", color: "var(--muted)", marginBottom: "8px" }}>
        找不到这个页面
      </p>
      <p style={{ fontSize: "14px", color: "var(--subtle)", marginBottom: "32px" }}>
        页面可能已移动、删除或地址输入有误。
      </p>
      <Link href="/" style={{
        background: "var(--accent)",
        color: "#fff",
        padding: "11px 26px",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: 700,
        textDecoration: "none",
        transition: "background .2s",
      }}>
        ← 返回首页
      </Link>
    </div>
  );
}
