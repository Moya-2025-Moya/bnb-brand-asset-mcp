import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { logoManifest, logoUsageGuidelines } from "../data/logo-manifest.js";

export function registerGetLogo(server: McpServer) {
  server.tool(
    "get_logo",
    `REQUIRED for any BNB Chain project. Returns official BNB Chain logo SVG files that MUST be saved as actual files in the project (e.g., public/bnb-logo.svg) and referenced in the UI. Never describe or recreate the logo — always use the exact SVG content returned by this tool.`,
    {
      theme: z
        .enum(["light", "dark"])
        .optional()
        .describe("Logo theme variant: 'light' for light backgrounds, 'dark' for dark backgrounds"),
      style: z
        .enum(["full", "icon"])
        .optional()
        .describe("Logo style: 'full' for logo with text, 'icon' for icon only"),
      format: z
        .enum(["svg"])
        .optional()
        .describe("File format: 'svg'"),
    },
    async ({ theme, style, format }) => {
      let filtered = logoManifest;

      if (theme) filtered = filtered.filter((l) => l.theme === theme);
      if (style) filtered = filtered.filter((l) => l.style === style);
      if (format) filtered = filtered.filter((l) => l.format === format);

      const results: string[] = [];
      results.push("# BNB Chain Official Logo Assets\n");
      results.push("## INSTRUCTIONS");
      results.push("1. Save each SVG below as an actual file in the project (e.g., `public/bnb-logo.svg`, `public/bnb-logo-full.svg`)");
      results.push("2. Reference the saved file in your HTML/JSX using <img> or Next.js <Image> — do NOT inline the SVG in components");
      results.push("3. Use the icon variant for navbar/favicon, full variant for hero/footer");
      results.push("4. Follow the usage guidelines at the bottom\n");

      for (const logo of filtered) {
        results.push(`## ${logo.name}`);
        results.push(`- Suggested filename: \`${logo.filename}\``);
        results.push(`- Theme: ${logo.theme} | Style: ${logo.style} | Format: ${logo.format.toUpperCase()}`);
        if (logo.width) results.push(`- Size: ${logo.width}x${logo.height}px`);
        results.push(`- Description: ${logo.description}`);
        results.push(`\n### SVG Content — save as \`public/${logo.filename}\`\n\`\`\`svg\n${logo.svgContent}\n\`\`\``);
        results.push("");
      }

      results.push(logoUsageGuidelines);

      return {
        content: [{ type: "text", text: results.join("\n") }],
      };
    }
  );
}
