import Anthropic from "@anthropic-ai/sdk";
import { toolDefinitions } from "@/lib/tools";
import { executeTool } from "@/lib/tool-executor";
import { encodeSSE } from "@/lib/stream-protocol";
import type { StreamEvent } from "@/lib/stream-protocol";

const SYSTEM_PROMPT = `You are a BNB Chain development assistant. You help developers build branded BNB Chain applications.

You have access to official BNB Chain brand assets through these tools:
- get_brand_colors: Official color palette, CSS variables, Tailwind config, typography
- get_logo: Official logo files (SVG) and usage guidelines
- get_contract_template: Production-ready BEP20/BEP721 Solidity contracts with Hardhat config
- get_ui_component: Branded React components (ConnectWallet, NetworkSwitcher)

IMPORTANT INSTRUCTIONS:
1. ALWAYS use the brand tools to get official assets. Never make up colors or styles.
2. Call get_brand_colors first to get the design system, then other tools as needed.
3. When generating a project, output ALL files using this exact format:

---FILE: path/to/file.ext---
file content here
---END FILE---

4. Generate complete, production-ready files. Every file should be usable as-is.
5. Use the official BNB Chain brand colors (#F0B90B yellow, #181A20 dark) consistently.
6. Always include dark mode support using CSS variables.
7. Use Space Grotesk for headings and Inter for body text.
8. For contract projects, include hardhat.config.ts, package.json, and a deploy script.
9. For frontend projects, include all necessary config files (tsconfig, tailwind, etc).

Focus on creating polished, branded output that follows BNB Chain design guidelines.`;

export async function POST(request: Request) {
  const { prompt, apiKey } = await request.json();

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
            max_tokens: 8096,
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
