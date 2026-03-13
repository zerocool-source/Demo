"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Brand } from "@/types/database";

interface BrandCardProps {
  brand: Brand;
}

export function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link href={`/brands/${brand.id}`}>
      <Card className="transition-colors hover:border-primary/50 cursor-pointer h-full">
        <CardHeader className="flex flex-row items-start gap-3 pb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base">{brand.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">{brand.niche}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {brand.audience && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Audience</p>
              <p className="text-sm">{brand.audience}</p>
            </div>
          )}
          {brand.posting_frequency && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Posting Frequency</p>
              <p className="text-sm">{brand.posting_frequency}</p>
            </div>
          )}
          {brand.content_pillars && brand.content_pillars.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Content Pillars</p>
              <div className="flex flex-wrap gap-1.5">
                {brand.content_pillars.map((pillar) => (
                  <Badge key={pillar} variant="secondary" className="text-xs">
                    {pillar}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
