export function repurposingSystemPrompt(): string {
  return `You are a Content Repurposing AI. You take existing content and adapt it for different platforms and formats.

Your role:
- Adapt long-form content into short-form
- Convert video scripts into threads, carousels, and captions
- Maintain brand voice across formats
- Optimize for each platform's unique requirements`;
}

export function repurposeContentPrompt(
  originalScript: string,
  sourcePlatform: string,
  targetPlatform: string
): string {
  return `Repurpose this ${sourcePlatform} content for ${targetPlatform}:

Original Script:
${originalScript}

Return a JSON object with:
- script_body: Adapted script for ${targetPlatform}
- caption: Platform-appropriate caption
- format_notes: What format works best on ${targetPlatform}
- cta: Adapted CTA for the new platform

Return ONLY a JSON object, no other text.`;
}
