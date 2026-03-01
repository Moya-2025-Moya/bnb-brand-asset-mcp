import type Anthropic from "@anthropic-ai/sdk";

export const toolDefinitions: Anthropic.Tool[] = [
  {
    name: "get_brand_colors",
    description:
      "Get BNB Chain official brand colors, typography, CSS variables, and Tailwind config. Returns complete design system tokens.",
    input_schema: {
      type: "object" as const,
      properties: {
        theme: {
          type: "string",
          enum: ["light", "dark", "both"],
          description: "Color theme to return",
          default: "both",
        },
        format: {
          type: "string",
          enum: ["json", "css", "tailwind", "all"],
          description: "Output format",
          default: "all",
        },
      },
      required: [],
    },
  },
  {
    name: "get_logo",
    description:
      "Get BNB Chain official logo files and usage guidelines. Returns logo metadata and SVG content.",
    input_schema: {
      type: "object" as const,
      properties: {
        theme: {
          type: "string",
          enum: ["light", "dark"],
          description: "Logo theme variant",
        },
        style: {
          type: "string",
          enum: ["full", "icon"],
          description: "Logo style: full with text or icon only",
        },
        format: {
          type: "string",
          enum: ["svg", "png"],
          description: "File format",
        },
      },
      required: [],
    },
  },
  {
    name: "get_contract_template",
    description:
      "Get BNB Chain smart contract templates (BEP20 token or BEP721 NFT) with Hardhat configuration.",
    input_schema: {
      type: "object" as const,
      properties: {
        type: {
          type: "string",
          enum: ["BEP20", "BEP721"],
          description: "Contract type",
        },
        tokenName: {
          type: "string",
          description: "Token/collection name",
        },
        tokenSymbol: {
          type: "string",
          description: "Token symbol",
        },
        includeHardhat: {
          type: "boolean",
          description: "Include Hardhat project configuration",
          default: true,
        },
      },
      required: ["type"],
    },
  },
  {
    name: "get_ui_component",
    description:
      "Get BNB Chain branded React UI components (ConnectWallet, NetworkSwitcher).",
    input_schema: {
      type: "object" as const,
      properties: {
        component: {
          type: "string",
          enum: ["ConnectWallet", "NetworkSwitcher", "all"],
          description: "Component name or 'all'",
        },
      },
      required: ["component"],
    },
  },
];
