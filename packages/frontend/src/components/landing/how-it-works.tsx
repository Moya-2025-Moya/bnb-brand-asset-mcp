import { Badge } from "@/components/ui/badge";

const steps = [
  {
    step: "1",
    title: "Install the MCP Server",
    description: "Add bnb-dev-suite to your Claude Desktop config or use npx directly.",
    code: `"bnb-dev-suite": {
  "command": "npx",
  "args": ["-y", "bnb-dev-suite"]
}`,
  },
  {
    step: "2",
    title: "Describe Your Project",
    description: "Tell Claude what you want to build. It automatically uses the brand tools.",
    code: `"Build me a BEP20 token called
GoldCoin with a branded landing page
and wallet connection"`,
  },
  {
    step: "3",
    title: "Get Complete Project",
    description: "Receive production-ready code with proper BNB Chain branding, contracts, and UI.",
    code: `✓ Brand colors & CSS variables
✓ Smart contract (Hardhat ready)
✓ React components with wallet
✓ Tailwind config & dark mode`,
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 bg-muted/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            From zero to branded BNB Chain project in three steps
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {steps.map((step) => (
            <div key={step.step} className="relative">
              <Badge className="mb-4 text-sm px-3 py-1">Step {step.step}</Badge>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground mb-4">{step.description}</p>
              <div className="rounded-lg border bg-card p-4">
                <pre className="text-sm font-mono text-muted-foreground whitespace-pre-wrap">
                  {step.code}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
