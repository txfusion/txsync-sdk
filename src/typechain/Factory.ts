/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "./common";

export declare namespace Factory {
  export type TsukoItemStruct = {
    method: BigNumberish;
    contractAddress: AddressLike;
  };

  export type TsukoItemStructOutput = [
    method: bigint,
    contractAddress: string
  ] & { method: bigint; contractAddress: string };
}

export interface FactoryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "addTokenConfig"
      | "calculatePaymasterCreationRequiredETH"
      | "createERC20Paymaster"
      | "createSponsoredPaymaster"
      | "deployedPaymasters"
      | "getDeployedPaymasters"
      | "initialize"
      | "owner"
      | "paymasterCreationPriceInUSD"
      | "priceFeedAddress"
      | "proxiableUUID"
      | "renounceOwnership"
      | "tokenConfigs"
      | "transferOwnership"
      | "updatePaymasterCreationPriceInUSD"
      | "updatePriceFeedAddress"
      | "updateTokenWhitelistStatus"
      | "upgradeTo"
      | "upgradeToAndCall"
      | "withdraw"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "AdminChanged"
      | "BeaconUpgraded"
      | "FundsWithdrawn"
      | "Initialized"
      | "OwnershipTransferred"
      | "PaymasterCreated"
      | "TokenConfigAdded"
      | "TokenWhitelistStatusUpdated"
      | "Upgraded"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "addTokenConfig",
    values: [AddressLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "calculatePaymasterCreationRequiredETH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "createERC20Paymaster",
    values: [AddressLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "createSponsoredPaymaster",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "deployedPaymasters",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getDeployedPaymasters",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "paymasterCreationPriceInUSD",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "priceFeedAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "proxiableUUID",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "tokenConfigs",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updatePaymasterCreationPriceInUSD",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "updatePriceFeedAddress",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateTokenWhitelistStatus",
    values: [AddressLike, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeTo",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeToAndCall",
    values: [AddressLike, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "withdraw", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "addTokenConfig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculatePaymasterCreationRequiredETH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createERC20Paymaster",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createSponsoredPaymaster",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deployedPaymasters",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDeployedPaymasters",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "paymasterCreationPriceInUSD",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "priceFeedAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "proxiableUUID",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenConfigs",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updatePaymasterCreationPriceInUSD",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updatePriceFeedAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateTokenWhitelistStatus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "upgradeTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "upgradeToAndCall",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}

export namespace AdminChangedEvent {
  export type InputTuple = [previousAdmin: AddressLike, newAdmin: AddressLike];
  export type OutputTuple = [previousAdmin: string, newAdmin: string];
  export interface OutputObject {
    previousAdmin: string;
    newAdmin: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace BeaconUpgradedEvent {
  export type InputTuple = [beacon: AddressLike];
  export type OutputTuple = [beacon: string];
  export interface OutputObject {
    beacon: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace FundsWithdrawnEvent {
  export type InputTuple = [owner: AddressLike, amount: BigNumberish];
  export type OutputTuple = [owner: string, amount: bigint];
  export interface OutputObject {
    owner: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace InitializedEvent {
  export type InputTuple = [version: BigNumberish];
  export type OutputTuple = [version: bigint];
  export interface OutputObject {
    version: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PaymasterCreatedEvent {
  export type InputTuple = [paymaster: AddressLike];
  export type OutputTuple = [paymaster: string];
  export interface OutputObject {
    paymaster: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TokenConfigAddedEvent {
  export type InputTuple = [tokenAddress: AddressLike, priceFeedKey: string];
  export type OutputTuple = [tokenAddress: string, priceFeedKey: string];
  export interface OutputObject {
    tokenAddress: string;
    priceFeedKey: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TokenWhitelistStatusUpdatedEvent {
  export type InputTuple = [tokenAddress: AddressLike, whitelisted: boolean];
  export type OutputTuple = [tokenAddress: string, whitelisted: boolean];
  export interface OutputObject {
    tokenAddress: string;
    whitelisted: boolean;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UpgradedEvent {
  export type InputTuple = [implementation: AddressLike];
  export type OutputTuple = [implementation: string];
  export interface OutputObject {
    implementation: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface Factory extends BaseContract {
  connect(runner?: ContractRunner | null): Factory;
  waitForDeployment(): Promise<this>;

  interface: FactoryInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  addTokenConfig: TypedContractMethod<
    [_tokenAddress: AddressLike, _priceFeedKey: string],
    [void],
    "nonpayable"
  >;

  calculatePaymasterCreationRequiredETH: TypedContractMethod<
    [],
    [bigint],
    "view"
  >;

  createERC20Paymaster: TypedContractMethod<
    [_tokenAddress: AddressLike, _name: string],
    [void],
    "payable"
  >;

  createSponsoredPaymaster: TypedContractMethod<
    [_name: string],
    [void],
    "payable"
  >;

  deployedPaymasters: TypedContractMethod<
    [arg0: AddressLike, arg1: BigNumberish],
    [[bigint, string] & { method: bigint; contractAddress: string }],
    "view"
  >;

  getDeployedPaymasters: TypedContractMethod<
    [],
    [Factory.TsukoItemStructOutput[]],
    "view"
  >;

  initialize: TypedContractMethod<
    [
      _priceFeedAddress: AddressLike,
      _paymasterCreationPriceInUSD: BigNumberish
    ],
    [void],
    "nonpayable"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  paymasterCreationPriceInUSD: TypedContractMethod<[], [bigint], "view">;

  priceFeedAddress: TypedContractMethod<[], [string], "view">;

  proxiableUUID: TypedContractMethod<[], [string], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  tokenConfigs: TypedContractMethod<
    [arg0: AddressLike],
    [[string, boolean] & { priceFeedKey: string; whitelisted: boolean }],
    "view"
  >;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  updatePaymasterCreationPriceInUSD: TypedContractMethod<
    [_paymasterCreationPriceInUSD: BigNumberish],
    [void],
    "nonpayable"
  >;

  updatePriceFeedAddress: TypedContractMethod<
    [_priceFeedAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  updateTokenWhitelistStatus: TypedContractMethod<
    [_tokenAddress: AddressLike, _newValue: boolean],
    [void],
    "nonpayable"
  >;

  upgradeTo: TypedContractMethod<
    [newImplementation: AddressLike],
    [void],
    "nonpayable"
  >;

  upgradeToAndCall: TypedContractMethod<
    [newImplementation: AddressLike, data: BytesLike],
    [void],
    "payable"
  >;

  withdraw: TypedContractMethod<[], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "addTokenConfig"
  ): TypedContractMethod<
    [_tokenAddress: AddressLike, _priceFeedKey: string],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "calculatePaymasterCreationRequiredETH"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "createERC20Paymaster"
  ): TypedContractMethod<
    [_tokenAddress: AddressLike, _name: string],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "createSponsoredPaymaster"
  ): TypedContractMethod<[_name: string], [void], "payable">;
  getFunction(
    nameOrSignature: "deployedPaymasters"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: BigNumberish],
    [[bigint, string] & { method: bigint; contractAddress: string }],
    "view"
  >;
  getFunction(
    nameOrSignature: "getDeployedPaymasters"
  ): TypedContractMethod<[], [Factory.TsukoItemStructOutput[]], "view">;
  getFunction(
    nameOrSignature: "initialize"
  ): TypedContractMethod<
    [
      _priceFeedAddress: AddressLike,
      _paymasterCreationPriceInUSD: BigNumberish
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "paymasterCreationPriceInUSD"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "priceFeedAddress"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "proxiableUUID"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "tokenConfigs"
  ): TypedContractMethod<
    [arg0: AddressLike],
    [[string, boolean] & { priceFeedKey: string; whitelisted: boolean }],
    "view"
  >;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updatePaymasterCreationPriceInUSD"
  ): TypedContractMethod<
    [_paymasterCreationPriceInUSD: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "updatePriceFeedAddress"
  ): TypedContractMethod<
    [_priceFeedAddress: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "updateTokenWhitelistStatus"
  ): TypedContractMethod<
    [_tokenAddress: AddressLike, _newValue: boolean],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "upgradeTo"
  ): TypedContractMethod<
    [newImplementation: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "upgradeToAndCall"
  ): TypedContractMethod<
    [newImplementation: AddressLike, data: BytesLike],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<[], [void], "nonpayable">;

  getEvent(
    key: "AdminChanged"
  ): TypedContractEvent<
    AdminChangedEvent.InputTuple,
    AdminChangedEvent.OutputTuple,
    AdminChangedEvent.OutputObject
  >;
  getEvent(
    key: "BeaconUpgraded"
  ): TypedContractEvent<
    BeaconUpgradedEvent.InputTuple,
    BeaconUpgradedEvent.OutputTuple,
    BeaconUpgradedEvent.OutputObject
  >;
  getEvent(
    key: "FundsWithdrawn"
  ): TypedContractEvent<
    FundsWithdrawnEvent.InputTuple,
    FundsWithdrawnEvent.OutputTuple,
    FundsWithdrawnEvent.OutputObject
  >;
  getEvent(
    key: "Initialized"
  ): TypedContractEvent<
    InitializedEvent.InputTuple,
    InitializedEvent.OutputTuple,
    InitializedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "PaymasterCreated"
  ): TypedContractEvent<
    PaymasterCreatedEvent.InputTuple,
    PaymasterCreatedEvent.OutputTuple,
    PaymasterCreatedEvent.OutputObject
  >;
  getEvent(
    key: "TokenConfigAdded"
  ): TypedContractEvent<
    TokenConfigAddedEvent.InputTuple,
    TokenConfigAddedEvent.OutputTuple,
    TokenConfigAddedEvent.OutputObject
  >;
  getEvent(
    key: "TokenWhitelistStatusUpdated"
  ): TypedContractEvent<
    TokenWhitelistStatusUpdatedEvent.InputTuple,
    TokenWhitelistStatusUpdatedEvent.OutputTuple,
    TokenWhitelistStatusUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "Upgraded"
  ): TypedContractEvent<
    UpgradedEvent.InputTuple,
    UpgradedEvent.OutputTuple,
    UpgradedEvent.OutputObject
  >;

  filters: {
    "AdminChanged(address,address)": TypedContractEvent<
      AdminChangedEvent.InputTuple,
      AdminChangedEvent.OutputTuple,
      AdminChangedEvent.OutputObject
    >;
    AdminChanged: TypedContractEvent<
      AdminChangedEvent.InputTuple,
      AdminChangedEvent.OutputTuple,
      AdminChangedEvent.OutputObject
    >;

    "BeaconUpgraded(address)": TypedContractEvent<
      BeaconUpgradedEvent.InputTuple,
      BeaconUpgradedEvent.OutputTuple,
      BeaconUpgradedEvent.OutputObject
    >;
    BeaconUpgraded: TypedContractEvent<
      BeaconUpgradedEvent.InputTuple,
      BeaconUpgradedEvent.OutputTuple,
      BeaconUpgradedEvent.OutputObject
    >;

    "FundsWithdrawn(address,uint256)": TypedContractEvent<
      FundsWithdrawnEvent.InputTuple,
      FundsWithdrawnEvent.OutputTuple,
      FundsWithdrawnEvent.OutputObject
    >;
    FundsWithdrawn: TypedContractEvent<
      FundsWithdrawnEvent.InputTuple,
      FundsWithdrawnEvent.OutputTuple,
      FundsWithdrawnEvent.OutputObject
    >;

    "Initialized(uint8)": TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;
    Initialized: TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "PaymasterCreated(address)": TypedContractEvent<
      PaymasterCreatedEvent.InputTuple,
      PaymasterCreatedEvent.OutputTuple,
      PaymasterCreatedEvent.OutputObject
    >;
    PaymasterCreated: TypedContractEvent<
      PaymasterCreatedEvent.InputTuple,
      PaymasterCreatedEvent.OutputTuple,
      PaymasterCreatedEvent.OutputObject
    >;

    "TokenConfigAdded(address,string)": TypedContractEvent<
      TokenConfigAddedEvent.InputTuple,
      TokenConfigAddedEvent.OutputTuple,
      TokenConfigAddedEvent.OutputObject
    >;
    TokenConfigAdded: TypedContractEvent<
      TokenConfigAddedEvent.InputTuple,
      TokenConfigAddedEvent.OutputTuple,
      TokenConfigAddedEvent.OutputObject
    >;

    "TokenWhitelistStatusUpdated(address,bool)": TypedContractEvent<
      TokenWhitelistStatusUpdatedEvent.InputTuple,
      TokenWhitelistStatusUpdatedEvent.OutputTuple,
      TokenWhitelistStatusUpdatedEvent.OutputObject
    >;
    TokenWhitelistStatusUpdated: TypedContractEvent<
      TokenWhitelistStatusUpdatedEvent.InputTuple,
      TokenWhitelistStatusUpdatedEvent.OutputTuple,
      TokenWhitelistStatusUpdatedEvent.OutputObject
    >;

    "Upgraded(address)": TypedContractEvent<
      UpgradedEvent.InputTuple,
      UpgradedEvent.OutputTuple,
      UpgradedEvent.OutputObject
    >;
    Upgraded: TypedContractEvent<
      UpgradedEvent.InputTuple,
      UpgradedEvent.OutputTuple,
      UpgradedEvent.OutputObject
    >;
  };
}