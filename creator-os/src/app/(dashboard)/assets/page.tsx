"use client";

import { useState, useMemo } from "react";
import { Image, Mic, FileText, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn, platformLabel, statusBadgeColor } from "@/lib/utils";
import { mockAssets, mockBrands } from "@/lib/mock-data";
import type { Asset, AssetStatus } from "@/types/database";
import { AssetCard } from "@/components/assets/asset-card";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "needs_review", label: "Needs Review" },
  { value: "approved", label: "Approved" },
  { value: "scheduled", label: "Scheduled" },
  { value: "posted", label: "Posted" },
];

const PLATFORM_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Platforms" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "x", label: "X" },
];

const platformBadgeColor: Record<string, string> = {
  youtube: "bg-red-600/20 text-red-400 border-red-600/30",
  tiktok: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30",
  instagram: "bg-pink-600/20 text-pink-400 border-pink-600/30",
  x: "bg-zinc-600/20 text-zinc-300 border-zinc-600/30",
};

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      if (statusFilter !== "all" && asset.status !== statusFilter) return false;
      if (platformFilter !== "all" && asset.platform !== platformFilter) return false;
      if (brandFilter !== "all" && asset.brand_id !== brandFilter) return false;
      return true;
    });
  }, [assets, statusFilter, platformFilter, brandFilter]);

  function openDetail(asset: Asset) {
    setSelectedAsset(asset);
    setDialogOpen(true);
  }

  function submitForReview(assetId: string) {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetId ? { ...a, status: "needs_review" as AssetStatus, updated_at: new Date().toISOString() } : a
      )
    );
    if (selectedAsset?.id === assetId) {
      setSelectedAsset((prev) =>
        prev ? { ...prev, status: "needs_review" as AssetStatus } : prev
      );
    }
  }

  function changeStatus(assetId: string, newStatus: AssetStatus) {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetId ? { ...a, status: newStatus, updated_at: new Date().toISOString() } : a
      )
    );
    if (selectedAsset?.id === assetId) {
      setSelectedAsset((prev) =>
        prev ? { ...prev, status: newStatus } : prev
      );
    }
  }

  function getBrandName(brandId: string) {
    return mockBrands.find((b) => b.id === brandId)?.name ?? "Unknown";
  }

  const statusLabel = (status: string) =>
    status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Assets</h1>
        <p className="text-muted-foreground mt-1">
          Manage your content assets across all platforms.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by platform" />
          </SelectTrigger>
          <SelectContent>
            {PLATFORM_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={brandFilter} onValueChange={setBrandFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {mockBrands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(statusFilter !== "all" || platformFilter !== "all" || brandFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStatusFilter("all");
              setPlatformFilter("all");
              setBrandFilter("all");
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredAssets.length} of {assets.length} assets
      </p>

      {/* Assets grid */}
      {filteredAssets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <FileText className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No assets match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} onClick={() => openDetail(asset)} />
          ))}
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedAsset && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {selectedAsset.title}
                </DialogTitle>
                <div className="flex items-center gap-2 pt-2">
                  <Badge
                    className={cn(
                      "text-[11px] border",
                      platformBadgeColor[selectedAsset.platform] ?? "bg-zinc-700 text-zinc-200"
                    )}
                  >
                    {platformLabel(selectedAsset.platform)}
                  </Badge>
                  <Badge
                    className={cn("text-[11px] border-0", statusBadgeColor(selectedAsset.status))}
                  >
                    {statusLabel(selectedAsset.status)}
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {getBrandName(selectedAsset.brand_id)}
                  </span>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {selectedAsset.script_text && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Script
                    </p>
                    <div className="max-h-48 overflow-y-auto rounded-md bg-muted/50 p-3 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedAsset.script_text}
                    </div>
                  </div>
                )}

                {selectedAsset.caption && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Caption
                    </p>
                    <div className="rounded-md bg-muted/50 p-3 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedAsset.caption}
                    </div>
                  </div>
                )}

                {selectedAsset.thumbnail_prompt && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Thumbnail Prompt
                    </p>
                    <div className="rounded-md bg-muted/50 p-3 text-sm leading-relaxed">
                      {selectedAsset.thumbnail_prompt}
                    </div>
                  </div>
                )}

                {selectedAsset.image_prompt && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Image Prompt
                    </p>
                    <div className="rounded-md bg-muted/50 p-3 text-sm leading-relaxed">
                      {selectedAsset.image_prompt}
                    </div>
                  </div>
                )}

                {selectedAsset.video_prompt && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Video Prompt
                    </p>
                    <div className="rounded-md bg-muted/50 p-3 text-sm leading-relaxed">
                      {selectedAsset.video_prompt}
                    </div>
                  </div>
                )}

                {selectedAsset.voiceover_text && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Voiceover Text
                    </p>
                    <div className="max-h-32 overflow-y-auto rounded-md bg-muted/50 p-3 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedAsset.voiceover_text}
                    </div>
                  </div>
                )}

                {/* Status change */}
                <div className="border-t border-border pt-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Change Status
                  </p>
                  <Select
                    value={selectedAsset.status}
                    onValueChange={(val) => changeStatus(selectedAsset.id, val as AssetStatus)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="needs_review">Needs Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="posted">Posted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                {selectedAsset.status === "draft" && (
                  <Button
                    onClick={() => submitForReview(selectedAsset.id)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Submit for Review
                  </Button>
                )}
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
