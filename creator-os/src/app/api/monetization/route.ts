import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { monetizationLinkSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = monetizationLinkSchema.parse(body);

    const { data: link, error } = await supabase
      .from("monetization_links")
      .insert({
        user_id: user.id,
        ...parsed,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    console.error("Create link error:", error);
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: links, error } = await supabase
      .from("monetization_links")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ links });
  } catch (error) {
    console.error("Fetch links error:", error);
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
  }
}
