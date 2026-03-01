import JSZip from "jszip";

export interface GeneratedFile {
  path: string;
  content: string;
}

export async function createProjectZip(
  files: GeneratedFile[],
  projectName: string = "bnb-project"
): Promise<Blob> {
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.path, file.content);
  }

  return zip.generateAsync({ type: "blob" });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function detectLanguage(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() || "";
  const langMap: Record<string, string> = {
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
    yml: "yaml",
    env: "bash",
    gitignore: "bash",
  };
  return langMap[ext] || "text";
}
