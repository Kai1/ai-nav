/**
 * Seed script: reads all 108 article HTML files from public/articles/
 * and inserts their metadata into the Supabase articles table.
 *
 * Run after copying HTML files and setting .env.local:
 *   npx tsx scripts/seed-articles.ts
 */
import { createClient } from "@supabase/supabase-js";
import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function extractMeta(html: string): { title: string; description: string; ogTitle?: string } {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);

  const rawTitle = titleMatch?.[1]?.trim() ?? "";
  // Remove site suffix like " — AI Nav" or " | AI Nav"
  const title = rawTitle.replace(/\s*[—|]\s*AI Nav.*$/i, "").trim();

  return {
    title,
    description: descMatch?.[1]?.trim() ?? "",
    ogTitle: ogTitleMatch?.[1]?.trim(),
  };
}

// Guess category from slug
function guessCategory(slug: string): string {
  if (/image|midjourney|dalle|stable.diff|firefly|ideogram|flux/.test(slug)) return "image";
  if (/video|runway|sora|pika|heygen|kling|hailuo|loom|capcut/.test(slug)) return "video";
  if (/audio|music|suno|udio|elevenlabs|voice|tts|whisper/.test(slug)) return "audio";
  if (/code|copilot|cursor|windsurf|codeium|tabnine|amazon.q/.test(slug)) return "code";
  if (/write|writing|jasper|notion.ai|writesonic|copy\.ai|grammarly/.test(slug)) return "writing";
  if (/seo|semrush|ahrefs|surfer|search.console/.test(slug)) return "search";
  if (/design|canva|figma|adobe|designer/.test(slug)) return "design";
  if (/data|analytics|julius|consensus|spreadsheet|finance/.test(slug)) return "data";
  if (/educat|student|teacher|khan|duolingo|learn/.test(slug)) return "education";
  if (/chat|gpt|claude|gemini|deepseek|grok|perplexity|llm|llama|mistral/.test(slug)) return "chat";
  if (/productiv|gamma|otter|zapier|fathom|meeting|note|project|email/.test(slug)) return "productivity";
  return "other";
}

// Known article dates from the POSTS array
const knownDates: Record<string, string> = {
  "best-free-ai-tools-2025": "2025-04-27",
  "midjourney-free-alternatives": "2025-04-22",
  "chatgpt-plus-free-alternatives": "2025-04-20",
  "jasper-free-alternatives": "2025-04-18",
  "suno-free-alternatives": "2025-04-16",
  "elevenlabs-free-alternatives": "2025-04-14",
  "github-copilot-free-alternatives": "2025-04-12",
  "gamma-free-alternatives": "2025-04-10",
  "semrush-free-alternatives": "2025-04-08",
  "runway-free-alternatives": "2025-04-06",
  "notion-ai-free-alternatives": "2025-04-04",
  "canva-pro-free-alternatives": "2025-04-02",
  "best-ai-spreadsheet-tools-2025": "2026-05-12",
  "best-ai-audio-tools-2025": "2026-05-09",
};

// Featured articles (highest traffic based on known views data)
const featuredSlugs = new Set([
  "best-free-ai-tools-2025",
  "chatgpt-plus-free-alternatives",
  "midjourney-free-alternatives",
  "github-copilot-free-alternatives",
  "runway-free-alternatives",
  "chatgpt-vs-claude-vs-gemini",
  "best-ai-writing-tools-2025",
  "best-ai-coding-assistants-2025",
  "cursor-vs-copilot-2025",
  "deepseek-review-2025",
]);

async function seed() {
  const articlesDir = join(process.cwd(), "public", "articles");
  if (!existsSync(articlesDir)) {
    console.error("❌ public/articles/ not found — run copy-articles script first");
    process.exit(1);
  }

  const files = readdirSync(articlesDir).filter(f => f.endsWith(".html"));
  console.log(`📖 Found ${files.length} article files`);

  const rows = files.map(file => {
    const slug = file.replace(/\.html$/, "");
    const html = readFileSync(join(articlesDir, file), "utf-8");
    const { title, description } = extractMeta(html);
    const category = guessCategory(slug);
    const dateStr = knownDates[slug] ?? "2025-05-01";

    return {
      slug,
      title: title || slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      description,
      category,
      lang: "zh",
      content_type: "static",
      static_file: file,
      published: true,
      featured: featuredSlugs.has(slug),
      view_count: 0,
      published_at: new Date(dateStr).toISOString(),
    };
  });

  // Batch upsert in chunks of 50
  const chunkSize = 50;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabase.from("articles").upsert(chunk, { onConflict: "slug" });
    if (error) {
      console.error(`❌ Error at chunk ${i}:`, error.message);
      process.exit(1);
    }
    inserted += chunk.length;
    console.log(`  ✓ ${inserted}/${rows.length}`);
  }

  console.log(`✅ Seeded ${rows.length} articles`);
}

seed();
