"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, CheckCircle, FileText, AlertCircle, MessageSquare } from "lucide-react";
import type { GenerationStep } from "@/hooks/use-generation";

interface StepCardProps {
  step: GenerationStep;
}

export function StepCard({ step }: StepCardProps) {
  const { type, data } = step;

  if (type === "tool_call") {
    const { name, input } = data as { id: string; name: string; input: Record<string, unknown> };
    return (
      <Card className="border-primary/20">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <Wrench className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs font-mono">
                  {name}
                </Badge>
              </div>
              <pre className="mt-1.5 text-xs text-muted-foreground overflow-x-auto">
                {JSON.stringify(input, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === "tool_result") {
    const { name } = data as { id: string; name: string; result: string };
    return (
      <Card className="border-bnb-success/20">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-bnb-success shrink-0" />
            <span className="text-sm">
              <span className="font-mono text-xs">{name}</span> completed
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === "file") {
    const { path } = data as { path: string; content: string; language: string };
    return (
      <Card className="border-primary/20">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm font-mono">{path}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === "text") {
    const { content } = data as { content: string };
    if (!content) return null;
    return (
      <Card>
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === "error") {
    const { message } = data as { message: string };
    return (
      <Card className="border-destructive/30">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
            <span className="text-sm text-destructive">{message}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
