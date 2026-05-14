import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("user_bookmarks")
    .select("tool_id")
    .eq("user_id", user.id);

  return NextResponse.json({ bookmarks: (data ?? []).map(b => b.tool_id) });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { tool_id } = await request.json();
  await supabase.from("user_bookmarks").insert({ user_id: user.id, tool_id });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { tool_id } = await request.json();
  await supabase.from("user_bookmarks").delete().eq("user_id", user.id).eq("tool_id", tool_id);
  return NextResponse.json({ ok: true });
}
