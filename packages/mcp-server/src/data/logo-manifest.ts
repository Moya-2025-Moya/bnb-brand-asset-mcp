export interface LogoVariant {
  name: string;
  filename: string;
  format: "svg";
  theme: "light" | "dark";
  style: "full" | "icon";
  width?: number;
  height?: number;
  description: string;
  svgContent: string;
}

const SVG_LOGO_FULL_LIGHT = `<svg width="300" height="80" viewBox="0 0 300 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <svg x="0" y="0" width="80" height="80" viewBox="0 0 96 96">
    <circle cx="48" cy="48" r="48" fill="#F0B90B"/>
    <path d="M34.5355 42.4676L48.0002 29.0032L61.4717 42.4747L69.3063 34.6397L48.0002 13.3333L26.7007 34.6328L34.5355 42.4676Z" fill="white"/>
    <path d="M21.1683 40.1646L29.003 47.9993L21.1679 55.8344L13.3333 47.9997L21.1683 40.1646Z" fill="white"/>
    <path d="M34.5355 53.5322L48.0002 66.9962L61.4714 53.5254L69.3105 61.3562L69.3063 61.3602L48.0002 82.6666L26.7004 61.3672L26.6895 61.3564L34.5355 53.5322Z" fill="white"/>
    <path d="M82.6674 48.0007L74.8327 55.8353L66.9981 48.0007L74.8327 40.166L82.6674 48.0007Z" fill="white"/>
    <path d="M55.9466 47.996H55.9502L47.9999 40.0456L40.0457 47.9998L40.0565 48.0109L47.9999 55.9543L55.9539 47.9998L55.9466 47.996Z" fill="white"/>
  </svg>
  <text x="96" y="48" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="28" fill="#1E2329">BNB Chain</text>
</svg>`;

const SVG_LOGO_FULL_DARK = `<svg width="300" height="80" viewBox="0 0 300 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <svg x="0" y="0" width="80" height="80" viewBox="0 0 96 96">
    <circle cx="48" cy="48" r="48" fill="#FCD535"/>
    <path d="M34.5355 42.4676L48.0002 29.0032L61.4717 42.4747L69.3063 34.6397L48.0002 13.3333L26.7007 34.6328L34.5355 42.4676Z" fill="#181A20"/>
    <path d="M21.1683 40.1646L29.003 47.9993L21.1679 55.8344L13.3333 47.9997L21.1683 40.1646Z" fill="#181A20"/>
    <path d="M34.5355 53.5322L48.0002 66.9962L61.4714 53.5254L69.3105 61.3562L69.3063 61.3602L48.0002 82.6666L26.7004 61.3672L26.6895 61.3564L34.5355 53.5322Z" fill="#181A20"/>
    <path d="M82.6674 48.0007L74.8327 55.8353L66.9981 48.0007L74.8327 40.166L82.6674 48.0007Z" fill="#181A20"/>
    <path d="M55.9466 47.996H55.9502L47.9999 40.0456L40.0457 47.9998L40.0565 48.0109L47.9999 55.9543L55.9539 47.9998L55.9466 47.996Z" fill="#181A20"/>
  </svg>
  <text x="96" y="48" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="28" fill="#EAECEF">BNB Chain</text>
</svg>`;

const SVG_LOGO_ICON_LIGHT = `<svg width="64" height="64" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="48" cy="48" r="48" fill="#F0B90B"/>
  <path d="M34.5355 42.4676L48.0002 29.0032L61.4717 42.4747L69.3063 34.6397L48.0002 13.3333L26.7007 34.6328L34.5355 42.4676Z" fill="white"/>
  <path d="M21.1683 40.1646L29.003 47.9993L21.1679 55.8344L13.3333 47.9997L21.1683 40.1646Z" fill="white"/>
  <path d="M34.5355 53.5322L48.0002 66.9962L61.4714 53.5254L69.3105 61.3562L69.3063 61.3602L48.0002 82.6666L26.7004 61.3672L26.6895 61.3564L34.5355 53.5322Z" fill="white"/>
  <path d="M82.6674 48.0007L74.8327 55.8353L66.9981 48.0007L74.8327 40.166L82.6674 48.0007Z" fill="white"/>
  <path d="M55.9466 47.996H55.9502L47.9999 40.0456L40.0457 47.9998L40.0565 48.0109L47.9999 55.9543L55.9539 47.9998L55.9466 47.996Z" fill="white"/>
</svg>`;

const SVG_LOGO_ICON_DARK = `<svg width="64" height="64" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="48" cy="48" r="48" fill="#FCD535"/>
  <path d="M34.5355 42.4676L48.0002 29.0032L61.4717 42.4747L69.3063 34.6397L48.0002 13.3333L26.7007 34.6328L34.5355 42.4676Z" fill="#181A20"/>
  <path d="M21.1683 40.1646L29.003 47.9993L21.1679 55.8344L13.3333 47.9997L21.1683 40.1646Z" fill="#181A20"/>
  <path d="M34.5355 53.5322L48.0002 66.9962L61.4714 53.5254L69.3105 61.3562L69.3063 61.3602L48.0002 82.6666L26.7004 61.3672L26.6895 61.3564L34.5355 53.5322Z" fill="#181A20"/>
  <path d="M82.6674 48.0007L74.8327 55.8353L66.9981 48.0007L74.8327 40.166L82.6674 48.0007Z" fill="#181A20"/>
  <path d="M55.9466 47.996H55.9502L47.9999 40.0456L40.0457 47.9998L40.0565 48.0109L47.9999 55.9543L55.9539 47.9998L55.9466 47.996Z" fill="#181A20"/>
</svg>`;

export const logoManifest: LogoVariant[] = [
  {
    name: "BNB Logo Full (Light)",
    filename: "bnb-logo-full.svg",
    format: "svg",
    theme: "light",
    style: "full",
    description: "Full BNB Chain logo with text, for light backgrounds",
    svgContent: SVG_LOGO_FULL_LIGHT,
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
    svgContent: SVG_LOGO_ICON_LIGHT,
  },
  {
    name: "BNB Logo Full (Dark)",
    filename: "bnb-logo-full-dark.svg",
    format: "svg",
    theme: "dark",
    style: "full",
    description: "Full BNB Chain logo with text, for dark backgrounds",
    svgContent: SVG_LOGO_FULL_DARK,
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
    svgContent: SVG_LOGO_ICON_DARK,
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
