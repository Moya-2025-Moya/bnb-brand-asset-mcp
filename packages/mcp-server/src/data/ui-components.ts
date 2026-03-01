export interface UIComponent {
  name: string;
  description: string;
  framework: string;
  dependencies: string[];
  code: string;
}

export const uiComponents: Record<string, UIComponent> = {
  ConnectWallet: {
    name: "ConnectWallet",
    description:
      "BNB Chain branded wallet connection button with MetaMask support, connection state management, and address display.",
    framework: "React + TypeScript",
    dependencies: ["ethers"],
    code: `"use client";

import { useState, useCallback } from "react";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

const BSC_CHAIN_ID = "0x38"; // 56 in hex
const BSC_TESTNET_CHAIN_ID = "0x61"; // 97 in hex

interface ConnectWalletProps {
  testnet?: boolean;
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
  className?: string;
}

export function ConnectWallet({
  testnet = false,
  onConnect,
  onDisconnect,
  className = "",
}: ConnectWalletProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetChainId = testnet ? BSC_TESTNET_CHAIN_ID : BSC_CHAIN_ID;
  const networkName = testnet ? "BNB Testnet" : "BNB Chain";

  const switchToBSC = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: targetChainId }],
      });
    } catch (switchError: unknown) {
      const err = switchError as { code: number };
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: targetChainId,
              chainName: networkName,
              nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
              rpcUrls: testnet
                ? ["https://data-seed-prebsc-1-s1.bnbchain.org:8545"]
                : ["https://bsc-dataseed.bnbchain.org/"],
              blockExplorerUrls: testnet
                ? ["https://testnet.bscscan.com"]
                : ["https://bscscan.com"],
            },
          ],
        });
      }
    }
  }, [targetChainId, networkName, testnet]);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask");
      return;
    }
    setConnecting(true);
    setError(null);
    try {
      await switchToBSC();
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      if (accounts[0]) {
        setAddress(accounts[0]);
        onConnect?.(accounts[0]);
      }
    } catch {
      setError("Connection failed");
    } finally {
      setConnecting(false);
    }
  }, [switchToBSC, onConnect]);

  const disconnect = useCallback(() => {
    setAddress(null);
    onDisconnect?.();
  }, [onDisconnect]);

  const shortAddress = address
    ? \`\${address.slice(0, 6)}...\${address.slice(-4)}\`
    : null;

  return (
    <div className={className}>
      {error && (
        <p style={{ color: "var(--bnb-error, #F6465D)", fontSize: 14, marginBottom: 8 }}>
          {error}
        </p>
      )}
      {address ? (
        <button
          onClick={disconnect}
          style={{
            background: "var(--bnb-bg-tertiary, #F5F5F5)",
            color: "var(--bnb-text-primary, #1E2329)",
            border: "1px solid var(--bnb-border-primary, #EAECEF)",
            borderRadius: 8,
            padding: "10px 20px",
            fontSize: 14,
            fontFamily: "var(--bnb-font-mono, monospace)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--bnb-success, #0ECB81)",
            }}
          />
          {shortAddress}
        </button>
      ) : (
        <button
          onClick={connect}
          disabled={connecting}
          style={{
            background: "var(--bnb-yellow, #F0B90B)",
            color: "var(--bnb-black, #181A20)",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "var(--bnb-font-heading, 'Space Grotesk', sans-serif)",
            cursor: connecting ? "wait" : "pointer",
            opacity: connecting ? 0.7 : 1,
            transition: "all 0.2s",
          }}
        >
          {connecting ? "Connecting..." : \`Connect to \${networkName}\`}
        </button>
      )}
    </div>
  );
}`,
  },
  NetworkSwitcher: {
    name: "NetworkSwitcher",
    description:
      "BNB Chain network switcher component supporting BSC Mainnet and Testnet with visual indicators.",
    framework: "React + TypeScript",
    dependencies: [],
    code: `"use client";

import { useState, useCallback } from "react";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

const NETWORKS = [
  {
    name: "BNB Chain",
    chainId: "0x38",
    rpcUrl: "https://bsc-dataseed.bnbchain.org/",
    explorer: "https://bscscan.com",
    symbol: "BNB",
    isTestnet: false,
  },
  {
    name: "BNB Testnet",
    chainId: "0x61",
    rpcUrl: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
    explorer: "https://testnet.bscscan.com",
    symbol: "tBNB",
    isTestnet: true,
  },
] as const;

interface NetworkSwitcherProps {
  className?: string;
  onNetworkChange?: (network: (typeof NETWORKS)[number]) => void;
}

export function NetworkSwitcher({ className = "", onNetworkChange }: NetworkSwitcherProps) {
  const [currentNetwork, setCurrentNetwork] = useState(NETWORKS[0]);
  const [switching, setSwitching] = useState(false);

  const switchNetwork = useCallback(
    async (network: (typeof NETWORKS)[number]) => {
      if (!window.ethereum) return;
      setSwitching(true);
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: network.chainId }],
        });
        setCurrentNetwork(network);
        onNetworkChange?.(network);
      } catch (err: unknown) {
        const error = err as { code: number };
        if (error.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: network.chainId,
                chainName: network.name,
                nativeCurrency: { name: "BNB", symbol: network.symbol, decimals: 18 },
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: [network.explorer],
              },
            ],
          });
          setCurrentNetwork(network);
          onNetworkChange?.(network);
        }
      } finally {
        setSwitching(false);
      }
    },
    [onNetworkChange]
  );

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        borderRadius: 8,
        border: "1px solid var(--bnb-border-primary, #EAECEF)",
        overflow: "hidden",
      }}
    >
      {NETWORKS.map((network) => (
        <button
          key={network.chainId}
          onClick={() => switchNetwork(network)}
          disabled={switching}
          style={{
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: currentNetwork.chainId === network.chainId ? 600 : 400,
            fontFamily: "var(--bnb-font-body, sans-serif)",
            background:
              currentNetwork.chainId === network.chainId
                ? "var(--bnb-yellow, #F0B90B)"
                : "transparent",
            color:
              currentNetwork.chainId === network.chainId
                ? "var(--bnb-black, #181A20)"
                : "var(--bnb-text-secondary, #474D57)",
            border: "none",
            cursor: switching ? "wait" : "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background:
                currentNetwork.chainId === network.chainId
                  ? "var(--bnb-success, #0ECB81)"
                  : "var(--bnb-text-tertiary, #76808F)",
            }}
          />
          {network.name}
        </button>
      ))}
    </div>
  );
}`,
  },
};
