"use client";

import Link from "next/link";
import { FileText, Calendar, Hash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, platformLabel, platformColor } from "@/lib/utils";
import type { Script } from "@/types/database";

interface ScriptCardProps {
  script: Script;
}

export function ScriptCard({ script }: ScriptCardProps) {
  const bodyPreview = script.script_body
    ? script.script_body.slice(0, 200) + (script.script_body.length > 200 ? "..." : "")
    : "No script body yet.";

  const createdDate = new Date(script.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link href={`/scripts/${script.id}`}>
      <Card className="group transition-all hover:border-border/80 hover:shadow-sm cursor-pointer">
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              <h3 className="font-semibold text-base leading-snug truncate">
                {script.title}
              </h3>
            </div>
            <Badge
              variant="outline"
              className={cn("border-0 text-xs shrink-0", platformColor(script.platform))}
            >
              {platformLabel(script.platform)}
            </Badge>
          </div>

          {/* Body preview */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 whitespace-pre-line">
            {bodyPreview}
          </p>

          {/* CTA preview */}
          {script.cta && (
            <div className="text-xs text-muted-foreground mb-3 p-2 rounded-md bg-muted/50 truncate">
              <span className="font-medium text-foreground/70">CTA:</span>{" "}
              {script.cta}
            </div>
          )}

          {/* Caption preview */}
          {script.caption && (
            <div className="text-xs text-muted-foreground mb-3 p-2 rounded-md bg-muted/50 line-clamp-2">
              <span className="font-medium text-foreground/70">Caption:</span>{" "}
              {script.caption.slice(0, 100)}
              {script.caption.length > 100 ? "..." : ""}
            </div>
          )}

          {/* Footer metadata */}
          <div className="flex items-center gap-4 pt-3 border-t border-border text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Hash className="h-3 w-3" />
              <span>v{script.version}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{createdDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
