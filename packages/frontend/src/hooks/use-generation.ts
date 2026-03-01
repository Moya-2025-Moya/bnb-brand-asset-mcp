"use client";

import { useState, useCallback } from "react";
import { decodeSSE } from "@/lib/stream-protocol";
import type { StreamEvent } from "@/lib/stream-protocol";

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

export interface GenerationStep {
  id: string;
  type: StreamEvent["type"];
  data: StreamEvent["data"];
  timestamp: number;
}

export interface GenerationState {
  status: "idle" | "generating" | "complete" | "error";
  steps: GenerationStep[];
  files: GeneratedFile[];
  error: string | null;
  totalTools: number;
}

export function useGeneration() {
  const [state, setState] = useState<GenerationState>({
    status: "idle",
    steps: [],
    files: [],
    error: null,
    totalTools: 0,
  });

  const generate = useCallback(async (prompt: string, apiKey: string) => {
    setState({
      status: "generating",
      steps: [],
      files: [],
      error: null,
      totalTools: 0,
    });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, apiKey }),
      });

      if (!response.ok) {
        const err = await response.json();
        setState((s) => ({
          ...s,
          status: "error",
          error: err.error || "Request failed",
        }));
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        setState((s) => ({ ...s, status: "error", error: "No response stream" }));
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let stepCounter = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const event = decodeSSE(line.trim());
          if (!event) continue;

          const step: GenerationStep = {
            id: `step-${stepCounter++}`,
            type: event.type,
            data: event.data,
            timestamp: Date.now(),
          };

          setState((prev) => {
            const newState = { ...prev, steps: [...prev.steps, step] };

            if (event.type === "file") {
              const fileData = event.data as { path: string; content: string; language: string };
              newState.files = [
                ...prev.files,
                {
                  path: fileData.path,
                  content: fileData.content,
                  language: fileData.language,
                },
              ];
            }

            if (event.type === "tool_call") {
              newState.totalTools = prev.totalTools + 1;
            }

            if (event.type === "complete") {
              newState.status = "complete";
            }

            if (event.type === "error") {
              newState.status = "error";
              newState.error = (event.data as { message: string }).message;
            }

            return newState;
          });
        }
      }
    } catch (error) {
      setState((s) => ({
        ...s,
        status: "error",
        error: error instanceof Error ? error.message : "Network error",
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      status: "idle",
      steps: [],
      files: [],
      error: null,
      totalTools: 0,
    });
  }, []);

  return { ...state, generate, reset };
}
