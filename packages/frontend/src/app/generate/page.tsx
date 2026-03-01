"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/landing/header";
import { ApiKeyInput } from "@/components/generate/api-key-input";
import { PromptInput } from "@/components/generate/prompt-input";
import { TemplateCards } from "@/components/generate/template-cards";
import { StepCard } from "@/components/generate/step-card";
import { CodeBlock } from "@/components/generate/code-block";
import { FileTree } from "@/components/generate/file-tree";
import { DownloadButton } from "@/components/generate/download-button";
import { useGeneration } from "@/hooks/use-generation";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw, Wrench, FileText } from "lucide-react";

export default function GeneratePage() {
  const [apiKey, setApiKey] = useLocalStorage("bnb-dev-suite-api-key", "");
  const [prompt, setPrompt] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const { status, steps, files, error, totalTools, generate, reset } = useGeneration();
  const stepsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    stepsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [steps.length]);

  const handleSubmit = () => {
    if (!prompt.trim() || !apiKey.trim()) return;
    generate(prompt, apiKey);
  };

  const handleReset = () => {
    reset();
    setPrompt("");
    setSelectedFile(null);
  };

  const selectedFileData = files.find((f) => f.path === selectedFile);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        {/* Input section */}
        {status === "idle" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Generate BNB Chain Project</h1>
              <p className="mt-2 text-muted-foreground">
                Describe what you want to build and AI will generate a complete branded project
              </p>
            </div>
            <ApiKeyInput value={apiKey} onChange={setApiKey} />
            <TemplateCards onSelect={setPrompt} />
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleSubmit}
              isGenerating={false}
              disabled={!apiKey.trim() || !prompt.trim()}
            />
          </div>
        )}

        {/* Generating / Complete view */}
        {status !== "idle" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
            {/* Main panel */}
            <div className="space-y-4 min-w-0">
              {/* Status bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {status === "generating" && (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm font-medium">Generating...</span>
                    </>
                  )}
                  {status === "complete" && (
                    <span className="text-sm font-medium text-bnb-success">Generation complete</span>
                  )}
                  {status === "error" && (
                    <span className="text-sm font-medium text-destructive">Error: {error}</span>
                  )}
                  <Badge variant="secondary" className="gap-1">
                    <Wrench className="h-3 w-3" />
                    {totalTools} tools
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <FileText className="h-3 w-3" />
                    {files.length} files
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {status === "complete" && <DownloadButton files={files} />}
                  <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5">
                    <RotateCcw className="h-3.5 w-3.5" />
                    New
                  </Button>
                </div>
              </div>

              {/* Code viewer */}
              {selectedFileData && (
                <CodeBlock
                  code={selectedFileData.content}
                  language={selectedFileData.language}
                  filename={selectedFileData.path}
                />
              )}

              {/* Steps stream */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Generation log</h3>
                {steps
                  .filter((s) => s.type !== "complete")
                  .map((step) => (
                    <StepCard key={step.id} step={step} />
                  ))}
                <div ref={stepsEndRef} />
              </div>
            </div>

            {/* Sidebar: File tree */}
            <div className="order-first lg:order-last">
              <Card className="sticky top-20">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm">Generated Files</CardTitle>
                </CardHeader>
                <CardContent className="px-2 pb-3">
                  {files.length === 0 ? (
                    <p className="text-xs text-muted-foreground px-2">
                      Files will appear here as they are generated...
                    </p>
                  ) : (
                    <FileTree
                      files={files}
                      onSelect={setSelectedFile}
                      selectedPath={selectedFile}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
