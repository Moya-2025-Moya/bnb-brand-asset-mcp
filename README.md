# BNB Dev Suite

> Brand Asset MCP Server + AI Project Generator for BNB Chain

**[HACKATHON_NAME] Submission**

## What is this?

BNB Dev Suite fills the brand asset gap in the BNB Chain developer ecosystem. While `bnbchain-mcp` handles on-chain operations and `Ask AI MCP` covers documentation, **no tool existed for official brand assets**. This project provides:

1. **MCP Server** (`bnb-dev-suite`) — 4 tools delivering official BNB Chain brand colors, logos, contract templates, and UI components to any MCP-compatible AI assistant
2. **Frontend Demo** — A web app that uses Claude's agentic loop to generate complete branded BNB Chain projects in 30 seconds

## Quick Start

### Use the MCP Server with Claude Desktop

Add to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "bnb-dev-suite": {
      "command": "npx",
      "args": ["-y", "bnb-dev-suite"]
    }
  }
}
```

Then ask Claude: *"Create a BEP20 token with a branded landing page"*

### Run the Frontend Demo

```bash
git clone <this-repo>
cd bnb-brand-asset-mcp
npm install
npm run dev:frontend
```

Open `http://localhost:3000`, enter your Claude API key, and generate a project.

## MCP Tools

| Tool | Description |
|------|-------------|
| `get_brand_colors` | Official BNB Chain color palette, CSS variables, Tailwind config, typography |
| `get_logo` | Logo SVGs (light/dark, full/icon) with usage guidelines |
| `get_contract_template` | BEP20/BEP721 Solidity contracts with Hardhat config (OpenZeppelin) |
| `get_ui_component` | ConnectWallet & NetworkSwitcher React components |

## Architecture

```
bnb-brand-asset-mcp/              (monorepo, npm workspaces)
├── packages/
│   ├── mcp-server/               (npm: bnb-dev-suite)
│   │   ├── src/
│   │   │   ├── index.ts          (CLI entry, stdio transport)
│   │   │   ├── server.ts         (McpServer + tool registration)
│   │   │   ├── tools/            (4 tool modules)
│   │   │   ├── data/             (brand data layer)
│   │   │   └── assets/           (logo SVGs)
│   │   └── package.json
│   │
│   └── frontend/                 (Next.js 14, Vercel)
│       ├── src/
│       │   ├── app/              (pages + API route)
│       │   ├── components/       (landing + generate UI)
│       │   ├── hooks/            (SSE consumption, localStorage)
│       │   └── lib/              (tools, executor, templates, zip)
│       └── package.json
│
├── package.json                  (workspaces)
└── README.md
```

## Tech Stack

- **MCP Server**: TypeScript, `@modelcontextprotocol/sdk`, Zod
- **Frontend**: Next.js 14, shadcn/ui, Tailwind CSS, Shiki, JSZip
- **Contracts**: Solidity 0.8.20, OpenZeppelin v5, Hardhat
- **AI**: Claude API with manual agentic loop + SSE streaming

## How the Frontend Works

1. User enters a prompt (or picks a template) + their Claude API key
2. The API route creates an agentic loop: Claude calls brand tools → gets results → generates files
3. Tool execution is embedded server-side (imports MCP data directly, no separate process)
4. Events stream via SSE: tool calls, results, generated files, completion
5. Frontend shows real-time progress, file tree, syntax-highlighted code, and zip download

## Complementary to Official BNB Tools

| Layer | Tool | Purpose |
|-------|------|---------|
| On-chain | `bnbchain-mcp` | Blockchain operations, queries |
| Documentation | `Ask AI MCP` | BNB Chain docs Q&A |
| **Brand Assets** | **`bnb-dev-suite`** | **Brand colors, logos, templates, UI** |

## License

MIT
