"use client";

import { useMemo } from "react";
import { Eye } from "lucide-react";
import {
  getFileExtension,
  buildHtmlPreview,
  buildSolidityPreview,
  buildMarkdownPreview,
  buildJsonPreview,
  buildCssPreview,
  buildProjectOverview,
} from "@/lib/preview-builders";

interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

interface PreviewPanelProps {
  file: GeneratedFile | null;
  allFiles: GeneratedFile[];
}

export function PreviewPanel({
  file,
  allFiles,
  isLoading,
}: PreviewPanelProps & { isLoading?: boolean }) {
  const previewHtml = useMemo(() => {
    if (!file) {
      if (allFiles.length === 0) return null;
      return buildProjectOverview(allFiles);
    }

    const ext = getFileExtension(file.path);

    switch (ext) {
      case "html":
      case "htm":
        return buildHtmlPreview(file.content);
      case "css":
        return buildCssPreview(file.content, file.path);
      case "sol":
        return buildSolidityPreview(file.content, file.path);
      case "md":
      case "mdx":
        return buildMarkdownPreview(file.content);
      case "json":
        return buildJsonPreview(file.content, file.path);
      default:
        // TSX/JSX and other files: show project overview instead of broken conversion
        if (allFiles.length > 0) return buildProjectOverview(allFiles);
        return null;
    }
  }, [file, allFiles]);

  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-[#181A20] p-8 space-y-5 overflow-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] animate-pulse" />
          <div className="space-y-2.5 flex-1">
            <div className="h-5 w-40 bg-white/[0.03] rounded-lg animate-pulse" />
            <div className="flex gap-2">
              <div className="h-4 w-16 bg-white/[0.03] rounded-full animate-pulse" />
              <div className="h-4 w-20 bg-white/[0.03] rounded-full animate-pulse" />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-16 bg-white/[0.02] rounded-xl animate-pulse" />
          <div className="h-16 bg-white/[0.02] rounded-xl animate-pulse" style={{ animationDelay: "150ms" }} />
          <div className="h-16 bg-white/[0.02] rounded-xl animate-pulse" style={{ animationDelay: "300ms" }} />
        </div>
        <div className="flex items-center justify-center pt-8">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F0B90B]/40 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-[#F0B90B]/40 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-[#F0B90B]/40 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            Building preview...
          </div>
        </div>
      </div>
    );
  }

  if (!previewHtml) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#181A20]">
        <div className="text-center space-y-3 p-8">
          <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center mx-auto">
            <Eye className="h-5 w-5 text-gray-600" />
          </div>
          <p className="text-sm text-gray-500">
            {file
              ? `No preview for .${getFileExtension(file.path)} files`
              : "Select a file to preview"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[#181A20]">
      <iframe
        srcDoc={previewHtml}
        sandbox="allow-scripts allow-same-origin"
        className="w-full h-full border-0"
        title="File preview"
        style={{ display: "block" }}
      />
    </div>
  );
}
