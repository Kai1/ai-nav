import Link from "next/link";
import Badge from "@/components/ui/Badge";
import BookmarkButton from "@/components/tools/BookmarkButton";
import type { Tool } from "@/lib/types";
import type { Lang } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/types";

interface ToolCardProps {
  tool: Tool;
  lang?: Lang;
}

export default function ToolCard({ tool, lang = "zh" }: ToolCardProps) {
  const cat = CATEGORIES.find(c => c.key === tool.category);
  const catLabel = cat ? (lang === "zh" ? cat.label_zh : cat.label_en) : tool.category;
  const catIcon = cat?.icon ?? "🔧";

  const pricingLabel = tool.is_free
    ? (lang === "zh" ? "免费" : "Free")
    : tool.has_free_tier
    ? (lang === "zh" ? "免费+" : "Freemium")
    : (lang === "zh" ? "付费" : "Paid");

  const pricingColor = tool.is_free ? "green" : tool.has_free_tier ? "amber" : "gray";

  return (
    <Link
      href={`/tools/${tool.slug}`}
      style={{
        display: "block",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "20px",
        transition: "border-color .2s, transform .2s, box-shadow .2s",
        textDecoration: "none",
        color: "inherit",
        position: "relative",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.borderColor = "var(--accent)";
        el.style.transform = "translateY(-2px)";
        el.style.boxShadow = "0 8px 24px rgba(99,102,241,.12)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.borderColor = "var(--border)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
        {/* Logo / icon */}
        <div style={{
          width: "44px",
          height: "44px",
          borderRadius: "10px",
          background: "var(--surface2)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          flexShrink: 0,
          overflow: "hidden",
        }}>
          {tool.logo_url
            ? <img src={tool.logo_url} alt={tool.name} width={44} height={44} style={{ objectFit: "cover" }} />
            : catIcon}
        </div>

        {/* Name + badges */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text)", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {tool.name}
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
            <Badge color="indigo">{catIcon} {catLabel}</Badge>
            <Badge color={pricingColor as "green" | "amber" | "gray"}>{pricingLabel}</Badge>
          </div>
        </div>

        {/* Rating */}
        {tool.rating && (
          <div style={{
            background: "rgba(99,102,241,.15)",
            color: "var(--grad-from)",
            borderRadius: "8px",
            padding: "4px 8px",
            fontSize: "13px",
            fontWeight: 800,
            flexShrink: 0,
          }}>
            ★ {tool.rating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Description */}
      {tool.description && (
        <p style={{
          fontSize: "13px",
          color: "var(--subtle)",
          lineHeight: 1.6,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          marginBottom: "14px",
        }}>
          {tool.description}
        </p>
      )}

      {/* Pricing note */}
      {tool.pricing_note && (
        <p style={{ fontSize: "12px", color: "var(--faint)", marginBottom: "12px" }}>
          {tool.pricing_note}
        </p>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <BookmarkButton toolId={tool.id} size="sm" />
        {tool.website_url && (
          <a
            href={tool.website_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              background: "var(--accent)",
              color: "#fff",
              borderRadius: "8px",
              padding: "5px 12px",
              fontSize: "12px",
              fontWeight: 600,
              transition: "background .2s",
              textDecoration: "none",
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--accent-h)")}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--accent)")}
          >
            {lang === "zh" ? "访问官网" : "Visit"} ↗
          </a>
        )}
      </div>
    </Link>
  );
}
