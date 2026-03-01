"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const steps = [
  {
    step: "1",
    title: "Install the MCP Server",
    description: "Add bnb-dev-suite to your Claude Desktop config or use npx directly.",
    code: [
      { type: "key", text: '"bnb-dev-suite"' },
      { type: "plain", text: ": {\n  " },
      { type: "key", text: '"command"' },
      { type: "plain", text: ": " },
      { type: "string", text: '"npx"' },
      { type: "plain", text: ",\n  " },
      { type: "key", text: '"args"' },
      { type: "plain", text: ": [" },
      { type: "string", text: '"-y"' },
      { type: "plain", text: ", " },
      { type: "string", text: '"bnb-dev-suite"' },
      { type: "plain", text: "]\n}" },
    ],
  },
  {
    step: "2",
    title: "Describe Your Project",
    description: "Tell Claude what you want to build. It automatically uses the brand tools.",
    code: [
      { type: "string", text: '"Build me a BEP20 token called\nGoldCoin with a branded landing page\nand wallet connection"' },
    ],
  },
  {
    step: "3",
    title: "Get Complete Project",
    description: "Receive production-ready code with proper BNB Chain branding, contracts, and UI.",
    code: [
      { type: "success", text: "✓" },
      { type: "plain", text: " Brand colors & CSS variables\n" },
      { type: "success", text: "✓" },
      { type: "plain", text: " Smart contract (Hardhat ready)\n" },
      { type: "success", text: "✓" },
      { type: "plain", text: " React components with wallet\n" },
      { type: "success", text: "✓" },
      { type: "plain", text: " Tailwind config & dark mode" },
    ],
  },
];

function StepItem({ step, index }: { step: typeof steps[0]; index: number }) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`relative scroll-reveal step-connector${isVisible ? " visible" : ""}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg mb-4 step-number-pulse">
        {step.step}
      </div>
      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
      <p className="text-muted-foreground mb-4">{step.description}</p>
      <div className="rounded-lg border bg-card p-4">
        <pre className="text-sm font-mono whitespace-pre-wrap">
          {step.code.map((segment, i) => {
            let className = "text-muted-foreground";
            if (segment.type === "key") className = "text-yellow-400";
            else if (segment.type === "string") className = "text-green-400";
            else if (segment.type === "success") className = "text-bnb-success";
            return (
              <span key={i} className={className}>
                {segment.text}
              </span>
            );
          })}
        </pre>
      </div>
    </div>
  );
}

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
          {steps.map((step, index) => (
            <StepItem key={step.step} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
