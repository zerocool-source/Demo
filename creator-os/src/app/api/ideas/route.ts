import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateContentIdeas } from "@/services/agents/idea-generator";
import { ideaGenerationSchema } from "@/lib/validations";
import type { Platform } from "@/types/database";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = ideaGenerationSchema.parse(body);

    // Fetch the brand
    const { data: brand, error: brandError } = await supabase
      .from("brands")
      .select("*")
      .eq("id", parsed.brand_id)
      .single();

    if (brandError || !brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    // Log agent run start
    const { data: agentRun } = await supabase.from("agent_runs").insert({
      user_id: user.id,
      brand_id: parsed.brand_id,
      agent: "niche_strategist",
      input_summary: `Generate ${parsed.count} ${parsed.platform} ideas for ${brand.name}`,
      status: "running",
    }).select().single();

    const startTime = Date.now();

    // Generate ideas using AI
    const { ideas, tokenEstimate } = await generateContentIdeas(
      brand,
      parsed.platform as Platform,
      parsed.count
    );

    // Save ideas to database
    const ideaRows = ideas.map((idea) => ({
      user_id: user.id,
      brand_id: parsed.brand_id,
      platform: parsed.platform,
      hook: idea.hook,
      topic: idea.topic,
      format: idea.format,
      target_audience_angle: idea.target_audience_angle,
      monetization_angle: idea.monetization_angle,
      status: "new" as const,
    }));

    const { data: savedIdeas, error: insertError } = await supabase
      .from("content_ideas")
      .insert(ideaRows)
      .select();

    if (insertError) {
      throw insertError;
    }

    // Update agent run
    if (agentRun) {
      await supabase.from("agent_runs").update({
        status: "completed",
        output_summary: `Generated ${ideas.length} ideas`,
        token_estimate: tokenEstimate,
        duration_ms: Date.now() - startTime,
        completed_at: new Date().toISOString(),
      }).eq("id", agentRun.id);
    }

    return NextResponse.json({ ideas: savedIdeas });
  } catch (error) {
    console.error("Idea generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate ideas" },
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

    const { data: ideas, error } = await supabase
      .from("content_ideas")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error("Fetch ideas error:", error);
    return NextResponse.json({ error: "Failed to fetch ideas" }, { status: 500 });
  }
}
