import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, FileCode, Blocks, Image } from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Brand Colors",
    tool: "get_brand_colors",
    description:
      "Complete BNB Chain color palette with light/dark themes, CSS variables, and Tailwind config. Includes typography tokens.",
  },
  {
    icon: Image,
    title: "Logo Assets",
    tool: "get_logo",
    description:
      "Official BNB Chain logos in SVG and PNG formats. Light and dark variants with usage guidelines.",
  },
  {
    icon: FileCode,
    title: "Contract Templates",
    tool: "get_contract_template",
    description:
      "Production-ready BEP20 and BEP721 Solidity contracts based on OpenZeppelin. Includes Hardhat config for BNB Chain.",
  },
  {
    icon: Blocks,
    title: "UI Components",
    tool: "get_ui_component",
    description:
      "BNB Chain branded React components — ConnectWallet and NetworkSwitcher with MetaMask integration.",
  },
];

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
          {features.map((feature) => (
            <Card key={feature.tool} className="card-shine transition-all duration-200 hover:border-primary/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <code className="text-xs text-muted-foreground">{feature.tool}</code>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
