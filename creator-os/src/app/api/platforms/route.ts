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
    const { brand_id, platform, action } = body;

    if (action === "connect") {
      // TODO: In production, initiate real OAuth flow for the platform
      // For MVP, simulate connection
      const { data: connection, error } = await supabase
        .from("platform_connections")
        .upsert({
          user_id: user.id,
          brand_id,
          platform,
          status: "connected",
          platform_username: `@mock_${platform}_user`,
        }, { onConflict: "brand_id,platform" })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ connection });
    }

    if (action === "disconnect") {
      const { error } = await supabase
        .from("platform_connections")
        .update({ status: "disconnected", platform_username: null })
        .eq("brand_id", brand_id)
        .eq("platform", platform);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Platform connection error:", error);
    return NextResponse.json(
      { error: "Failed to update platform connection" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: connections, error } = await supabase
      .from("platform_connections")
      .select("*")
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ connections });
  } catch (error) {
    console.error("Fetch connections error:", error);
    return NextResponse.json({ error: "Failed to fetch connections" }, { status: 500 });
  }
}
