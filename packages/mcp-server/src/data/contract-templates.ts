export interface ContractTemplate {
  name: string;
  description: string;
  type: "BEP20" | "BEP721";
  solidity: string;
  placeholders: Record<string, string>;
}

export const contractTemplates: Record<string, ContractTemplate> = {
  BEP20: {
    name: "BEP20 Token",
    description:
      "Standard BEP20 fungible token on BNB Chain with mint, burn, and pause capabilities. Based on OpenZeppelin contracts.",
    type: "BEP20",
    placeholders: {
      "{{TOKEN_NAME}}": "My BNB Token",
      "{{TOKEN_SYMBOL}}": "MBT",
      "{{INITIAL_SUPPLY}}": "1000000",
      "{{DECIMALS}}": "18",
    },
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title {{TOKEN_NAME}}
 * @dev BEP20 Token on BNB Chain
 * @notice Standard fungible token with mint, burn, and pause capabilities
 */
contract {{TOKEN_NAME_PASCAL}} is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    uint8 private _decimals;

    constructor()
        ERC20("{{TOKEN_NAME}}", "{{TOKEN_SYMBOL}}")
        Ownable(msg.sender)
    {
        _decimals = {{DECIMALS}};
        _mint(msg.sender, {{INITIAL_SUPPLY}} * 10 ** decimals());
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}`,
  },
  BEP721: {
    name: "BEP721 NFT Collection",
    description:
      "Standard BEP721 NFT collection on BNB Chain with metadata URI, minting, and enumeration. Based on OpenZeppelin contracts.",
    type: "BEP721",
    placeholders: {
      "{{COLLECTION_NAME}}": "My BNB NFT",
      "{{COLLECTION_SYMBOL}}": "MBNFT",
      "{{BASE_URI}}": "ipfs://QmYourHash/",
      "{{MAX_SUPPLY}}": "10000",
      "{{MINT_PRICE}}": "0.05 ether",
    },
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title {{COLLECTION_NAME}}
 * @dev BEP721 NFT Collection on BNB Chain
 * @notice NFT collection with enumeration, metadata URI, and controlled minting
 */
contract {{COLLECTION_NAME_PASCAL}} is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Strings for uint256;

    uint256 public constant MAX_SUPPLY = {{MAX_SUPPLY}};
    uint256 public constant MINT_PRICE = {{MINT_PRICE}};
    string private _baseTokenURI;
    uint256 private _nextTokenId;
    bool public mintActive = false;

    constructor()
        ERC721("{{COLLECTION_NAME}}", "{{COLLECTION_SYMBOL}}")
        Ownable(msg.sender)
    {
        _baseTokenURI = "{{BASE_URI}}";
    }

    function mint(uint256 quantity) external payable {
        require(mintActive, "Minting is not active");
        require(quantity > 0 && quantity <= 10, "Invalid quantity");
        require(_nextTokenId + quantity <= MAX_SUPPLY, "Exceeds max supply");
        require(msg.value >= MINT_PRICE * quantity, "Insufficient payment");

        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(msg.sender, tokenId);
        }
    }

    function ownerMint(address to, uint256 quantity) external onlyOwner {
        require(_nextTokenId + quantity <= MAX_SUPPLY, "Exceeds max supply");
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(to, tokenId);
        }
    }

    function setMintActive(bool active) external onlyOwner {
        mintActive = active;
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function withdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }

    // Required overrides
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}`,
  },
};

export const hardhatConfig = `import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      chainId: 97,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    bscMainnet: {
      url: "https://bsc-dataseed.bnbchain.org/",
      chainId: 56,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

export default config;
`;

export const hardhatPackageJson = `{
  "name": "bnb-contracts",
  "version": "1.0.0",
  "scripts": {
    "compile": "npx hardhat compile",
    "test": "npx hardhat test",
    "deploy:testnet": "npx hardhat run scripts/deploy.ts --network bscTestnet",
    "deploy:mainnet": "npx hardhat run scripts/deploy.ts --network bscMainnet"
  },
  "devDependencies": {
    "@nomicfoundation/hardhat-toolbox": "^4.0.0",
    "hardhat": "^2.19.0",
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "ts-node": "^10.9.0"
  },
  "dependencies": {
    "@openzeppelin/contracts": "^5.0.0",
    "dotenv": "^16.3.0"
  }
}`;
