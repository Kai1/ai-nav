"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0d0d", flexDirection: "column", gap: "16px", padding: "40px" }}>
      <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 700 }}>Something went wrong</h2>
      <p style={{ color: "#888", fontSize: "14px", maxWidth: "400px", textAlign: "center" }}>
        {error?.digest ? `Error ID: ${error.digest}` : error?.message ?? "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        style={{ background: "#6366f1", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}
      >
        Try again
      </button>
    </div>
  );
}
