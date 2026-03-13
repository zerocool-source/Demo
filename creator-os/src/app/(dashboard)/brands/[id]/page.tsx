"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Edit3,
  Globe,
  Lightbulb,
  BarChart3,
  Save,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  cn,
  formatNumber,
  platformLabel,
  statusBadgeColor,
} from "@/lib/utils";
import {
  mockBrands,
  mockConnections,
  mockIdeas,
  mockAnalytics,
  mockAssets,
} from "@/lib/mock-data";
import type { Brand } from "@/types/database";

const TONE_OPTIONS = ["Professional", "Casual", "Humorous", "Educational", "Motivational"];
const MONETIZATION_OPTIONS = ["Affiliate", "Digital Products", "Courses", "Coaching", "Sponsorships", "Mixed"];
const CTA_OPTIONS = ["Soft sell", "Direct", "Value-first", "Urgency-based"];
const FREQUENCY_OPTIONS = ["Daily", "3x/week", "2x/week", "Weekly"];

export default function BrandDetailPage() {
  const params = useParams();
  const router = useRouter();
  const brandId = params.id as string;

  const brand = mockBrands.find((b) => b.id === brandId);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(brand?.name ?? "");
  const [editNiche, setEditNiche] = useState(brand?.niche ?? "");
  const [editAudience, setEditAudience] = useState(brand?.audience ?? "");
  const [editTone, setEditTone] = useState(brand?.tone_of_voice ?? "");
  const [editMonetization, setEditMonetization] = useState(brand?.monetization_model ?? "");
  const [editCta, setEditCta] = useState(brand?.cta_style ?? "");
  const [editFrequency, setEditFrequency] = useState(brand?.posting_frequency ?? "");
  const [editPillars, setEditPillars] = useState<string[]>(brand?.content_pillars ?? []);
  const [pillarInput, setPillarInput] = useState("");

  if (!brand) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/brands">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Brand Not Found</h1>
            <p className="text-muted-foreground mt-1">
              The brand you are looking for does not exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Data filtered by brand
  const connections = mockConnections.filter((c) => c.brand_id === brandId);
  const ideas = mockIdeas
    .filter((i) => i.brand_id === brandId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);
  const brandAnalytics = mockAnalytics.filter((a) => a.brand_id === brandId);
  const brandAssets = mockAssets.filter((a) => a.brand_id === brandId);

  // Stats
  const totalViews = brandAnalytics.reduce((sum, a) => sum + a.views, 0);
  const totalLikes = brandAnalytics.reduce((sum, a) => sum + a.likes, 0);
  const totalShares = brandAnalytics.reduce((sum, a) => sum + a.shares, 0);
  const totalAssets = brandAssets.length;

  function handleAddPillar() {
    const newPillars = pillarInput
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0 && !editPillars.includes(p));
    if (newPillars.length > 0) {
      setEditPillars([...editPillars, ...newPillars]);
      setPillarInput("");
    }
  }

  function handlePillarKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddPillar();
    }
  }

  function handleSaveEdit() {
    const updatedBrand = {
      name: editName,
      niche: editNiche,
      audience: editAudience || null,
      tone_of_voice: editTone || null,
      monetization_model: editMonetization || null,
      cta_style: editCta || null,
      posting_frequency: editFrequency || null,
      content_pillars: editPillars.length > 0 ? editPillars : null,
    };

    // TODO: Replace with Supabase update
    console.log("Updating brand:", brandId, updatedBrand);
    setIsEditing(false);
  }

  function handleCancelEdit() {
    if (!brand) return;
    setEditName(brand.name);
    setEditNiche(brand.niche);
    setEditAudience(brand.audience ?? "");
    setEditTone(brand.tone_of_voice ?? "");
    setEditMonetization(brand.monetization_model ?? "");
    setEditCta(brand.cta_style ?? "");
    setEditFrequency(brand.posting_frequency ?? "");
    setEditPillars(brand.content_pillars ?? []);
    setPillarInput("");
    setIsEditing(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/brands">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{brand.name}</h1>
            <p className="text-muted-foreground mt-1">{brand.niche}</p>
          </div>
        </div>
        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit3 className="mr-2 h-4 w-4" />
            Edit Brand
          </Button>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Views", value: formatNumber(totalViews) },
          { label: "Total Likes", value: formatNumber(totalLikes) },
          { label: "Total Shares", value: formatNumber(totalShares) },
          { label: "Content Assets", value: totalAssets.toString() },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Brand Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Brand Details</CardTitle>
            </div>
            <CardDescription>Identity and content strategy</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-niche">Niche</Label>
                  <Input
                    id="edit-niche"
                    value={editNiche}
                    onChange={(e) => setEditNiche(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-audience">Audience</Label>
                  <Textarea
                    id="edit-audience"
                    value={editAudience}
                    onChange={(e) => setEditAudience(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tone of Voice</Label>
                  <Select value={editTone} onValueChange={setEditTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TONE_OPTIONS.map((tone) => (
                        <SelectItem key={tone} value={tone}>
                          {tone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Monetization Model</Label>
                  <Select value={editMonetization} onValueChange={setEditMonetization}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONETIZATION_OPTIONS.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>CTA Style</Label>
                  <Select value={editCta} onValueChange={setEditCta}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select CTA style" />
                    </SelectTrigger>
                    <SelectContent>
                      {CTA_OPTIONS.map((cta) => (
                        <SelectItem key={cta} value={cta}>
                          {cta}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Posting Frequency</Label>
                  <Select value={editFrequency} onValueChange={setEditFrequency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {FREQUENCY_OPTIONS.map((freq) => (
                        <SelectItem key={freq} value={freq}>
                          {freq}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pillars">Content Pillars</Label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-pillars"
                      placeholder="Comma-separated pillars, then Enter"
                      value={pillarInput}
                      onChange={(e) => setPillarInput(e.target.value)}
                      onKeyDown={handlePillarKeyDown}
                    />
                    <Button type="button" variant="secondary" onClick={handleAddPillar}>
                      Add
                    </Button>
                  </div>
                  {editPillars.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {editPillars.map((pillar) => (
                        <Badge key={pillar} variant="secondary" className="gap-1">
                          {pillar}
                          <button
                            type="button"
                            onClick={() =>
                              setEditPillars(editPillars.filter((p) => p !== pillar))
                            }
                            className="ml-0.5 hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="ghost" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { label: "Audience", value: brand.audience },
                  { label: "Tone of Voice", value: brand.tone_of_voice },
                  { label: "Monetization", value: brand.monetization_model },
                  { label: "CTA Style", value: brand.cta_style },
                  { label: "Posting Frequency", value: brand.posting_frequency },
                ].map((field) =>
                  field.value ? (
                    <div key={field.label}>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        {field.label}
                      </p>
                      <p className="text-sm">{field.value}</p>
                    </div>
                  ) : null
                )}
                {brand.content_pillars && brand.content_pillars.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">
                      Content Pillars
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {brand.content_pillars.map((pillar) => (
                        <Badge key={pillar} variant="secondary" className="text-xs">
                          {pillar}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connected Platforms */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Connected Platforms</CardTitle>
            </div>
            <CardDescription>Platform accounts linked to this brand</CardDescription>
          </CardHeader>
          <CardContent>
            {connections.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No platforms connected yet.
              </p>
            ) : (
              <div className="space-y-3">
                {connections.map((conn) => (
                  <div
                    key={conn.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium">
                          {platformLabel(conn.platform)}
                        </p>
                        {conn.platform_username && (
                          <p className="text-xs text-muted-foreground">
                            {conn.platform_username}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge
                      className={cn("text-xs", statusBadgeColor(conn.status))}
                    >
                      {conn.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Ideas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Recent Ideas</CardTitle>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/ideas">View all</Link>
            </Button>
          </div>
          <CardDescription>Latest content ideas for {brand.name}</CardDescription>
        </CardHeader>
        <CardContent>
          {ideas.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No content ideas yet for this brand.
            </p>
          ) : (
            <div className="space-y-3">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="flex items-start justify-between gap-4 rounded-lg border border-border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm leading-snug">{idea.hook}</p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {idea.topic}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {platformLabel(idea.platform)}
                      </Badge>
                      <Badge className={cn("text-xs", statusBadgeColor(idea.status))}>
                        {idea.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Performance Overview</CardTitle>
          </div>
          <CardDescription>Engagement metrics across all platforms</CardDescription>
        </CardHeader>
        <CardContent>
          {brandAnalytics.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No analytics data available yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { label: "Views", value: totalViews },
                { label: "Likes", value: totalLikes },
                { label: "Shares", value: totalShares },
                {
                  label: "Comments",
                  value: brandAnalytics.reduce((sum, a) => sum + a.comments, 0),
                },
                {
                  label: "Saves",
                  value: brandAnalytics.reduce((sum, a) => sum + a.saves, 0),
                },
                {
                  label: "Click-throughs",
                  value: brandAnalytics.reduce((sum, a) => sum + a.click_throughs, 0),
                },
              ].map((metric) => (
                <div key={metric.label} className="text-center">
                  <p className="text-2xl font-bold">{formatNumber(metric.value)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{metric.label}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
