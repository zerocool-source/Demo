import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function platformLabel(platform: string): string {
  const labels: Record<string, string> = {
    youtube: "YouTube",
    tiktok: "TikTok",
    instagram: "Instagram",
    x: "X",
  };
  return labels[platform] ?? platform;
}

export function platformColor(platform: string): string {
  const colors: Record<string, string> = {
    youtube: "text-red-500",
    tiktok: "text-cyan-400",
    instagram: "text-pink-500",
    x: "text-foreground",
  };
  return colors[platform] ?? "text-muted-foreground";
}

export function statusBadgeColor(status: string): string {
  const map: Record<string, string> = {
    draft: "bg-zinc-700 text-zinc-200",
    needs_review: "bg-yellow-600/20 text-yellow-400",
    approved: "bg-green-600/20 text-green-400",
    scheduled: "bg-blue-600/20 text-blue-400",
    posted: "bg-emerald-600/20 text-emerald-400",
    rejected: "bg-red-600/20 text-red-400",
    published: "bg-emerald-600/20 text-emerald-400",
    failed: "bg-red-600/20 text-red-400",
    running: "bg-blue-600/20 text-blue-400",
    completed: "bg-green-600/20 text-green-400",
    new: "bg-purple-600/20 text-purple-400",
    accepted: "bg-green-600/20 text-green-400",
    used: "bg-zinc-600/20 text-zinc-400",
    connected: "bg-green-600/20 text-green-400",
    disconnected: "bg-zinc-700 text-zinc-400",
    pending: "bg-yellow-600/20 text-yellow-400",
    error: "bg-red-600/20 text-red-400",
  };
  return map[status] ?? "bg-zinc-700 text-zinc-200";
}
