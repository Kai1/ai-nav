import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { tool_name, website_url, description, submitter_email } = await request.json();

    if (!tool_name || !website_url) {
      return NextResponse.json({ error: "tool_name and website_url are required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("tool_submissions").insert({
      tool_name: tool_name.trim(),
      website_url: website_url.trim(),
      description: description?.trim() ?? null,
      submitter_email: submitter_email?.trim() ?? null,
    });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("submit error", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
