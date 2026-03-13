"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/brands": "Brands",
  "/platforms": "Platforms",
  "/ideas": "Ideas",
  "/scripts": "Scripts",
  "/assets": "Assets",
  "/approval": "Approval",
  "/schedule": "Schedule",
  "/analytics": "Analytics",
  "/monetization": "Monetization",
  "/agent-logs": "Agent Logs",
  "/settings": "Settings",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) {
    return pageTitles[pathname];
  }

  for (const [path, title] of Object.entries(pageTitles)) {
    if (pathname.startsWith(path)) {
      return title;
    }
  }

  return "Creator OS";
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const title = getPageTitle(pathname);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-card/80 backdrop-blur-sm px-6">
      <h1 className="text-lg font-semibold">{title}</h1>

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <User className="h-4 w-4 text-primary" />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </header>
  );
}
