"use client";

import { Image, Mic, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, platformLabel, statusBadgeColor } from "@/lib/utils";
import type { Asset } from "@/types/database";

const platformBadgeColor: Record<string, string> = {
  youtube: "bg-red-600/20 text-red-400 border-red-600/30",
  tiktok: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30",
  instagram: "bg-pink-600/20 text-pink-400 border-pink-600/30",
  x: "bg-zinc-600/20 text-zinc-300 border-zinc-600/30",
};

interface AssetCardProps {
  asset: Asset;
  onClick?: () => void;
}

export function AssetCard({ asset, onClick }: AssetCardProps) {
  const statusLabel = asset.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Card
      className={cn(
        "transition-colors h-full",
        onClick && "hover:border-primary/50 cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug line-clamp-2">
            {asset.title}
          </CardTitle>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Badge
            className={cn(
              "text-[11px] border",
              platformBadgeColor[asset.platform] ?? "bg-zinc-700 text-zinc-200"
            )}
          >
            {platformLabel(asset.platform)}
          </Badge>
          <Badge className={cn("text-[11px] border-0", statusBadgeColor(asset.status))}>
            {statusLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {asset.script_text && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Script</p>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {asset.script_text.slice(0, 100)}
              {asset.script_text.length > 100 ? "..." : ""}
            </p>
          </div>
        )}
        {asset.caption && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Caption</p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {asset.caption.slice(0, 80)}
              {asset.caption.length > 80 ? "..." : ""}
            </p>
          </div>
        )}
        <div className="flex items-center gap-3 pt-1">
          {asset.thumbnail_prompt && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground" title="Has thumbnail prompt">
              <Image className="h-3.5 w-3.5" />
              Thumbnail
            </span>
          )}
          {asset.voiceover_text && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground" title="Has voiceover">
              <Mic className="h-3.5 w-3.5" />
              Voiceover
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
          <Calendar className="h-3 w-3" />
          {new Date(asset.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </CardContent>
    </Card>
  );
}
