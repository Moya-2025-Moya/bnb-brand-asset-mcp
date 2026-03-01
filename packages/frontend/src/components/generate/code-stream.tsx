"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { codeToHtml } from "shiki";
import { Button } from "@/components/ui/button";
import { Check, Copy, ChevronLeft, ChevronRight } from "lucide-react";
import type { GeneratedFile } from "@/hooks/use-generation";

interface CodeStreamProps {
  file: GeneratedFile | null;
  files: GeneratedFile[];
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
  isStreaming: boolean;
}

function getTabColor(path: string) {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "tsx":
    case "ts":
      return "bg-blue-400";
    case "sol":
      return "bg-purple-400";
    case "css":
      return "bg-pink-400";
    case "json":
      return "bg-yellow-400";
    case "md":
      return "bg-gray-400";
    case "html":
      return "bg-orange-400";
    default:
      return "bg-gray-400";
  }
}

export function CodeStream({
  file,
  files,
  selectedPath,
  onSelectFile,
  isStreaming,
}: CodeStreamProps) {
  const [revealedLines, setRevealedLines] = useState(0);
  const [highlightedHtml, setHighlightedHtml] = useState("");
  const [isRevealing, setIsRevealing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const prevPathRef = useRef<string | null>(null);
  const codeEndRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const lines = file ? file.content.split("\n") : [];
  const totalLines = lines.length;

  useEffect(() => {
    if (!file) return;
    if (file.path !== prevPathRef.current) {
      prevPathRef.current = file.path;
      setRevealedLines(0);
      setIsRevealing(true);
      setHighlightedHtml("");
    }
  }, [file]);

  useEffect(() => {
    if (!isRevealing || revealedLines >= totalLines) {
      if (revealedLines >= totalLines && totalLines > 0) setIsRevealing(false);
      return;
    }
    const timer = setTimeout(
      () => setRevealedLines((r) => Math.min(r + 3, totalLines)),
      totalLines > 100 ? 10 : 25
    );
    return () => clearTimeout(timer);
  }, [revealedLines, totalLines, isRevealing]);

  useEffect(() => {
    if (isRevealing) {
      codeEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [revealedLines, isRevealing]);

  useEffect(() => {
    if (!file || isRevealing) return;
    const lang =
      file.language === "solidity"
        ? "solidity"
        : file.language === "tsx"
        ? "tsx"
        : file.language === "typescript"
        ? "typescript"
        : file.language === "css"
        ? "css"
        : file.language === "json"
        ? "json"
        : "text";
    codeToHtml(file.content, { lang, theme: "vitesse-dark" })
      .then(setHighlightedHtml)
      .catch(() => {});
  }, [file, isRevealing]);

  const handleCopy = async () => {
    if (!file) return;
    await navigator.clipboard.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Tab scroll state
  const updateScrollState = useCallback(() => {
    const el = tabsRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  const scrollTabs = useCallback((dir: "left" | "right") => {
    const el = tabsRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -150 : 150, behavior: "smooth" });
  }, []);

  // Auto-center selected tab
  useEffect(() => {
    if (!selectedPath || !tabsRef.current) return;
    const container = tabsRef.current;
    const tab = container.querySelector(`[data-path="${CSS.escape(selectedPath)}"]`) as HTMLElement | null;
    if (!tab) return;
    const tabCenter = tab.offsetLeft + tab.offsetWidth / 2;
    const containerCenter = container.clientWidth / 2;
    container.scrollTo({ left: tabCenter - containerCenter, behavior: "smooth" });
  }, [selectedPath]);

  // Update arrow visibility on scroll / resize
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", updateScrollState); ro.disconnect(); };
  }, [updateScrollState, files.length]);

  const fileName = (p: string) => p.split("/").pop() || p;

  return (
    <div className="flex flex-col h-full bg-[#0e0e0e]">
      {/* File tabs */}
      <div className="flex items-center border-b border-white/[0.06] bg-[#161616] shrink-0">
        {/* Left arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scrollTabs("left")}
            className="shrink-0 px-1 py-2.5 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        )}
        <div ref={tabsRef} className="flex-1 flex items-center overflow-x-auto scrollbar-none">
          {files.map((f) => (
            <button
              key={f.path}
              data-path={f.path}
              onClick={() => onSelectFile(f.path)}
              className={`group flex items-center gap-2 px-4 py-2.5 text-xs font-mono whitespace-nowrap border-r border-white/[0.04] transition-all relative ${
                f.path === selectedPath
                  ? "bg-[#0e0e0e] text-gray-200"
                  : "text-gray-500 hover:text-gray-400 hover:bg-white/[0.02]"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${getTabColor(f.path)} ${
                  f.path === selectedPath ? "opacity-100" : "opacity-40"
                }`}
              />
              {fileName(f.path)}
              {f.path === selectedPath && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F0B90B]" />
              )}
              {f.path === selectedPath && isRevealing && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0B90B] animate-pulse" />
              )}
            </button>
          ))}
        </div>
        {/* Right arrow */}
        {canScrollRight && (
          <button
            onClick={() => scrollTabs("right")}
            className="shrink-0 px-1 py-2.5 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
        <div className="px-3 shrink-0 border-l border-white/[0.06]">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-600 hover:text-gray-400"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3 w-3 text-[#18DC7E]" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Code area */}
      <div className="flex-1 overflow-auto">
        {!file ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            {isStreaming ? (
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full bg-[#F0B90B] animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-[#F0B90B] animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-[#F0B90B] animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
                <p className="text-sm text-gray-600">Generating code...</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Select a file to view code
              </p>
            )}
          </div>
        ) : isRevealing || !highlightedHtml ? (
          <div className="p-4 font-mono text-[13px] leading-6">
            <table className="w-full border-collapse">
              <tbody>
                {lines.slice(0, revealedLines).map((line, i) => (
                  <tr
                    key={i}
                    className={
                      i >= revealedLines - 3
                        ? "animate-in fade-in duration-150"
                        : ""
                    }
                  >
                    <td className="select-none text-gray-600 text-right pr-4 w-10 align-top tabular-nums">
                      {i + 1}
                    </td>
                    <td className="text-gray-300 whitespace-pre-wrap break-all">
                      {line || "\u00A0"}
                    </td>
                  </tr>
                ))}
                {isRevealing && (
                  <tr>
                    <td className="select-none text-gray-600 text-right pr-4 w-10 tabular-nums">
                      {revealedLines + 1}
                    </td>
                    <td>
                      <span className="typing-cursor" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div ref={codeEndRef} />
          </div>
        ) : (
          <div
            className="overflow-x-auto text-[13px] [&_pre]:p-4 [&_pre]:m-0 [&_pre]:bg-transparent! [&_pre]:leading-6"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        )}
      </div>
    </div>
  );
}
