import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { contractTemplates, hardhatConfig, hardhatPackageJson } from "../data/contract-templates.js";

export function registerGetContractTemplate(server: McpServer) {
  server.tool(
    "get_contract_template",
    `Returns production-ready BNB Chain smart contract code (BEP20 or BEP721) with Hardhat project setup. The returned Solidity code MUST be saved as a .sol file in the project. Always include the Hardhat config so the user can compile and deploy immediately. Contracts use OpenZeppelin v5 and target BNB Smart Chain (BSC).`,
    {
      type: z
        .enum(["BEP20", "BEP721"])
        .describe("Contract type: 'BEP20' for fungible tokens, 'BEP721' for NFT collections"),
      tokenName: z.string().optional().describe("Token/collection name (e.g., 'My BNB Token')"),
      tokenSymbol: z.string().optional().describe("Token symbol (e.g., 'MBT')"),
      includeHardhat: z
        .boolean()
        .optional()
        .default(true)
        .describe("Include Hardhat project configuration"),
    },
    async ({ type, tokenName, tokenSymbol, includeHardhat }) => {
      const template = contractTemplates[type];
      if (!template) {
        return {
          content: [{ type: "text" as const, text: `Unknown contract type: ${type}. Available: BEP20, BEP721` }],
          isError: true,
        };
      }

      let solidity = template.solidity;

      // Apply customizations
      if (type === "BEP20") {
        if (tokenName) {
          solidity = solidity.replace(/\{\{TOKEN_NAME\}\}/g, tokenName);
          const pascal = tokenName.replace(/[^a-zA-Z0-9]/g, "");
          solidity = solidity.replace(/\{\{TOKEN_NAME_PASCAL\}\}/g, pascal);
        }
        if (tokenSymbol) {
          solidity = solidity.replace(/\{\{TOKEN_SYMBOL\}\}/g, tokenSymbol);
        }
      } else if (type === "BEP721") {
        if (tokenName) {
          solidity = solidity.replace(/\{\{COLLECTION_NAME\}\}/g, tokenName);
          const pascal = tokenName.replace(/[^a-zA-Z0-9]/g, "");
          solidity = solidity.replace(/\{\{COLLECTION_NAME_PASCAL\}\}/g, pascal);
        }
        if (tokenSymbol) {
          solidity = solidity.replace(/\{\{COLLECTION_SYMBOL\}\}/g, tokenSymbol);
        }
      }

      const sections: string[] = [];
      sections.push(`# ${template.name} Template\n`);
      sections.push("## INSTRUCTIONS");
      sections.push(`1. Save the Solidity contract below as \`contracts/${type === "BEP20" ? (tokenName ? tokenName.replace(/[^a-zA-Z0-9]/g, "") : "MyToken") : (tokenName ? tokenName.replace(/[^a-zA-Z0-9]/g, "") : "MyNFT")}.sol\``);
      sections.push("2. Replace ALL placeholder values ({{...}}) with the user's actual token/collection details");
      sections.push("3. Save hardhat.config.ts and package.json at the project root");
      sections.push("4. Create a `.env` file with `PRIVATE_KEY=your_private_key_here` (remind user to NEVER commit this)");
      sections.push("5. Create a deploy script at `scripts/deploy.ts`");
      sections.push("6. Target BNB Smart Chain — testnet (chainId 97) for development, mainnet (chainId 56) for production\n");

      sections.push(`${template.description}\n`);
      sections.push("## Solidity Contract\n");
      sections.push("```solidity\n" + solidity + "\n```\n");

      sections.push("## Placeholders to Customize\n");
      for (const [placeholder, defaultValue] of Object.entries(template.placeholders)) {
        sections.push(`- \`${placeholder}\` → default: \`${defaultValue}\``);
      }
      sections.push("");

      if (includeHardhat) {
        sections.push("## Hardhat Configuration\n");
        sections.push("### hardhat.config.ts — save at project root\n```typescript\n" + hardhatConfig + "\n```\n");
        sections.push("### package.json — save at project root\n```json\n" + hardhatPackageJson + "\n```\n");
        sections.push("### Setup Instructions\n");
        sections.push("```bash\nnpm install\nnpx hardhat compile\nnpx hardhat test\n```\n");
      }

      return {
        content: [{ type: "text", text: sections.join("\n") }],
      };
    }
  );
}
