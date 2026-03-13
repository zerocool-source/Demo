"use client";

import { useState, useMemo } from "react";
import { DollarSign, Link2, TrendingUp, Plus, Sparkles, ShoppingBag, Handshake, Megaphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { cn, formatCurrency, platformLabel } from "@/lib/utils";
import { mockMonetizationLinks, mockRevenue } from "@/lib/mock-data";
import type { MonetizationLink, LinkType, Platform } from "@/types/database";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const LINK_TYPE_BADGE: Record<string, string> = {
  affiliate: "bg-purple-600/20 text-purple-400 border-purple-600/30",
  digital_product: "bg-emerald-600/20 text-emerald-400 border-emerald-600/30",
  sponsorship: "bg-amber-600/20 text-amber-400 border-amber-600/30",
  platform_payout: "bg-blue-600/20 text-blue-400 border-blue-600/30",
  lead_gen: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30",
};

const TYPE_LABELS: Record<string, string> = {
  affiliate: "Affiliate",
  digital_product: "Product",
  sponsorship: "Sponsorship",
  platform_payout: "Platform Payout",
  lead_gen: "Lead Gen",
};

export default function MonetizationPage() {
  const [links, setLinks] = useState<MonetizationLink[]>([...mockMonetizationLinks]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // New link form state
  const [newType, setNewType] = useState<LinkType | "">("");
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newPlatform, setNewPlatform] = useState<string>("");

  // Revenue calculations
  const totalRevenue = mockRevenue.reduce((s, r) => s + r.amount, 0);
  const affiliateRevenue = mockRevenue
    .filter((r) => r.type === "affiliate")
    .reduce((s, r) => s + r.amount, 0);
  const productRevenue = mockRevenue
    .filter((r) => r.type === "digital_product")
    .reduce((s, r) => s + r.amount, 0);
  const sponsorshipRevenue = mockRevenue
    .filter((r) => r.type === "sponsorship")
    .reduce((s, r) => s + r.amount, 0);

  // Revenue trend (aggregate by date)
  const revenueTrend = useMemo(() => {
    const map = new Map<string, number>();
    mockRevenue.forEach((r) => {
      map.set(r.date, (map.get(r.date) ?? 0) + r.amount);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue: parseFloat(amount.toFixed(2)),
      }));
  }, []);

  const handleAddLink = () => {
    if (!newType || !newLabel || !newUrl) return;

    const newLink: MonetizationLink = {
      id: `ml-new-${Date.now()}`,
      user_id: "00000000-0000-0000-0000-000000000001",
      brand_id: "00000000-0000-0000-0000-000000000010",
      type: newType as LinkType,
      label: newLabel,
      url: newUrl,
      platform: newPlatform ? (newPlatform as Platform) : null,
      is_active: true,
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setLinks((prev) => [...prev, newLink]);
    setNewType("");
    setNewLabel("");
    setNewUrl("");
    setNewPlatform("");
    setDialogOpen(false);
  };

  const summaryCards = [
    { title: "Total Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, color: "text-emerald-400" },
    { title: "Affiliate Revenue", value: formatCurrency(affiliateRevenue), icon: Link2, color: "text-purple-400" },
    { title: "Product Revenue", value: formatCurrency(productRevenue), icon: ShoppingBag, color: "text-emerald-400" },
    { title: "Sponsorship Revenue", value: formatCurrency(sponsorshipRevenue), icon: Handshake, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monetization</h1>
          <p className="text-muted-foreground mt-1">
            Track revenue and manage monetization links.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Monetization Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newType} onValueChange={(v) => setNewType(v as LinkType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select link type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="affiliate">Affiliate</SelectItem>
                    <SelectItem value="digital_product">Digital Product</SelectItem>
                    <SelectItem value="sponsorship">Sponsorship</SelectItem>
                    <SelectItem value="platform_payout">Platform Payout</SelectItem>
                    <SelectItem value="lead_gen">Lead Gen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  placeholder="e.g., TubeBuddy Affiliate Link"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  placeholder="https://..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Platform (optional)</Label>
                <Select value={newPlatform} onValueChange={setNewPlatform}>
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
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddLink}
                disabled={!newType || !newLabel || !newUrl}
              >
                Add Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={cn("h-4 w-4", stat.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Revenue Trend</CardTitle>
          <CardDescription>Daily revenue over the past 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueTrend}>
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
                formatter={(value) => [formatCurrency(Number(value ?? 0)), "Revenue"]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monetization Links Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monetization Links</CardTitle>
          <CardDescription>Manage your affiliate links, products, and sponsorships</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Header row */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="col-span-4">Label</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Platform</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-3">URL</div>
            </div>
            {links.map((link) => (
              <div
                key={link.id}
                className="grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-lg border border-border"
              >
                <div className="col-span-4">
                  <span className="text-sm font-medium">{link.label}</span>
                </div>
                <div className="col-span-2">
                  <Badge
                    className={cn(
                      "text-xs border",
                      LINK_TYPE_BADGE[link.type] ?? "bg-zinc-700 text-zinc-200"
                    )}
                  >
                    {TYPE_LABELS[link.type] ?? link.type}
                  </Badge>
                </div>
                <div className="col-span-2 text-sm text-muted-foreground">
                  {link.platform ? platformLabel(link.platform) : "All"}
                </div>
                <div className="col-span-1">
                  <Badge
                    className={cn(
                      "text-xs",
                      link.is_active
                        ? "bg-green-600/20 text-green-400"
                        : "bg-zinc-700 text-zinc-400"
                    )}
                  >
                    {link.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="col-span-3">
                  <span className="text-xs text-muted-foreground truncate block">
                    {link.url}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Tracking Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            Conversion Tracking
          </CardTitle>
          <CardDescription>Coming Soon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground max-w-md">
              Advanced conversion tracking is on the way. Soon you will be able to track
              click-through rates, conversion funnels, A/B test performance, and
              revenue attribution across all your monetization links and platforms.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
