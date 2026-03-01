import Anthropic from "@anthropic-ai/sdk";
import { toolDefinitions } from "@/lib/tools";
import { executeTool } from "@/lib/tool-executor";
import { encodeSSE } from "@/lib/stream-protocol";
import type { StreamEvent } from "@/lib/stream-protocol";

const SYSTEM_PROMPT = `You are a BNB Chain project generator. You create polished, brand-consistent web pages and smart contracts for BNB Chain projects.

## MANDATORY WORKFLOW — follow these steps IN ORDER:

Step 1: Call get_design_template with the appropriate type:
  - "token" for any BEP20 token project
  - "nft" for any NFT / BEP721 project
  - "dashboard" for any dApp with a dashboard UI
  - "landing" for any other project type
  This returns a complete HTML reference template. You MUST base your output on this template.

Step 2: If the project involves a smart contract, call get_contract_template to get the Solidity code.

Step 3: Generate output files using this exact format:
  ---FILE: path/to/file.ext---
  file content here
  ---END FILE---

## OUTPUT RULES:

1. The MAIN output must be a standalone HTML file (index.html) based on the design template.
   - Use the Tailwind CDN and Google Fonts links from the template (already included).
   - Keep the BNB logo SVG in the navbar exactly as provided in the template.
   - Keep the design system: #F0B90B yellow, #1E2329 dark text, #707A8A secondary, #FAFAFA background.
   - Keep Space Grotesk for headings, Inter for body text.
   - Light mode only — do NOT add dark mode.

2. Replace ALL {{PLACEHOLDER}} values in the template with real content based on the user's request.
   - Invent reasonable placeholder data (token supply, price, stats) if the user didn't specify.
   - Write compelling copy that matches the project's purpose.

3. You may customize the template:
   - Add, remove, or reorder sections to fit the project.
   - Add new cards, stats, or content using the same styling patterns from the template.
   - Change section headings and descriptions.
   - But do NOT change the core design system (colors, fonts, card styles, navbar structure).

4. For smart contract projects, also output the .sol file and hardhat config files.

5. Every file must be complete and production-ready. No TODOs, no placeholders left unfilled.

## DO NOT:
- Create React/TSX/JSX files — always output standalone HTML with Tailwind CDN
- Invent your own color scheme — use the template's BNB brand colors
- Remove the BNB logo from the navbar
- Add dark mode
- Leave any {{PLACEHOLDER}} values in the final output
- Call get_brand_colors or get_logo or get_ui_component — the design template already includes everything needed`;

export async function POST(request: Request) {
  const { prompt, apiKey, maxTokens: userMaxTokens } = await request.json();
  const ALLOWED_MAX_TOKENS = [4096, 8192, 16384, 32768];
  const maxTokens = ALLOWED_MAX_TOKENS.includes(userMaxTokens) ? userMaxTokens : 16384;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!prompt) {
    return new Response(JSON.stringify({ error: "Prompt is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  let totalTools = 0;

  const stream = new ReadableStream({
    async start(controller) {
      function emit(event: StreamEvent) {
        controller.enqueue(encoder.encode(encodeSSE(event)));
      }

      try {
        const client = new Anthropic({ apiKey });
        const messages: Anthropic.MessageParam[] = [
          { role: "user", content: prompt },
        ];

        let continueLoop = true;

        while (continueLoop) {
          const response = await client.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: maxTokens,
            system: SYSTEM_PROMPT,
            tools: toolDefinitions,
            messages,
          });

          // Process content blocks
          const assistantContent: Anthropic.ContentBlock[] = [];
          const toolResults: Anthropic.ToolResultBlockParam[] = [];

          for (const block of response.content) {
            assistantContent.push(block);

            if (block.type === "text") {
              // Parse files from text
              const files = parseFiles(block.text);
              for (const file of files) {
                emit({
                  type: "file",
                  data: {
                    path: file.path,
                    content: file.content,
                    language: detectLang(file.path),
                  },
                });
              }

              // Emit remaining text (without file blocks)
              const cleanText = block.text
                .replace(/---FILE:.*?---END FILE---/gs, "")
                .trim();
              if (cleanText) {
                emit({ type: "text", data: { content: cleanText } });
              }
            }

            if (block.type === "tool_use") {
              totalTools++;
              emit({
                type: "tool_call",
                data: {
                  id: block.id,
                  name: block.name,
                  input: block.input as Record<string, unknown>,
                },
              });

              // Execute tool
              const result = executeTool(
                block.name,
                block.input as Record<string, unknown>
              );

              emit({
                type: "tool_result",
                data: { id: block.id, name: block.name, result },
              });

              toolResults.push({
                type: "tool_result",
                tool_use_id: block.id,
                content: result,
              });
            }
          }

          // Add assistant message
          messages.push({ role: "assistant", content: assistantContent });

          // If there were tool uses, add results and continue
          if (toolResults.length > 0) {
            messages.push({ role: "user", content: toolResults });
          }

          // Stop if no more tool use
          if (response.stop_reason !== "tool_use") {
            continueLoop = false;
          }
        }

        // Count files from all text blocks
        let totalFiles = 0;
        for (const msg of messages) {
          if (msg.role === "assistant" && Array.isArray(msg.content)) {
            for (const block of msg.content) {
              if (typeof block === "object" && "type" in block && block.type === "text" && "text" in block) {
                totalFiles += parseFiles(block.text as string).length;
              }
            }
          }
        }

        emit({
          type: "complete",
          data: { totalFiles, totalTools },
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "An unexpected error occurred";
        emit({ type: "error", data: { message } });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

interface ParsedFile {
  path: string;
  content: string;
}

function parseFiles(text: string): ParsedFile[] {
  const files: ParsedFile[] = [];
  const regex = /---FILE:\s*(.+?)---\n([\s\S]*?)---END FILE---/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    files.push({
      path: match[1].trim(),
      content: match[2].trim(),
    });
  }

  return files;
}

function detectLang(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "tsx",
    js: "javascript",
    jsx: "jsx",
    sol: "solidity",
    css: "css",
    json: "json",
    md: "markdown",
    html: "html",
    svg: "xml",
    toml: "toml",
    yaml: "yaml",
    env: "bash",
  };
  return map[ext] || "text";
}
