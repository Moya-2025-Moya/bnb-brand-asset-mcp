import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetLogo } from "./get-logo.js";
import { registerGetBrandColors } from "./get-brand-colors.js";
import { registerGetContractTemplate } from "./get-contract-template.js";
import { registerGetUIComponent } from "./get-ui-component.js";
import { registerGetDesignTemplate } from "./get-design-template.js";

export function registerTools(server: McpServer) {
  registerGetLogo(server);
  registerGetBrandColors(server);
  registerGetContractTemplate(server);
  registerGetUIComponent(server);
  registerGetDesignTemplate(server);
}
