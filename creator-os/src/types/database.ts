export type Platform = "youtube" | "tiktok" | "instagram" | "x";
export type ConnectionStatus = "connected" | "disconnected" | "pending" | "error";
export type IdeaStatus = "new" | "accepted" | "rejected" | "used";
export type AssetStatus = "draft" | "needs_review" | "approved" | "scheduled" | "posted" | "rejected";
export type ReviewDecision = "approved" | "rejected" | "revision_requested";
export type PostStatus = "scheduled" | "publishing" | "published" | "failed" | "cancelled";
export type LinkType = "affiliate" | "digital_product" | "sponsorship" | "platform_payout" | "lead_gen";
export type AgentType =
  | "niche_strategist"
  | "trend_research"
  | "script_writer"
  | "offer_agent"
  | "thumbnail_prompt"
  | "repurposing"
  | "compliance"
  | "publisher"
  | "analytics";
export type AgentRunStatus = "running" | "completed" | "failed";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  user_id: string;
  name: string;
  niche: string;
  audience: string | null;
  tone_of_voice: string | null;
  monetization_model: string | null;
  cta_style: string | null;
  posting_frequency: string | null;
  content_pillars: string[] | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlatformConnection {
  id: string;
  user_id: string;
  brand_id: string;
  platform: Platform;
  status: ConnectionStatus;
  platform_username: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ContentIdea {
  id: string;
  user_id: string;
  brand_id: string;
  platform: Platform;
  hook: string;
  topic: string;
  format: string | null;
  target_audience_angle: string | null;
  monetization_angle: string | null;
  status: IdeaStatus;
  created_at: string;
  updated_at: string;
}

export interface Script {
  id: string;
  user_id: string;
  brand_id: string;
  idea_id: string | null;
  platform: Platform;
  title: string;
  script_body: string | null;
  caption: string | null;
  cta: string | null;
  affiliate_plug: string | null;
  version: number;
  parent_script_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  user_id: string;
  brand_id: string;
  script_id: string | null;
  platform: Platform;
  title: string;
  script_text: string | null;
  caption: string | null;
  thumbnail_prompt: string | null;
  image_prompt: string | null;
  video_prompt: string | null;
  voiceover_text: string | null;
  status: AssetStatus;
  file_urls: string[] | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ApprovalReview {
  id: string;
  user_id: string;
  asset_id: string;
  decision: ReviewDecision;
  notes: string | null;
  created_at: string;
}

export interface ScheduledPost {
  id: string;
  user_id: string;
  brand_id: string;
  asset_id: string;
  platform: Platform;
  scheduled_at: string;
  published_at: string | null;
  status: PostStatus;
  platform_post_id: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsEntry {
  id: string;
  user_id: string;
  brand_id: string;
  platform: Platform;
  post_id: string | null;
  date: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  saves: number;
  click_throughs: number;
  estimated_earnings: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface MonetizationLink {
  id: string;
  user_id: string;
  brand_id: string;
  type: LinkType;
  label: string;
  url: string | null;
  platform: Platform | null;
  is_active: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface RevenueEntry {
  id: string;
  user_id: string;
  brand_id: string;
  link_id: string | null;
  type: LinkType;
  amount: number;
  currency: string;
  description: string | null;
  date: string;
  created_at: string;
}

export interface AgentRun {
  id: string;
  user_id: string;
  brand_id: string | null;
  agent: AgentType;
  input_summary: string | null;
  output_summary: string | null;
  status: AgentRunStatus;
  token_estimate: number | null;
  duration_ms: number | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}
