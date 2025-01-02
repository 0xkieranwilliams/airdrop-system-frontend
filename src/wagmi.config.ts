import {
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';

import {
  mainnet,
  sepolia,
} from 'wagmi/chains';
import { http } from 'wagmi' 

export default getDefaultConfig({
  appName: 'Epoch Airdrop System',
  projectId: '0e011a7dafb96ed999ec1f44c5824370',
  chains: [mainnet, sepolia],
  transports: { 
    [sepolia.id]: http(), 
    [mainnet.id]: http(), 
  },
  ssr: false, 
});
