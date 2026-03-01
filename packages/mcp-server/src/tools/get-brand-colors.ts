import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { brandColors } from "../data/brand-colors.js";

export function registerGetBrandColors(server: McpServer) {
  server.tool(
    "get_brand_colors",
    `MUST be called FIRST before writing any code for a BNB Chain project. Returns the official BNB Chain design system: colors, typography, CSS variables, and Tailwind config. You MUST use these exact values — never guess or use approximate BNB colors. The primary brand yellow is #F0B90B, NOT #FFD700 or #FFC107.`,
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
      sections.push("# BNB Chain Official Design System\n");
      sections.push("## INSTRUCTIONS");
      sections.push("1. Use ONLY these colors in the project — never guess BNB brand colors");
      sections.push("2. Primary yellow is #F0B90B (light theme) / #FCD535 (dark theme) — this is critical");
      sections.push("3. For Tailwind projects: copy the Tailwind config section into tailwind.config.ts");
      sections.push("4. For CSS projects: copy the CSS variables into your global stylesheet");
      sections.push("5. Always include BOTH light and dark theme support");
      sections.push("6. Use Space Grotesk for headings, Inter for body, JetBrains Mono for code\n");

      if (format === "all" || format === "json") {
        sections.push("## Color Palette\n");
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
        sections.push("## CSS Variables — copy into globals.css\n");
        if (theme === "both" || theme === "light") {
          sections.push("### Light Theme\n```css" + brandColors.cssVariables.light + "\n```\n");
        }
        if (theme === "both" || theme === "dark") {
          sections.push("### Dark Theme\n```css" + brandColors.cssVariables.dark + "\n```\n");
        }
      }

      if (format === "all" || format === "tailwind") {
        sections.push("## Tailwind Config — merge into tailwind.config.ts\n```typescript" + brandColors.tailwindConfig + "\n```\n");
      }

      return {
        content: [{ type: "text", text: sections.join("\n") }],
      };
    }
  );
}
