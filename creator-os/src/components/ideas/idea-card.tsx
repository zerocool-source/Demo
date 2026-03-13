"use client";

import { Check, X, FileText, Lightbulb, Target, DollarSign, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, platformLabel, platformColor, statusBadgeColor } from "@/lib/utils";
import type { ContentIdea } from "@/types/database";

interface IdeaCardProps {
  idea: ContentIdea;
  onAccept?: () => void;
  onReject?: () => void;
  onGenerateScript?: () => void;
}

export function IdeaCard({ idea, onAccept, onReject, onGenerateScript }: IdeaCardProps) {
  return (
    <Card className="group transition-colors hover:border-border/80">
      <CardContent className="p-5">
        {/* Header row: hook + badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-base leading-snug line-clamp-2">
            {idea.hook}
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            <Badge
              variant="outline"
              className={cn("border-0 text-xs", statusBadgeColor(idea.status))}
            >
              {idea.status}
            </Badge>
          </div>
        </div>

        {/* Topic */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {idea.topic}
        </p>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className={cn("font-medium", platformColor(idea.platform))}>
              {platformLabel(idea.platform)}
            </span>
          </div>
          {idea.format && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Lightbulb className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{idea.format}</span>
            </div>
          )}
          {idea.target_audience_angle && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{idea.target_audience_angle}</span>
            </div>
          )}
          {idea.monetization_angle && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{idea.monetization_angle}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          {idea.status === "new" && onAccept && (
            <Button
              size="sm"
              variant="outline"
              className="text-green-400 border-green-400/30 hover:bg-green-400/10"
              onClick={onAccept}
            >
              <Check className="mr-1 h-3.5 w-3.5" />
              Accept
            </Button>
          )}
          {idea.status === "new" && onReject && (
            <Button
              size="sm"
              variant="outline"
              className="text-red-400 border-red-400/30 hover:bg-red-400/10"
              onClick={onReject}
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Reject
            </Button>
          )}
          {(idea.status === "new" || idea.status === "accepted") && onGenerateScript && (
            <Button
              size="sm"
              variant="outline"
              onClick={onGenerateScript}
              className="ml-auto"
            >
              <FileText className="mr-1 h-3.5 w-3.5" />
              Generate Script
            </Button>
          )}
          {idea.status === "used" && (
            <span className="text-xs text-muted-foreground ml-auto">Script generated</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
