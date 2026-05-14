import { createClient, createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";
import StaticArticleWrapper from "@/components/articles/StaticArticleWrapper";
import type { Article } from "@/lib/types";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("articles").select("title,description").eq("slug", slug).single();
  if (!data) return {};
  return {
    title: data.title,
    description: data.description ?? "",
    openGraph: { title: data.title, description: data.description ?? "" },
  };
}

export async function generateStaticParams() {
  let dbSlugs = new Set<string>();
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createAdminClient();
      const { data: dbArticles } = await supabase.from("articles").select("slug").eq("published", true);
      dbSlugs = new Set((dbArticles ?? []).map((a: { slug: string }) => a.slug));
    } catch { /* no DB available at build time */ }
  }

  // Also generate params from static HTML files
  const staticDir = join(process.cwd(), "public", "articles");
  let fsSlugs: string[] = [];
  if (existsSync(staticDir)) {
    fsSlugs = readdirSync(staticDir)
      .filter(f => f.endsWith(".html"))
      .map(f => f.replace(/\.html$/, ""));
  }

  const allSlugs = new Set([...dbSlugs, ...fsSlugs]);
  return Array.from(allSlugs).map(slug => ({ slug }));
}

function extractBodyContent(html: string): string {
  // Extract everything between <body ...> and </body>
  // Remove the outer <header>, <footer> from the static article (they have their own nav)
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!bodyMatch) return html;

  let body = bodyMatch[1];

  // Remove the header element (we have our own)
  body = body.replace(/<header[\s\S]*?<\/header>/i, "");
  // Remove the footer element (we have our own)
  body = body.replace(/<footer[\s\S]*?<\/footer>/i, "");

  return body.trim();
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  // Record view asynchronously
  supabase.from("page_views").insert({ path: `/articles/${slug}` }).then(() => {});

  // Update view_count in articles table
  if (data) {
    supabase.from("articles")
      .update({ view_count: (data as Article).view_count + 1 })
      .eq("slug", slug)
      .then(() => {});
  }

  let htmlContent = "";

  if (data) {
    const article = data as Article;

    if (article.content_type === "db" && article.html_content) {
      htmlContent = article.html_content;
    } else {
      // static file
      const fileName = article.static_file ?? `${slug}.html`;
      const filePath = join(process.cwd(), "public", "articles", fileName);
      if (existsSync(filePath)) {
        const raw = readFileSync(filePath, "utf-8");
        htmlContent = extractBodyContent(raw);
      }
    }
  } else {
    // Fallback: try to serve directly from filesystem (for legacy articles not yet seeded)
    const filePath = join(process.cwd(), "public", "articles", `${slug}.html`);
    if (!existsSync(filePath)) notFound();
    const raw = readFileSync(filePath, "utf-8");
    htmlContent = extractBodyContent(raw);
  }

  if (!htmlContent) notFound();

  return <StaticArticleWrapper html={htmlContent} />;
}
