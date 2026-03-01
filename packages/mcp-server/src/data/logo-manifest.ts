export interface LogoVariant {
  name: string;
  filename: string;
  format: "svg";
  theme: "light" | "dark";
  style: "full" | "icon";
  width?: number;
  height?: number;
  description: string;
}

export const logoManifest: LogoVariant[] = [
  {
    name: "BNB Logo Full (Light)",
    filename: "bnb-logo-full.svg",
    format: "svg",
    theme: "light",
    style: "full",
    description: "Full BNB Chain logo with text, for light backgrounds",
  },
  {
    name: "BNB Logo Icon (Light)",
    filename: "bnb-logo-icon.svg",
    format: "svg",
    theme: "light",
    style: "icon",
    width: 64,
    height: 64,
    description: "BNB Chain icon only, for light backgrounds",
  },
  {
    name: "BNB Logo Full (Dark)",
    filename: "bnb-logo-full-dark.svg",
    format: "svg",
    theme: "dark",
    style: "full",
    description: "Full BNB Chain logo with text, for dark backgrounds",
  },
  {
    name: "BNB Logo Icon (Dark)",
    filename: "bnb-logo-icon-dark.svg",
    format: "svg",
    theme: "dark",
    style: "icon",
    width: 64,
    height: 64,
    description: "BNB Chain icon only, for dark backgrounds",
  },
];

export const logoUsageGuidelines = `
## BNB Chain Logo Usage Guidelines

### Do's
- Use official logo files from the brand kit
- Maintain adequate clear space around the logo
- Use the appropriate color variant for your background (light/dark)
- Keep the logo at a readable size (minimum 24px for icon, 100px for full)

### Don'ts
- Don't alter the logo colors or proportions
- Don't place the logo on busy or low-contrast backgrounds
- Don't add effects (shadows, gradients, outlines) to the logo
- Don't rotate or distort the logo

### Recommended Sizes
- Favicon: 32x32px (icon variant)
- Navigation: 24-32px height (icon) or 100-120px width (full)
- Hero section: 48-64px height (icon) or 200-300px width (full)
- Footer: 24px height (icon) or 100px width (full)
`;
