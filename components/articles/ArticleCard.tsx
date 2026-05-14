import Link from "next/link";
import Badge from "@/components/ui/Badge";
import type { Article } from "@/lib/types";
import type { Lang } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/types";

interface ArticleCardProps {
  article: Article;
  lang?: Lang;
}

export default function ArticleCard({ article, lang = "zh" }: ArticleCardProps) {
  const cat = CATEGORIES.find(c => c.key === article.category);
  const catLabel = cat ? (lang === "zh" ? cat.label_zh : cat.label_en) : article.category;
  const catIcon = cat?.icon ?? "📄";

  const dateStr = new Date(article.published_at).toLocaleDateString(
    lang === "zh" ? "zh-CN" : "en-US",
    { year: "numeric", month: "short", day: "numeric" }
  );

  return (
    <Link
      href={`/articles/${article.slug}`}
      style={{
        display: "block",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "20px",
        transition: "border-color .2s, transform .2s",
        textDecoration: "none",
        color: "inherit",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.borderColor = "var(--accent)";
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.borderColor = "var(--border)";
        el.style.transform = "translateY(0)";
      }}
    >
      {/* Category + date */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        {catLabel && <Badge color="indigo">{catIcon} {catLabel}</Badge>}
        <span style={{ fontSize: "12px", color: "var(--faint)", marginLeft: "auto" }}>{dateStr}</span>
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: "15px",
        fontWeight: 700,
        color: "var(--text)",
        lineHeight: 1.5,
        marginBottom: "8px",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>
        {article.title}
      </h3>

      {/* Description */}
      {article.description && (
        <p style={{
          fontSize: "13px",
          color: "var(--subtle)",
          lineHeight: 1.6,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          marginBottom: "12px",
        }}>
          {article.description}
        </p>
      )}

      {/* Views */}
      <div style={{ fontSize: "12px", color: "var(--faint)", display: "flex", alignItems: "center", gap: "4px" }}>
        <span>👁</span>
        <span>{article.view_count.toLocaleString()} {lang === "zh" ? "次浏览" : "views"}</span>
      </div>
    </Link>
  );
}
