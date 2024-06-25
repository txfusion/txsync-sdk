import {
  BigNumberish,
  BytesLike,
  InterfaceAbi,
  TransactionRequest,
} from 'ethers';
import {Address} from 'zksync-ethers/build/types';

export enum PaymasterType {
  ERC20,
  SPONSORED,
}

export enum RestrictionMethod {
  CONTRACT,
  USER,
  FUNCTION,
}

export interface PaymasterOptions {
  innerInput?: BytesLike;
  minimalAllowance?: BigNumberish;
}

export interface PaymasterOverrides
  extends Omit<TransactionRequest, 'from' | 'type' | 'gasPrice'> {
  paymasterOptions?: PaymasterOptions;
}

export type PaymasterParams = [Address, InterfaceAbi, any[]?, PaymasterOverrides?];

export type BaseRestrictionItem = {
  address: string;
};

export type AddressOrBaseRestrictionItem = string | BaseRestrictionItem;

export type ContractItems = AddressOrBaseRestrictionItem[];
export type UserItems = AddressOrBaseRestrictionItem[];
export type FunctionItems = (BaseRestrictionItem & {
  functionSignature: string;
})[];

export type RestrictionItems = ContractItems | UserItems | FunctionItems;
