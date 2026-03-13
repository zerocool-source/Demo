import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(1, "Name is required"),
});

export const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  niche: z.string().min(1, "Niche is required"),
  audience: z.string().optional(),
  tone_of_voice: z.string().optional(),
  monetization_model: z.string().optional(),
  cta_style: z.string().optional(),
  posting_frequency: z.string().optional(),
  content_pillars: z.array(z.string()).optional(),
});

export const ideaGenerationSchema = z.object({
  brand_id: z.string().uuid(),
  platform: z.enum(["youtube", "tiktok", "instagram", "x"]),
  count: z.number().min(1).max(10).default(3),
});

export const scriptGenerationSchema = z.object({
  idea_id: z.string().uuid(),
});

export const approvalSchema = z.object({
  asset_id: z.string().uuid(),
  decision: z.enum(["approved", "rejected", "revision_requested"]),
  notes: z.string().optional(),
});

export const scheduleSchema = z.object({
  asset_id: z.string().uuid(),
  platform: z.enum(["youtube", "tiktok", "instagram", "x"]),
  scheduled_at: z.string().datetime(),
});

export const monetizationLinkSchema = z.object({
  brand_id: z.string().uuid(),
  type: z.enum(["affiliate", "digital_product", "sponsorship", "platform_payout", "lead_gen"]),
  label: z.string().min(1),
  url: z.string().url().optional(),
  platform: z.enum(["youtube", "tiktok", "instagram", "x"]).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type BrandInput = z.infer<typeof brandSchema>;
export type IdeaGenerationInput = z.infer<typeof ideaGenerationSchema>;
export type ApprovalInput = z.infer<typeof approvalSchema>;
export type ScheduleInput = z.infer<typeof scheduleSchema>;
export type MonetizationLinkInput = z.infer<typeof monetizationLinkSchema>;
