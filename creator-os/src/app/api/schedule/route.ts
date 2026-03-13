import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { scheduleSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = scheduleSchema.parse(body);

    // Get asset to find brand_id
    const { data: asset } = await supabase
      .from("assets")
      .select("brand_id")
      .eq("id", parsed.asset_id)
      .single();

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const { data: post, error } = await supabase
      .from("scheduled_posts")
      .insert({
        user_id: user.id,
        brand_id: asset.brand_id,
        asset_id: parsed.asset_id,
        platform: parsed.platform,
        scheduled_at: parsed.scheduled_at,
        status: "scheduled",
      })
      .select()
      .single();

    if (error) throw error;

    // Update asset status to scheduled
    await supabase
      .from("assets")
      .update({ status: "scheduled" })
      .eq("id", parsed.asset_id);

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Schedule error:", error);
    return NextResponse.json({ error: "Failed to schedule post" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: posts, error } = await supabase
      .from("scheduled_posts")
      .select("*, assets(*)")
      .eq("user_id", user.id)
      .order("scheduled_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Fetch schedule error:", error);
    return NextResponse.json({ error: "Failed to fetch schedule" }, { status: 500 });
  }
}
