import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { uiComponents } from "../data/ui-components.js";

export function registerGetUIComponent(server: McpServer) {
  server.tool(
    "get_ui_component",
    `Returns ready-to-use BNB Chain branded React components. Use these instead of writing wallet connection or network switching logic from scratch. Components are pre-styled with BNB brand colors and require the CSS variables from get_brand_colors.`,
    {
      component: z
        .enum(["ConnectWallet", "NetworkSwitcher", "all"])
        .describe("Component name or 'all' to get all components"),
    },
    async ({ component }) => {
      const sections: string[] = [];
      sections.push("# BNB Chain UI Components\n");
      sections.push("## INSTRUCTIONS");
      sections.push("1. Save each component as its own file (e.g., `components/ConnectWallet.tsx`)");
      sections.push("2. These components require BNB CSS variables — call `get_brand_colors` first and include the CSS variables in your global stylesheet");
      sections.push("3. Do NOT modify the brand colors in these components\n");

      const components =
        component === "all"
          ? Object.values(uiComponents)
          : [uiComponents[component]].filter(Boolean);

      if (components.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Unknown component: ${component}. Available: ${Object.keys(uiComponents).join(", ")}`,
            },
          ],
          isError: true,
        };
      }

      for (const comp of components) {
        sections.push(`## ${comp.name}\n`);
        sections.push(`${comp.description}\n`);
        sections.push(`- **Framework:** ${comp.framework}`);
        sections.push(
          `- **Dependencies:** ${comp.dependencies.length > 0 ? comp.dependencies.join(", ") : "none"}`
        );
        sections.push(`\n### Code — save as \`components/${comp.name}.tsx\`\n\`\`\`tsx\n${comp.code}\n\`\`\`\n`);
      }

      return {
        content: [{ type: "text", text: sections.join("\n") }],
      };
    }
  );
}
