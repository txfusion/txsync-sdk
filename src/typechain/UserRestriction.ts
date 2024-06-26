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

export type TransactionStruct = {
  txType: BigNumberish;
  from: BigNumberish;
  to: BigNumberish;
  gasLimit: BigNumberish;
  gasPerPubdataByteLimit: BigNumberish;
  maxFeePerGas: BigNumberish;
  maxPriorityFeePerGas: BigNumberish;
  paymaster: BigNumberish;
  nonce: BigNumberish;
  value: BigNumberish;
  reserved: [BigNumberish, BigNumberish, BigNumberish, BigNumberish];
  data: BytesLike;
  signature: BytesLike;
  factoryDeps: BytesLike[];
  paymasterInput: BytesLike;
  reservedDynamic: BytesLike;
};

export type TransactionStructOutput = [
  txType: bigint,
  from: bigint,
  to: bigint,
  gasLimit: bigint,
  gasPerPubdataByteLimit: bigint,
  maxFeePerGas: bigint,
  maxPriorityFeePerGas: bigint,
  paymaster: bigint,
  nonce: bigint,
  value: bigint,
  reserved: [bigint, bigint, bigint, bigint],
  data: string,
  signature: string,
  factoryDeps: string[],
  paymasterInput: string,
  reservedDynamic: string
] & {
  txType: bigint;
  from: bigint;
  to: bigint;
  gasLimit: bigint;
  gasPerPubdataByteLimit: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  paymaster: bigint;
  nonce: bigint;
  value: bigint;
  reserved: [bigint, bigint, bigint, bigint];
  data: string;
  signature: string;
  factoryDeps: string[];
  paymasterInput: string;
  reservedDynamic: string;
};

export interface UserRestrictionInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "batchUpdateUserWhiteList"
      | "canPayForTransaction"
      | "name"
      | "owner"
      | "renounceOwnership"
      | "transferOwnership"
      | "updateUserWhiteList"
      | "userWhitelist"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "OwnershipTransferred" | "UserWhiteListUpdated"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "batchUpdateUserWhiteList",
    values: [AddressLike[], boolean[]]
  ): string;
  encodeFunctionData(
    functionFragment: "canPayForTransaction",
    values: [TransactionStruct]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateUserWhiteList",
    values: [AddressLike, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "userWhitelist",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "batchUpdateUserWhiteList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "canPayForTransaction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateUserWhiteList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "userWhitelist",
    data: BytesLike
  ): Result;
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

export namespace UserWhiteListUpdatedEvent {
  export type InputTuple = [userAddress: AddressLike, status: boolean];
  export type OutputTuple = [userAddress: string, status: boolean];
  export interface OutputObject {
    userAddress: string;
    status: boolean;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface UserRestriction extends BaseContract {
  connect(runner?: ContractRunner | null): UserRestriction;
  waitForDeployment(): Promise<this>;

  interface: UserRestrictionInterface;

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

  batchUpdateUserWhiteList: TypedContractMethod<
    [_users: AddressLike[], _statuses: boolean[]],
    [void],
    "nonpayable"
  >;

  canPayForTransaction: TypedContractMethod<
    [_transaction: TransactionStruct],
    [boolean],
    "view"
  >;

  name: TypedContractMethod<[], [string], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  updateUserWhiteList: TypedContractMethod<
    [_userAddress: AddressLike, _status: boolean],
    [void],
    "nonpayable"
  >;

  userWhitelist: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "batchUpdateUserWhiteList"
  ): TypedContractMethod<
    [_users: AddressLike[], _statuses: boolean[]],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "canPayForTransaction"
  ): TypedContractMethod<[_transaction: TransactionStruct], [boolean], "view">;
  getFunction(
    nameOrSignature: "name"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateUserWhiteList"
  ): TypedContractMethod<
    [_userAddress: AddressLike, _status: boolean],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "userWhitelist"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "UserWhiteListUpdated"
  ): TypedContractEvent<
    UserWhiteListUpdatedEvent.InputTuple,
    UserWhiteListUpdatedEvent.OutputTuple,
    UserWhiteListUpdatedEvent.OutputObject
  >;

  filters: {
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

    "UserWhiteListUpdated(address,bool)": TypedContractEvent<
      UserWhiteListUpdatedEvent.InputTuple,
      UserWhiteListUpdatedEvent.OutputTuple,
      UserWhiteListUpdatedEvent.OutputObject
    >;
    UserWhiteListUpdated: TypedContractEvent<
      UserWhiteListUpdatedEvent.InputTuple,
      UserWhiteListUpdatedEvent.OutputTuple,
      UserWhiteListUpdatedEvent.OutputObject
    >;
  };
}
