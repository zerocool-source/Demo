"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  PlayCircle,
  List,
  CalendarDays,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, platformLabel, statusBadgeColor } from "@/lib/utils";
import { mockScheduledPosts, mockAssets } from "@/lib/mock-data";
import type { ScheduledPost, Platform } from "@/types/database";

export default function SchedulePage() {
  const [posts, setPosts] = useState<ScheduledPost[]>([...mockScheduledPosts]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [publishing, setPublishing] = useState<string | null>(null);

  // New post form state
  const [newAssetId, setNewAssetId] = useState("");
  const [newPlatform, setNewPlatform] = useState<Platform | "">("");
  const [newDateTime, setNewDateTime] = useState("");

  const approvedAssets = mockAssets.filter((a) => a.status === "approved");

  const getAssetTitle = (assetId: string) => {
    const asset = mockAssets.find((a) => a.id === assetId);
    return asset?.title ?? "Untitled";
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-400" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-zinc-400" />;
    }
  };

  const handleSchedule = () => {
    if (!newAssetId || !newPlatform || !newDateTime) return;

    const newPost: ScheduledPost = {
      id: `sp-new-${Date.now()}`,
      user_id: "00000000-0000-0000-0000-000000000001",
      brand_id: "00000000-0000-0000-0000-000000000010",
      asset_id: newAssetId,
      platform: newPlatform as Platform,
      scheduled_at: new Date(newDateTime).toISOString(),
      published_at: null,
      status: "scheduled",
      platform_post_id: null,
      error_message: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setPosts((prev) => [...prev, newPost]);
    setNewAssetId("");
    setNewPlatform("");
    setNewDateTime("");
    setDialogOpen(false);
  };

  const handleSimulatePublish = (postId: string) => {
    setPublishing(postId);
    setTimeout(() => {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                status: "published" as const,
                published_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            : p
        )
      );
      setPublishing(null);
    }, 1500);
  };

  // Calendar helpers
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const monthName = new Date(currentYear, currentMonth).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const getPostsForDay = (day: number) => {
    return posts.filter((p) => {
      const d = new Date(p.scheduled_at);
      return (
        d.getFullYear() === currentYear &&
        d.getMonth() === currentMonth &&
        d.getDate() === day
      );
    });
  };

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <p className="text-muted-foreground mt-1">
            Manage your publishing queue and calendar.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule a Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Asset</Label>
                <Select value={newAssetId} onValueChange={setNewAssetId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an approved asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedAssets.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select
                  value={newPlatform}
                  onValueChange={(v) => setNewPlatform(v as Platform)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="x">X</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date &amp; Time</Label>
                <Input
                  type="datetime-local"
                  value={newDateTime}
                  onChange={(e) => setNewDateTime(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSchedule}
                disabled={!newAssetId || !newPlatform || !newDateTime}
              >
                Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            List
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            Calendar
          </TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Publishing Queue</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedPosts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No scheduled posts yet. Click &quot;Schedule New&quot; to get started.
                </p>
              ) : (
                <div className="space-y-2">
                  {/* Header row */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <div className="col-span-4">Title</div>
                    <div className="col-span-2">Platform</div>
                    <div className="col-span-3">Scheduled</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                  {sortedPosts.map((post) => {
                    const scheduledDate = new Date(post.scheduled_at);
                    return (
                      <div
                        key={post.id}
                        className="grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-lg border border-border"
                      >
                        <div className="col-span-4 flex items-center gap-2">
                          {statusIcon(post.status)}
                          <span className="text-sm font-medium truncate">
                            {getAssetTitle(post.asset_id)}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <Badge variant="secondary" className="text-xs">
                            {platformLabel(post.platform)}
                          </Badge>
                        </div>
                        <div className="col-span-3 text-sm text-muted-foreground">
                          {scheduledDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          at{" "}
                          {scheduledDate.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="col-span-1">
                          <Badge className={cn("text-xs", statusBadgeColor(post.status))}>
                            {post.status}
                          </Badge>
                        </div>
                        <div className="col-span-2 text-right">
                          {post.status === "scheduled" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={publishing === post.id}
                              onClick={() => handleSimulatePublish(post.id)}
                            >
                              {publishing === post.id ? (
                                <span className="flex items-center gap-1 text-xs">
                                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                  Publishing...
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs">
                                  <PlayCircle className="h-3 w-3" />
                                  Simulate Publish
                                </span>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{monthName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-px">
                {/* Day of week headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div
                    key={d}
                    className="text-center text-xs font-medium text-muted-foreground py-2"
                  >
                    {d}
                  </div>
                ))}
                {/* Empty cells before first day */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="min-h-[80px] rounded-lg border border-border/50 bg-muted/20 p-1"
                  />
                ))}
                {/* Day cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayPosts = getPostsForDay(day);
                  const isToday =
                    day === now.getDate() &&
                    currentMonth === now.getMonth() &&
                    currentYear === now.getFullYear();
                  return (
                    <div
                      key={day}
                      className={cn(
                        "min-h-[80px] rounded-lg border p-1",
                        isToday
                          ? "border-primary bg-primary/5"
                          : "border-border/50"
                      )}
                    >
                      <span
                        className={cn(
                          "text-xs font-medium",
                          isToday ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {day}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {dayPosts.map((post) => (
                          <div
                            key={post.id}
                            className={cn(
                              "text-[10px] leading-tight px-1 py-0.5 rounded truncate",
                              post.status === "published"
                                ? "bg-emerald-600/20 text-emerald-400"
                                : post.status === "failed"
                                ? "bg-red-600/20 text-red-400"
                                : "bg-blue-600/20 text-blue-400"
                            )}
                          >
                            {getAssetTitle(post.asset_id)}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
