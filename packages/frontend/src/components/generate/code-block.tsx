"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    codeToHtml(code, {
      lang: language === "solidity" ? "solidity" : language === "tsx" ? "tsx" : language === "typescript" ? "typescript" : language === "css" ? "css" : language === "json" ? "json" : "text",
      theme: "vitesse-dark",
    })
      .then(setHtml)
      .catch(() => setHtml(`<pre>${code}</pre>`));
  }, [code, language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border overflow-hidden">
      {filename && (
        <div className="flex items-center justify-between bg-muted/50 px-3 py-1.5 border-b">
          <span className="text-xs font-mono text-muted-foreground">{filename}</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
      )}
      <div
        className="overflow-x-auto text-sm [&_pre]:p-4 [&_pre]:m-0 [&_pre]:bg-[#121212]!"
        dangerouslySetInnerHTML={{ __html: html || `<pre class="p-4">${escapeHtml(code)}</pre>` }}
      />
    </div>
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
