import { Hexagon } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <Hexagon className="h-5 w-5 text-primary fill-primary/20" />
            <span className="font-semibold">BNB Dev Suite</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built for the BNB Chain ecosystem. Open source MCP server for brand-consistent development.
          </p>
        </div>
      </div>
    </footer>
  );
}
