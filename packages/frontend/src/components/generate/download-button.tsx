"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { createProjectZip, downloadBlob } from "@/lib/zip";
import type { GeneratedFile } from "@/hooks/use-generation";

interface DownloadButtonProps {
  files: GeneratedFile[];
}

export function DownloadButton({ files }: DownloadButtonProps) {
  const handleDownload = async () => {
    const blob = await createProjectZip(files);
    downloadBlob(blob, "bnb-project.zip");
  };

  return (
    <Button
      onClick={handleDownload}
      className="gap-2 download-glow text-bnb-black font-semibold border-0 group"
      disabled={files.length === 0}
    >
      <Download className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
      Download Project ({files.length} files)
    </Button>
  );
}
