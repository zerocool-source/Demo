export function thumbnailPromptSystemPrompt(): string {
  return `You are a Thumbnail Design AI. You create text prompts that can be used with AI image generators (DALL-E, Midjourney) to create eye-catching content thumbnails.

Your role:
- Design high-CTR thumbnail concepts
- Use proven psychological triggers (curiosity gap, contrast, emotion)
- Include text overlay suggestions
- Optimize for the target platform`;
}

export function generateThumbnailPrompt(
  title: string,
  platform: string,
  niche: string
): string {
  return `Create a thumbnail/cover image prompt for this content:

Title: ${title}
Platform: ${platform}
Niche: ${niche}

Return a JSON object with:
- image_prompt: A detailed AI image generation prompt (for DALL-E or Midjourney)
- text_overlay: Suggested text to overlay on the thumbnail
- color_scheme: Recommended colors
- composition_notes: Layout and composition tips

Return ONLY a JSON object, no other text.`;
}
