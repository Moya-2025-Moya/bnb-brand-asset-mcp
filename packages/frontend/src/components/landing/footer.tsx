import Image from "next/image";
import { Github, ExternalLink, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <Image src="/bnb-logo.svg" alt="BNB Chain" width={20} height={20} />
            <span className="font-semibold">BNB Dev Suite</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built for the BNB Chain ecosystem. Open source MCP server for brand-consistent development.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/nicholaschen09/bnb-chain-brand-mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/nicholascheneth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://www.bnbchain.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 text-sm"
            >
              bnbchain.org
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
