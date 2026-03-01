import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { logoManifest, logoUsageGuidelines } from "../data/logo-manifest.js";

export function registerGetLogo(server: McpServer) {
  server.tool(
    "get_logo",
    "Get BNB Chain official logo files and usage guidelines. Returns logo metadata, SVG content, and brand usage guidelines.",
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
      results.push("# BNB Chain Logo Assets\n");

      for (const logo of filtered) {
        results.push(`## ${logo.name}`);
        results.push(`- File: ${logo.filename}`);
        results.push(`- Format: ${logo.format.toUpperCase()}`);
        results.push(`- Theme: ${logo.theme}`);
        results.push(`- Style: ${logo.style}`);
        if (logo.width) results.push(`- Size: ${logo.width}x${logo.height}px`);
        results.push(`- Description: ${logo.description}`);
        results.push(`\n\`\`\`svg\n${logo.svgContent}\n\`\`\``);
        results.push("");
      }

      results.push(logoUsageGuidelines);

      return {
        content: [{ type: "text", text: results.join("\n") }],
      };
    }
  );
}
