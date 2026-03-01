"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  isGenerating,
  disabled,
}: PromptInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Describe your project</label>
      <div className="relative">
        <Textarea
          placeholder="Create a BEP20 token with a branded landing page..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="resize-none pr-14"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !disabled) {
              onSubmit();
            }
          }}
        />
        <Button
          onClick={onSubmit}
          disabled={disabled || isGenerating}
          size="icon"
          className="absolute right-2 bottom-2"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Press Cmd+Enter to send
      </p>
    </div>
  );
}
