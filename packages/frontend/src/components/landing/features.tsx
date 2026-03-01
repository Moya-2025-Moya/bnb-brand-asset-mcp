"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, FileCode, Blocks, Image } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const features = [
  {
    icon: Palette,
    title: "Brand Colors",
    tool: "get_brand_colors",
    stat: "40+ colors",
    description:
      "Complete BNB Chain color palette with light/dark themes, CSS variables, and Tailwind config. Includes typography tokens.",
  },
  {
    icon: Image,
    title: "Logo Assets",
    tool: "get_logo",
    stat: "4 variants",
    description:
      "Official BNB Chain logos in SVG and PNG formats. Light and dark variants with usage guidelines.",
  },
  {
    icon: FileCode,
    title: "Contract Templates",
    tool: "get_contract_template",
    stat: "2 templates",
    description:
      "Production-ready BEP20 and BEP721 Solidity contracts based on OpenZeppelin. Includes Hardhat config for BNB Chain.",
  },
  {
    icon: Blocks,
    title: "UI Components",
    tool: "get_ui_component",
    stat: "2 components",
    description:
      "BNB Chain branded React components — ConnectWallet and NetworkSwitcher with MetaMask integration.",
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`scroll-reveal${isVisible ? " visible" : ""}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card className="card-shine gradient-border transition-all duration-200 hover:border-primary/30 group">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <feature.icon className="h-5 w-5 text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {feature.stat}
                </Badge>
              </div>
              <code className="text-xs text-muted-foreground">{feature.tool}</code>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{feature.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function Features() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold sm:text-4xl">4 Tools, Complete Brand Kit</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Everything you need to build branded BNB Chain applications
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feature, index) => (
            <FeatureCard key={feature.tool} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
