"use client";

import Link from "next/link";
import {
  TrendingUp,
  Eye,
  DollarSign,
  Building2,
  Lightbulb,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, formatNumber, platformLabel, statusBadgeColor } from "@/lib/utils";
import {
  mockBrands,
  mockIdeas,
  mockScheduledPosts,
  mockAnalytics,
  mockRevenue,
  mockAssets,
} from "@/lib/mock-data";

export default function DashboardPage() {
  // Aggregate stats
  const totalPosts = mockAssets.length;
  const totalViews = mockAnalytics.reduce((sum, a) => sum + a.views, 0);
  const totalRevenue = mockRevenue.reduce((sum, r) => sum + r.amount, 0);
  const activeBrands = mockBrands.length;

  // Recent ideas (last 5)
  const recentIdeas = [...mockIdeas]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Upcoming scheduled posts (only scheduled, sorted by date)
  const upcomingPosts = mockScheduledPosts
    .filter((p) => p.status === "scheduled")
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());

  // Revenue by recent days (last 7 entries for a mini trend)
  const recentRevenue = [...mockRevenue]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7)
    .reverse();

  const statsCards = [
    {
      title: "Total Posts",
      value: formatNumber(totalPosts),
      icon: TrendingUp,
      description: "Content assets created",
    },
    {
      title: "Total Views",
      value: formatNumber(totalViews),
      icon: Eye,
      description: "Across all platforms",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      description: "Lifetime earnings",
    },
    {
      title: "Active Brands",
      value: activeBrands.toString(),
      icon: Building2,
      description: "Brands managed",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground mt-1">
          Here is what is happening across your brands today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Content Ideas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Recent Ideas</CardTitle>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/ideas">View all</Link>
              </Button>
            </div>
            <CardDescription>Latest content ideas from your brands</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="flex items-start justify-between gap-4 rounded-lg border border-border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm leading-snug">{idea.hook}</p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {idea.topic}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {platformLabel(idea.platform)}
                      </Badge>
                      <Badge className={cn("text-xs", statusBadgeColor(idea.status))}>
                        {idea.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Scheduled Posts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Upcoming Posts</CardTitle>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/schedule">View all</Link>
              </Button>
            </div>
            <CardDescription>Posts scheduled for publishing</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No upcoming posts scheduled.
              </p>
            ) : (
              <div className="space-y-4">
                {upcomingPosts.map((post) => {
                  const asset = mockAssets.find((a) => a.id === post.asset_id);
                  const scheduledDate = new Date(post.scheduled_at);
                  return (
                    <div
                      key={post.id}
                      className="flex items-center justify-between gap-4 rounded-lg border border-border p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm">
                          {asset?.title ?? "Untitled"}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {platformLabel(post.platform)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {scheduledDate.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            at{" "}
                            {scheduledDate.toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                      <Badge className={cn("text-xs shrink-0", statusBadgeColor(post.status))}>
                        {post.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Revenue Trend</CardTitle>
          </div>
          <CardDescription>Recent revenue across all monetization channels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-32">
            {recentRevenue.map((entry) => {
              const maxAmount = Math.max(...recentRevenue.map((r) => r.amount));
              const heightPercent = maxAmount > 0 ? (entry.amount / maxAmount) * 100 : 0;
              return (
                <div key={entry.id} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(entry.amount)}
                  </span>
                  <div
                    className="w-full rounded-t bg-primary/80 transition-all"
                    style={{ height: `${heightPercent}%`, minHeight: "4px" }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
