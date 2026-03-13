import type { Brand } from "@/types/database";

export function nicheStrategistSystemPrompt(brand: Brand): string {
  return `You are a Niche Strategist AI for a content brand.

Brand: ${brand.name}
Niche: ${brand.niche}
Audience: ${brand.audience ?? "General"}
Tone: ${brand.tone_of_voice ?? "Professional and engaging"}
Content Pillars: ${brand.content_pillars?.join(", ") ?? "Not defined"}

Your role:
- Analyze the niche and identify content gaps
- Suggest positioning strategies
- Identify trending sub-niches
- Recommend content angles that differentiate from competitors

Always be specific, actionable, and data-informed in your suggestions.`;
}

export function generateIdeasPrompt(
  platform: string,
  count: number,
  brand: Brand
): string {
  return `Generate ${count} unique content ideas for the ${platform} platform.

Brand: ${brand.name}
Niche: ${brand.niche}
Audience: ${brand.audience ?? "General"}
Monetization model: ${brand.monetization_model ?? "Mixed"}
CTA style: ${brand.cta_style ?? "Soft sell"}

For each idea, return a JSON array with objects containing:
- hook: A compelling opening hook (1 sentence)
- topic: The core topic
- format: Recommended content format for ${platform}
- target_audience_angle: Who exactly this speaks to
- monetization_angle: How this content can drive revenue

Return ONLY a JSON array, no other text.`;
}
