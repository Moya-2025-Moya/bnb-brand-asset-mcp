import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { designTemplates } from "../data/design-templates.js";

export function registerGetDesignTemplate(server: McpServer) {
  server.tool(
    "get_design_template",
    `MUST be called BEFORE generating any HTML page. Returns a complete, brand-perfect HTML reference template for the requested page type. You MUST use this template as your starting point — customize the content and placeholders but keep the design system (colors, fonts, layout patterns, BNB logo, card styles). Output format is always standalone HTML with Tailwind CDN. Available types: token (BEP20 showcase), nft (mint page), landing (general project), dashboard (dApp UI).`,
    {
      type: z
        .enum(["token", "nft", "landing", "dashboard"])
        .describe("Page type: 'token' for BEP20 showcase, 'nft' for NFT mint page, 'landing' for project landing, 'dashboard' for dApp UI"),
    },
    async ({ type }) => {
      const template = designTemplates[type];
      if (!template) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Unknown template type: ${type}. Available: token, nft, landing, dashboard`,
            },
          ],
          isError: true,
        };
      }

      const sections: string[] = [];
      sections.push(`# BNB Chain Design Template: ${template.name}\n`);
      sections.push("## INSTRUCTIONS");
      sections.push("1. Use this HTML as your BASE template — do NOT create your own layout from scratch");
      sections.push("2. Replace all {{PLACEHOLDER}} values with content from the user's request");
      sections.push("3. Keep the BNB logo in the navbar exactly as-is (the inline SVG)");
      sections.push("4. Keep the color scheme: #F0B90B (BNB yellow), #1E2329 (dark text), #707A8A (secondary text), #FAFAFA (background)");
      sections.push("5. Keep the fonts: Space Grotesk for headings, Inter for body text");
      sections.push("6. You may add, remove, or reorder sections as needed for the user's project");
      sections.push("7. You may add new feature cards, stats, or content blocks using the same card/styling patterns");
      sections.push("8. Output the final HTML as a SINGLE file using ---FILE: index.html--- format");
      sections.push("9. The HTML is standalone with Tailwind CDN — it will render directly in the browser\n");
      sections.push(`## Template: ${template.name}\n`);
      sections.push(`${template.description}\n`);
      sections.push("```html\n" + template.html + "\n```\n");

      return {
        content: [{ type: "text", text: sections.join("\n") }],
      };
    }
  );
}
