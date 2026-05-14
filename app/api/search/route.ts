import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ tools: [], articles: [] });
  }

  const supabase = await createClient();

  const [{ data: tools }, { data: articles }] = await Promise.all([
    supabase
      .from("tools")
      .select("id,slug,name,category,rating,is_free,has_free_tier,description")
      .eq("published", true)
      .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
      .limit(6),
    supabase
      .from("articles")
      .select("id,slug,title,description,category,published_at")
      .eq("published", true)
      .textSearch("search_vector", q, { type: "plain" })
      .limit(6),
  ]);

  return NextResponse.json({ tools: tools ?? [], articles: articles ?? [] });
}
