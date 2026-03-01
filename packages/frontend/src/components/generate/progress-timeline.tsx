"use client";

import { CheckCircle, Loader2 } from "lucide-react";
import type { GenerationStep } from "@/hooks/use-generation";

interface ProgressTimelineProps {
  steps: GenerationStep[];
  status: "idle" | "generating" | "complete" | "error";
}

interface ToolNode {
  name: string;
  status: "done" | "running" | "waiting";
}

export function ProgressTimeline({ steps, status }: ProgressTimelineProps) {
  // Build tool nodes from steps
  const toolNodes: ToolNode[] = [];
  const completedTools = new Set<string>();

  for (const step of steps) {
    if (step.type === "tool_result") {
      const { name } = step.data as { id: string; name: string; result: string };
      completedTools.add(name);
    }
  }

  for (const step of steps) {
    if (step.type === "tool_call") {
      const { name } = step.data as { id: string; name: string; input: Record<string, unknown> };
      if (!toolNodes.find((n) => n.name === name)) {
        toolNodes.push({
          name,
          status: completedTools.has(name) ? "done" : "running",
        });
      }
    }
  }

  if (toolNodes.length === 0) return null;

  const totalDone = toolNodes.filter((n) => n.status === "done").length;
  const progress =
    status === "complete"
      ? 100
      : Math.round((totalDone / Math.max(toolNodes.length, 1)) * 90);

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #F0B90B, #18DC7E)",
            }}
          />
        </div>
        <span className="text-xs font-mono text-muted-foreground w-10 text-right">
          {progress}%
        </span>
      </div>

      {/* Tool nodes */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {toolNodes.map((node, i) => (
          <div key={node.name} className="flex items-center">
            {i > 0 && (
              <div
                className={`w-4 sm:w-6 h-px mx-0.5 ${
                  node.status === "done" ? "bg-[#18DC7E]/50" : "bg-muted"
                }`}
              />
            )}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-all duration-300 ${
                node.status === "done"
                  ? "bg-[#18DC7E]/10 text-[#18DC7E]"
                  : node.status === "running"
                  ? "bg-[#F0B90B]/10 text-[#F0B90B] ring-1 ring-[#F0B90B]/20"
                  : "bg-muted/50 text-muted-foreground"
              }`}
            >
              {node.status === "done" ? (
                <CheckCircle className="h-3 w-3" />
              ) : node.status === "running" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <div className="h-3 w-3 rounded-full border border-muted-foreground/30" />
              )}
              <span className="hidden sm:inline">
                {node.name.replace("get_", "")}
              </span>
            </div>
          </div>
        ))}

        {status === "complete" && (
          <>
            <div className="w-4 sm:w-6 h-px mx-0.5 bg-[#18DC7E]/50" />
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-[#18DC7E]/10 text-[#18DC7E]">
              <CheckCircle className="h-3 w-3" />
              <span className="hidden sm:inline">done</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
