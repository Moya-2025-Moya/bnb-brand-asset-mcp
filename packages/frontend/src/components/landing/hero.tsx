"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Shield, Clock, Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const terminalLines = [
  {
    prefix: "❯",
    prefixColor: "text-[#18DC7E]",
    segments: [
      { text: "Describe your project to Claude...", color: "text-gray-500" },
    ],
  },
  {
    prefix: "USER",
    prefixColor: "text-[#F0B90B]",
    segments: [
      { text: 'Create a BEP20 token "', color: "text-gray-300" },
      { text: "GoldCoin", color: "text-[#FCD535]" },
      { text: '" with branded landing page', color: "text-gray-300" },
    ],
  },
  {
    prefix: "MCP",
    prefixColor: "text-[#18DC7E]",
    segments: [
      { text: "get_brand_colors", color: "text-[#F0B90B]" },
      { text: " → ", color: "text-gray-600" },
      { text: "get_logo", color: "text-[#F0B90B]" },
      { text: " → ", color: "text-gray-600" },
      { text: "get_contract_template", color: "text-[#F0B90B]" },
      { text: " → ", color: "text-gray-600" },
      { text: "get_ui_component", color: "text-[#F0B90B]" },
    ],
  },
  {
    prefix: "OUT",
    prefixColor: "text-[#18DC7E]",
    segments: [
      { text: "✓ ", color: "text-[#18DC7E]" },
      { text: "GoldCoin.sol", color: "text-gray-300" },
      { text: "  ✓ ", color: "text-[#18DC7E]" },
      { text: "page.tsx", color: "text-gray-300" },
      { text: "  ✓ ", color: "text-[#18DC7E]" },
      { text: "tailwind.config", color: "text-gray-300" },
    ],
  },
  {
    prefix: "AI",
    prefixColor: "text-[#F0B90B]",
    segments: [
      { text: "Complete project ready — ", color: "text-gray-300" },
      { text: "7 files", color: "text-[#FCD535]" },
      { text: ", ", color: "text-gray-300" },
      { text: "3 tools", color: "text-[#18DC7E]" },
      { text: ", ", color: "text-gray-300" },
      { text: "4.2s", color: "text-gray-400" },
    ],
  },
];

