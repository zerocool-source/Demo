import { generateCompletion } from "@/lib/ai";
import {
  nicheStrategistSystemPrompt,
  generateIdeasPrompt,
} from "@/prompts/niche-strategist";
import type { Brand, ContentIdea, Platform } from "@/types/database";

export interface GeneratedIdea {
  hook: string;
  topic: string;
  format: string;
  target_audience_angle: string;
  monetization_angle: string;
}

export async function generateContentIdeas(
  brand: Brand,
  platform: Platform,
  count: number
): Promise<{ ideas: GeneratedIdea[]; tokenEstimate: number }> {
  const result = await generateCompletion({
    systemPrompt: nicheStrategistSystemPrompt(brand),
    prompt: generateIdeasPrompt(platform, count, brand),
    maxTokens: 2048,
    temperature: 0.8,
  });

  let ideas: GeneratedIdea[];
  try {
    ideas = JSON.parse(result.content);
  } catch {
    // If JSON parsing fails, return the raw content wrapped in a single idea
    ideas = [
      {
        hook: result.content.slice(0, 100),
        topic: result.content,
        format: "Unknown",
        target_audience_angle: "General",
        monetization_angle: "TBD",
      },
    ];
  }

  return { ideas, tokenEstimate: result.tokenEstimate };
}
