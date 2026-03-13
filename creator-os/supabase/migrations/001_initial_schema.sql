-- Creator OS Database Schema
-- This migration creates all tables for the Creator OS MVP

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- USERS (extends Supabase auth.users)
-- ============================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- ============================================
-- BRANDS
-- ============================================
create table public.brands (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  niche text not null,
  audience text,
  tone_of_voice text,
  monetization_model text,
  cta_style text,
  posting_frequency text,
  content_pillars text[], -- array of content pillar strings
  logo_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.brands enable row level security;
create policy "Users can manage own brands" on public.brands for all using (auth.uid() = user_id);

-- ============================================
-- PLATFORM CONNECTIONS
-- ============================================
create type platform_type as enum ('youtube', 'tiktok', 'instagram', 'x');
create type connection_status as enum ('connected', 'disconnected', 'pending', 'error');

create table public.platform_connections (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  brand_id uuid not null references public.brands(id) on delete cascade,
  platform platform_type not null,
  status connection_status default 'disconnected' not null,
  platform_username text,
  access_token text, -- encrypted in production
  refresh_token text, -- encrypted in production
  token_expires_at timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(brand_id, platform)
);

alter table public.platform_connections enable row level security;
create policy "Users can manage own connections" on public.platform_connections for all using (auth.uid() = user_id);

-- ============================================
-- CONTENT IDEAS
-- ============================================
create type idea_status as enum ('new', 'accepted', 'rejected', 'used');

create table public.content_ideas (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  brand_id uuid not null references public.brands(id) on delete cascade,
  platform platform_type not null,
  hook text not null,
  topic text not null,
  format text,
  target_audience_angle text,
  monetization_angle text,
  status idea_status default 'new' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.content_ideas enable row level security;
create policy "Users can manage own ideas" on public.content_ideas for all using (auth.uid() = user_id);

-- ============================================
-- SCRIPTS
-- ============================================
create table public.scripts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  brand_id uuid not null references public.brands(id) on delete cascade,
  idea_id uuid references public.content_ideas(id) on delete set null,
  platform platform_type not null,
  title text not null,
  script_body text,
  caption text,
  cta text,
  affiliate_plug text,
  version integer default 1 not null,
  parent_script_id uuid references public.scripts(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.scripts enable row level security;
create policy "Users can manage own scripts" on public.scripts for all using (auth.uid() = user_id);

-- ============================================
-- CONTENT ASSETS
-- ============================================
create type asset_status as enum ('draft', 'needs_review', 'approved', 'scheduled', 'posted', 'rejected');

create table public.assets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  brand_id uuid not null references public.brands(id) on delete cascade,
  script_id uuid references public.scripts(id) on delete set null,
  platform platform_type not null,
  title text not null,
  script_text text,
  caption text,
  thumbnail_prompt text,
  image_prompt text,
  video_prompt text,
  voiceover_text text,
  status asset_status default 'draft' not null,
  file_urls text[],
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.assets enable row level security;
create policy "Users can manage own assets" on public.assets for all using (auth.uid() = user_id);

-- ============================================
-- APPROVAL REVIEWS
-- ============================================
create type review_decision as enum ('approved', 'rejected', 'revision_requested');

create table public.approval_reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  asset_id uuid not null references public.assets(id) on delete cascade,
  decision review_decision not null,
  notes text,
  created_at timestamptz default now() not null
);

alter table public.approval_reviews enable row level security;
create policy "Users can manage own reviews" on public.approval_reviews for all using (auth.uid() = user_id);

-- ============================================
-- SCHEDULED POSTS
-- ============================================
create type post_status as enum ('scheduled', 'publishing', 'published', 'failed', 'cancelled');

create table public.scheduled_posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  brand_id uuid not null references public.brands(id) on delete cascade,
  asset_id uuid not null references public.assets(id) on delete cascade,
  platform platform_type not null,
  scheduled_at timestamptz not null,
  published_at timestamptz,
  status post_status default 'scheduled' not null,
  platform_post_id text, -- ID returned from the platform after publishing
  error_message text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.scheduled_posts enable row level security;
create policy "Users can manage own posts" on public.scheduled_posts for all using (auth.uid() = user_id);

-- ============================================
-- ANALYTICS
-- ============================================
create table public.analytics (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  brand_id uuid not null references public.brands(id) on delete cascade,
  platform platform_type not null,
  post_id uuid references public.scheduled_posts(id) on delete set null,
  date date not null,
  views integer default 0,
  likes integer default 0,
  shares integer default 0,
  comments integer default 0,
  saves integer default 0,
  click_throughs integer default 0,
  estimated_earnings numeric(10,2) default 0,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

alter table public.analytics enable row level security;
create policy "Users can manage own analytics" on public.analytics for all using (auth.uid() = user_id);

-- ============================================
-- MONETIZATION LINKS
-- ============================================
create type link_type as enum ('affiliate', 'digital_product', 'sponsorship', 'platform_payout', 'lead_gen');

create table public.monetization_links (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  brand_id uuid not null references public.brands(id) on delete cascade,
  type link_type not null,
  label text not null,
  url text,
  platform platform_type,
  is_active boolean default true,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.monetization_links enable row level security;
create policy "Users can manage own links" on public.monetization_links for all using (auth.uid() = user_id);

-- ============================================
-- REVENUE ENTRIES
-- ============================================
create table public.revenue_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  brand_id uuid not null references public.brands(id) on delete cascade,
  link_id uuid references public.monetization_links(id) on delete set null,
  type link_type not null,
  amount numeric(10,2) not null,
  currency text default 'USD',
  description text,
  date date not null,
  created_at timestamptz default now() not null
);

alter table public.revenue_entries enable row level security;
create policy "Users can manage own revenue" on public.revenue_entries for all using (auth.uid() = user_id);

-- ============================================
-- AGENT RUNS
-- ============================================
create type agent_type as enum (
  'niche_strategist', 'trend_research', 'script_writer',
  'offer_agent', 'thumbnail_prompt', 'repurposing',
  'compliance', 'publisher', 'analytics'
);
create type agent_run_status as enum ('running', 'completed', 'failed');

create table public.agent_runs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  brand_id uuid references public.brands(id) on delete set null,
  agent agent_type not null,
  input_summary text,
  output_summary text,
  status agent_run_status default 'running' not null,
  token_estimate integer,
  duration_ms integer,
  error_message text,
  created_at timestamptz default now() not null,
  completed_at timestamptz
);

alter table public.agent_runs enable row level security;
create policy "Users can manage own agent runs" on public.agent_runs for all using (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at timestamps
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_brands_updated_at before update on public.brands for each row execute function public.update_updated_at();
create trigger update_platform_connections_updated_at before update on public.platform_connections for each row execute function public.update_updated_at();
create trigger update_content_ideas_updated_at before update on public.content_ideas for each row execute function public.update_updated_at();
create trigger update_scripts_updated_at before update on public.scripts for each row execute function public.update_updated_at();
create trigger update_assets_updated_at before update on public.assets for each row execute function public.update_updated_at();
create trigger update_scheduled_posts_updated_at before update on public.scheduled_posts for each row execute function public.update_updated_at();
create trigger update_monetization_links_updated_at before update on public.monetization_links for each row execute function public.update_updated_at();
