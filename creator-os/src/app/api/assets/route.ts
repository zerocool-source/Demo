import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { data: asset, error } = await supabase
      .from("assets")
      .insert({
        user_id: user.id,
        brand_id: body.brand_id,
        script_id: body.script_id ?? null,
        platform: body.platform,
        title: body.title,
        script_text: body.script_text ?? null,
        caption: body.caption ?? null,
        thumbnail_prompt: body.thumbnail_prompt ?? null,
        image_prompt: body.image_prompt ?? null,
        video_prompt: body.video_prompt ?? null,
        voiceover_text: body.voiceover_text ?? null,
        status: "draft",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ asset }, { status: 201 });
  } catch (error) {
    console.error("Create asset error:", error);
    return NextResponse.json({ error: "Failed to create asset" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: assets, error } = await supabase
      .from("assets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ assets });
  } catch (error) {
    console.error("Fetch assets error:", error);
    return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 });
  }
}
