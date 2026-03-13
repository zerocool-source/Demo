"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit3,
  Save,
  Loader2,
  RefreshCw,
  PlusCircle,
  Hash,
  Calendar,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn, platformLabel, platformColor } from "@/lib/utils";
import { mockScripts, mockBrands } from "@/lib/mock-data";
import type { Script } from "@/types/database";

export default function ScriptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const scriptId = params.id as string;

  const originalScript = mockScripts.find((s) => s.id === scriptId);

  const [script, setScript] = useState<Script | null>(originalScript ?? null);
  const [isEditing, setIsEditing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Edit state
  const [editBody, setEditBody] = useState(script?.script_body ?? "");
  const [editCaption, setEditCaption] = useState(script?.caption ?? "");
  const [editCta, setEditCta] = useState(script?.cta ?? "");
  const [editAffiliate, setEditAffiliate] = useState(script?.affiliate_plug ?? "");

  const brand = script ? mockBrands.find((b) => b.id === script.brand_id) : null;

  const createdDate = script
    ? new Date(script.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  const handleStartEdit = useCallback(() => {
    if (!script) return;
    setEditBody(script.script_body ?? "");
    setEditCaption(script.caption ?? "");
    setEditCta(script.cta ?? "");
    setEditAffiliate(script.affiliate_plug ?? "");
    setIsEditing(true);
  }, [script]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleSave = useCallback(() => {
    if (!script) return;
    setScript({
      ...script,
      script_body: editBody || null,
      caption: editCaption || null,
      cta: editCta || null,
      affiliate_plug: editAffiliate || null,
      updated_at: new Date().toISOString(),
    });
    setIsEditing(false);
  }, [script, editBody, editCaption, editCta, editAffiliate]);

  const handleRegenerate = useCallback(() => {
    if (!script) return;

    setIsRegenerating(true);

    setTimeout(() => {
      const regeneratedBody = `HOOK: [Regenerated] Here's a fresh take on this topic that your audience needs to hear.

INTRO: After analyzing what works best for ${brand?.name ?? "your brand"}, I've rewritten this script with sharper hooks, tighter pacing, and a stronger call to action.

${script.script_body?.split("\n\n").slice(1, -1).join("\n\n") ?? ""}

OUTRO: That's a wrap on this one. If you found value, make sure to subscribe and turn on notifications. Your future self will thank you.`;

      const updatedScript: Script = {
        ...script,
        script_body: regeneratedBody,
        version: script.version + 1,
        updated_at: new Date().toISOString(),
      };

      setScript(updatedScript);
      setEditBody(regeneratedBody);
      setIsRegenerating(false);
    }, 2000);
  }, [script, brand]);

  const handleCreateAsset = useCallback(() => {
    if (!script) return;
    router.push(`/assets?from_script=${script.id}`);
  }, [script, router]);

  if (!script) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push("/scripts")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Scripts
        </Button>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <p className="text-muted-foreground font-medium">Script not found</p>
          <p className="text-sm text-muted-foreground mt-1">
            This script may have been deleted or the URL is incorrect.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/scripts")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{script.title}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <Badge
                variant="outline"
                className={cn("border-0 text-xs", platformColor(script.platform))}
              >
                {platformLabel(script.platform)}
              </Badge>
              <div className="flex items-center gap-1">
                <Hash className="h-3 w-3" />
                <span>v{script.version}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{createdDate}</span>
              </div>
              {brand && (
                <span className="text-muted-foreground/70">
                  {brand.name}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancelEdit}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleStartEdit}>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={handleRegenerate}
                disabled={isRegenerating}
              >
                {isRegenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate
                  </>
                )}
              </Button>
              <Button onClick={handleCreateAsset}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Asset
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Script sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main script body - takes 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Script Body</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Write your script body here..."
                />
              ) : (
                <div className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                  {script.script_body || (
                    <span className="text-muted-foreground italic">No script body yet.</span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar sections */}
        <div className="space-y-6">
          {/* Caption */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Caption</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="min-h-[120px] text-sm"
                  placeholder="Write a caption for this post..."
                />
              ) : (
                <p className="whitespace-pre-line text-sm text-foreground/90">
                  {script.caption || (
                    <span className="text-muted-foreground italic">No caption set.</span>
                  )}
                </p>
              )}
            </CardContent>
          </Card>

          {/* CTA */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Call to Action</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editCta}
                  onChange={(e) => setEditCta(e.target.value)}
                  className="min-h-[80px] text-sm"
                  placeholder="What should the audience do next?"
                />
              ) : (
                <p className="text-sm text-foreground/90">
                  {script.cta || (
                    <span className="text-muted-foreground italic">No CTA set.</span>
                  )}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Affiliate Plug */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Affiliate Plug</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editAffiliate}
                  onChange={(e) => setEditAffiliate(e.target.value)}
                  className="min-h-[80px] text-sm"
                  placeholder="Add an affiliate plug or sponsored mention..."
                />
              ) : (
                <p className="text-sm text-foreground/90">
                  {script.affiliate_plug || (
                    <span className="text-muted-foreground italic">No affiliate plug set.</span>
                  )}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
