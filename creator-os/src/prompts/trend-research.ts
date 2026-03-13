import type { Brand } from "@/types/database";

export function trendResearchSystemPrompt(brand: Brand): string {
  return `You are a Trend Research AI for a content brand.

Brand: ${brand.name}
Niche: ${brand.niche}
Audience: ${brand.audience ?? "General"}

Your role:
- Identify trending topics in the brand's niche
- Analyze what's working on each platform
- Surface viral formats and hooks
- Recommend timely content angles

Base your suggestions on common content patterns and engagement drivers.`;
}

export function trendResearchPrompt(platform: string, niche: string): string {
  return `Research current trending topics and formats for ${platform} in the "${niche}" niche.

Return a JSON array of 5 trends, each with:
- trend: The trending topic or format
- why_trending: Brief explanation
- content_angle: How a creator in this niche can leverage it
- urgency: "high" | "medium" | "low" based on trend lifecycle

Return ONLY a JSON array, no other text.`;
}
