"use client";

import { useMemo, useState } from "react";
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
  Terminal,
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
} from "@/lib/preview-builders";
import type { GenerationStep, GeneratedFile } from "@/hooks/use-generation";

interface CompletionViewProps {
  files: GeneratedFile[];
  steps: GenerationStep[];
  totalTools: number;
  prompt: string;
}

// File type visual config
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

// MCP tool definitions for the spec section
const mcpToolSpecs: Record<string, { description: string; params: Record<string, string>; returns: string }> = {
  get_brand_colors: {
    description: "Get BNB Chain official brand colors, typography, CSS variables, and Tailwind config",
    params: { theme: "light | dark | both", format: "json | css | tailwind | all" },
    returns: "Design system tokens (colors, fonts, spacing)",
  },
  get_logo: {
    description: "Get BNB Chain official logo files and usage guidelines",
    params: { theme: "light | dark", style: "full | icon", format: "svg | png" },
    returns: "Logo metadata + SVG/PNG content",
  },
  get_contract_template: {
    description: "Get BNB Chain smart contract templates with Hardhat config",
    params: { type: "BEP20 | BEP721", tokenName: "string", tokenSymbol: "string", includeHardhat: "boolean" },
    returns: "Solidity source + Hardhat project files",
  },
  get_ui_component: {
    description: "Get BNB Chain branded React UI components",
    params: { component: "ConnectWallet | NetworkSwitcher | all" },
    returns: "React component source code",
  },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1 rounded hover:bg-muted/50 text-muted-foreground transition-colors"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-[#18DC7E]" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  return (
    <div className="relative group rounded-lg border bg-muted/30 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b bg-muted/20">
        <span className="text-[10px] font-mono text-muted-foreground uppercase">{language || "shell"}</span>
        <CopyButton text={code} />
      </div>
      <pre className="px-3 py-2.5 overflow-x-auto text-sm font-mono text-foreground/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#F0B90B]/10 text-[#F0B90B]">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

export function CompletionView({ files, steps, totalTools, prompt }: CompletionViewProps) {
  const [previewTab, setPreviewTab] = useState<"frontend" | "contract">("frontend");

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

    // Determine project type description
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

    // Parse project name
    let projectName = contractName || "BNB Project";
    if (packageJson) {
      try {
        const pkg = JSON.parse(packageJson.content);
        if (pkg.name) projectName = pkg.name;
      } catch { /* ignore */ }
    }

    // AI explanation from text steps
    const aiExplanation = steps
      .filter((s) => s.type === "text")
      .map((s) => (s.data as { content: string }).content)
      .filter(Boolean)
      .join("\n\n");

    // Extract tool calls and results, paired by id
    const toolCalls = steps.filter((s) => s.type === "tool_call").map((s) => s.data as { id: string; name: string; input: Record<string, unknown> });
    const toolResults = steps.filter((s) => s.type === "tool_result").map((s) => s.data as { id: string; name: string; result: string });
    const pairedTools = toolCalls.map((tc) => ({
      ...tc,
      result: toolResults.find((tr) => tr.id === tc.id)?.result,
    }));

    // Deduplicate tools by name (keep first call of each unique tool)
    const uniqueTools = pairedTools.filter((t, i, arr) => arr.findIndex((x) => x.name === t.name) === i);

    // Contract functions/events for tech spec
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

    // Group files by extension
    const grouped: Record<string, GeneratedFile[]> = {};
    files.forEach((f) => {
      const ext = getFileExtension(f.path);
      if (!grouped[ext]) grouped[ext] = [];
      grouped[ext].push(f);
    });

    // Getting started steps
    const gettingStartedSteps: { title: string; description: string; code: string; language?: string }[] = [];
    gettingStartedSteps.push({
      title: "Download & Extract",
      description: "Click the Download button above to get a .zip file, then extract it.",
      code: "unzip project.zip && cd project",
    });
    if (packageJson) {
      gettingStartedSteps.push({
        title: "Install Dependencies",
        description: "Install the Node.js packages required by the project.",
        code: "npm install",
      });
    }
    if (envExample) {
      gettingStartedSteps.push({
        title: "Configure Environment",
        description: "Copy the example environment file and fill in your keys.",
        code: "cp .env.example .env\n# Edit .env with your private key and API keys",
      });
    }
    if (hardhatConfig) {
      gettingStartedSteps.push({
        title: "Compile Contract",
        description: "Compile the Solidity smart contracts using Hardhat.",
        code: "npx hardhat compile",
      });
      gettingStartedSteps.push({
        title: "Deploy to BNB Testnet",
        description: "Deploy the compiled contract to the BNB Smart Chain testnet.",
        code: "npx hardhat run scripts/deploy.ts --network bscTestnet",
      });
    }
    if (hasTsx) {
      gettingStartedSteps.push({
        title: "Run Frontend",
        description: "Start the development server to preview the frontend locally.",
        code: "npm run dev",
      });
    }

    return {
      contractFile, contractName, htmlFile, packageJson, hardhatConfig,
      hasTsx, totalLines, typeDescription, projectName, aiExplanation,
      pairedTools, uniqueTools, functions, events, constructorParams,
      grouped, gettingStartedSteps,
    };
  }, [files, steps]);

  const hasFrontendPreview = !!analysis.htmlFile;
  const hasContractPreview = !!analysis.contractFile;

  // Build preview HTML
  const frontendPreviewHtml = useMemo(() => {
    if (!analysis.htmlFile) return null;
    return buildHtmlPreview(analysis.htmlFile.content);
  }, [analysis.htmlFile]);

  const contractPreviewHtml = useMemo(() => {
    if (!analysis.contractFile) return null;
    return buildSolidityPreview(analysis.contractFile.content, analysis.contractFile.path);
  }, [analysis.contractFile]);

  // Auto-select best preview tab
  const effectiveTab = previewTab === "frontend" && !hasFrontendPreview ? "contract" :
    previewTab === "contract" && !hasContractPreview ? "frontend" : previewTab;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">

      {/* ========== Section 1: Hero ========== */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F0B90B]/20 to-[#18DC7E]/10 mx-auto">
            <Layers className="h-7 w-7 text-[#F0B90B]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{analysis.projectName}</h2>
            <p className="text-sm text-muted-foreground mt-1">{analysis.typeDescription}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="rounded-xl border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-[#F0B90B]">{files.length}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Files</div>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-[#18DC7E]">{analysis.totalLines.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Lines</div>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{totalTools}</div>
            <div className="text-xs text-muted-foreground mt-0.5">MCP Tools</div>
          </div>
        </div>

        {/* Prompt quote */}
        <div className="mt-6 rounded-xl border bg-card p-4">
          <div className="flex items-start gap-3">
            <Quote className="h-4 w-4 text-[#F0B90B] mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground italic leading-relaxed">{prompt}</p>
          </div>
        </div>

        {/* AI explanation */}
        {analysis.aiExplanation && (
          <div className="mt-4 rounded-xl border bg-card p-4">
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {analysis.aiExplanation.length > 500 ? analysis.aiExplanation.slice(0, 500) + "..." : analysis.aiExplanation}
            </p>
          </div>
        )}
      </section>

      {/* ========== Section 2: Preview ========== */}
      {(hasFrontendPreview || hasContractPreview) && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
          <SectionHeader icon={<Globe className="h-4 w-4" />} title="Preview" subtitle="Live preview of generated output" />

          {/* Tabs - only show if both types exist */}
          {hasFrontendPreview && hasContractPreview && (
            <div className="flex items-center gap-1 mb-4">
              <button
                onClick={() => setPreviewTab("frontend")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  effectiveTab === "frontend" ? "bg-card border shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Frontend
              </button>
              <button
                onClick={() => setPreviewTab("contract")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
                srcDoc={effectiveTab === "frontend" ? (frontendPreviewHtml || "") : (contractPreviewHtml || "")}
                sandbox="allow-scripts allow-same-origin"
                className="w-full h-full border-0"
                title={effectiveTab === "frontend" ? "Frontend preview" : "Contract preview"}
                style={{ display: "block" }}
              />
            </div>
          </div>
        </section>
      )}

      {/* ========== Section 3: Getting Started ========== */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both">
        <SectionHeader icon={<BookOpen className="h-4 w-4" />} title="Getting Started" subtitle="Step-by-step setup instructions" />

        <div className="space-y-4">
          {analysis.gettingStartedSteps.map((step, i) => (
            <div key={i} className="rounded-xl border bg-card overflow-hidden">
              <div className="flex items-start gap-4 p-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F0B90B]/10 text-[#F0B90B] text-sm font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold mb-1">{step.title}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{step.description}</p>
                  <CodeBlock code={step.code} language={step.language} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== Section 4: Project Files ========== */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
        <SectionHeader icon={<FileText className="h-4 w-4" />} title="Project Files" subtitle={`${files.length} files generated`} />

        <div className="space-y-3">
          {Object.entries(analysis.grouped)
            .sort((a, b) => b[1].length - a[1].length)
            .map(([ext, groupFiles]) => {
              const cfg = fileTypeConfig[ext] || { color: "text-gray-500", bg: "bg-gray-500/10", icon: <FileText className="h-4 w-4" />, label: ext.toUpperCase() };
              return (
                <div key={ext} className="rounded-xl border bg-card overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${cfg.bg} ${cfg.color}`}>
                        {cfg.icon}
                      </div>
                      <span className="text-sm font-medium">{cfg.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {groupFiles.length} file{groupFiles.length > 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <div className="divide-y">
                    {groupFiles.map((f) => (
                      <div key={f.path} className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/20 transition-colors">
                        <code className="text-sm font-mono text-foreground/80">{f.path}</code>
                        <span className="text-xs text-muted-foreground">{f.content.split("\n").length} lines</span>
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
        <SectionHeader icon={<Cpu className="h-4 w-4" />} title="Technical Specification" subtitle="For Claude Code and AI tools" />

        <div className="space-y-4">
          {/* File tree */}
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b bg-muted/30">
              <span className="text-sm font-medium">File Tree</span>
            </div>
            <pre className="px-4 py-3 text-sm font-mono text-foreground/80 overflow-x-auto">
              {files.map((f) => f.path).join("\n")}
            </pre>
          </div>

          {/* Contract info */}
          {analysis.contractFile && (
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b bg-muted/30">
                <span className="text-sm font-medium">Contract: {analysis.contractName || "Unknown"}</span>
              </div>
              <div className="p-4 space-y-3">
                {analysis.constructorParams && (
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Constructor</span>
                    <code className="block mt-1 text-sm font-mono text-foreground/80">
                      constructor({analysis.constructorParams})
                    </code>
                  </div>
                )}
                {analysis.functions.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Functions ({analysis.functions.length})</span>
                    <div className="mt-1 space-y-1">
                      {analysis.functions.map((f, i) => (
                        <code key={i} className="block text-sm font-mono text-foreground/80">
                          {f.name}({f.params}){f.modifiers ? ` ${f.modifiers}` : ""}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
                {analysis.events.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Events ({analysis.events.length})</span>
                    <div className="mt-1 space-y-1">
                      {analysis.events.map((e, i) => (
                        <code key={i} className="block text-sm font-mono text-foreground/80">
                          {e.name}({e.params})
                        </code>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Frontend info */}
          {analysis.hasTsx && (
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b bg-muted/30">
                <span className="text-sm font-medium">Frontend Stack</span>
              </div>
              <div className="p-4 text-sm text-foreground/80">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Tailwind CSS</Badge>
                  {files.some((f) => f.content.includes("wagmi") || f.content.includes("useAccount")) && <Badge variant="secondary">wagmi</Badge>}
                  {files.some((f) => f.content.includes("ethers")) && <Badge variant="secondary">ethers.js</Badge>}
                  {files.some((f) => f.content.includes("viem")) && <Badge variant="secondary">viem</Badge>}
                </div>
              </div>
            </div>
          )}

          {/* Network config */}
          {analysis.hardhatConfig && (
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b bg-muted/30">
                <span className="text-sm font-medium">Network Configuration</span>
              </div>
              <div className="p-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">BSC Testnet</span>
                  <code className="font-mono text-xs text-foreground/80">https://data-seed-prebsc-1-s1.binance.org:8545</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">BSC Mainnet</span>
                  <code className="font-mono text-xs text-foreground/80">https://bsc-dataseed.binance.org</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Chain ID</span>
                  <code className="font-mono text-xs text-foreground/80">97 (testnet) / 56 (mainnet)</code>
                </div>
              </div>
            </div>
          )}

          {/* Example Claude Code command */}
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b bg-muted/30">
              <span className="text-sm font-medium">Example Claude Code Command</span>
            </div>
            <div className="p-4">
              <CodeBlock
                code={`claude "Review the generated ${analysis.contractName || "project"} and suggest optimizations for gas efficiency and security"`}
                language="shell"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== Section 6: MCP Attribution ========== */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500 fill-mode-both">
        <SectionHeader icon={<Wrench className="h-4 w-4" />} title="MCP Tools Used" subtitle={`${analysis.uniqueTools.length} unique tools invoked`} />

        <div className="space-y-3">
          {analysis.uniqueTools.map((tool, i) => {
            const spec = mcpToolSpecs[tool.name];
            return (
              <ToolCard key={i} tool={tool} spec={spec} />
            );
          })}
        </div>

        {/* Full MCP spec */}
        <div className="mt-6 rounded-xl border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b bg-muted/30">
            <span className="text-sm font-medium">Available MCP Tool Specifications</span>
          </div>
          <div className="p-4 space-y-4">
            {Object.entries(mcpToolSpecs).map(([name, spec]) => (
              <div key={name} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono font-semibold text-[#F0B90B]">{name}</code>
                </div>
                <p className="text-xs text-muted-foreground">{spec.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(spec.params).map(([param, type]) => (
                    <span key={param} className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted/50 text-muted-foreground">
                      {param}: <span className="text-foreground/60">{type}</span>
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Returns: <span className="text-foreground/60">{spec.returns}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Powered by */}
        <div className="mt-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Terminal className="h-4 w-4" />
            <span>Powered by <span className="text-[#F0B90B] font-medium">BNB Dev Suite MCP</span></span>
          </div>
          <code className="text-xs font-mono text-muted-foreground">
            npx @anthropic-ai/sdk mcp connect bnb-dev-suite
          </code>
        </div>
      </section>
    </div>
  );
}

function ToolCard({ tool, spec }: {
  tool: { id: string; name: string; input: Record<string, unknown>; result?: string };
  spec?: { description: string; params: Record<string, string>; returns: string };
}) {
  const [expanded, setExpanded] = useState(false);
  const resultSummary = tool.result
    ? (tool.result.length > 150 ? tool.result.slice(0, 150) + "..." : tool.result)
    : null;

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F0B90B]/10 text-[#F0B90B]">
            <Wrench className="h-4 w-4" />
          </div>
          <div className="text-left">
            <code className="text-sm font-mono font-semibold">{tool.name}</code>
            {spec && <p className="text-xs text-muted-foreground mt-0.5">{spec.description}</p>}
          </div>
        </div>
        {expanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </button>
      {expanded && (
        <div className="border-t px-4 py-3 space-y-3">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Parameters</span>
            <pre className="mt-1 text-xs font-mono text-foreground/80 bg-muted/30 rounded-lg p-2 overflow-x-auto">
              {JSON.stringify(tool.input, null, 2)}
            </pre>
          </div>
          {resultSummary && (
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Result Summary</span>
              <p className="mt-1 text-xs text-foreground/70 bg-muted/30 rounded-lg p-2">{resultSummary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
