import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: analytics, error } = await supabase
      .from("analytics")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error("Fetch analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
