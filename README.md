# 🚀 txsync-sdk

## 📌 Overview

`txsync-sdk` abstracts the functionalities of the [txSync](https://txsync.io/) products and makes it easier to integrate in your project.

We currently support [txTsuko](https://app.txsync.io/tsuko), but we're planning to integrate all txSync functionalities.
Currently, we have two main exported functions:

- `getTsuko` - which provides a way to get the Tsuko you created and then call methods on it
- `createRestriction` - which deploys a new restriction contract based on the provided parameters

## 🛠 Prerequisites

- `node: >= 18` ([installation guide](https://nodejs.org/en/download/package-manager))
- `ethers: ^6.8.0`

## getTsuko

```javascript
async function getTsuko(address: Address, runner: Signer | Wallet): Promise<Tsuko>
```

Creates a new instance of the Tsuko class based on the provided Paymaster contract address.

- `address`: Address: The address of the Paymaster contract.
- `runner`: `Signer` | `Wallet`: A `Signer` or `Wallet` instance for signing and sending transactions.
- `Returns`: A new `Tsuko` instance.

## Tsuko

The `Tsuko` class is a utility class that provides methods for interacting with tsuko contracts on the zkSync network. It supports two types of Paymasters: ERC20Paymaster and SponsoredPaymaster.

### Constructor

```javascript
constructor(address: Address, runner: Signer | Wallet, paymasterType: PaymasterType, chainId: string, token?: Address)
```

- `address`: `Address` - The address of the Paymaster contract.
- `runner`: `Signer` | `Wallet` - A `Signer` or `Wallet` instance for signing transactions.
- `paymasterType`: [`PaymasterType`](#paymastertype) - type of Paymaster (ERC20Paymaster or SponsoredPaymaster).
- `chainId`: `string` - The ID of the chain the Paymaster contract is deployed on.
- `token`: `Address` (optional) - The address of the ERC20 token used by the ERC20Paymaster.

### populateTsukoTransaction

```javascript
async populateTsukoTransaction(contractAddress: Address, functionToCall: InterfaceAbi, args?: any[], overrides?: TsukoOverrides): Promise<TransactionRequest>
```

Populates a `TransactionRequest` object with the necessary data to call a function on a contract using the Paymaster.

- `contractAddress`: `Address` - The address of the contract to call.
- `functionToCall`: `ethers.InterfaceAbi` - The definition of the function to call. Can be:
  - Human-Readable fragment - string which resembles a Solidity signature and is introduced in [this blog entry](https://blog.ricmoo.com/human-readable-contract-abis-in-ethers-js-141902f4d917). For example, `function balanceOf(address) view returns (uint)`.
  - Parsed JSON fragment - [[Fragment]] instances - JavaScript Object desribed in the [Solidity documentation](https://docs.soliditylang.org/en/v0.8.19/abi-spec.html#json).
- `args`: `any[]` (optional) - An array of arguments for the function call.
- `overrides`: [`TsukoOverrides`](#tsukooverrides) (optional)- An object containing overrides for the transaction (e.g., to, value, data, customData, gasLimit, maxFeePerGas, maxPriorityFeePerGas)
- `Returns`: A `TransactionRequest` object populated with the transaction data.

### getPaymasterCustomData

```javascript
getPaymasterCustomData(paymasterOptions?: PaymasterOptions): PaymasterParams
```

Generates the `PaymasterParams` object that will be passed to the transaction that's using paymaster.

- `paymasterOptions`: [`PaymasterOptions`](#paymasteroptions) (optional) - An object containing options for the Paymaster (e.g., innerInput, minimalAllowance).
- `Returns`: A `PaymasterParams` object.

### sendTsukoTransaction

```javascript
async sendTsukoTransaction(contractAddress: Address, functionToCall: InterfaceAbi, args: any[] = [], overrides?: TsukoOverrides): Promise<TransactionResponse>
```

Populates and sends a transaction using the Paymaster.

- `contractAddress`: `Address` - The address of the contract to call.
- `functionToCall`: `ethers.InterfaceAbi` - The definition of the function to call. Can be:
  - Human-Readable fragment - string which resembles a Solidity signature and is introduced in [this blog entry](https://blog.ricmoo.com/human-readable-contract-abis-in-ethers-js-141902f4d917). For example, `function balanceOf(address) view returns (uint)`.
  - Parsed JSON fragment - [[Fragment]] instances - JavaScript Object desribed in the [Solidity documentation](https://docs.soliditylang.org/en/v0.8.19/abi-spec.html#json).
- `args`: `any[]` (optional) - An array of arguments for the function call.
- `overrides`: [`TsukoOverrides`](#tsukooverrides) (optional)- An object containing overrides for the transaction (e.g., to, value, data, customData, gasLimit, maxFeePerGas, maxPriorityFeePerGas)
- `Returns`: A `TransactionResponse` object.

### sendTransaction

```javascript
async sendTransaction(tx: TransactionRequest): Promise<TransactionResponse>
```

Sends a populated `TransactionRequest` object using the Paymaster.

- `tx`: The `TransactionRequest` object to send.
- `Returns`: A `TransactionResponse` object.

### getBalance

```javascript
async getBalance(): Promise<BigNumberish>
```

Gets the balance of the Paymaster contract.

- `Returns`: The balance of the Paymaster contract as a `BigNumberish` value.

### estimateGas

```javascript
async estimateGas(tx: TransactionRequest): Promise<BigNumberish>
```

Estimates the gas required for a transaction. Especially tailored for tsuko paymaster needs.

- `tx`: The `TransactionRequest` object for which to estimate the gas.
- `Returns`: The estimated gas limit as a `BigNumberish` value.

### getPaymasterContract

```javascript
getPaymasterContract(): ERC20Paymaster | SponsoredPaymaster
```

Gets an instance of the ERC20Paymaster or SponsoredPaymaster contract, depending on the [paymasterType](#paymastertype).

- `Returns`: An instance of the `(ethers.Contract)`.

### addRestriction

```javascript
async addRestriction(address: Address): Promise<ContractTransactionResponse>
```

Adds a restriction to the Paymaster.

- `address`: `Address` - The address of the restriction contract to add.
- `Returns`: A `ContractTransactionResponse` object.

### getRestrictions

```javascript
async getRestrictions(): Promise<string[]>
```

Gets the list of restriction contract addresses added to the Paymaster.

- `Returns`: An array of restriction contract addresses.

### removeRestriction

```javascript
async removeRestriction(address: Address): Promise<ContractTransactionResponse>
```

Removes a restriction contract from the Paymaster.

- `address`: `Address` - The address of the restriction contract to remove.
- `Returns`: A `ContractTransactionResponse` object.

### checkTransactionEligibility

```javascript
async checkTransactionEligibility(contractAddress: Address, functionToCall: InterfaceAbi, args: any[] = [], overrides?: TsukoOverrides): Promise<boolean>
```

Checks if a transaction is eligible to be paid for by the Paymaster, based on the added restrictions.

- `contractAddress`: `Address` - The address of the contract to call.
- `functionToCall`: `ethers.InterfaceAbi` - The definition of the function to call. Can be:
  - Human-Readable fragment - string which resembles a Solidity signature and is introduced in [this blog entry](https://blog.ricmoo.com/human-readable-contract-abis-in-ethers-js-141902f4d917). For example, `function balanceOf(address) view returns (uint)`.
  - Parsed JSON fragment - [[Fragment]] instances - JavaScript Object desribed in the [Solidity documentation](https://docs.soliditylang.org/en/v0.8.19/abi-spec.html#json).
- `args`: `any[]` (optional) - An array of arguments for the function call.
- `overrides`: [`TsukoOverrides`](#tsukooverrides) (optional)- An object containing overrides for the transaction (e.g., to, value, data, customData, gasLimit, maxFeePerGas, maxPriorityFeePerGas)
- `Returns`: `true` if the transaction is eligible, `false` otherwise.

### getMinimalAllowance

```javascript
async getMinimalAllowance(contractAddress: Address, functionToCall: InterfaceAbi, args?: any[], overrides?: TsukoOverrides): Promise<BigNumberish>
```

Calculates the minimal allowance required for an ERC20Paymaster to pay for a transaction.

- `contractAddress`: `Address` - The address of the contract to call.
- `functionToCall`: `ethers.InterfaceAbi` - The definition of the function to call. Can be:
  - Human-Readable fragment - string which resembles a Solidity signature and is introduced in [this blog entry](https://blog.ricmoo.com/human-readable-contract-abis-in-ethers-js-141902f4d917). For example, `function balanceOf(address) view returns (uint)`.
  - Parsed JSON fragment - [[Fragment]] instances - JavaScript Object desribed in the [Solidity documentation](https://docs.soliditylang.org/en/v0.8.19/abi-spec.html#json).
- `args`: `any[]` (optional) - An array of arguments for the function call.
- `overrides`: [`TsukoOverrides`](#tsukooverrides) (optional)- An object containing overrides for the transaction (e.g., to, value, data, customData, gasLimit, maxFeePerGas, maxPriorityFeePerGas)
- `Returns`: The minimal allowance as a `BigNumberish` value.

## Restrictions

Restrictions are external smart contracts that can be added to the Paymaster contract. These restrictions are used to enforce specific conditions or rules that must be met for a transaction to be eligible for payment by the Paymaster. Currently, there are 3 restriction types/methods: contract, user and function restrictions.

### createRestriction

```javascript
async function createRestriction(
  name: string,
  type: RestrictionMethod,
  runner: Signer | Wallet,
  items?: RestrictionItems,
  restrictionFactoryContractAddress?: string
): Promise<Address>
```

Deploys a new restriction contract based on the provided parameters.

- `name`: `string` - The name of the restriction contract to be created.
- `type`: [`RestrictionMethod`](#restrictionmethod) - The type of restriction contract to be created. It can be one of the following: `CONTRACT`, `USER`, or `FUNCTION`
- `runner`: `Signer` | `Wallet`: A `Signer` or `Wallet` instance used for signing transactions and interacting with the Restriction Factory contract.
- `items`: [`RestrictionItems`](#restrictionitems) (optional) - An object containing the items (e.g., contract addresses, user addresses, function signatures with contract addresses) related to the restriction being created.
- `restrictionFactoryContractAddress`: `Address` (optional) - The address of the Restriction Factory contract. If not provided, it will be retrieved based on the chain ID.
- `Returns`: Address: address of the deployed restriction.

## types

#### TsukoParams

A tuple type representing the parameters for several methods of Tsuko instance: [populateTsukoTransaction](#populatetsukotransaction), [sendTsukoTransaction](#sendtsukotransaction), [checkTransactionEligibility](#checkTransactionEligibility) and [getMinimalAllowance](#getminimalallowance). Added for easier usage.

```javascript
export type TsukoParams = [Address, InterfaceAbi, any[]?, TsukoOverrides?];
```

#### PaymasterType

```javascript
export enum PaymasterType {
  ERC20,
  SPONSORED,
}
```

#### RestrictionMethod

```javascript
export enum RestrictionMethod {
  CONTRACT,
  USER,
  FUNCTION,
}
```

#### PaymasterOptions

```javascript
export interface PaymasterOptions {
  innerInput?: BytesLike;
  minimalAllowance?: BigNumberish;
}
```

#### TsukoOverrides

```javascript
export interface TsukoOverrides extends Omit<TransactionRequest, 'from' | 'type' | 'gasPrice'> {
  paymasterOptions?: PaymasterOptions;
}
```

#### BaseRestrictionItem

```javascript
export type BaseRestrictionItem = {
  address: string;
};
```

#### AddressOrBaseRestrictionItem

```javascript
export type AddressOrBaseRestrictionItem = string | BaseRestrictionItem;
```

#### ContractItems

```javascript
export type ContractItems = AddressOrBaseRestrictionItem[];
```

#### UserItems

```javascript
export type UserItems = AddressOrBaseRestrictionItem[];
```

#### FunctionItems

```javascript
export type FunctionItems = (BaseRestrictionItem & {
  functionSignature: string;
})[];
```

#### RestrictionItems

```javascript
export type RestrictionItems = ContractItems | UserItems | FunctionItems;
```

## typechain

```javascript
export type { ContractRestriction };
export type { ERC20Paymaster };
export type { ERC20Token };
export type { Factory };
export type { FunctionRestriction };
export type { IRestriction };
export type { RestrictionFactory };
export type { SponsoredPaymaster };
export type { UserRestriction };
export { ContractRestriction__factory };
export { ERC20Paymaster__factory };
export { ERC20Token__factory };
export { Factory__factory };
export { FunctionRestriction__factory };
export { IRestriction__factory };
export { RestrictionFactory__factory };
export { SponsoredPaymaster__factory };
export { UserRestriction__factory };
```
