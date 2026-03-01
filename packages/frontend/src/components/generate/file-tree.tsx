"use client";

import { File, Folder, FolderOpen } from "lucide-react";
import { useState } from "react";

interface FileTreeProps {
  files: { path: string; content: string }[];
  onSelect: (path: string) => void;
  selectedPath: string | null;
}

interface TreeNode {
  name: string;
  path: string;
  isFile: boolean;
  children: TreeNode[];
}

function buildTree(paths: string[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const path of paths) {
    const parts = path.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      const isFile = i === parts.length - 1;
      const fullPath = parts.slice(0, i + 1).join("/");

      let node = current.find((n) => n.name === name);
      if (!node) {
        node = { name, path: fullPath, isFile, children: [] };
        current.push(node);
      }
      current = node.children;
    }
  }

  return root;
}

function getFileIconColor(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "tsx":
    case "ts":
      return "text-blue-400";
    case "sol":
      return "text-purple-400";
    case "css":
      return "text-pink-400";
    case "json":
      return "text-yellow-400";
    case "md":
      return "text-gray-400";
    case "js":
    case "jsx":
      return "text-yellow-300";
    default:
      return "text-muted-foreground";
  }
}

function TreeItem({
  node,
  onSelect,
  selectedPath,
  depth = 0,
}: {
  node: TreeNode;
  onSelect: (path: string) => void;
  selectedPath: string | null;
  depth?: number;
}) {
  const [open, setOpen] = useState(true);
  const isSelected = node.path === selectedPath;

  if (node.isFile) {
    return (
      <button
        onClick={() => onSelect(node.path)}
        className={`flex items-center gap-1.5 w-full text-left px-2 py-1 text-sm rounded hover:bg-muted/50 transition-colors animate-in fade-in duration-300 fill-mode-both ${
          isSelected ? "bg-primary/10 text-primary" : "text-muted-foreground"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <File className={`h-3.5 w-3.5 shrink-0 ${getFileIconColor(node.name)}`} />
        <span className="truncate font-mono text-xs">{node.name}</span>
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 w-full text-left px-2 py-1 text-sm text-muted-foreground rounded hover:bg-muted/50 transition-colors"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {open ? (
          <FolderOpen className="h-3.5 w-3.5 shrink-0 text-primary" />
        ) : (
          <Folder className="h-3.5 w-3.5 shrink-0 text-primary" />
        )}
        <span className="truncate font-mono text-xs font-medium">{node.name}</span>
      </button>
      {open &&
        node.children.map((child) => (
          <TreeItem
            key={child.path}
            node={child}
            onSelect={onSelect}
            selectedPath={selectedPath}
            depth={depth + 1}
          />
        ))}
    </div>
  );
}

export function FileTree({ files, onSelect, selectedPath }: FileTreeProps) {
  const tree = buildTree(files.map((f) => f.path));

  return (
    <div className="space-y-0.5">
      {tree.map((node) => (
        <TreeItem
          key={node.path}
          node={node}
          onSelect={onSelect}
          selectedPath={selectedPath}
        />
      ))}
    </div>
  );
}
