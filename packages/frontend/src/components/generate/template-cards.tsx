"use client";

import { Card, CardContent } from "@/components/ui/card";
import { promptTemplates } from "@/lib/templates";
import { Coins, Image, Layout, Boxes } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  coins: Coins,
  image: Image,
  layout: Layout,
  boxes: Boxes,
};

interface TemplateCardsProps {
  onSelect: (prompt: string) => void;
}

export function TemplateCards({ onSelect }: TemplateCardsProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Quick templates</label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {promptTemplates.map((template) => {
          const Icon = iconMap[template.icon] || Boxes;
          return (
            <Card
              key={template.id}
              className="cursor-pointer card-shine transition-all duration-200 hover:border-primary/30"
              onClick={() => onSelect(template.prompt)}
            >
              <CardContent className="p-3">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{template.title}</p>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
