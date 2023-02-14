import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { createStarkSigner, EthSigner, generateStarkPrivateKey, WalletConnection } from '@imtbl/core-sdk';
import { requireEnvironmentVariable } from './utils';

/**
 * Generate a ethSigner/starkSigner object from a private key.
 */
export const generateWalletConnection = async (
  ethNetwork: string,
): Promise<WalletConnection> => {
  const userPrivateKey = requireEnvironmentVariable('PRIVATE_KEY');
  //const userStarkKey = requireEnvironmentVariable('STARK_PRIVATE_KEY');
  const alchemyKey = requireEnvironmentVariable('ALCHEMY_API_KEY');
  const starkPrivateKey = generateStarkPrivateKey(); // Or retrieve previously generated key
  const starkSigner = createStarkSigner(starkPrivateKey);

  // connect provider
  const provider = new AlchemyProvider(ethNetwork, alchemyKey);

  // L1 credentials
  const ethSigner = new Wallet(userPrivateKey).connect(provider);

  // L2 credentials
  //const starkSigner = createStarkSigner(userStarkKey);

  return {
    ethSigner,
    starkSigner,
  };
};