export function Hero() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const mcpCommand = "claude mcp add bnb-dev-suite https://bnb-dev-suite.vercel.app/api/mcp";
  const handleCopy = () => {
    navigator.clipboard.writeText(mcpCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (visibleLines >= terminalLines.length) {
      setIsTypingDone(true);
      return;
    }

    const fullText = terminalLines[visibleLines].segments
      .map((s) => s.text)
      .join("");

    if (currentText.length < fullText.length) {
      const speed = visibleLines === 0 ? 40 : 20;
      const timeout = setTimeout(() => {
        setCurrentText(fullText.slice(0, currentText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setVisibleLines((v) => v + 1);
        setCurrentText("");
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [visibleLines, currentText]);

  const renderSegments = (
    segments: { text: string; color: string }[],
    partialLength?: number
  ) => {
    if (partialLength === undefined) {
      return segments.map((seg, i) => (
        <span key={i} className={seg.color}>{seg.text}</span>
      ));
    }
    let remaining = partialLength;
    return segments.map((seg, i) => {
      if (remaining <= 0) return null;
      const visibleText = seg.text.slice(0, remaining);
      remaining -= seg.text.length;
      return (
        <span key={i} className={seg.color}>{visibleText}</span>
      );
    });
  };

  return (
    <section className="relative overflow-hidden hero-gradient">
      {/* Subtle ambient gradients — using CSS gradients instead of blobs */}
      <div
        className="absolute -top-[200px] -left-[200px] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(240,185,11,0.08) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-[150px] -right-[150px] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(24,220,126,0.06) 0%, transparent 70%)" }}
      />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid" />

      {/* Floating BNB logos — high density */}
      <div className="absolute top-12 left-[5%] opacity-[0.1] animate-float">
        <Image src="/bnb-logo.svg" alt="" width={120} height={120} aria-hidden />
      </div>
      <div className="absolute top-8 right-[8%] opacity-[0.1] animate-float-delayed">
        <Image src="/bnb-logo.svg" alt="" width={100} height={100} aria-hidden />
      </div>
      <div className="absolute top-[45%] left-[2%] opacity-[0.1] animate-float-slow">
        <Image src="/bnb-logo.svg" alt="" width={90} height={90} aria-hidden />
      </div>
      <div className="absolute bottom-20 right-[5%] opacity-[0.1] animate-float">
        <Image src="/bnb-logo.svg" alt="" width={110} height={110} aria-hidden />
      </div>
      <div className="absolute top-28 left-[30%] opacity-[0.1] animate-float-delayed">
        <Image src="/bnb-logo.svg" alt="" width={70} height={70} aria-hidden />
      </div>
      <div className="absolute top-16 right-[30%] opacity-[0.1] animate-float-slow">
        <Image src="/bnb-logo.svg" alt="" width={80} height={80} aria-hidden />
      </div>
      <div className="absolute bottom-40 left-[18%] opacity-[0.1] animate-float-delayed">
        <Image src="/bnb-logo.svg" alt="" width={95} height={95} aria-hidden />
      </div>
      <div className="absolute bottom-12 left-[45%] opacity-[0.1] animate-float">
        <Image src="/bnb-logo.svg" alt="" width={75} height={75} aria-hidden />
      </div>
      <div className="absolute top-[60%] right-[18%] opacity-[0.1] animate-float-slow">
        <Image src="/bnb-logo.svg" alt="" width={85} height={85} aria-hidden />
      </div>
      <div className="absolute top-[35%] right-[40%] opacity-[0.1] animate-float">
        <Image src="/bnb-logo.svg" alt="" width={65} height={65} aria-hidden />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <Badge
            variant="secondary"
            className="mb-6 gap-1.5 px-4 py-1.5 text-sm border border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            MCP-Powered Brand Toolkit
          </Badge>

          {/* Heading */}
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
            Build{" "}
            <span className="gradient-text">Brand-Perfect</span>
            {" "}BNB Chain Projects with{" "}
            <span className="gradient-text">AI</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
            Official brand colors, logos, smart contract templates, and UI
            components — delivered through MCP to your AI coding assistant.
          </p>

          {/* Stats row */}
          <div className="mt-8 flex items-center gap-6 sm:gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms] fill-mode-both">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-[#F0B90B]" />
              <span><strong className="text-foreground">4</strong> MCP Tools</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-[#18DC7E]" />
              <span><strong className="text-foreground">100%</strong> Brand-Accurate</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-[#F0B90B]" />
              <span><strong className="text-foreground">One-Click</strong> Setup</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500 fill-mode-both">
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="gap-2 text-base btn-bnb-gradient border-0 h-12 px-8 rounded-xl">
                <Link href="/generate">
                  Generate Project
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-base font-mono h-12 px-6 rounded-xl border-border/80 hover:border-primary/50"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-[#18DC7E]" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Add to Claude
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground max-w-md text-center">
              Click &quot;Add to Claude&quot; to copy the command, then paste it into your terminal to connect BNB Dev Suite MCP to Claude Code.
            </p>
          </div>

          {/* === TERMINAL MOCK === */}
          <div className="mt-16 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-700 fill-mode-both">
            <div className="terminal-card">
              {/* Scan line */}
              <div className="terminal-scanline" />

              {/* Title bar */}
              <div className="relative z-10 flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
                  <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                  <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
                </div>
                <span className="text-[11px] text-gray-500 font-mono tracking-wider uppercase">
                  BNB Dev Suite — Terminal
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#18DC7E] dot-live" />
                  <span className="text-[10px] text-gray-600 font-mono">live</span>
                </div>
              </div>

              {/* Terminal body */}
              <div className="relative z-10 p-5 sm:p-6 space-y-3 font-mono text-[13px] sm:text-sm text-left min-h-[200px]">
                {terminalLines.map((line, i) => {
                  if (i > visibleLines) return null;
                  const isCurrentlyTyping = i === visibleLines && !isTypingDone;

                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-3 ${i < visibleLines ? "terminal-line-appear" : ""}`}
                    >
                      <span
                        className={`${line.prefixColor} font-semibold text-xs shrink-0 min-w-[36px] mt-0.5 ${
                          i === 0 ? "text-base" : ""
                        }`}
                      >
                        {line.prefix}
                      </span>
                      <span className="leading-relaxed">
                        {isCurrentlyTyping
                          ? renderSegments(line.segments, currentText.length)
                          : renderSegments(line.segments)}
                        {isCurrentlyTyping && (
                          <span className="typing-cursor" />
                        )}
                      </span>
                    </div>
                  );
                })}

                {isTypingDone && (
                  <div className="flex items-start gap-3 terminal-line-appear">
                    <span className="text-[#18DC7E] font-semibold text-base shrink-0 min-w-[36px]">
                      ❯
                    </span>
                    <span className="typing-cursor" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
