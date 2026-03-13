// OpenAI API abstraction layer
// In production, replace with real OpenAI SDK calls.
// For MVP, this provides a mock-able interface.

export interface AICompletionOptions {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AICompletionResult {
  content: string;
  tokenEstimate: number;
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function generateCompletion(
  options: AICompletionOptions
): Promise<AICompletionResult> {
  const { prompt, systemPrompt, maxTokens = 1024, temperature = 0.7 } = options;

  // If no API key, return mock response
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "sk-your-openai-api-key") {
    return getMockResponse(prompt);
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
        { role: "user" as const, content: prompt },
      ],
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? "";
  const tokenEstimate = data.usage?.total_tokens ?? Math.ceil(content.length / 4);

  return { content, tokenEstimate };
}

function getMockResponse(prompt: string): AICompletionResult {
  const lower = prompt.toLowerCase();

  if (lower.includes("idea") || lower.includes("content idea")) {
    return {
      content: JSON.stringify([
        {
          hook: "Why 90% of creators fail in their first year",
          topic: "Common mistakes new content creators make",
          format: "Short-form video (60s)",
          target_audience_angle: "Aspiring creators who feel stuck",
          monetization_angle: "Promote a creator course as affiliate",
        },
        {
          hook: "I made $10K in 30 days with this strategy",
          topic: "Revenue diversification for creators",
          format: "Long-form YouTube video",
          target_audience_angle: "Creators earning under $1K/month",
          monetization_angle: "Sell digital templates pack",
        },
        {
          hook: "The algorithm hack nobody talks about",
          topic: "Understanding platform recommendation systems",
          format: "Carousel post / Thread",
          target_audience_angle: "Creators struggling with reach",
          monetization_angle: "Lead gen for coaching waitlist",
        },
      ]),
      tokenEstimate: 450,
    };
  }

  if (lower.includes("script") || lower.includes("write")) {
    return {
      content: JSON.stringify({
        script_body:
          "HOOK: Stop scrolling — this one tip changed everything for me.\n\n" +
          "PROBLEM: Most creators spend hours making content that nobody sees. " +
          "The algorithm doesn't reward effort — it rewards strategy.\n\n" +
          "SOLUTION: Here's the 3-step framework I use:\n" +
          "1. Hook within the first 2 seconds\n" +
          "2. Deliver value by second 15\n" +
          "3. End with a clear CTA\n\n" +
          "PROOF: Since using this framework, my average view duration went up 47%.\n\n" +
          "CTA: Follow for more creator growth tips and grab my free checklist — link in bio.",
        caption:
          "The 3-step framework that 10x'd my content reach 🚀\n\n" +
          "Most creators focus on quantity. Winners focus on structure.\n\n" +
          "#ContentCreator #GrowOnSocial #CreatorEconomy",
        cta: "Grab my free Content Strategy Checklist — link in bio",
        affiliate_plug:
          "I use [Tool Name] to schedule all my posts (affiliate link in bio) — " +
          "it saves me 5+ hours per week.",
      }),
      tokenEstimate: 380,
    };
  }

  return {
    content: "This is a mock AI response. Connect your OpenAI API key for real generation.",
    tokenEstimate: 25,
  };
}
