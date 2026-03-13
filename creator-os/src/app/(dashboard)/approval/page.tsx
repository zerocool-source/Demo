"use client";

import { useState, useMemo } from "react";
import {
  ShieldCheck,
  Inbox,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  History,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, platformLabel, statusBadgeColor } from "@/lib/utils";
import { mockAssets, mockBrands } from "@/lib/mock-data";
import type { Asset, AssetStatus, ReviewDecision } from "@/types/database";
import { ApprovalCard } from "@/components/approval/approval-card";

interface ReviewRecord {
  id: string;
  assetId: string;
  assetTitle: string;
  platform: string;
  brandName: string;
  decision: ReviewDecision;
  notes: string;
  reviewedAt: string;
}

function getBrandName(brandId: string): string {
  return mockBrands.find((b) => b.id === brandId)?.name ?? "Unknown";
}

const decisionConfig: Record<
  ReviewDecision,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "text-green-400",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "text-red-400",
  },
  revision_requested: {
    label: "Revision Requested",
    icon: RotateCcw,
    className: "text-yellow-400",
  },
};

export default function ApprovalPage() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [reviewHistory, setReviewHistory] = useState<ReviewRecord[]>([]);

  const queueItems = useMemo(
    () => assets.filter((a) => a.status === "needs_review"),
    [assets]
  );

  function handleApprove(assetId: string) {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return;

    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetId
          ? { ...a, status: "approved" as AssetStatus, updated_at: new Date().toISOString() }
          : a
      )
    );

    setReviewHistory((prev) => [
      {
        id: crypto.randomUUID(),
        assetId,
        assetTitle: asset.title,
        platform: asset.platform,
        brandName: getBrandName(asset.brand_id),
        decision: "approved",
        notes: "",
        reviewedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }

  function handleReject(assetId: string) {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return;

    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetId
          ? { ...a, status: "rejected" as AssetStatus, updated_at: new Date().toISOString() }
          : a
      )
    );

    setReviewHistory((prev) => [
      {
        id: crypto.randomUUID(),
        assetId,
        assetTitle: asset.title,
        platform: asset.platform,
        brandName: getBrandName(asset.brand_id),
        decision: "rejected",
        notes: "",
        reviewedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }

  function handleRevise(assetId: string, notes: string) {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return;

    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetId
          ? { ...a, status: "draft" as AssetStatus, updated_at: new Date().toISOString() }
          : a
      )
    );

    setReviewHistory((prev) => [
      {
        id: crypto.randomUUID(),
        assetId,
        assetTitle: asset.title,
        platform: asset.platform,
        brandName: getBrandName(asset.brand_id),
        decision: "revision_requested",
        notes,
        reviewedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-yellow-500" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Approval Queue</h1>
            <p className="text-muted-foreground mt-1">
              Review and approve content before it goes live.
            </p>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="rounded-full bg-yellow-600/20 p-2">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{queueItems.length}</p>
              <p className="text-xs text-muted-foreground">Pending Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="rounded-full bg-green-600/20 p-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {reviewHistory.filter((r) => r.decision === "approved").length}
              </p>
              <p className="text-xs text-muted-foreground">Approved Today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="rounded-full bg-red-600/20 p-2">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {reviewHistory.filter((r) => r.decision === "rejected").length}
              </p>
              <p className="text-xs text-muted-foreground">Rejected Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs: Queue + History */}
      <Tabs defaultValue="queue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="queue" className="gap-2">
            <Inbox className="h-4 w-4" />
            Review Queue
            {queueItems.length > 0 && (
              <Badge className="ml-1 bg-yellow-600/20 text-yellow-400 text-[11px] border-0">
                {queueItems.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            Review History
            {reviewHistory.length > 0 && (
              <Badge className="ml-1 bg-zinc-600/20 text-zinc-400 text-[11px] border-0">
                {reviewHistory.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Queue tab */}
        <TabsContent value="queue" className="space-y-4">
          {queueItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20">
              <CheckCircle2 className="h-12 w-12 text-green-500/50 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                All caught up
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                No content waiting for review. Nice work!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {queueItems.map((asset) => (
                <ApprovalCard
                  key={asset.id}
                  asset={asset}
                  brandName={getBrandName(asset.brand_id)}
                  onApprove={() => handleApprove(asset.id)}
                  onReject={() => handleReject(asset.id)}
                  onRevise={(notes) => handleRevise(asset.id, notes)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* History tab */}
        <TabsContent value="history" className="space-y-4">
          {reviewHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
              <History className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                No review history yet. Decisions you make will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviewHistory.map((record) => {
                const config = decisionConfig[record.decision];
                const Icon = config.icon;

                return (
                  <Card key={record.id}>
                    <CardContent className="flex items-start gap-4 py-4">
                      <div
                        className={cn(
                          "mt-0.5 rounded-full p-1.5",
                          record.decision === "approved" && "bg-green-600/20",
                          record.decision === "rejected" && "bg-red-600/20",
                          record.decision === "revision_requested" && "bg-yellow-600/20"
                        )}
                      >
                        <Icon className={cn("h-4 w-4", config.className)} />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm">{record.assetTitle}</p>
                          <Badge
                            className={cn(
                              "text-[11px] border-0",
                              record.decision === "approved" && "bg-green-600/20 text-green-400",
                              record.decision === "rejected" && "bg-red-600/20 text-red-400",
                              record.decision === "revision_requested" &&
                                "bg-yellow-600/20 text-yellow-400"
                            )}
                          >
                            {config.label}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{platformLabel(record.platform)}</span>
                          <span className="text-border">|</span>
                          <span>{record.brandName}</span>
                          <span className="text-border">|</span>
                          <span>
                            {new Date(record.reviewedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        {record.notes && (
                          <div className="mt-2 rounded-md bg-muted/50 p-2.5 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground/80">Notes: </span>
                            {record.notes}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
