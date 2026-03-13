import { generateCompletion } from "@/lib/ai";
import {
  scriptWriterSystemPrompt,
  generateScriptPrompt,
} from "@/prompts/script-writer";
import type { Brand, ContentIdea } from "@/types/database";

export interface GeneratedScript {
  script_body: string;
  caption: string;
  cta: string;
  affiliate_plug: string | null;
}

export async function generateScript(
  brand: Brand,
  idea: ContentIdea
): Promise<{ script: GeneratedScript; tokenEstimate: number }> {
  const result = await generateCompletion({
    systemPrompt: scriptWriterSystemPrompt(brand),
    prompt: generateScriptPrompt(idea, idea.platform),
    maxTokens: 2048,
    temperature: 0.7,
  });

  let script: GeneratedScript;
  try {
    script = JSON.parse(result.content);
  } catch {
    script = {
      script_body: result.content,
      caption: "",
      cta: "",
      affiliate_plug: null,
    };
  }

  return { script, tokenEstimate: result.tokenEstimate };
}
