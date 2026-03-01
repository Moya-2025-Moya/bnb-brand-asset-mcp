"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Header } from "@/components/landing/header";
import { ApiKeyInput } from "@/components/generate/api-key-input";
import { PromptInput } from "@/components/generate/prompt-input";
import { TemplateCards } from "@/components/generate/template-cards";
import { CodeStream } from "@/components/generate/code-stream";
import { PreviewPanel } from "@/components/generate/preview-panel";
import { ProgressTimeline } from "@/components/generate/progress-timeline";
import { DownloadButton } from "@/components/generate/download-button";
import { CompletionView } from "@/components/generate/completion-view";
import { useGeneration } from "@/hooks/use-generation";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useConfetti } from "@/hooks/use-confetti";
import { useCountUp } from "@/hooks/use-count-up";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  RotateCcw,
  Wrench,
  FileText,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Zap,
} from "lucide-react";
import type { GenerationStep } from "@/hooks/use-generation";

// Compact log line for the streaming log view
function LogLine({ step }: { step: GenerationStep }) {
  const { type, data } = step;
  if (type === "tool_call") {
    const { name } = data as { id: string; name: string; input: Record<string, unknown> };
    return (
      <div className="flex items-start gap-3 py-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Wrench className="h-4 w-4 text-[#F0B90B] mt-0.5 shrink-0" />
        <div>
          <span className="text-sm font-medium text-foreground">Calling </span>
          <code className="text-sm font-mono text-[#F0B90B]">{name}</code>
        </div>
      </div>
    );
  }
  if (type === "tool_result") {
    const { name } = data as { id: string; name: string; result: string };
    return (
      <div className="flex items-start gap-3 py-2 animate-in fade-in duration-200">
        <CheckCircle className="h-4 w-4 text-[#18DC7E] mt-0.5 shrink-0" />
        <div>
          <code className="text-sm font-mono text-foreground">{name}</code>
          <span className="text-sm text-[#18DC7E] ml-2">completed</span>
        </div>
      </div>
    );
  }
  if (type === "file") {
    const { path } = data as { path: string; content: string; language: string };
    return (
      <div className="flex items-start gap-3 py-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <FileText className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
        <div>
          <span className="text-sm text-muted-foreground">Generated </span>
          <code className="text-sm font-mono text-foreground">{path}</code>
        </div>
      </div>
    );
  }
  if (type === "text") {
    const { content } = data as { content: string };
    if (!content) return null;
    return (
      <div className="flex items-start gap-3 py-2 animate-in fade-in duration-200">
        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          {content.length > 200 ? content.slice(0, 200) + "..." : content}
        </p>
      </div>
    );
  }
  if (type === "error") {
    const { message } = data as { message: string };
    return (
      <div className="flex items-start gap-3 py-2 text-destructive animate-in fade-in duration-200">
        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
        <span className="text-sm">{message}</span>
      </div>
    );
  }
  return null;
}

export default function GeneratePage() {
  const [apiKey, setApiKey] = useLocalStorage("bnb-dev-suite-api-key", "");
  const [maxTokens, setMaxTokens] = useLocalStorage("bnb-dev-suite-max-tokens", "16384");
  const [prompt, setPrompt] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [codeOpen, setCodeOpen] = useState(false);
  const { status, steps, files, error, totalTools, generate, reset } =
    useGeneration();
  const { fire } = useConfetti();
  const animatedTools = useCountUp(totalTools);
  const animatedFiles = useCountUp(files.length);
  const confettiFiredRef = useRef(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Derived state: which "phase" are we in?
  const hasFiles = files.length > 0;
  const isComplete = status === "complete";
  const isGenerating = status === "generating";
  const isWaiting = isGenerating && !hasFiles; // no files yet
  const isStreaming = isGenerating && hasFiles; // files arriving

  useEffect(() => {
    if (status === "complete" && !confettiFiredRef.current) {
      confettiFiredRef.current = true;
      fire();
    }
    if (status === "idle") confettiFiredRef.current = false;
  }, [status, fire]);

  // Auto-select best file
  useEffect(() => {
    if (files.length > 0 && !selectedFile) {
      const priority = ["page.tsx", "App.tsx", "index.tsx", "index.html"];
      const best =
        files.find((f) => priority.some((p) => f.path.endsWith(p))) ||
        files.find((f) => f.path.endsWith(".tsx") || f.path.endsWith(".html")) ||
        files[0];
      if (best) setSelectedFile(best.path);
    }
  }, [files, selectedFile]);

  // Auto-select newest file during streaming
  useEffect(() => {
    if (isStreaming && files.length > 0) {
      setSelectedFile(files[files.length - 1].path);
    }
  }, [files.length, isStreaming]);

  // Auto-scroll log
  useEffect(() => {
    if (isWaiting) logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [steps.length, isWaiting]);

  const handleSubmit = () => {
    if (!prompt.trim() || !apiKey.trim()) return;
    generate(prompt, apiKey, Number(maxTokens));
  };

  const handleReset = () => {
    reset();
    setPrompt("");
    setSelectedFile(null);
    setSelectedPrompt(null);
    setCodeOpen(false);
  };

  const selectedFileData = files.find((f) => f.path === selectedFile) || null;

  // Pick the best file that actually renders well as a preview.
  const previewFile = (() => {
    const renderableExts = ["sol", "html", "htm", "md", "json", "css"];
    const priorityOrder = ["sol", "html", "htm", "md", "json", "css"];

    if (selectedFileData) {
      const ext = selectedFileData.path.split(".").pop()?.toLowerCase() || "";
      if (renderableExts.includes(ext)) return selectedFileData;
    }

    for (const ext of priorityOrder) {
      const found = files.find((f) => {
        const e = f.path.split(".").pop()?.toLowerCase();
        if (ext === "json") return f.path.endsWith("package.json");
        return e === ext;
      });
      if (found) return found;
    }

    const jsonFile = files.find((f) => f.path.endsWith(".json"));
    if (jsonFile) return jsonFile;

    return null;
  })();

  return (
    <div className="min-h-screen flex flex-col relative hero-gradient overflow-hidden">
      {/* Ambient gradients — match landing page */}
      <div
        className="absolute -top-[200px] -left-[200px] w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(240,185,11,0.08) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-[150px] -right-[150px] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(24,220,126,0.06) 0%, transparent 70%)" }}
      />
      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid z-0" />

      {/* Floating BNB logos — high density */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-6 left-[5%] opacity-[0.1] animate-float">
          <Image src="/bnb-logo.svg" alt="" width={120} height={120} aria-hidden />
        </div>
        <div className="absolute top-10 right-[8%] opacity-[0.1] animate-float-delayed">
          <Image src="/bnb-logo.svg" alt="" width={100} height={100} aria-hidden />
        </div>
        <div className="absolute top-[40%] left-[3%] opacity-[0.1] animate-float-slow">
          <Image src="/bnb-logo.svg" alt="" width={90} height={90} aria-hidden />
        </div>
        <div className="absolute bottom-[15%] right-[5%] opacity-[0.1] animate-float">
          <Image src="/bnb-logo.svg" alt="" width={110} height={110} aria-hidden />
        </div>
        <div className="absolute top-24 left-[28%] opacity-[0.1] animate-float-delayed">
          <Image src="/bnb-logo.svg" alt="" width={70} height={70} aria-hidden />
        </div>
        <div className="absolute top-12 right-[30%] opacity-[0.1] animate-float-slow">
          <Image src="/bnb-logo.svg" alt="" width={80} height={80} aria-hidden />
        </div>
        <div className="absolute bottom-[35%] left-[18%] opacity-[0.1] animate-float-delayed">
          <Image src="/bnb-logo.svg" alt="" width={95} height={95} aria-hidden />
        </div>
        <div className="absolute bottom-[10%] left-[42%] opacity-[0.1] animate-float">
          <Image src="/bnb-logo.svg" alt="" width={75} height={75} aria-hidden />
        </div>
        <div className="absolute top-[55%] right-[15%] opacity-[0.1] animate-float-slow">
          <Image src="/bnb-logo.svg" alt="" width={85} height={85} aria-hidden />
        </div>
        <div className="absolute top-[30%] right-[38%] opacity-[0.1] animate-float">
          <Image src="/bnb-logo.svg" alt="" width={65} height={65} aria-hidden />
        </div>
      </div>
      <Header />
      <main className="flex-1 flex flex-col relative z-10">
        {/* === IDLE === */}
        {status === "idle" && (
          <div className="flex-1 flex items-start justify-center px-4 py-8 sm:px-6">
            <div className="max-w-3xl w-full space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Generate BNB Chain Project</h1>
                <p className="mt-2 text-muted-foreground">
                  Describe what you want to build and AI will generate a complete branded project
                </p>
              </div>
              <ApiKeyInput value={apiKey} onChange={setApiKey} />

              {/* Output quality tier */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  Output Quality
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {([
                    { value: "4096",  label: "Fast",     tokens: "4K",  desc: "Basic output, lower cost" },
                    { value: "8192",  label: "Standard", tokens: "8K",  desc: "Good balance" },
                    { value: "16384", label: "Premium",  tokens: "16K", desc: "Rich pages, detailed code" },
                    { value: "32768", label: "Ultra",    tokens: "32K", desc: "Maximum detail & polish" },
                  ] as const).map((tier) => (
                    <button
                      key={tier.value}
                      onClick={() => setMaxTokens(tier.value)}
                      className={`rounded-xl border p-3 text-left transition-all ${
                        maxTokens === tier.value
                          ? "border-[#F0B90B] bg-[#F0B90B]/5 shadow-sm shadow-[#F0B90B]/10"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${maxTokens === tier.value ? "text-[#F0B90B]" : "text-foreground"}`}>
                          {tier.label}
                        </span>
                        <span className={`text-[11px] font-mono ${maxTokens === tier.value ? "text-[#F0B90B]/70" : "text-muted-foreground"}`}>
                          {tier.tokens} tokens
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{tier.desc}</div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Higher tiers use more API tokens per generation. Premium recommended for most projects.
                </p>
              </div>

              <TemplateCards onSelect={(p) => { setPrompt(p); setSelectedPrompt(p); }} selectedPrompt={selectedPrompt} />
              <PromptInput value={prompt} onChange={setPrompt} onSubmit={handleSubmit} isGenerating={false} disabled={!apiKey.trim() || !prompt.trim()} />
            </div>
          </div>
        )}

        {/* === GENERATING / COMPLETE === */}
        {status !== "idle" && (
          <div className="flex-1 flex flex-col min-h-0 mx-auto w-full max-w-[1400px] px-4 sm:px-6 py-4 gap-3">

            {/* Status bar */}
            {isComplete ? (
              <div className="flex items-center justify-between rounded-xl border bg-card px-5 py-3 shadow-sm shrink-0">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#18DC7E]" />
                    <span className="text-sm font-medium text-[#18DC7E]">Complete</span>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <ProgressTimeline steps={steps} status={status} />
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="gap-1.5 text-xs">
                    <Wrench className="h-3 w-3" />{animatedTools} tools
                  </Badge>
                  <Badge variant="secondary" className="gap-1.5 text-xs">
                    <FileText className="h-3 w-3" />{animatedFiles} files
                  </Badge>
                  <DownloadButton files={files} />
                  <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5 text-muted-foreground">
                    <RotateCcw className="h-3.5 w-3.5" />New
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between rounded-xl border bg-card px-5 py-3 shadow-sm shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {status === "error" ? (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin text-[#F0B90B]" />
                      )}
                      <span className="text-sm font-medium">{status === "error" ? "Error" : "Generating..."}</span>
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <Badge variant="secondary" className="gap-1.5 text-xs">
                      <Wrench className="h-3 w-3" />{animatedTools} tools
                    </Badge>
                    <Badge variant="secondary" className="gap-1.5 text-xs">
                      <FileText className="h-3 w-3" />{animatedFiles} files
                    </Badge>
                    {status === "error" && (
                      <span className="text-sm text-destructive">{error}</span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5 text-muted-foreground">
                    <RotateCcw className="h-3.5 w-3.5" />New
                  </Button>
                </div>
                <div className="shrink-0 rounded-xl border bg-card px-5 py-3 shadow-sm">
                  <ProgressTimeline steps={steps} status={status} />
                </div>
              </>
            )}

            {/* === PHASE 1: Waiting (no files) === */}
            {isWaiting && (
              <div className="flex-1 min-h-0 flex items-start justify-center overflow-auto pt-4">
                <div className="w-full max-w-2xl rounded-xl border bg-card shadow-sm">
                  <div className="px-6 py-5 space-y-0.5">
                    {steps
                      .filter((s) => s.type !== "complete")
                      .map((step) => (
                        <LogLine key={step.id} step={step} />
                      ))}
                    <div className="flex items-center gap-3 py-3">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F0B90B] animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F0B90B] animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F0B90B] animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-xs text-muted-foreground">Working...</span>
                    </div>
                    <div ref={logEndRef} />
                  </div>
                </div>
              </div>
            )}

            {/* === PHASE 2: Streaming (files arriving) === */}
            {isStreaming && (
              <div className="flex-1 min-h-0 rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className="h-full grid grid-cols-1 lg:grid-cols-2">
                  <div className="min-h-0 flex flex-col border-r border-border/50">
                    <CodeStream file={selectedFileData} files={files} selectedPath={selectedFile} onSelectFile={setSelectedFile} isStreaming />
                  </div>
                  <div className="min-h-0 relative">
                    <PreviewPanel file={previewFile} allFiles={files} isLoading={files.length === 0} />
                  </div>
                </div>
              </div>
            )}

            {/* === PHASE 3: Complete === */}
            {isComplete && (
              <>
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <CompletionView files={files} steps={steps} totalTools={totalTools} prompt={prompt} />
                </div>

                {/* Collapsible code panel */}
                <div className="shrink-0 rounded-xl border bg-card shadow-sm overflow-hidden">
                  <button
                    onClick={() => setCodeOpen(!codeOpen)}
                    className="w-full flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 text-sm font-medium">
                      {codeOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                      Source Code
                      <span className="text-xs text-muted-foreground font-normal">{files.length} files</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {files.slice(0, 5).map((f) => (
                        <span key={f.path} className="px-2 py-0.5 rounded bg-muted/50 font-mono">
                          {f.path.split("/").pop()}
                        </span>
                      ))}
                      {files.length > 5 && <span>+{files.length - 5}</span>}
                    </div>
                  </button>
                  {codeOpen && (
                    <div className="border-t h-[400px]">
                      <CodeStream file={selectedFileData} files={files} selectedPath={selectedFile} onSelectFile={setSelectedFile} isStreaming={false} />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
