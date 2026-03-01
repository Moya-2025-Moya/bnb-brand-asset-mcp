export type SSEEventType =
  | "tool_call"
  | "tool_result"
  | "text"
  | "file"
  | "error"
  | "complete";

export interface SSEEvent {
  type: SSEEventType;
  data: Record<string, unknown>;
}

export interface ToolCallEvent {
  type: "tool_call";
  data: {
    id: string;
    name: string;
    input: Record<string, unknown>;
  };
}

export interface ToolResultEvent {
  type: "tool_result";
  data: {
    id: string;
    name: string;
    result: string;
  };
}

export interface TextEvent {
  type: "text";
  data: {
    content: string;
  };
}

export interface FileEvent {
  type: "file";
  data: {
    path: string;
    content: string;
    language: string;
  };
}

export interface ErrorEvent {
  type: "error";
  data: {
    message: string;
  };
}

export interface CompleteEvent {
  type: "complete";
  data: {
    totalFiles: number;
    totalTools: number;
  };
}

export type StreamEvent =
  | ToolCallEvent
  | ToolResultEvent
  | TextEvent
  | FileEvent
  | ErrorEvent
  | CompleteEvent;

export function encodeSSE(event: StreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export function decodeSSE(line: string): StreamEvent | null {
  if (!line.startsWith("data: ")) return null;
  try {
    return JSON.parse(line.slice(6)) as StreamEvent;
  } catch {
    return null;
  }
}
