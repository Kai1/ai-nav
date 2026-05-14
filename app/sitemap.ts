import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/server";

const BASE = "https://ai-nav.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let tools: { slug: string; updated_at: string }[] = [];
  let articles: { slug: string; updated_at: string }[] = [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createAdminClient();
      const [{ data: t }, { data: a }] = await Promise.all([
        supabase.from("tools").select("slug,updated_at").eq("published", true),
        supabase.from("articles").select("slug,updated_at").eq("published", true),
      ]);
      tools = t ?? [];
      articles = a ?? [];
    } catch { /* no DB at build time */ }
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/tools`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/articles`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/privacy`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/terms`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/submit`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const toolRoutes: MetadataRoute.Sitemap = (tools ?? []).map((t: { slug: string; updated_at: string }) => ({
    url: `${BASE}/tools/${t.slug}`,
    lastModified: new Date(t.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const articleRoutes: MetadataRoute.Sitemap = (articles ?? []).map((a: { slug: string; updated_at: string }) => ({
    url: `${BASE}/articles/${a.slug}`,
    lastModified: new Date(a.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...toolRoutes, ...articleRoutes];
}
