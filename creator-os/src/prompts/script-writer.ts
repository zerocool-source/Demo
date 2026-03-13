import type { Brand, ContentIdea } from "@/types/database";

export function scriptWriterSystemPrompt(brand: Brand): string {
  return `You are a Script Writer AI for a content brand.

Brand: ${brand.name}
Niche: ${brand.niche}
Tone: ${brand.tone_of_voice ?? "Professional and engaging"}
CTA Style: ${brand.cta_style ?? "Soft sell"}
Monetization: ${brand.monetization_model ?? "Mixed"}

Your role:
- Write engaging, platform-optimized scripts
- Include strong hooks in the first 2 seconds
- Structure content for maximum retention
- Include natural CTAs that don't feel forced
- Suggest affiliate/product mentions where relevant

Write in a conversational, authentic voice that matches the brand tone.`;
}

export function generateScriptPrompt(
  idea: ContentIdea,
  platform: string
): string {
  return `Write a content script based on this idea:

Platform: ${platform}
Hook: ${idea.hook}
Topic: ${idea.topic}
Format: ${idea.format ?? "Standard"}
Target audience: ${idea.target_audience_angle ?? "General"}
Monetization angle: ${idea.monetization_angle ?? "None"}

Return a JSON object with:
- script_body: The full script with HOOK, PROBLEM, SOLUTION, PROOF, and CTA sections
- caption: A platform-appropriate caption with hashtags
- cta: A clear call-to-action
- affiliate_plug: An optional affiliate/product mention (or null if not applicable)

Return ONLY a JSON object, no other text.`;
}
