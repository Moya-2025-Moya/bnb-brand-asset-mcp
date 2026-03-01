"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  FileText,
  Layers,
  Code2,
  FileCode,
  Palette,
  Braces,
  FileType,
  Globe,
  Wrench,
  BookOpen,
  Cpu,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Quote,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getFileExtension,
  buildHtmlPreview,
  buildSolidityPreview,
  buildTsxPreview,
} from "@/lib/preview-builders";
import type { GenerationStep, GeneratedFile } from "@/hooks/use-generation";

interface CompletionViewProps {
  files: GeneratedFile[];
  steps: GenerationStep[];
  totalTools: number;
  prompt: string;
}

const fileTypeConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  sol: { color: "text-purple-500", bg: "bg-purple-500/10", icon: <Layers className="h-4 w-4" />, label: "Solidity" },
  tsx: { color: "text-blue-500", bg: "bg-blue-500/10", icon: <FileCode className="h-4 w-4" />, label: "React TSX" },
  ts: { color: "text-blue-500", bg: "bg-blue-500/10", icon: <Code2 className="h-4 w-4" />, label: "TypeScript" },
  css: { color: "text-pink-500", bg: "bg-pink-500/10", icon: <Palette className="h-4 w-4" />, label: "CSS" },
  json: { color: "text-amber-500", bg: "bg-amber-500/10", icon: <Braces className="h-4 w-4" />, label: "JSON" },
  md: { color: "text-gray-500", bg: "bg-gray-500/10", icon: <FileType className="h-4 w-4" />, label: "Markdown" },
  html: { color: "text-orange-500", bg: "bg-orange-500/10", icon: <Globe className="h-4 w-4" />, label: "HTML" },
  js: { color: "text-yellow-500", bg: "bg-yellow-500/10", icon: <Code2 className="h-4 w-4" />, label: "JavaScript" },
};

const mcpToolSpecs: Record<string, { description: string; params: Record<string, string>; returns: string }> = {
  get_brand_colors: {
    description: "BNB Chain official brand colors, typography, and Tailwind config",
    params: { theme: "light | dark | both", format: "json | css | tailwind | all" },
    returns: "Design system tokens",
  },
  get_logo: {
    description: "BNB Chain official logo files and usage guidelines",
    params: { theme: "light | dark", style: "full | icon", format: "svg | png" },
    returns: "Logo metadata + SVG/PNG",
  },
  get_contract_template: {
    description: "BNB Chain smart contract templates with Hardhat config",
    params: { type: "BEP20 | BEP721", tokenName: "string", tokenSymbol: "string", includeHardhat: "boolean" },
    returns: "Solidity + Hardhat files",
  },
  get_ui_component: {
    description: "BNB Chain branded React UI components",
    params: { component: "ConnectWallet | NetworkSwitcher | all" },
    returns: "React component source",
  },
};

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      data-copy-button
      onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-muted/50 text-muted-foreground text-xs transition-colors"
    >
      {copied ? <Check className="h-3 w-3 text-[#18DC7E]" /> : <Copy className="h-3 w-3" />}
      {label && <span>{copied ? "Copied" : label}</span>}
    </button>
  );
}

