export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  prompt: string;
}

export const promptTemplates: PromptTemplate[] = [
  {
    id: "bep20-token",
    title: "BEP20 Token",
    description: "Fungible token with branded landing page",
    icon: "coins",
    prompt:
      'Create a complete BEP20 token project called "GoldCoin" (GLD) on BNB Chain. Include the smart contract with Hardhat config, a branded landing page with BNB Chain colors and dark mode, and a ConnectWallet component. Use the official BNB brand colors and typography.',
  },
  {
    id: "nft-collection",
    title: "NFT Collection",
    description: "BEP721 NFT with mint page",
    icon: "image",
    prompt:
      'Create a complete BEP721 NFT collection called "BNB Punks" (BNBP) on BNB Chain. Include the NFT smart contract with Hardhat config, a mint page with wallet connection, BNB Chain brand colors, and dark mode support. Show the collection info and minting UI.',
  },
  {
    id: "brand-landing",
    title: "Brand Landing",
    description: "BNB Chain branded website",
    icon: "layout",
    prompt:
      "Create a BNB Chain branded landing page for a DeFi project. Include hero section with gradient background, feature cards, how-it-works section, and footer. Use official BNB Chain brand colors, Space Grotesk font, and full dark mode support. Include the ConnectWallet and NetworkSwitcher components.",
  },
  {
    id: "full-dapp",
    title: "Full dApp",
    description: "Complete dApp with contract + frontend",
    icon: "boxes",
    prompt:
      'Build a complete BNB Chain dApp: a BEP20 token called "StarToken" (STAR) with a full branded frontend. Include the smart contract with Hardhat config, a Next.js frontend with BNB Chain brand colors, ConnectWallet, NetworkSwitcher, token info display, and transfer form. Full dark mode support.',
  },
];
