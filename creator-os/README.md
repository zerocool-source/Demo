# Creator OS

An AI-powered content automation dashboard for creators. Manage brands, generate ideas, write scripts, approve content, schedule posts, track analytics, and monitor monetization — all from one command center.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: shadcn/ui-style components (Radix UI primitives)
- **Backend/Auth/DB**: Supabase
- **AI**: OpenAI API (with mock fallback)
- **Charts**: Recharts
- **Validation**: Zod
- **Icons**: Lucide React

## Features

| Module | Description | Status |
|--------|-------------|--------|
| Auth | Email/password sign up & login | MVP (Supabase Auth) |
| Brands | Create and manage content brands | MVP |
| Platform Connections | Connect YouTube, TikTok, Instagram, X | Mock (OAuth placeholder) |
| Idea Generation | AI-powered content idea generation | MVP (mock + OpenAI) |
| Script Generator | Turn ideas into platform-specific scripts | MVP (mock + OpenAI) |
| Content Assets | Manage scripts, captions, prompts | MVP |
| Approval Queue | Human review before publishing | MVP |
| Scheduler | Schedule and simulate publishing | MVP (mock publish) |
| Analytics | Views, engagement, earnings charts | MVP (mock data) |
| Monetization | Track affiliate links, revenue, conversions | MVP (mock data) |
| Agent Logs | AI agent run history and diagnostics | MVP |

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A Supabase project (free tier works)
- OpenAI API key (optional — app works with mock data without it)

### 1. Clone and Install

```bash
cd creator-os
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-key  # Optional
```

### 3. Set Up Database

Run the SQL migration in your Supabase SQL Editor:

```
supabase/migrations/001_initial_schema.sql
```

This creates all tables, RLS policies, triggers, and functions.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. (Optional) Seed Data

After creating your first user account, you can run the seed SQL in `supabase/seed/seed.sql` to populate sample data. Replace `USER_ID_HERE` with your user's UUID.

## Demo Mode

The app works without Supabase or OpenAI configured. All pages load with realistic mock data so you can explore the full UI immediately.

## Project Structure

```
creator-os/
├── src/
│   ├── app/
│   │   ├── (auth)/           # Login, signup pages
│   │   ├── (dashboard)/      # All dashboard pages
│   │   │   ├── dashboard/    # Overview
│   │   │   ├── brands/       # Brand CRUD
│   │   │   ├── platforms/    # Platform connections
│   │   │   ├── ideas/        # Idea generation
│   │   │   ├── scripts/      # Script management
│   │   │   ├── assets/       # Content asset manager
│   │   │   ├── approval/     # Human review queue
│   │   │   ├── schedule/     # Publishing queue
│   │   │   ├── analytics/    # Analytics dashboard
│   │   │   ├── monetization/ # Revenue tracking
│   │   │   ├── agent-logs/   # AI agent run logs
│   │   │   └── settings/     # User settings
│   │   └── api/              # API route handlers
│   ├── components/
│   │   ├── ui/               # Base UI components (shadcn-style)
│   │   ├── layout/           # Sidebar, header
│   │   ├── brands/           # Brand-specific components
│   │   ├── ideas/            # Idea card components
│   │   ├── scripts/          # Script card components
│   │   ├── assets/           # Asset card components
│   │   └── approval/         # Approval card components
│   ├── lib/
│   │   ├── supabase/         # Supabase client (browser, server, middleware)
│   │   ├── ai.ts             # OpenAI abstraction (with mock fallback)
│   │   ├── utils.ts          # Shared utilities
│   │   ├── validations.ts    # Zod schemas
│   │   └── mock-data.ts      # Mock/seed data for demo mode
│   ├── services/
│   │   └── agents/           # AI agent service functions
│   ├── prompts/              # AI prompt templates (modular, per-agent)
│   ├── types/                # TypeScript type definitions
│   └── middleware.ts          # Auth middleware
├── supabase/
│   ├── migrations/           # SQL schema migrations
│   └── seed/                 # Seed data SQL
└── .env.example              # Environment variable template
```

## AI Agent Architecture

The app is architected around specialized AI agents:

| Agent | Prompt File | Service | Purpose |
|-------|-------------|---------|---------|
| Niche Strategist | `prompts/niche-strategist.ts` | `services/agents/idea-generator.ts` | Content idea generation |
| Trend Research | `prompts/trend-research.ts` | TODO | Trending topic analysis |
| Script Writer | `prompts/script-writer.ts` | `services/agents/script-generator.ts` | Script/caption writing |
| Offer Agent | `prompts/offer-agent.ts` | TODO | Monetization offer design |
| Thumbnail Prompt | `prompts/thumbnail-prompt.ts` | TODO | Thumbnail/cover image prompts |
| Repurposing | `prompts/repurposing.ts` | TODO | Cross-platform adaptation |
| Compliance | `prompts/compliance.ts` | TODO | FTC/platform compliance review |
| Publisher | — | TODO | Platform API publishing |
| Analytics | — | TODO | Analytics data ingestion |

Each agent has its own prompt template file with modular system prompts and user prompt generators.

## Production Roadmap

### Platform OAuth (TODO)
- YouTube: Google OAuth 2.0 + YouTube Data API v3
- TikTok: TikTok Login Kit + Content Posting API
- Instagram: Instagram Graph API via Facebook Login
- X: OAuth 2.0 PKCE + X API v2

### Real Publishing (TODO)
- Implement Publisher Agent with platform-specific API calls
- Add retry logic, rate limiting, and error handling
- Support media uploads (images, videos)

### Real Analytics (TODO)
- Implement Analytics Agent to pull metrics from platform APIs
- Set up periodic data sync (cron jobs or n8n workflows)
- Calculate estimated earnings from platform payout data

### Workflow Automation (TODO)
- Integrate n8n for automated content pipelines
- Trigger idea generation → script writing → review → scheduling flows
- Set up webhook handlers for platform notifications

## License

Private — All rights reserved.
