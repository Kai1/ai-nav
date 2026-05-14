import { createClient, createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import BookmarkButton from "@/components/tools/BookmarkButton";
import { CATEGORIES } from "@/lib/types";
import type { Tool } from "@/lib/types";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("tools").select("name,description").eq("slug", slug).single();
  if (!data) return {};
  return {
    title: `${data.name} 评测 — 功能、定价与替代方案`,
    description: data.description ?? "",
  };
}

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("tools").select("slug").eq("published", true);
    return (data ?? []).map(({ slug }: { slug: string }) => ({ slug }));
  } catch {
    return [];
  }
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("tools").select("*").eq("slug", slug).single();
  if (!data) notFound();

  const tool = data as Tool;
  const cat = CATEGORIES.find(c => c.key === tool.category);

  // Record view
  supabase.from("page_views").insert({ path: `/tools/${slug}` }).then(() => {});

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 20px 80px" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: "13px", color: "var(--subtle)", marginBottom: "24px" }}>
        <Link href="/tools" style={{ color: "var(--accent)" }}>工具库</Link>
        {" "}/{" "}
        <span>{tool.name}</span>
      </div>

      {/* Tool header */}
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", marginBottom: "32px" }}>
        <div style={{
          width: "72px", height: "72px", borderRadius: "16px",
          background: "var(--surface)", border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "36px", flexShrink: 0,
        }}>
          {tool.logo_url ? <img src={tool.logo_url} alt={tool.name} width={72} height={72} style={{ objectFit: "cover", borderRadius: "16px" }} /> : cat?.icon ?? "🔧"}
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 900, color: "var(--text)", marginBottom: "8px" }}>
            {tool.name}
          </h1>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
            {cat && <Badge color="indigo">{cat.icon} {cat.label_zh}</Badge>}
            {tool.is_free && <Badge color="green">免费</Badge>}
            {!tool.is_free && tool.has_free_tier && <Badge color="amber">免费+付费</Badge>}
            {!tool.is_free && !tool.has_free_tier && <Badge color="gray">付费</Badge>}
            {tool.rating && (
              <Badge color="purple">★ {tool.rating.toFixed(1)}</Badge>
            )}
          </div>
          {tool.description && (
            <p style={{ color: "var(--muted)", fontSize: "14.5px", lineHeight: 1.7 }}>
              {tool.description}
            </p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "40px", flexWrap: "wrap" }}>
        {tool.website_url && (
          <a href={tool.website_url} target="_blank" rel="noopener noreferrer" style={{
            background: "var(--accent)", color: "#fff",
            padding: "10px 22px", borderRadius: "10px",
            fontSize: "14px", fontWeight: 700,
            textDecoration: "none", transition: "background .2s",
          }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--accent-h)")}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--accent)")}
          >
            访问官网 ↗
          </a>
        )}
        <BookmarkButton toolId={tool.id} size="md" />
      </div>

      {/* Details */}
      {tool.pricing_note && (
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "12px", padding: "20px", marginBottom: "24px",
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", marginBottom: "8px" }}>💰 定价说明</h2>
          <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.7 }}>{tool.pricing_note}</p>
        </div>
      )}

      {/* Tags */}
      {tool.tags && tool.tags.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text)", marginBottom: "10px" }}>🏷 标签</h2>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {tool.tags.map(tag => (
              <Badge key={tag} color="gray">{tag}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Back */}
      <Link href="/tools" style={{ color: "var(--accent)", fontSize: "13.5px" }}>← 返回工具库</Link>
    </div>
  );
}
