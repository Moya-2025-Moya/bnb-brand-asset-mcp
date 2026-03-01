import { brandColors } from "../../mcp-data/brand-colors";
import { contractTemplates, hardhatConfig, hardhatPackageJson } from "../../mcp-data/contract-templates";
import { uiComponents } from "../../mcp-data/ui-components";
import { logoManifest, logoUsageGuidelines } from "../../mcp-data/logo-manifest";

interface ToolInput {
  [key: string]: unknown;
}

export function executeTool(name: string, input: ToolInput): string {
  switch (name) {
    case "get_brand_colors":
      return executeBrandColors(input);
    case "get_logo":
      return executeLogo(input);
    case "get_contract_template":
      return executeContractTemplate(input);
    case "get_ui_component":
      return executeUIComponent(input);
    default:
      return `Unknown tool: ${name}`;
  }
}

function executeBrandColors(input: ToolInput): string {
  const theme = (input.theme as string) || "both";
  const format = (input.format as string) || "all";
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

  return sections.join("\n");
}

function executeLogo(input: ToolInput): string {
  let filtered = [...logoManifest];
  if (input.theme) filtered = filtered.filter((l) => l.theme === input.theme);
  if (input.style) filtered = filtered.filter((l) => l.style === input.style);
  if (input.format) filtered = filtered.filter((l) => l.format === input.format);

  const results: string[] = [];
  results.push("# BNB Chain Logo Assets\n");

  for (const logo of filtered) {
    results.push(`## ${logo.name}`);
    results.push(`- File: ${logo.filename}`);
    results.push(`- Format: ${logo.format.toUpperCase()}`);
    results.push(`- Theme: ${logo.theme}`);
    results.push(`- Style: ${logo.style}`);
    if (logo.width) results.push(`- Size: ${logo.width}x${logo.height}px`);
    results.push(`- Description: ${logo.description}\n`);
  }

  results.push(logoUsageGuidelines);
  return results.join("\n");
}

function executeContractTemplate(input: ToolInput): string {
  const type = input.type as string;
  const template = contractTemplates[type];
  if (!template) return `Unknown contract type: ${type}. Available: BEP20, BEP721`;

  let solidity = template.solidity;

  if (type === "BEP20") {
    if (input.tokenName) {
      const name = input.tokenName as string;
      solidity = solidity.replace(/\{\{TOKEN_NAME\}\}/g, name);
      solidity = solidity.replace(/\{\{TOKEN_NAME_PASCAL\}\}/g, name.replace(/[^a-zA-Z0-9]/g, ""));
    }
    if (input.tokenSymbol) {
      solidity = solidity.replace(/\{\{TOKEN_SYMBOL\}\}/g, input.tokenSymbol as string);
    }
  } else if (type === "BEP721") {
    if (input.tokenName) {
      const name = input.tokenName as string;
      solidity = solidity.replace(/\{\{COLLECTION_NAME\}\}/g, name);
      solidity = solidity.replace(/\{\{COLLECTION_NAME_PASCAL\}\}/g, name.replace(/[^a-zA-Z0-9]/g, ""));
    }
    if (input.tokenSymbol) {
      solidity = solidity.replace(/\{\{COLLECTION_SYMBOL\}\}/g, input.tokenSymbol as string);
    }
  }

  const sections: string[] = [];
  sections.push(`# ${template.name} Template\n`);
  sections.push(`${template.description}\n`);
  sections.push("## Solidity Contract\n```solidity\n" + solidity + "\n```\n");

  sections.push("## Placeholders to Customize\n");
  for (const [placeholder, defaultValue] of Object.entries(template.placeholders)) {
    sections.push(`- \`${placeholder}\` → default: \`${defaultValue}\``);
  }

  if (input.includeHardhat !== false) {
    sections.push("\n## Hardhat Configuration\n");
    sections.push("### hardhat.config.ts\n```typescript\n" + hardhatConfig + "\n```\n");
    sections.push("### package.json\n```json\n" + hardhatPackageJson + "\n```\n");
  }

  return sections.join("\n");
}

function executeUIComponent(input: ToolInput): string {
  const component = input.component as string;
  const sections: string[] = [];
  sections.push("# BNB Chain UI Components\n");

  const components = component === "all"
    ? Object.values(uiComponents)
    : [uiComponents[component]].filter(Boolean);

  if (components.length === 0) {
    return `Unknown component: ${component}. Available: ${Object.keys(uiComponents).join(", ")}`;
  }

  for (const comp of components) {
    sections.push(`## ${comp.name}\n`);
    sections.push(`${comp.description}\n`);
    sections.push(`- **Framework:** ${comp.framework}`);
    sections.push(`- **Dependencies:** ${comp.dependencies.length > 0 ? comp.dependencies.join(", ") : "none"}`);
    sections.push(`\n### Code\n\`\`\`tsx\n${comp.code}\n\`\`\`\n`);
  }

  return sections.join("\n");
}
