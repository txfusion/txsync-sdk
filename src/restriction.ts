import {ContractTransactionReceipt, id} from 'ethers';
import {RestrictionFactory, RestrictionFactory__factory} from './typechain';
import {
  ContractItems,
  FunctionItems,
  RestrictionItems,
  RestrictionMethod,
  UserItems,
} from './types';
import {
  RESTRICTION_FACTORY_CONTRACT_ADDRESS,
  isBaseRestrictionItem,
  sendRequest,
} from './utils';
import {PaymasterError} from './errors';
import {Signer, Wallet} from 'zksync-ethers';
import { Address } from 'zksync-ethers/build/types';

export async function createRestriction(
  name: string,
  type: RestrictionMethod,
  runner: Signer | Wallet,
  items?: RestrictionItems,
  restrictionFactoryContractAddress?: string
): Promise<Address> {
  const chainId = await sendRequest(runner, 'eth_chainId');
  const factoryAddress =
    restrictionFactoryContractAddress ??
    RESTRICTION_FACTORY_CONTRACT_ADDRESS(chainId);
  if (!factoryAddress)
    throw new PaymasterError(
      'Restriction factory contract address not found',
      'FACTORY_NOT_FOUND'
    );

  const Factory = RestrictionFactory__factory.connect(factoryAddress, runner);

  const result = await createAppropriateRestriction(type, Factory, name, items);
  return parseRestrictionCreationResult(result);
}

async function createAppropriateRestriction(
  type: RestrictionMethod,
  Factory: RestrictionFactory,
  name: string,
  items?: RestrictionItems
): Promise<ContractTransactionReceipt | null> {
  switch (type) {
    case RestrictionMethod.CONTRACT:
      return handleContractRestriction(Factory, name, items as ContractItems);
    case RestrictionMethod.USER:
      return handleUserRestriction(Factory, name, items as UserItems);
    case RestrictionMethod.FUNCTION:
      return handleFunctionRestriction(Factory, name, items as FunctionItems);
    default:
      throw new PaymasterError('Invalid restriction type provided', 'INVALID_TYPE');
  }
}

async function handleContractRestriction(
  Factory: RestrictionFactory,
  name: string,
  contractItems?: ContractItems
): Promise<ContractTransactionReceipt | null> {
  const addresses =
    contractItems?.map(item =>
      isBaseRestrictionItem(item) ? item.address : item
    ) ?? [];
  const statuses = new Array(addresses.length).fill(true);

  return (
    await Factory.createContractRestriction(name, addresses, statuses)
  ).wait();
}

async function handleUserRestriction(
  Factory: RestrictionFactory,
  name: string,
  userItems?: UserItems
): Promise<ContractTransactionReceipt | null> {
  const addresses =
    userItems?.map(item =>
      isBaseRestrictionItem(item) ? item.address : item
    ) ?? [];
  const statuses = new Array(addresses.length).fill(true);

  return (
    await Factory.createUserRestriction(name, addresses, statuses)
  ).wait();
}

async function handleFunctionRestriction(
  Factory: RestrictionFactory,
  name: string,
  functionItems?: FunctionItems
): Promise<ContractTransactionReceipt | null> {
  const functionSignatures =
    functionItems?.map(item => item.functionSignature) ?? [];
  const contractAddresses = functionItems?.map(item => item.address) ?? [];

  const statuses = new Array(functionSignatures.length).fill(true);
  const selectors = functionSignatures.map(signature =>
    id(signature).substring(0, 10)
  );

  return (
    await Factory.createFunctionRestriction(
      name,
      contractAddresses,
      selectors,
      statuses
    )
  ).wait();
}

function parseRestrictionCreationResult(
  result: ContractTransactionReceipt | null
): Address {
  const log = result!.logs.find(
    log => log.topics[0] === id('RestrictionCreated(address)')
  );
  if (!log)
    throw new PaymasterError(
      'No RestrictionCreated event found',
      'RESTRICTION_NOT_FOUND'
    );

  return '0x' + log.data.slice(26);
}
