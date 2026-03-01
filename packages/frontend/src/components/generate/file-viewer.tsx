"use client";

import { Eye, Code2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/generate/code-block";
import { PreviewPanel } from "@/components/generate/preview-panel";

interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

interface FileViewerProps {
  file: GeneratedFile | null;
  allFiles: GeneratedFile[];
}

export function FileViewer({ file, allFiles }: FileViewerProps) {
  return (
    <Tabs defaultValue="preview">
      <TabsList>
        <TabsTrigger value="preview" className="gap-1.5">
          <Eye className="h-3.5 w-3.5" />
          Preview
        </TabsTrigger>
        <TabsTrigger value="code" className="gap-1.5">
          <Code2 className="h-3.5 w-3.5" />
          Code
        </TabsTrigger>
      </TabsList>

      <TabsContent value="preview" className="tab-crossfade-enter">
        <PreviewPanel file={file} allFiles={allFiles} />
      </TabsContent>

      <TabsContent value="code" className="tab-crossfade-enter">
        {file ? (
          <CodeBlock
            code={file.content}
            language={file.language}
            filename={file.path}
          />
        ) : (
          <div className="rounded-lg border bg-muted/20 flex items-center justify-center min-h-[400px]">
            <p className="text-sm text-muted-foreground">
              Select a file to view code
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
