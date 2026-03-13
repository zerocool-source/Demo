import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { brandSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = brandSchema.parse(body);

    const { data: brand, error } = await supabase
      .from("brands")
      .insert({
        user_id: user.id,
        ...parsed,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ brand }, { status: 201 });
  } catch (error) {
    console.error("Create brand error:", error);
    return NextResponse.json(
      { error: "Failed to create brand" },
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

    const { data: brands, error } = await supabase
      .from("brands")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ brands });
  } catch (error) {
    console.error("Fetch brands error:", error);
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}
