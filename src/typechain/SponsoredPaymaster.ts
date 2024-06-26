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

export interface SponsoredPaymasterInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "addRestriction"
      | "getRestrictions"
      | "getRestrictionsCount"
      | "name"
      | "owner"
      | "postTransaction"
      | "removeRestriction"
      | "renounceOwnership"
      | "restrictions"
      | "transferOwnership"
      | "validateAndPayForPaymasterTransaction"
      | "withdraw"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "FundsWithdrawn"
      | "OwnershipTransferred"
      | "TransactionExecuted"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "addRestriction",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getRestrictions",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getRestrictionsCount",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "postTransaction",
    values: [
      BytesLike,
      TransactionStruct,
      BytesLike,
      BytesLike,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "removeRestriction",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "restrictions",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "validateAndPayForPaymasterTransaction",
    values: [BytesLike, BytesLike, TransactionStruct]
  ): string;
  encodeFunctionData(functionFragment: "withdraw", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "addRestriction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRestrictions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRestrictionsCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "postTransaction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeRestriction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "restrictions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validateAndPayForPaymasterTransaction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
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

export namespace TransactionExecutedEvent {
  export type InputTuple = [
    result: BigNumberish,
    from: BigNumberish,
    to: BigNumberish,
    requiredEth: BigNumberish
  ];
  export type OutputTuple = [
    result: bigint,
    from: bigint,
    to: bigint,
    requiredEth: bigint
  ];
  export interface OutputObject {
    result: bigint;
    from: bigint;
    to: bigint;
    requiredEth: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface SponsoredPaymaster extends BaseContract {
  connect(runner?: ContractRunner | null): SponsoredPaymaster;
  waitForDeployment(): Promise<this>;

  interface: SponsoredPaymasterInterface;

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

  addRestriction: TypedContractMethod<
    [_restriction: AddressLike],
    [void],
    "nonpayable"
  >;

  getRestrictions: TypedContractMethod<[], [string[]], "view">;

  getRestrictionsCount: TypedContractMethod<[], [bigint], "view">;

  name: TypedContractMethod<[], [string], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  postTransaction: TypedContractMethod<
    [
      arg0: BytesLike,
      _transaction: TransactionStruct,
      arg2: BytesLike,
      arg3: BytesLike,
      _txResult: BigNumberish,
      arg5: BigNumberish
    ],
    [void],
    "payable"
  >;

  removeRestriction: TypedContractMethod<
    [_restriction: AddressLike],
    [void],
    "nonpayable"
  >;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  restrictions: TypedContractMethod<[arg0: BigNumberish], [string], "view">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  validateAndPayForPaymasterTransaction: TypedContractMethod<
    [arg0: BytesLike, arg1: BytesLike, _transaction: TransactionStruct],
    [[string, string] & { magic: string; context: string }],
    "payable"
  >;

  withdraw: TypedContractMethod<[], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "addRestriction"
  ): TypedContractMethod<[_restriction: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "getRestrictions"
  ): TypedContractMethod<[], [string[]], "view">;
  getFunction(
    nameOrSignature: "getRestrictionsCount"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "name"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "postTransaction"
  ): TypedContractMethod<
    [
      arg0: BytesLike,
      _transaction: TransactionStruct,
      arg2: BytesLike,
      arg3: BytesLike,
      _txResult: BigNumberish,
      arg5: BigNumberish
    ],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "removeRestriction"
  ): TypedContractMethod<[_restriction: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "restrictions"
  ): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "validateAndPayForPaymasterTransaction"
  ): TypedContractMethod<
    [arg0: BytesLike, arg1: BytesLike, _transaction: TransactionStruct],
    [[string, string] & { magic: string; context: string }],
    "payable"
  >;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<[], [void], "nonpayable">;

  getEvent(
    key: "FundsWithdrawn"
  ): TypedContractEvent<
    FundsWithdrawnEvent.InputTuple,
    FundsWithdrawnEvent.OutputTuple,
    FundsWithdrawnEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "TransactionExecuted"
  ): TypedContractEvent<
    TransactionExecutedEvent.InputTuple,
    TransactionExecutedEvent.OutputTuple,
    TransactionExecutedEvent.OutputObject
  >;

  filters: {
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

    "TransactionExecuted(uint8,uint256,uint256,uint256)": TypedContractEvent<
      TransactionExecutedEvent.InputTuple,
      TransactionExecutedEvent.OutputTuple,
      TransactionExecutedEvent.OutputObject
    >;
    TransactionExecuted: TypedContractEvent<
      TransactionExecutedEvent.InputTuple,
      TransactionExecutedEvent.OutputTuple,
      TransactionExecutedEvent.OutputObject
    >;
  };
}
