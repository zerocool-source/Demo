"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn, platformLabel, statusBadgeColor } from "@/lib/utils";
import type { Asset } from "@/types/database";

const platformBadgeColor: Record<string, string> = {
  youtube: "bg-red-600/20 text-red-400 border-red-600/30",
  tiktok: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30",
  instagram: "bg-pink-600/20 text-pink-400 border-pink-600/30",
  x: "bg-zinc-600/20 text-zinc-300 border-zinc-600/30",
};

interface ApprovalCardProps {
  asset: Asset;
  brandName?: string;
  onApprove: () => void;
  onReject: () => void;
  onRevise: (notes: string) => void;
}

export function ApprovalCard({
  asset,
  brandName,
  onApprove,
  onReject,
  onRevise,
}: ApprovalCardProps) {
  const [notes, setNotes] = useState("");
  const [showRevisionInput, setShowRevisionInput] = useState(false);

  function handleRevise() {
    if (!showRevisionInput) {
      setShowRevisionInput(true);
      return;
    }
    onRevise(notes);
    setNotes("");
    setShowRevisionInput(false);
  }

  return (
    <Card className="border-yellow-600/30 bg-card">
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-1.5">
            <CardTitle className="text-lg">{asset.title}</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                className={cn(
                  "text-[11px] border",
                  platformBadgeColor[asset.platform] ?? "bg-zinc-700 text-zinc-200"
                )}
              >
                {platformLabel(asset.platform)}
              </Badge>
              <Badge className={cn("text-[11px] border-0", statusBadgeColor(asset.status))}>
                Needs Review
              </Badge>
              {brandName && (
                <span className="text-xs text-muted-foreground">
                  {brandName}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Clock className="h-3.5 w-3.5" />
            Submitted{" "}
            {new Date(asset.updated_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </div>
        </div>
      </CardHeader>

      {/* Content fields */}
      <CardContent className="space-y-4">
        {asset.script_text && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Script
            </p>
            <div className="max-h-48 overflow-y-auto rounded-md bg-muted/50 p-3 text-sm leading-relaxed whitespace-pre-wrap">
              {asset.script_text}
            </div>
          </div>
        )}

        {asset.caption && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Caption
            </p>
            <div className="rounded-md bg-muted/50 p-3 text-sm leading-relaxed whitespace-pre-wrap">
              {asset.caption}
            </div>
          </div>
        )}

        {asset.thumbnail_prompt && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Thumbnail Prompt
            </p>
            <div className="rounded-md bg-muted/50 p-3 text-sm leading-relaxed">
              {asset.thumbnail_prompt}
            </div>
          </div>
        )}

        {asset.image_prompt && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Image Prompt
            </p>
            <div className="rounded-md bg-muted/50 p-3 text-sm leading-relaxed">
              {asset.image_prompt}
            </div>
          </div>
        )}

        {asset.video_prompt && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Video Prompt
            </p>
            <div className="rounded-md bg-muted/50 p-3 text-sm leading-relaxed">
              {asset.video_prompt}
            </div>
          </div>
        )}

        {asset.voiceover_text && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Voiceover Text
            </p>
            <div className="max-h-32 overflow-y-auto rounded-md bg-muted/50 p-3 text-sm leading-relaxed whitespace-pre-wrap">
              {asset.voiceover_text}
            </div>
          </div>
        )}

        {/* Reviewer notes */}
        <div className="border-t border-border pt-4 space-y-3">
          <Textarea
            placeholder="Add review notes (optional for approve/reject, required for revision requests)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="resize-none"
          />

          {showRevisionInput && notes.trim() === "" && (
            <p className="text-xs text-yellow-500">
              Please add notes explaining what revisions are needed.
            </p>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={onApprove}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button
              onClick={onReject}
              variant="destructive"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              onClick={handleRevise}
              variant="outline"
              className="border-yellow-600/50 text-yellow-500 hover:bg-yellow-600/10 hover:text-yellow-400"
              disabled={showRevisionInput && notes.trim() === ""}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Request Revision
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
