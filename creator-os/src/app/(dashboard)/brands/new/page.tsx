"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const TONE_OPTIONS = ["Professional", "Casual", "Humorous", "Educational", "Motivational"];
const MONETIZATION_OPTIONS = ["Affiliate", "Digital Products", "Courses", "Coaching", "Sponsorships", "Mixed"];
const CTA_OPTIONS = ["Soft sell", "Direct", "Value-first", "Urgency-based"];
const FREQUENCY_OPTIONS = ["Daily", "3x/week", "2x/week", "Weekly"];

export default function NewBrandPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [niche, setNiche] = useState("");
  const [audience, setAudience] = useState("");
  const [toneOfVoice, setToneOfVoice] = useState("");
  const [monetizationModel, setMonetizationModel] = useState("");
  const [ctaStyle, setCtaStyle] = useState("");
  const [postingFrequency, setPostingFrequency] = useState("");
  const [pillarInput, setPillarInput] = useState("");
  const [pillars, setPillars] = useState<string[]>([]);

  function handleAddPillar() {
    const newPillars = pillarInput
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0 && !pillars.includes(p));
    if (newPillars.length > 0) {
      setPillars([...pillars, ...newPillars]);
      setPillarInput("");
    }
  }

  function handleRemovePillar(pillar: string) {
    setPillars(pillars.filter((p) => p !== pillar));
  }

  function handlePillarKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddPillar();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const brandData = {
      name,
      niche,
      audience: audience || null,
      tone_of_voice: toneOfVoice || null,
      monetization_model: monetizationModel || null,
      cta_style: ctaStyle || null,
      posting_frequency: postingFrequency || null,
      content_pillars: pillars.length > 0 ? pillars : null,
    };

    // TODO: Replace with Supabase insert
    console.log("Creating brand:", brandData);

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSubmitting(false);
    setSuccess(true);

    setTimeout(() => {
      router.push("/brands");
    }, 1500);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-600/20">
              <svg
                className="h-6 w-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold">Brand Created</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Redirecting to your brands...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/brands">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Brand</h1>
          <p className="text-muted-foreground mt-1">
            Set up a new creator brand with its identity and strategy.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brand Details</CardTitle>
          <CardDescription>
            Define your brand identity, audience, and content strategy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="e.g. CreatorGrowth"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Niche */}
            <div className="space-y-2">
              <Label htmlFor="niche">Niche *</Label>
              <Input
                id="niche"
                placeholder="e.g. Creator Economy / Business"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                required
              />
            </div>

            {/* Audience */}
            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Textarea
                id="audience"
                placeholder="Describe your ideal audience..."
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                rows={3}
              />
            </div>

            {/* Tone of Voice */}
            <div className="space-y-2">
              <Label>Tone of Voice</Label>
              <Select value={toneOfVoice} onValueChange={setToneOfVoice}>
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

            {/* Monetization Model */}
            <div className="space-y-2">
              <Label>Monetization Model</Label>
              <Select value={monetizationModel} onValueChange={setMonetizationModel}>
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

            {/* CTA Style */}
            <div className="space-y-2">
              <Label>CTA Style</Label>
              <Select value={ctaStyle} onValueChange={setCtaStyle}>
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

            {/* Posting Frequency */}
            <div className="space-y-2">
              <Label>Posting Frequency</Label>
              <Select value={postingFrequency} onValueChange={setPostingFrequency}>
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

            {/* Content Pillars */}
            <div className="space-y-2">
              <Label htmlFor="pillars">Content Pillars</Label>
              <div className="flex gap-2">
                <Input
                  id="pillars"
                  placeholder="Type pillars separated by commas, then press Enter"
                  value={pillarInput}
                  onChange={(e) => setPillarInput(e.target.value)}
                  onKeyDown={handlePillarKeyDown}
                />
                <Button type="button" variant="secondary" onClick={handleAddPillar}>
                  Add
                </Button>
              </div>
              {pillars.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {pillars.map((pillar) => (
                    <Badge key={pillar} variant="secondary" className="gap-1">
                      {pillar}
                      <button
                        type="button"
                        onClick={() => handleRemovePillar(pillar)}
                        className="ml-0.5 hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" asChild>
                <Link href="/brands">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting || !name || !niche}>
                {isSubmitting ? "Creating..." : "Create Brand"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
