import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden hero-gradient">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
        <div className="flex flex-col items-center text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5" />
            MCP-Powered Brand Toolkit
          </Badge>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Build{" "}
            <span className="gradient-text">BNB Chain</span>
            {" "}Projects in 30 Seconds
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Official brand colors, logos, smart contract templates, and UI
            components — delivered through MCP to your AI coding assistant.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild className="gap-2 text-base">
              <Link href="/generate">
                Generate Project
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 text-base font-mono">
              <Link href="https://www.npmjs.com/package/bnb-dev-suite" target="_blank">
                npx bnb-dev-suite
              </Link>
            </Button>
          </div>

          <div className="mt-16 w-full max-w-3xl rounded-xl border bg-card p-4 shadow-lg">
            <div className="flex items-center gap-2 border-b pb-3 mb-3">
              <div className="h-3 w-3 rounded-full bg-bnb-error/80" />
              <div className="h-3 w-3 rounded-full bg-bnb-yellow/80" />
              <div className="h-3 w-3 rounded-full bg-bnb-success/80" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">Claude Desktop</span>
            </div>
            <div className="space-y-2 font-mono text-sm text-left">
              <p className="text-muted-foreground">
                <span className="text-primary">User:</span> Create a BEP20 token called &quot;GoldCoin&quot; with BNB Chain branding
              </p>
              <p className="text-muted-foreground">
                <span className="text-bnb-success">Tool:</span> get_brand_colors → get_contract_template → get_ui_component
              </p>
              <p className="text-muted-foreground">
                <span className="text-primary">Claude:</span> Here&apos;s your complete project with branded styles, GoldCoin contract, and wallet UI...
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