function SectionHeader({ icon, title, subtitle, right }: { icon: React.ReactNode; title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#F0B90B]/10 text-[#F0B90B]">
          {icon}
        </div>
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

export function CompletionView({ files, steps, totalTools, prompt }: CompletionViewProps) {
  const [previewTab, setPreviewTab] = useState<"frontend" | "contract">("frontend");
  const [guideOpen, setGuideOpen] = useState(false);

  const analysis = useMemo(() => {
    const contractFile = files.find((f) => getFileExtension(f.path) === "sol");
    const contractName = contractFile?.content.match(/contract\s+(\w+)/)?.[1];
    const inherits = contractFile?.content.match(/contract\s+\w+\s+is\s+([^{]+)/)?.[1]?.trim();
    const htmlFile = files.find((f) => ["html", "htm"].includes(getFileExtension(f.path)));
    const packageJson = files.find((f) => f.path.endsWith("package.json"));
    const hardhatConfig = files.find((f) => f.path.includes("hardhat.config"));
    const envExample = files.find((f) => f.path.includes(".env.example") || f.path.includes(".env"));
    const hasTsx = files.some((f) => getFileExtension(f.path) === "tsx");
    const totalLines = files.reduce((sum, f) => sum + f.content.split("\n").length, 0);

    let typeDescription = "BNB Chain Project";
    if (contractFile && (hasTsx || htmlFile)) {
      const standard = inherits?.includes("ERC721") || inherits?.includes("BEP721") ? "BEP721 NFT" :
        inherits?.includes("ERC20") || inherits?.includes("BEP20") ? "BEP20 Token" : "Smart Contract";
      typeDescription = `${standard} + Branded Frontend`;
    } else if (contractFile) {
      typeDescription = inherits?.includes("ERC721") || inherits?.includes("BEP721") ? "BEP721 NFT Contract" :
        inherits?.includes("ERC20") || inherits?.includes("BEP20") ? "BEP20 Token Contract" : "Smart Contract";
    } else if (hasTsx || htmlFile) {
      typeDescription = "BNB Chain Frontend";
    }

    let projectName = contractName || "BNB Project";
    if (packageJson) {
      try {
        const pkg = JSON.parse(packageJson.content);
        if (pkg.name) projectName = pkg.name;
      } catch { /* ignore */ }
    }

    // AI explanation: only take the first meaningful text block, strip file markers
    const aiTexts = steps
      .filter((s) => s.type === "text")
      .map((s) => (s.data as { content: string }).content)
      .filter(Boolean)
      .map((t) => t.replace(/---FILE:.*?---/g, "").trim())
      .filter((t) => t.length > 10 && !t.startsWith("'use ") && !t.startsWith("import "));
    const aiExplanation = aiTexts.length > 0 ? aiTexts[0] : "";

    // Tool calls paired with results
    const toolCalls = steps.filter((s) => s.type === "tool_call").map((s) => s.data as { id: string; name: string; input: Record<string, unknown> });
    const toolResults = steps.filter((s) => s.type === "tool_result").map((s) => s.data as { id: string; name: string; result: string });
    const pairedTools = toolCalls.map((tc) => ({
      ...tc,
      result: toolResults.find((tr) => tr.id === tc.id)?.result,
    }));
    const uniqueTools = pairedTools.filter((t, i, arr) => arr.findIndex((x) => x.name === t.name) === i);

    // Contract analysis
    const functions = contractFile
      ? [...contractFile.content.matchAll(/function\s+(\w+)\s*\(([^)]*)\)([^{]*)/g)].map((m) => ({
          name: m[1], params: m[2], modifiers: m[3].trim().replace(/\s+/g, " "),
        }))
      : [];
    const events = contractFile
      ? [...contractFile.content.matchAll(/event\s+(\w+)\s*\(([^)]*)\)/g)].map((m) => ({ name: m[1], params: m[2] }))
      : [];
    const constructorMatch = contractFile?.content.match(/constructor\s*\(([^)]*)\)/);
    const constructorParams = constructorMatch?.[1] || null;

    // Group files + precompute line counts
    const grouped: Record<string, GeneratedFile[]> = {};
    const fileLinesMap: Record<string, number> = {};
    files.forEach((f) => {
      const ext = getFileExtension(f.path);
      if (!grouped[ext]) grouped[ext] = [];
      grouped[ext].push(f);
      fileLinesMap[f.path] = f.content.split("\n").length;
    });

    // Detect frontend libraries (avoid scanning in render)
    const hasWagmi = files.some((f) => f.content.includes("wagmi") || f.content.includes("useAccount"));
    const hasEthers = files.some((f) => f.content.includes("ethers"));
    const hasViem = files.some((f) => f.content.includes("viem"));

    // Getting started commands (compact)
    const cmds: string[] = [];
    cmds.push("# Download and extract the zip, then:");
    cmds.push("cd project");
    if (packageJson) cmds.push("npm install");
    if (envExample) cmds.push("cp .env.example .env  # fill in your keys");
    if (hardhatConfig) {
      cmds.push("npx hardhat compile");
      cmds.push("npx hardhat run scripts/deploy.ts --network bscTestnet");
    }
    if (hasTsx) cmds.push("npm run dev");
    const guideText = cmds.join("\n");

    return {
      contractFile, contractName, htmlFile, packageJson, hardhatConfig,
      hasTsx, totalLines, typeDescription, projectName, aiExplanation,
      uniqueTools, functions, events, constructorParams,
      grouped, fileLinesMap, guideText,
      hasWagmi, hasEthers, hasViem,
    };
  }, [files, steps]);

  // Preview: HTML file > TSX project overview > contract
  const hasFrontendPreview = !!(analysis.htmlFile || analysis.hasTsx);
  const hasContractPreview = !!analysis.contractFile;

  const frontendPreviewHtml = useMemo(() => {
    if (analysis.htmlFile) return buildHtmlPreview(analysis.htmlFile.content);
    if (analysis.hasTsx) return buildTsxPreview(files);
    return null;
  }, [analysis.htmlFile, analysis.hasTsx, files]);

  const contractPreviewHtml = useMemo(() => {
    if (!analysis.contractFile) return null;
    return buildSolidityPreview(analysis.contractFile.content, analysis.contractFile.path);
  }, [analysis.contractFile]);

  // Default to frontend if available, else contract
  const effectiveTab = previewTab === "frontend" && !hasFrontendPreview ? "contract" :
    previewTab === "contract" && !hasContractPreview ? "frontend" : previewTab;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

      {/* ========== Section 1: Hero ========== */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold">{analysis.projectName}</h2>
          <p className="text-sm text-muted-foreground">{analysis.typeDescription}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5">
          <div className="rounded-xl border bg-card p-3 text-center">
            <div className="text-2xl font-bold text-[#F0B90B]">{files.length}</div>
            <div className="text-[11px] text-muted-foreground">Files</div>
          </div>
          <div className="rounded-xl border bg-card p-3 text-center">
            <div className="text-2xl font-bold text-[#18DC7E]">{analysis.totalLines.toLocaleString()}</div>
            <div className="text-[11px] text-muted-foreground">Lines</div>
          </div>
          <div className="rounded-xl border bg-card p-3 text-center">
            <div className="text-2xl font-bold text-blue-500">{totalTools}</div>
            <div className="text-[11px] text-muted-foreground">MCP Tools</div>
          </div>
        </div>

        {/* Prompt */}
        <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
          <Quote className="h-3.5 w-3.5 text-[#F0B90B] mt-0.5 shrink-0" />
          <p className="italic leading-relaxed line-clamp-2">{prompt}</p>
        </div>

        {/* AI summary - short, first paragraph only */}
        {analysis.aiExplanation && (
          <p className="mt-3 text-sm text-foreground/70 leading-relaxed line-clamp-3">
            {analysis.aiExplanation.slice(0, 250)}
          </p>
        )}
      </section>

      {/* ========== Section 2: Preview ========== */}
      {(hasFrontendPreview || hasContractPreview) && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
          <SectionHeader icon={<Globe className="h-4 w-4" />} title="Preview" />

          {/* Tabs */}
          {hasFrontendPreview && hasContractPreview && (
            <div className="flex items-center gap-1 mb-3">
              <button
                onClick={() => setPreviewTab("frontend")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  effectiveTab === "frontend" ? "bg-card border shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Frontend
              </button>
              <button
                onClick={() => setPreviewTab("contract")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  effectiveTab === "contract" ? "bg-card border shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Contract Explorer
              </button>
            </div>
          )}

          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="h-[500px] relative bg-[#181A20]">
              <iframe
                key={effectiveTab}
                srcDoc={effectiveTab === "frontend" ? (frontendPreviewHtml || "") : (contractPreviewHtml || "")}
                sandbox="allow-scripts"
                className="w-full h-full border-0"
                title={effectiveTab === "frontend" ? "Frontend preview" : "Contract preview"}
                style={{ display: "block" }}
              />
            </div>
          </div>
        </section>
      )}

      {/* ========== Section 3: Getting Started (collapsed) ========== */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both">
        <div className="rounded-xl border bg-card overflow-hidden">
          <div
            role="button"
            tabIndex={0}
            aria-expanded={guideOpen}
            onClick={(e) => {
              // Don't toggle if clicking the copy button
              if ((e.target as HTMLElement).closest('[data-copy-button]')) return;
              setGuideOpen(!guideOpen);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setGuideOpen(!guideOpen);
              }
            }}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#F0B90B]/10 text-[#F0B90B]">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold">Getting Started</span>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton text={analysis.guideText} label="Copy" />
              {guideOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </div>
          </div>
          {guideOpen && (
            <div className="border-t px-4 py-3">
              <pre className="text-sm font-mono text-foreground/80 whitespace-pre-wrap">{analysis.guideText}</pre>
            </div>
          )}
        </div>
      </section>

      {/* ========== Section 4: Project Files ========== */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
        <SectionHeader icon={<FileText className="h-4 w-4" />} title="Project Files" subtitle={`${files.length} files`} />

        <div className="space-y-3">
          {Object.entries(analysis.grouped)
            .sort((a, b) => b[1].length - a[1].length)
            .map(([ext, groupFiles]) => {
              const cfg = fileTypeConfig[ext] || { color: "text-gray-500", bg: "bg-gray-500/10", icon: <FileText className="h-4 w-4" />, label: ext.toUpperCase() };
              return (
                <div key={ext} className="rounded-xl border bg-card overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/30">
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-lg ${cfg.bg} ${cfg.color}`}>
                        {cfg.icon}
                      </div>
                      <span className="text-sm font-medium">{cfg.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {groupFiles.length}
                    </Badge>
                  </div>
                  <div className="divide-y">
                    {groupFiles.map((f) => (
                      <div key={f.path} className="flex items-center justify-between px-4 py-2 hover:bg-muted/20 transition-colors">
                        <code className="text-xs font-mono text-foreground/80">{f.path}</code>
                        <span className="text-[11px] text-muted-foreground">{analysis.fileLinesMap[f.path]} lines</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* ========== Section 5: Technical Spec ========== */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms] fill-mode-both">
        <SectionHeader
          icon={<Cpu className="h-4 w-4" />}
          title="Technical Specification"
          subtitle="For Claude Code / AI tools"
          right={<CopyButton text={buildTechSpecText(files, analysis)} label="Copy spec" />}
        />

        <div className="space-y-3">
          {/* File tree */}
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">FILE TREE</span>
            </div>
            <pre className="px-4 py-2.5 text-xs font-mono text-foreground/80 overflow-x-auto">
              {files.map((f) => f.path).join("\n")}
            </pre>
          </div>

          {/* Contract */}
          {analysis.contractFile && (
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="px-4 py-2.5 border-b bg-muted/30">
                <span className="text-xs font-medium text-muted-foreground">CONTRACT: {analysis.contractName}</span>
              </div>
              <div className="px-4 py-2.5 space-y-2">
                {analysis.constructorParams && (
                  <code className="block text-xs font-mono text-foreground/80">constructor({analysis.constructorParams})</code>
                )}
                {analysis.functions.length > 0 && (
                  <div className="space-y-0.5">
                    {analysis.functions.map((f) => (
                      <code key={`${f.name}-${f.params}`} className="block text-xs font-mono text-foreground/70">
                        {f.name}({f.params}){f.modifiers ? ` ${f.modifiers}` : ""}
                      </code>
                    ))}
                  </div>
                )}
                {analysis.events.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1 border-t border-border/50">
                    {analysis.events.map((e) => (
                      <span key={e.name} className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">{e.name}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stack & Network */}
          <div className="flex flex-wrap gap-2">
            {analysis.hasTsx && (
              <>
                <Badge variant="secondary" className="text-xs">React</Badge>
                <Badge variant="secondary" className="text-xs">TypeScript</Badge>
                <Badge variant="secondary" className="text-xs">Tailwind CSS</Badge>
                {analysis.hasWagmi && <Badge variant="secondary" className="text-xs">wagmi</Badge>}
                {analysis.hasEthers && <Badge variant="secondary" className="text-xs">ethers.js</Badge>}
                {analysis.hasViem && <Badge variant="secondary" className="text-xs">viem</Badge>}
              </>
            )}
            {analysis.hardhatConfig && (
              <>
                <Badge variant="secondary" className="text-xs">BSC Testnet (97)</Badge>
                <Badge variant="secondary" className="text-xs">BSC Mainnet (56)</Badge>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ========== Section 6: MCP Attribution ========== */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500 fill-mode-both">
        <SectionHeader icon={<Wrench className="h-4 w-4" />} title="MCP Tools Used" subtitle={`${analysis.uniqueTools.length} tools`} />

        <div className="space-y-2">
          {analysis.uniqueTools.map((tool) => (
            <ToolCard key={tool.name} tool={tool} spec={mcpToolSpecs[tool.name]} />
          ))}
        </div>

        {/* Spec accordion */}
        <ToolSpecAccordion />

        {/* Powered by */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Image src="/bnb-logo.svg" alt="BNB" width={16} height={16} />
          <span>Powered by <span className="text-[#F0B90B] font-medium">BNB Dev Suite MCP</span></span>
        </div>
      </section>
    </div>
  );
}

function ToolSpecAccordion() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 rounded-xl border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/20 transition-colors"
      >
        <span className="text-xs font-medium text-muted-foreground">Full MCP Tool Specifications</span>
        {open ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>
      {open && (
        <div className="border-t px-4 py-3 space-y-3">
          {Object.entries(mcpToolSpecs).map(([name, spec]) => (
            <div key={name} className="space-y-1">
              <code className="text-xs font-mono font-semibold text-[#F0B90B]">{name}</code>
              <p className="text-[11px] text-muted-foreground">{spec.description}</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(spec.params).map(([param, type]) => (
                  <span key={param} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
                    {param}: {type}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ToolCard({ tool, spec }: {
  tool: { id: string; name: string; input: Record<string, unknown>; result?: string };
  spec?: { description: string; params: Record<string, string>; returns: string };
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#F0B90B]/10 text-[#F0B90B]">
            <Wrench className="h-3.5 w-3.5" />
          </div>
          <code className="text-sm font-mono font-medium">{tool.name}</code>
        </div>
        {expanded ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>
      {expanded && (
        <div className="border-t px-4 py-2.5 space-y-2">
          {spec && <p className="text-[11px] text-muted-foreground">{spec.description}</p>}
          <pre className="text-[11px] font-mono text-foreground/70 bg-muted/30 rounded-lg p-2 overflow-x-auto">
            {JSON.stringify(tool.input, null, 2)}
          </pre>
          {tool.result && (
            <p className="text-[11px] text-foreground/60 bg-muted/20 rounded-lg p-2 line-clamp-3">
              {tool.result.slice(0, 200)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Build a plain-text tech spec for copying
function buildTechSpecText(
  files: GeneratedFile[],
  analysis: {
    contractName?: string;
    constructorParams: string | null;
    functions: { name: string; params: string; modifiers: string }[];
    events: { name: string; params: string }[];
    hasTsx: boolean;
    hardhatConfig: GeneratedFile | undefined;
  }
): string {
  const lines: string[] = [];
  lines.push("# File Tree");
  files.forEach((f) => lines.push(f.path));
  if (analysis.contractName) {
    lines.push(`\n# Contract: ${analysis.contractName}`);
    if (analysis.constructorParams) lines.push(`constructor(${analysis.constructorParams})`);
    analysis.functions.forEach((f) => lines.push(`${f.name}(${f.params}) ${f.modifiers}`));
    if (analysis.events.length) {
      lines.push("Events: " + analysis.events.map((e) => e.name).join(", "));
    }
  }
  if (analysis.hasTsx) lines.push("\n# Frontend: React + TypeScript + Tailwind CSS");
  if (analysis.hardhatConfig) lines.push("# Network: BSC Testnet (97) / BSC Mainnet (56)");
  return lines.join("\n");
}
