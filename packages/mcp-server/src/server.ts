import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerTools } from "./tools/index.js";

export function createServer() {
  const server = new McpServer({
    name: "bnb-dev-suite",
    version: "1.0.0",
  });

  registerTools(server);

  return server;
}

// Re-export data for frontend consumption
export { brandColors } from "./data/brand-colors.js";
export { contractTemplates, hardhatConfig, hardhatPackageJson } from "./data/contract-templates.js";
export { uiComponents } from "./data/ui-components.js";
export { logoManifest, logoUsageGuidelines } from "./data/logo-manifest.js";
export { registerTools } from "./tools/index.js";
