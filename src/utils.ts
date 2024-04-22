import {Signer, Wallet} from 'zksync-ethers';
import {TransactionStruct} from './typechain/IRestriction';
import {AddressOrBaseRestrictionItem, BaseRestrictionItem} from './types';
import { Address } from 'zksync-ethers/build/types';

// TODO: Add for other chain ids (e.g. differentiate between mainnet and testnet)
export const ERC20_PAYMASTER_GAS_OVERHEAD: (chainId: string) => bigint = (
  chainId: string
) => {
  if (chainId === '0x104') {
    return 3_000_000n;
  } else {
    return 225_000n;
  }
};

// TODO: Insert testnet and mainnet chain ids/addresses
export const RESTRICTION_FACTORY_CONTRACT_ADDRESS: (
  chainId: string
) => Address | undefined = (chainId: string) => {
  if (chainId === 'testnetChainID') {
    return 'testnetAddress';
  } else if (chainId === 'mainnetChainID') {
    return 'mainnetAddress';
  }

  return undefined;
};

export const GAS_DIFF_FACTOR = 1.1;

export function multiplyBigIntWithFLoat(bigInt: bigint, float: number): bigint {
  const integerPart = bigInt * BigInt(Math.floor(float));
  const decimalPart = bigInt * BigInt(Math.round((float % 1) * 10));

  return integerPart + decimalPart / BigInt(10);
}

export async function sendRequest(
  runner: Signer | Wallet,
  methodName: string,
  params: any[] = []
) {
  const result = await runner.provider.send(methodName, params);
  return result;
}

export function isBaseRestrictionItem(
  item: AddressOrBaseRestrictionItem
): item is BaseRestrictionItem {
  return typeof item === 'object' && 'address' in item;
}

export function formatTransaction(input: any): TransactionStruct {
  return {
    txType: input.type,
    from: input.from,
    to: input.to,
    gasLimit: input.gasLimit ?? 0n,
    gasPerPubdataByteLimit: 0n,
    maxFeePerGas: input.maxFeePerGas ?? 0n,
    maxPriorityFeePerGas: input.maxPriorityFeePerGas ?? 0n,
    paymaster: input.customData.paymasterParams.paymaster,
    nonce: input.nonce ?? 0n,
    value: input.value ?? 0n,
    reserved: [0n, 0n, 0n, 0n],
    data: input.data,
    signature: '0x',
    factoryDeps: [],
    paymasterInput: input.customData.paymasterParams.paymasterInput,
    reservedDynamic: '0x',
  };
}
