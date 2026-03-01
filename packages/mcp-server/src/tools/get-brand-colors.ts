import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { brandColors } from "../data/brand-colors.js";

export function registerGetBrandColors(server: McpServer) {
  server.tool(
    "get_brand_colors",
    "Get BNB Chain official brand colors, typography, CSS variables, and Tailwind config. Returns complete design system tokens for building branded applications.",
    {
      theme: z
        .enum(["light", "dark", "both"])
        .optional()
        .default("both")
        .describe("Color theme to return"),
      format: z
        .enum(["json", "css", "tailwind", "all"])
        .optional()
        .default("all")
        .describe("Output format: 'json' for raw values, 'css' for CSS variables, 'tailwind' for Tailwind config, 'all' for everything"),
    },
    async ({ theme, format }) => {
      const sections: string[] = [];
      sections.push("# BNB Chain Brand Colors & Design Tokens\n");

      if (format === "all" || format === "json") {
        sections.push("## Color Palette (JSON)\n");
        if (theme === "both" || theme === "light") {
          sections.push("### Light Theme\n```json\n" + JSON.stringify(brandColors.light, null, 2) + "\n```\n");
        }
        if (theme === "both" || theme === "dark") {
          sections.push("### Dark Theme\n```json\n" + JSON.stringify(brandColors.dark, null, 2) + "\n```\n");
        }
        sections.push("### Gradients\n```json\n" + JSON.stringify(brandColors.gradients, null, 2) + "\n```\n");
        sections.push("### Typography\n```json\n" + JSON.stringify(brandColors.typography, null, 2) + "\n```\n");
      }

      if (format === "all" || format === "css") {
        sections.push("## CSS Variables\n");
        if (theme === "both" || theme === "light") {
          sections.push("### Light Theme\n```css" + brandColors.cssVariables.light + "\n```\n");
        }
        if (theme === "both" || theme === "dark") {
          sections.push("### Dark Theme\n```css" + brandColors.cssVariables.dark + "\n```\n");
        }
      }

      if (format === "all" || format === "tailwind") {
        sections.push("## Tailwind CSS Config\n```typescript" + brandColors.tailwindConfig + "\n```\n");
      }

      return {
        content: [{ type: "text", text: sections.join("\n") }],
      };
    }
  );
}
