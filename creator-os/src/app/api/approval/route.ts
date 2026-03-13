import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { approvalSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = approvalSchema.parse(body);

    // Create review record
    const { error: reviewError } = await supabase
      .from("approval_reviews")
      .insert({
        user_id: user.id,
        asset_id: parsed.asset_id,
        decision: parsed.decision,
        notes: parsed.notes ?? null,
      });

    if (reviewError) throw reviewError;

    // Update asset status based on decision
    const statusMap: Record<string, string> = {
      approved: "approved",
      rejected: "rejected",
      revision_requested: "draft",
    };

    const { error: updateError } = await supabase
      .from("assets")
      .update({ status: statusMap[parsed.decision] })
      .eq("id", parsed.asset_id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Approval error:", error);
    return NextResponse.json({ error: "Failed to process review" }, { status: 500 });
  }
}
