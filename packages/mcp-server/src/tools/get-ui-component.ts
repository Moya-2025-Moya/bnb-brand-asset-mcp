import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { uiComponents } from "../data/ui-components.js";

export function registerGetUIComponent(server: McpServer) {
  server.tool(
    "get_ui_component",
    "Get BNB Chain branded React UI components (ConnectWallet, NetworkSwitcher). Returns ready-to-use TypeScript/React code with BNB Chain styling.",
    {
      component: z
        .enum(["ConnectWallet", "NetworkSwitcher", "all"])
        .describe("Component name or 'all' to get all components"),
    },
    async ({ component }) => {
      const sections: string[] = [];
      sections.push("# BNB Chain UI Components\n");

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
        sections.push(`\n### Code\n\`\`\`tsx\n${comp.code}\n\`\`\`\n`);
      }

      sections.push("## Usage Notes\n");
      sections.push("- Components use BNB Chain CSS variables (--bnb-*) for theming");
      sections.push("- Include the CSS variables from `get_brand_colors` tool for proper styling");
      sections.push("- ConnectWallet requires `window.ethereum` (MetaMask or compatible wallet)");
      sections.push("- Both components support light and dark themes automatically");

      return {
        content: [{ type: "text", text: sections.join("\n") }],
      };
    }
  );
}
