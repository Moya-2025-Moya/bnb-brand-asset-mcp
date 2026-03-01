import { brandColors } from "../../mcp-data/brand-colors";
import { contractTemplates, hardhatConfig, hardhatPackageJson } from "../../mcp-data/contract-templates";
import { uiComponents } from "../../mcp-data/ui-components";
import { logoManifest, logoUsageGuidelines } from "../../mcp-data/logo-manifest";
import { designTemplates } from "../../mcp-data/design-templates";

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
    case "get_design_template":
      return executeDesignTemplate(input);
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

function executeDesignTemplate(input: ToolInput): string {
  const type = input.type as string;
  const template = designTemplates[type];
  if (!template) {
    return `Unknown template type: ${type}. Available: ${Object.keys(designTemplates).join(", ")}`;
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

  return sections.join("\n");
}
