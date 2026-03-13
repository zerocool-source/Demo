"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { cn, platformLabel, statusBadgeColor } from "@/lib/utils";
import { mockIdeas, mockBrands, mockScripts } from "@/lib/mock-data";
import { IdeaCard } from "@/components/ideas/idea-card";
import type { ContentIdea, Platform } from "@/types/database";

const PLATFORMS: Platform[] = ["youtube", "tiktok", "instagram", "x"];

const MOCK_HOOKS = [
  "Stop scrolling — this changes everything",
  "Nobody is talking about this growth strategy",
  "I tested this for 30 days and here's what happened",
  "The #1 mistake killing your content",
  "How I went from 0 to 50K followers in 90 days",
  "This free tool replaced my entire tech stack",
  "3 things I wish I knew before starting my channel",
  "The algorithm doesn't hate you — you're just doing this wrong",
  "POV: You finally understand content strategy",
  "Why your first 1,000 followers matter more than 100K",
];

const MOCK_TOPICS = [
  "Breaking down the content creation flywheel and how to build one",
  "Leveraging short-form content to drive long-form viewership",
  "Building an email list from social media followers",
  "Repurposing one piece of content across 5 platforms",
  "Understanding watch time and how to optimize for it",
  "The power of community building for creators",
  "How to price digital products as a creator",
  "Mastering platform-specific content formats",
  "Analytics deep dive: metrics that actually matter",
  "Collaboration strategies that drive mutual growth",
];

const MOCK_FORMATS: Record<Platform, string[]> = {
  youtube: ["Long-form video (10-15 min)", "Short (60s)", "Live stream"],
  tiktok: ["Short-form video (30s)", "Short-form video (60s)", "Stitch/Duet"],
  instagram: ["Reel (30-60s)", "Carousel (8-10 slides)", "Story series"],
  x: ["Thread (5-8 tweets)", "Single tweet with image", "Poll + follow-up thread"],
};

const MOCK_AUDIENCES = [
  "New creators looking for their first win",
  "Creators plateauing at 1K-10K followers",
  "Side-hustle creators wanting to go full-time",
  "Experienced creators diversifying revenue",
  "Creators struggling with consistency",
];

const MOCK_MONETIZATION = [
  "Affiliate product recommendation",
  "Digital course promotion",
  "Lead magnet opt-in",
  "Coaching services upsell",
  "Template pack promotion",
];

export default function IdeasPage() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<ContentIdea[]>(mockIdeas);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generator form state
  const [genBrandId, setGenBrandId] = useState<string>("");
  const [genPlatform, setGenPlatform] = useState<Platform | "">("");
  const [genCount, setGenCount] = useState<string>("3");

  // Filter state
  const [filterBrand, setFilterBrand] = useState<string>("all");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const generateIdeas = useCallback(() => {
    if (!genBrandId || !genPlatform) return;

    setIsGenerating(true);

    setTimeout(() => {
      const count = parseInt(genCount) || 3;
      const newIdeas: ContentIdea[] = Array.from({ length: count }, (_, i) => {
        const hookIdx = Math.floor(Math.random() * MOCK_HOOKS.length);
        const topicIdx = Math.floor(Math.random() * MOCK_TOPICS.length);
        const formatOptions = MOCK_FORMATS[genPlatform as Platform];
        const formatIdx = Math.floor(Math.random() * formatOptions.length);
        const audIdx = Math.floor(Math.random() * MOCK_AUDIENCES.length);
        const monIdx = Math.floor(Math.random() * MOCK_MONETIZATION.length);

        return {
          id: `gen-${Date.now()}-${i}`,
          user_id: "00000000-0000-0000-0000-000000000001",
          brand_id: genBrandId,
          platform: genPlatform as Platform,
          hook: MOCK_HOOKS[hookIdx],
          topic: MOCK_TOPICS[topicIdx],
          format: formatOptions[formatIdx],
          target_audience_angle: MOCK_AUDIENCES[audIdx],
          monetization_angle: MOCK_MONETIZATION[monIdx],
          status: "new" as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      });

      setIdeas((prev) => [...newIdeas, ...prev]);
      setIsGenerating(false);
    }, 1500);
  }, [genBrandId, genPlatform, genCount]);

  const handleAccept = useCallback((id: string) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === id ? { ...idea, status: "accepted" as const, updated_at: new Date().toISOString() } : idea
      )
    );
  }, []);

  const handleReject = useCallback((id: string) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === id ? { ...idea, status: "rejected" as const, updated_at: new Date().toISOString() } : idea
      )
    );
  }, []);

  const handleGenerateScript = useCallback((idea: ContentIdea) => {
    setIdeas((prev) =>
      prev.map((i) =>
        i.id === idea.id ? { ...i, status: "used" as const, updated_at: new Date().toISOString() } : i
      )
    );
    router.push(`/scripts?from_idea=${idea.id}`);
  }, [router]);

  // Apply filters
  const filteredIdeas = ideas.filter((idea) => {
    if (filterBrand !== "all" && idea.brand_id !== filterBrand) return false;
    if (filterPlatform !== "all" && idea.platform !== filterPlatform) return false;
    if (filterStatus !== "all" && idea.status !== filterStatus) return false;
    return true;
  });

  const statusCounts = {
    all: ideas.length,
    new: ideas.filter((i) => i.status === "new").length,
    accepted: ideas.filter((i) => i.status === "accepted").length,
    rejected: ideas.filter((i) => i.status === "rejected").length,
    used: ideas.filter((i) => i.status === "used").length,
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ideas</h1>
        <p className="text-muted-foreground mt-1">
          Generate AI-powered content ideas and manage your idea pipeline.
        </p>
      </div>

      {/* Idea Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            Idea Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="w-full sm:w-48 space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Brand</label>
              <Select value={genBrandId} onValueChange={setGenBrandId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {mockBrands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-40 space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Platform</label>
              <Select value={genPlatform} onValueChange={(v) => setGenPlatform(v as Platform)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {platformLabel(p)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-32 space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Ideas</label>
              <Select value={genCount} onValueChange={setGenCount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={generateIdeas}
              disabled={isGenerating || !genBrandId || !genPlatform}
              className="w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Ideas
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters + ideas list */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filters</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={filterBrand} onValueChange={setFilterBrand}>
              <SelectTrigger className="w-[160px] h-9 text-sm">
                <SelectValue placeholder="All brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All brands</SelectItem>
                {mockBrands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterPlatform} onValueChange={setFilterPlatform}>
              <SelectTrigger className="w-[150px] h-9 text-sm">
                <SelectValue placeholder="All platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All platforms</SelectItem>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {platformLabel(p)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px] h-9 text-sm">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ({statusCounts.all})</SelectItem>
                <SelectItem value="new">New ({statusCounts.new})</SelectItem>
                <SelectItem value="accepted">Accepted ({statusCounts.accepted})</SelectItem>
                <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
                <SelectItem value="used">Used ({statusCounts.used})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Ideas grid */}
        {filteredIdeas.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
            <Sparkles className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-1 font-medium">No ideas found</p>
            <p className="text-sm text-muted-foreground">
              {ideas.length === 0
                ? "Generate your first batch of ideas above."
                : "Try adjusting your filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onAccept={() => handleAccept(idea.id)}
                onReject={() => handleReject(idea.id)}
                onGenerateScript={() => handleGenerateScript(idea)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
