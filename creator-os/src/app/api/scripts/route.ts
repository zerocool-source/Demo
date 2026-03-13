import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateScript } from "@/services/agents/script-generator";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { idea_id } = body;

    // Fetch the idea
    const { data: idea, error: ideaError } = await supabase
      .from("content_ideas")
      .select("*")
      .eq("id", idea_id)
      .single();

    if (ideaError || !idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    // Fetch the brand
    const { data: brand, error: brandError } = await supabase
      .from("brands")
      .select("*")
      .eq("id", idea.brand_id)
      .single();

    if (brandError || !brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    // Log agent run
    const { data: agentRun } = await supabase.from("agent_runs").insert({
      user_id: user.id,
      brand_id: brand.id,
      agent: "script_writer",
      input_summary: `Write ${idea.platform} script for "${idea.hook}"`,
      status: "running",
    }).select().single();

    const startTime = Date.now();

    // Generate script
    const { script, tokenEstimate } = await generateScript(brand, idea);

    // Save script
    const { data: savedScript, error: insertError } = await supabase
      .from("scripts")
      .insert({
        user_id: user.id,
        brand_id: brand.id,
        idea_id: idea.id,
        platform: idea.platform,
        title: `${idea.hook} — Script v1`,
        script_body: script.script_body,
        caption: script.caption,
        cta: script.cta,
        affiliate_plug: script.affiliate_plug,
        version: 1,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Mark idea as used
    await supabase
      .from("content_ideas")
      .update({ status: "used" })
      .eq("id", idea_id);

    // Update agent run
    if (agentRun) {
      await supabase.from("agent_runs").update({
        status: "completed",
        output_summary: "Generated script with caption, CTA, and affiliate plug",
        token_estimate: tokenEstimate,
        duration_ms: Date.now() - startTime,
        completed_at: new Date().toISOString(),
      }).eq("id", agentRun.id);
    }

    return NextResponse.json({ script: savedScript });
  } catch (error) {
    console.error("Script generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate script" },
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

    const { data: scripts, error } = await supabase
      .from("scripts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ scripts });
  } catch (error) {
    console.error("Fetch scripts error:", error);
    return NextResponse.json({ error: "Failed to fetch scripts" }, { status: 500 });
  }
}
