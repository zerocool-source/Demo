"use client";

import { useState, useMemo } from "react";
import { Bot, Clock, CheckCircle2, XCircle, ChevronDown, ChevronRight, Zap, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, statusBadgeColor } from "@/lib/utils";
import { mockAgentRuns } from "@/lib/mock-data";
import type { AgentRun, AgentType, AgentRunStatus } from "@/types/database";

const AGENT_LABELS: Record<string, string> = {
  niche_strategist: "Niche Strategist",
  trend_research: "Trend Research",
  script_writer: "Script Writer",
  offer_agent: "Offer Agent",
  thumbnail_prompt: "Thumbnail Prompt",
  repurposing: "Repurposing",
  compliance: "Compliance",
  publisher: "Publisher",
  analytics: "Analytics",
};

const AGENT_BADGE_COLOR: Record<string, string> = {
  niche_strategist: "bg-violet-600/20 text-violet-400 border-violet-600/30",
  trend_research: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30",
  script_writer: "bg-amber-600/20 text-amber-400 border-amber-600/30",
  offer_agent: "bg-emerald-600/20 text-emerald-400 border-emerald-600/30",
  thumbnail_prompt: "bg-pink-600/20 text-pink-400 border-pink-600/30",
  repurposing: "bg-blue-600/20 text-blue-400 border-blue-600/30",
  compliance: "bg-orange-600/20 text-orange-400 border-orange-600/30",
  publisher: "bg-green-600/20 text-green-400 border-green-600/30",
  analytics: "bg-indigo-600/20 text-indigo-400 border-indigo-600/30",
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  running: <Clock className="h-4 w-4 text-blue-400 animate-pulse" />,
  completed: <CheckCircle2 className="h-4 w-4 text-green-400" />,
  failed: <XCircle className="h-4 w-4 text-red-400" />,
};

export default function AgentLogsPage() {
  const [agentFilter, setAgentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const filteredRuns = useMemo(() => {
    let data = [...mockAgentRuns];
    if (agentFilter !== "all") {
      data = data.filter((r) => r.agent === agentFilter);
    }
    if (statusFilter !== "all") {
      data = data.filter((r) => r.status === statusFilter);
    }
    // Sort by date newest first
    return data.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [agentFilter, statusFilter]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const formatDuration = (ms: number | null) => {
    if (ms === null) return "-";
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatTimestamp = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
      " at " +
      d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
  };

  // Get unique agent types for filter
  const agentTypes = Array.from(new Set(mockAgentRuns.map((r) => r.agent)));

  const failedCount = mockAgentRuns.filter((r) => r.status === "failed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agent Logs</h1>
        <p className="text-muted-foreground mt-1">
          Monitor AI agent runs, outputs, and performance.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAgentRuns.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
            <Zap className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAgentRuns
                .reduce((s, r) => s + (r.token_estimate ?? 0), 0)
                .toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Failed Runs</CardTitle>
            <AlertTriangle className={cn("h-4 w-4", failedCount > 0 ? "text-red-400" : "text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", failedCount > 0 && "text-red-400")}>
              {failedCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={agentFilter} onValueChange={setAgentFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Agents</SelectItem>
            {agentTypes.map((agent) => (
              <SelectItem key={agent} value={agent}>
                {AGENT_LABELS[agent] ?? agent}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        {(agentFilter !== "all" || statusFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setAgentFilter("all");
              setStatusFilter("all");
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredRuns.length} of {mockAgentRuns.length} runs
      </p>

      {/* Agent Runs List */}
      <Card>
        <CardContent className="p-0">
          <div className="space-y-0">
            {/* Header row */}
            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
              <div className="col-span-1"></div>
              <div className="col-span-2">Agent</div>
              <div className="col-span-3">Input</div>
              <div className="col-span-2">Output</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Tokens</div>
              <div className="col-span-1">Duration</div>
              <div className="col-span-1">Time</div>
            </div>
            {filteredRuns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Bot className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No agent runs match your filters.</p>
              </div>
            ) : (
              filteredRuns.map((run) => {
                const isExpanded = expandedRows.has(run.id);
                const isFailed = run.status === "failed";
                return (
                  <div key={run.id}>
                    <div
                      className={cn(
                        "grid grid-cols-12 gap-4 items-center px-4 py-3 border-b border-border cursor-pointer hover:bg-muted/30 transition-colors",
                        isFailed && "bg-red-950/10"
                      )}
                      onClick={() => toggleRow(run.id)}
                    >
                      <div className="col-span-1 flex items-center">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="col-span-2">
                        <Badge
                          className={cn(
                            "text-xs border",
                            AGENT_BADGE_COLOR[run.agent] ?? "bg-zinc-700 text-zinc-200"
                          )}
                        >
                          {AGENT_LABELS[run.agent] ?? run.agent}
                        </Badge>
                      </div>
                      <div className="col-span-3">
                        <span className="text-sm truncate block">{run.input_summary}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-sm text-muted-foreground truncate block">
                          {run.output_summary}
                        </span>
                      </div>
                      <div className="col-span-1">
                        <div className="flex items-center gap-1.5">
                          {STATUS_ICON[run.status]}
                          <Badge className={cn("text-xs", statusBadgeColor(run.status))}>
                            {run.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="col-span-1 text-sm text-muted-foreground">
                        {run.token_estimate?.toLocaleString() ?? "-"}
                      </div>
                      <div className="col-span-1 text-sm text-muted-foreground">
                        {formatDuration(run.duration_ms)}
                      </div>
                      <div className="col-span-1 text-xs text-muted-foreground">
                        {new Date(run.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-4 py-4 border-b border-border bg-muted/20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                              Full Input
                            </p>
                            <div className="rounded-md bg-muted/50 p-3 text-sm leading-relaxed">
                              {run.input_summary ?? "No input recorded"}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                              Full Output
                            </p>
                            <div className="rounded-md bg-muted/50 p-3 text-sm leading-relaxed">
                              {run.output_summary ?? "No output recorded"}
                            </div>
                          </div>
                          {isFailed && run.error_message && (
                            <div className="md:col-span-2">
                              <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-1.5">
                                Error Message
                              </p>
                              <div className="rounded-md bg-red-950/30 border border-red-900/50 p-3 text-sm text-red-300 leading-relaxed">
                                {run.error_message}
                              </div>
                            </div>
                          )}
                          <div className="md:col-span-2 flex items-center gap-6 text-xs text-muted-foreground">
                            <span>Created: {formatTimestamp(run.created_at)}</span>
                            {run.completed_at && (
                              <span>Completed: {formatTimestamp(run.completed_at)}</span>
                            )}
                            <span>ID: {run.id}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
