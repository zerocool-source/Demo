"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Share2,
  Lightbulb,
  FileText,
  FolderOpen,
  CheckSquare,
  Calendar,
  BarChart3,
  DollarSign,
  Bot,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/brands", label: "Brands", icon: Building2 },
  { href: "/platforms", label: "Platforms", icon: Share2 },
  { href: "/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/scripts", label: "Scripts", icon: FileText },
  { href: "/assets", label: "Assets", icon: FolderOpen },
  { href: "/approval", label: "Approval", icon: CheckSquare },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/monetization", label: "Monetization", icon: DollarSign },
  { href: "/agent-logs", label: "Agent Logs", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border/50 bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border/50 px-6">
        <Zap className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold tracking-tight">Creator OS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-border/50 px-6 py-4">
        <p className="text-xs text-muted-foreground">
          Creator OS v1.0
        </p>
      </div>
    </aside>
  );
}
