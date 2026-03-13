"use client";

import { useState, useMemo } from "react";
import { Eye, Heart, Share2, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatNumber, formatCurrency, platformLabel } from "@/lib/utils";
import { mockAnalytics, mockBrands } from "@/lib/mock-data";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PLATFORM_COLORS: Record<string, string> = {
  youtube: "#ef4444",
  tiktok: "#06b6d4",
  instagram: "#ec4899",
  x: "#a1a1aa",
};

export default function AnalyticsPage() {
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<number>(30);

  const filtered = useMemo(() => {
    let data = [...mockAnalytics];
    if (brandFilter !== "all") {
      data = data.filter((a) => a.brand_id === brandFilter);
    }
    // Filter by date range (last N days from the latest date in data)
    const dates = data.map((a) => new Date(a.date).getTime());
    const maxDate = Math.max(...dates);
    const cutoff = maxDate - dateRange * 24 * 60 * 60 * 1000;
    data = data.filter((a) => new Date(a.date).getTime() >= cutoff);
    return data;
  }, [brandFilter, dateRange]);

  // Summary stats
  const totalViews = filtered.reduce((s, a) => s + a.views, 0);
  const totalLikes = filtered.reduce((s, a) => s + a.likes, 0);
  const totalShares = filtered.reduce((s, a) => s + a.shares, 0);
  const totalEarnings = filtered.reduce((s, a) => s + a.estimated_earnings, 0);

  // Views over time (aggregate by date)
  const viewsByDate = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((a) => {
      map.set(a.date, (map.get(a.date) ?? 0) + a.views);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, views]) => ({
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        views,
      }));
  }, [filtered]);

  // Engagement by platform
  const engagementByPlatform = useMemo(() => {
    const map = new Map<string, { likes: number; shares: number; comments: number }>();
    filtered.forEach((a) => {
      const existing = map.get(a.platform) ?? { likes: 0, shares: 0, comments: 0 };
      map.set(a.platform, {
        likes: existing.likes + a.likes,
        shares: existing.shares + a.shares,
        comments: existing.comments + a.comments,
      });
    });
    return Array.from(map.entries()).map(([platform, data]) => ({
      platform: platformLabel(platform),
      platformKey: platform,
      ...data,
      total: data.likes + data.shares + data.comments,
    }));
  }, [filtered]);

  // Platform distribution for pie chart
  const platformDistribution = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((a) => {
      map.set(a.platform, (map.get(a.platform) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([platform, count]) => ({
      name: platformLabel(platform),
      value: count,
      color: PLATFORM_COLORS[platform] ?? "#71717a",
    }));
  }, [filtered]);

  const summaryCards = [
    { title: "Total Views", value: formatNumber(totalViews), icon: Eye },
    { title: "Total Likes", value: formatNumber(totalLikes), icon: Heart },
    { title: "Total Shares", value: formatNumber(totalShares), icon: Share2 },
    { title: "Est. Earnings", value: formatCurrency(totalEarnings), icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track performance across all your platforms.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
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
        <div className="flex items-center gap-2">
          {[7, 14, 30].map((d) => (
            <Button
              key={d}
              size="sm"
              variant={dateRange === d ? "default" : "outline"}
              onClick={() => setDateRange(d)}
            >
              {d}d
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Views Over Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Views Over Time</CardTitle>
          <CardDescription>Daily views across platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewsByDate}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(240 10% 5.5%)",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  color: "#fafafa",
                }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: "#8b5cf6", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Engagement by Platform */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Engagement by Platform</CardTitle>
            <CardDescription>Likes, shares, and comments per platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementByPlatform}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="platform" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(240 10% 5.5%)",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    color: "#fafafa",
                  }}
                />
                <Legend />
                <Bar dataKey="likes" fill="#ec4899" name="Likes" />
                <Bar dataKey="shares" fill="#06b6d4" name="Shares" />
                <Bar dataKey="comments" fill="#f59e0b" name="Comments" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Platform Distribution</CardTitle>
            <CardDescription>Content spread across platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {platformDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(240 10% 5.5%)",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    color: "#fafafa",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
