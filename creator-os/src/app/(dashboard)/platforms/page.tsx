"use client";

import { useState } from "react";
import { Wifi, WifiOff, Users, Loader2, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn, platformLabel, platformColor, statusBadgeColor, formatNumber } from "@/lib/utils";
import { mockConnections, mockBrands } from "@/lib/mock-data";
import type { PlatformConnection, Platform, ConnectionStatus } from "@/types/database";

const PLATFORM_BG: Record<string, string> = {
  youtube: "border-red-600/30",
  tiktok: "border-cyan-600/30",
  instagram: "border-pink-600/30",
  x: "border-zinc-600/30",
};

const PLATFORM_ICON_BG: Record<string, string> = {
  youtube: "bg-red-600/20",
  tiktok: "bg-cyan-600/20",
  instagram: "bg-pink-600/20",
  x: "bg-zinc-600/20",
};

const MOCK_USERNAMES: Record<string, string> = {
  youtube: "@CreatorGrowth",
  tiktok: "@creatorgrowth",
  instagram: "@creatorgrowth.ig",
  x: "@CreatorGrowthHQ",
};

const ALL_PLATFORMS: Platform[] = ["youtube", "tiktok", "instagram", "x"];

export default function PlatformsPage() {
  const [connections, setConnections] = useState<PlatformConnection[]>([...mockConnections]);
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [connecting, setConnecting] = useState<string | null>(null);
  const [disconnectDialog, setDisconnectDialog] = useState<string | null>(null);

  const filteredConnections = brandFilter === "all"
    ? connections
    : connections.filter((c) => c.brand_id === brandFilter);

  // Build a map of platform -> connection for the currently filtered brand
  const connectionMap = new Map<string, PlatformConnection>();
  filteredConnections.forEach((c) => {
    connectionMap.set(c.platform, c);
  });

  const handleConnect = (platform: Platform) => {
    const connectionId = connectionMap.get(platform)?.id;
    setConnecting(platform);

    setTimeout(() => {
      setConnections((prev) => {
        if (connectionId) {
          // Update existing connection
          return prev.map((c) =>
            c.id === connectionId
              ? {
                  ...c,
                  status: "connected" as ConnectionStatus,
                  platform_username: MOCK_USERNAMES[platform] ?? `@user_${platform}`,
                  metadata: { followers: Math.floor(Math.random() * 50000) + 1000 },
                  updated_at: new Date().toISOString(),
                }
              : c
          );
        } else {
          // Create new connection
          const newConn: PlatformConnection = {
            id: `conn-new-${Date.now()}`,
            user_id: "00000000-0000-0000-0000-000000000001",
            brand_id: brandFilter !== "all" ? brandFilter : mockBrands[0].id,
            platform,
            status: "connected",
            platform_username: MOCK_USERNAMES[platform] ?? `@user_${platform}`,
            metadata: { followers: Math.floor(Math.random() * 50000) + 1000 },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          return [...prev, newConn];
        }
      });
      setConnecting(null);
    }, 1500);
  };

  const handleDisconnect = (connectionId: string) => {
    setConnections((prev) =>
      prev.map((c) =>
        c.id === connectionId
          ? {
              ...c,
              status: "disconnected" as ConnectionStatus,
              platform_username: null,
              metadata: {},
              updated_at: new Date().toISOString(),
            }
          : c
      )
    );
    setDisconnectDialog(null);
  };

  const getFollowerCount = (conn: PlatformConnection): number | null => {
    const meta = conn.metadata as Record<string, unknown>;
    return (meta.followers as number) ?? (meta.subscribers as number) ?? null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platforms</h1>
        <p className="text-muted-foreground mt-1">
          Manage your platform connections and linked accounts.
        </p>
      </div>

      {/* Brand selector */}
      <div className="flex items-center gap-3">
        <Select value={brandFilter} onValueChange={setBrandFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {mockBrands.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Platform cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ALL_PLATFORMS.map((platform) => {
          const conn = connectionMap.get(platform);
          const isConnected = conn?.status === "connected";
          const isConnecting = connecting === platform;
          const followerCount = conn ? getFollowerCount(conn) : null;

          return (
            <Card
              key={platform}
              className={cn(
                "relative overflow-hidden transition-all",
                PLATFORM_BG[platform]
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        PLATFORM_ICON_BG[platform]
                      )}
                    >
                      <span className={cn("text-lg font-bold", platformColor(platform))}>
                        {platformLabel(platform).charAt(0)}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-base">{platformLabel(platform)}</CardTitle>
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      "text-xs",
                      statusBadgeColor(isConnected ? "connected" : "disconnected")
                    )}
                  >
                    {isConnected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isConnected && conn ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Wifi className="h-4 w-4 text-green-400" />
                        <span className="font-medium">{conn.platform_username}</span>
                      </div>
                      {followerCount !== null && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{formatNumber(followerCount)} followers</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-red-600/30 text-red-400 hover:bg-red-600/10 hover:text-red-300"
                      onClick={() => setDisconnectDialog(conn.id)}
                    >
                      <WifiOff className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="py-2">
                      <p className="text-sm text-muted-foreground">
                        No account connected. Link your {platformLabel(platform)} account to start publishing.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      disabled={isConnecting}
                      onClick={() => handleConnect(platform)}
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Wifi className="h-4 w-4 mr-2" />
                          Connect
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Note */}
      <Card className="border-dashed">
        <CardContent className="flex items-start gap-3 py-4">
          <Info className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            OAuth integration placeholder. In production, these buttons will initiate real OAuth flows
            to securely connect your social media accounts. Currently using simulated connections for demo purposes.
          </p>
        </CardContent>
      </Card>

      {/* Disconnect confirmation dialog */}
      <Dialog
        open={disconnectDialog !== null}
        onOpenChange={(open) => {
          if (!open) setDisconnectDialog(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disconnect Platform</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to disconnect this platform? You will need to reconnect
            to resume publishing.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDisconnectDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (disconnectDialog) handleDisconnect(disconnectDialog);
              }}
            >
              Disconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
