import Link from "next/link";
import {
  Zap,
  Building2,
  FileText,
  Calendar,
  BarChart3,
  DollarSign,
  Bot,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Building2,
    title: "Brand Management",
    description:
      "Organize all your brand partnerships, contracts, and deliverables in one place.",
  },
  {
    icon: FileText,
    title: "Script Writing",
    description:
      "AI-powered script creation and editing with built-in approval workflows.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description:
      "Schedule content across all platforms with optimal posting times.",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description:
      "Track performance metrics across YouTube, TikTok, Instagram, and X.",
  },
  {
    icon: DollarSign,
    title: "Monetization Tracking",
    description:
      "Monitor revenue streams, invoices, and payment status at a glance.",
  },
  {
    icon: Bot,
    title: "AI Agent Automation",
    description:
      "Autonomous agents handle repetitive tasks so you can focus on creating.",
  },
  {
    icon: Shield,
    title: "Approval Workflows",
    description:
      "Streamlined review and approval processes for brand collaborations.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built for speed with real-time updates and instant content previews.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Creator OS</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
              <Zap className="h-3.5 w-3.5" />
              The operating system for creators
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Create, Manage,{" "}
              <span className="text-primary">Monetize.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Creator OS is the all-in-one platform that helps content creators
              manage brands, write scripts, schedule content, track analytics,
              and grow revenue — all from a single dashboard.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="text-base px-8">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-base px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need to scale
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From ideation to monetization, Creator OS gives you the tools to run
            your content business like a pro.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border/50 bg-card p-6 hover:border-primary/30 hover:bg-card/80 transition-all duration-200"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 via-card to-card p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to take control?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join thousands of creators who use Creator OS to streamline their
            workflow and grow their business.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-base px-8">
              Start for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="h-4 w-4" />
            <span className="text-sm">Creator OS</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Creator OS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
