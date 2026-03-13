"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Loader2, FileText, Filter } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn, platformLabel, platformColor } from "@/lib/utils";
import { mockScripts, mockBrands, mockIdeas } from "@/lib/mock-data";
import { ScriptCard } from "@/components/scripts/script-card";
import type { Script, Platform } from "@/types/database";

const PLATFORMS: Platform[] = ["youtube", "tiktok", "instagram", "x"];

const MOCK_SCRIPT_BODIES: Record<Platform, string> = {
  youtube: `HOOK: This one insight changed how I create content forever.

INTRO: If you've been creating content for a while and still aren't seeing the growth you want, this video is for you. I'm going to break down the exact framework I used to 10x my reach.

SECTION 1: The Content Flywheel
Most creators think about content as individual pieces. But the best creators build a flywheel — every piece of content feeds the next one.

SECTION 2: Optimizing for the Algorithm
The algorithm isn't your enemy. It's your distribution partner. Here's how to work with it, not against it.

SECTION 3: Monetization from Day One
Don't wait to monetize. Build revenue into your content strategy from the very beginning.

OUTRO: If this helped, subscribe and hit that bell. Drop a comment telling me your biggest takeaway.`,
  tiktok: `HOOK: POV — you just discovered the strategy that changes everything.

Everyone's focused on going viral. But what if I told you that consistency beats virality every single time?

Here's the 3-step formula:
1. Post daily for 30 days
2. Study your analytics every week
3. Double down on what works

The creators who win aren't the luckiest — they're the most disciplined.

Follow for more creator growth tips.`,
  instagram: `Slide 1: Stop posting randomly.
Slide 2: Your content needs a strategy.
Slide 3: Here's the framework I use:
Slide 4: Step 1 — Define your content pillars (3-5 topics you own)
Slide 5: Step 2 — Create a content calendar (plan 2 weeks ahead)
Slide 6: Step 3 — Batch your content (create 5-10 pieces in one session)
Slide 7: Step 4 — Analyze and iterate (check metrics weekly)
Slide 8: The result? Consistent growth without burnout.
Slide 9: Save this for later and share it with a creator friend.`,
  x: `THREAD: The content strategy nobody talks about 🧵

1/ Most creators focus on reach. But reach without retention is meaningless. Here's how to build both.

2/ Retention starts with your hook. You have 3 seconds to earn the next 30. Make them count.

3/ The best hooks create a knowledge gap — they promise value the reader can't resist.

4/ After the hook, deliver immediately. Don't waste time with filler. Get to the insight.

5/ End every piece with a clear CTA. Tell people exactly what to do next.

6/ Then analyze. Which pieces got saved? Which got shared? Those are your winners.

7/ Repeat. The content game is an infinite game. The only way to lose is to stop playing.

Like + RT if this was helpful. Follow for daily creator tips.`,
};

const MOCK_CAPTIONS: Record<Platform, string> = {
  youtube:
    "The framework that changed everything for my content strategy. Full breakdown in this video.\n\n#ContentCreator #CreatorEconomy #GrowthStrategy",
  tiktok:
    "Consistency beats virality. Every. Single. Time. 🔥\n\n#creatortips #contentstrategy #growthhack #creator",
  instagram:
    "Your content strategy framework in 9 slides. Save this for later.\n\n#contentstrategy #creatortips #socialmediamarketing",
  x: "",
};

const MOCK_CTAS: Record<Platform, string> = {
  youtube: "Subscribe and grab the free Content Flywheel Template — link in description",
  tiktok: "Follow for daily creator growth tips",
  instagram: "Save this post and share it with a creator friend who needs it",
  x: "Like + RT and follow for daily creator insights",
};

export default function ScriptsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Loading...</div>}>
      <ScriptsPageContent />
    </Suspense>
  );
}

function ScriptsPageContent() {
  const searchParams = useSearchParams();
  const fromIdeaId = searchParams.get("from_idea");
  const linkedIdea = fromIdeaId ? mockIdeas.find((i) => i.id === fromIdeaId) : null;

  const [scripts, setScripts] = useState<Script[]>(mockScripts);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(!!linkedIdea);

  // New script form state
  const [newTitle, setNewTitle] = useState(linkedIdea ? `${linkedIdea.hook} — Script v1` : "");
  const [newBrandId, setNewBrandId] = useState(linkedIdea?.brand_id ?? "");
  const [newPlatform, setNewPlatform] = useState<Platform | "">(linkedIdea?.platform ?? "");

  // Filters
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [filterBrand, setFilterBrand] = useState<string>("all");

  const handleGenerate = useCallback(() => {
    if (!newTitle.trim() || !newBrandId || !newPlatform) return;

    setIsGenerating(true);

    setTimeout(() => {
      const platform = newPlatform as Platform;
      const newScript: Script = {
        id: `gen-script-${Date.now()}`,
        user_id: "00000000-0000-0000-0000-000000000001",
        brand_id: newBrandId,
        idea_id: fromIdeaId ?? null,
        platform,
        title: newTitle,
        script_body: MOCK_SCRIPT_BODIES[platform],
        caption: MOCK_CAPTIONS[platform] || null,
        cta: MOCK_CTAS[platform] || null,
        affiliate_plug: "Check out the tools I use daily — affiliate links in description",
        version: 1,
        parent_script_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setScripts((prev) => [newScript, ...prev]);
      setIsGenerating(false);
      setDialogOpen(false);
      setNewTitle("");
      setNewBrandId("");
      setNewPlatform("");
    }, 1500);
  }, [newTitle, newBrandId, newPlatform, fromIdeaId]);

  const filteredScripts = scripts.filter((script) => {
    if (filterPlatform !== "all" && script.platform !== filterPlatform) return false;
    if (filterBrand !== "all" && script.brand_id !== filterBrand) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scripts</h1>
          <p className="text-muted-foreground mt-1">
            Manage your content scripts and generate new ones with AI.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Generate New Script
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Generate New Script</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Title</label>
                <Input
                  placeholder="e.g. Why 90% of Creators Fail — Script v1"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Brand</label>
                <Select value={newBrandId} onValueChange={setNewBrandId}>
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

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Platform</label>
                <Select
                  value={newPlatform}
                  onValueChange={(v) => setNewPlatform(v as Platform)}
                >
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

              {linkedIdea && (
                <div className="rounded-md border border-border bg-muted/50 p-3 text-sm">
                  <p className="font-medium text-foreground/80 mb-1">Linked Idea</p>
                  <p className="text-muted-foreground">{linkedIdea.hook}</p>
                  <p className="text-xs text-muted-foreground mt-1">{linkedIdea.topic}</p>
                </div>
              )}

              <Button
                className="w-full"
                onClick={handleGenerate}
                disabled={isGenerating || !newTitle.trim() || !newBrandId || !newPlatform}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Script...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Script
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
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
        </div>
      </div>

      {/* Scripts grid */}
      {filteredScripts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <FileText className="h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-muted-foreground mb-1 font-medium">No scripts found</p>
          <p className="text-sm text-muted-foreground">
            {scripts.length === 0
              ? "Generate your first script to get started."
              : "Try adjusting your filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredScripts.map((script) => (
            <ScriptCard key={script.id} script={script} />
          ))}
        </div>
      )}
    </div>
  );
}
