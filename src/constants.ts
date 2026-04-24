/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  name: string;
  description: string;
  category: 'DeFi' | 'Social' | 'NFT' | 'Bridge' | 'Infrastructure' | 'Dev Tool';
  url: string;
  icon: string;
  stats?: {
    label: string;
    value: string;
  };
}

export const ECOSYSTEM_PROJECTS: Project[] = [
  {
    id: 'aerodrome',
    name: 'Aerodrome',
    description: 'The central liquidity hub on Base. A next-generation AMM designed to be the ecosystems primary source of liquidity.',
    category: 'DeFi',
    url: 'https://aerodrome.finance/',
    icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=aerodrome',
    stats: { label: 'TVL', value: '$700M+' }
  },
  {
    id: 'uniswap',
    name: 'Uniswap',
    description: 'The world’s largest decentralized exchange, fully live on Base for fast and low-cost swaps.',
    category: 'DeFi',
    url: 'https://uniswap.org/',
    icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=uniswap',
  },
  {
    id: 'warpcast',
    name: 'Warpcast',
    description: 'A client for Farcaster, the decentralized social network. Base is the home for many Farcaster developers.',
    category: 'Social',
    url: 'https://warpcast.com/',
    icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=warpcast',
  },
  {
    id: 'friend-tech',
    name: 'Friend.tech',
    description: 'A social app that lets you trade "shares" of your friends and influencers.',
    category: 'Social',
    url: 'https://www.friend.tech/',
    icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=friendtech',
  },
  {
    id: 'base-bridge',
    name: 'Base Bridge',
    description: 'The official bridge for moving assets between Ethereum and Base.',
    category: 'Bridge',
    url: 'https://bridge.base.org/',
    icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=bridge',
  },
  {
    id: 'aave',
    name: 'Aave',
    description: 'The leading lending protocol on Ethereum, providing decentralized liquidity and borrowing on Base.',
    category: 'DeFi',
    url: 'https://aave.com/',
    icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=aave',
  },
  {
    id: 'base-scan',
    name: 'BaseScan',
    description: 'The primary block explorer for the Base network, powered by Etherscan.',
    category: 'Infrastructure',
    url: 'https://basescan.org/',
    icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=basescan',
  },
  {
    id: 'foundry',
    name: 'Foundry',
    description: 'A blazing fast, portable and modular toolkit for Ethereum application development written in Rust.',
    category: 'Dev Tool',
    url: 'https://book.getfoundry.sh/',
    icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=foundry',
  },
  {
    id: 'open-sea',
    name: 'OpenSea',
    description: 'The largest NFT marketplace, fully supporting Base NFTs and collections.',
    category: 'NFT',
    url: 'https://opensea.io/',
    icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=opensea',
  }
];

export const CATEGORIES = ['All', 'DeFi', 'Social', 'NFT', 'Bridge', 'Infrastructure', 'Dev Tool'] as const;
