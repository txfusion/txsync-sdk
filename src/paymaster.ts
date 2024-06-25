import {
  ERC20Paymaster,
  ERC20Paymaster__factory,
  ERC20Token__factory,
  IRestriction__factory,
  SponsoredPaymaster,
  SponsoredPaymaster__factory,
} from './typechain';
import {PaymasterOptions, PaymasterType, PaymasterOverrides} from './types';
import {ERC20_PAYMASTER_GAS_OVERHEAD, GAS_DIFF_FACTOR, formatTransaction, multiplyBigIntWithFLoat, sendRequest} from './utils';

import {
  Address,
  PaymasterInput,
  PaymasterParams,
  TransactionRequest,
  TransactionResponse,
} from 'zksync-ethers/build/types';
import {getPaymasterParams} from 'zksync-ethers/build/paymaster-utils';
import {EIP712_TX_TYPE} from 'zksync-ethers/build/utils';
import {Signer, Wallet} from 'zksync-ethers';

import {
  BigNumberish,
  ContractTransactionResponse,
  FunctionFragment,
  Interface,
  InterfaceAbi,
} from 'ethers';
import {PaymasterError} from './errors';

class Paymaster {
  readonly address!: Address;
  readonly paymasterType!: PaymasterType;
  readonly runner!: Signer | Wallet;
  readonly chainId!: string;
  readonly token?: Address | undefined;

  constructor(
    address: Address,
    runner: Signer | Wallet,
    paymasterType: PaymasterType,
    chainId: string,
    token?: Address
  ) {
    this.address = address;
    this.paymasterType = paymasterType;
    this.runner = runner;
    this.chainId = chainId;
    this.token = token;
  }

  async populatePaymasterTransaction(
    contractAddress: Address,
    functionToCall: InterfaceAbi,
    args?: any[],
    overrides?: PaymasterOverrides
  ) {
    const tx: TransactionRequest = {};

    tx.type = EIP712_TX_TYPE;
    tx.from = await this.runner.getAddress();
    tx.to = overrides?.to ?? contractAddress;
    tx.value = overrides?.value ?? 0n;

    const fragment = FunctionFragment.from(functionToCall);
    const encodedData = new Interface([fragment]).encodeFunctionData(
      fragment.name,
      args ?? []
    );
    tx.data = overrides?.data ?? encodedData;

    tx.customData = overrides?.customData ?? {
      paymasterParams: this.getPaymasterCustomData(overrides?.paymasterOptions),
    };

    // tx.gasLimit = overrides?.gasLimit ?? await this.estimateGas(tx);
    // // maxFeePerGas and maxPriorityFeePerGas are set after the gas limit is calculated for purpose
    // // Because of this estimation for gasLimit is a little bit higher (~ 4k gas) but it's not a big deal and
    // // it's better to have a little bit higher estimation than lower.
    // tx.maxFeePerGas = overrides?.maxFeePerGas ?? await this.runner.provider.getGasPrice();
    // tx.maxPriorityFeePerGas = overrides?.maxPriorityFeePerGas ?? 0n;

    return tx;
  }

  getPaymasterCustomData(paymasterOptions?: PaymasterOptions): PaymasterParams {
    let paymasterInput: PaymasterInput;
    if (this.paymasterType === PaymasterType.ERC20) {
      paymasterInput = {
        type: 'ApprovalBased',
        token: this.token!,
        innerInput: paymasterOptions?.innerInput ?? new Uint8Array(),
        minimalAllowance: paymasterOptions?.minimalAllowance ?? 1n,
      };
    } else {
      paymasterInput = {
        type: 'General',
        innerInput: paymasterOptions?.innerInput ?? new Uint8Array(),
      };
    }

    return getPaymasterParams(this.address, paymasterInput);
  }

  async sendPaymasterTransaction(
    contractAddress: Address,
    functionToCall: InterfaceAbi,
    args: any[] = [],
    overrides?: PaymasterOverrides
  ) {
    const tx = await this.populatePaymasterTransaction(
      contractAddress,
      functionToCall,
      args,
      overrides
    );
    // Moved here from populatePaymasterTransaction because we don't want to estimate gas in the case
    // when transaction will fail and populatePaymasterTransaction will throw an error
    tx.gasLimit = overrides?.gasLimit ?? (await this.estimateGas(tx));
    // maxFeePerGas and maxPriorityFeePerGas are set after the gas limit is calculated for purpose
    // Because of this estimation for gasLimit is a little bit higher (~ 4k gas) but it's not a big deal and
    // it's better to have a little bit higher estimation than lower.
    tx.maxFeePerGas =
      overrides?.maxFeePerGas ?? (await this.runner.provider.getGasPrice());
    tx.maxPriorityFeePerGas = overrides?.maxPriorityFeePerGas ?? 0n;
    return this.sendTransaction(tx);
  }

  async sendTransaction(tx: TransactionRequest): Promise<TransactionResponse> {
    return this.runner.sendTransaction!(tx) as Promise<TransactionResponse>;
  }

  // TODO: Check if the ETH balance is asked for ERC20 paymasters
  async getBalance(): Promise<BigNumberish> {
    if (this.paymasterType === PaymasterType.ERC20) {
      const erc20token = ERC20Token__factory.connect(this.token!, this.runner);
      return erc20token.balanceOf(this.address);
    }

    return this.runner.provider.getBalance(this.address);
  }

  async estimateGas(tx: TransactionRequest): Promise<BigNumberish> {
    if (this.paymasterType === PaymasterType.SPONSORED) {
      return this.runner.estimateGas(tx);
    }

    // If allowance is already set, we can estimate gas limit with customData for paymaster
    try {
      const gasLimit = await this.runner.estimateGas(tx);
      return gasLimit;
    } catch (error: any) {}

    // Give me tx but without customData.paymasterParams
    const txWithoutPaymasterParams = {...tx};
    delete txWithoutPaymasterParams.customData?.paymasterParams;

    const gasLimit = await this.runner.estimateGas(txWithoutPaymasterParams);
    return gasLimit + ERC20_PAYMASTER_GAS_OVERHEAD(this.chainId);
  }

  getPaymasterContract(): ERC20Paymaster | SponsoredPaymaster {
    return this.paymasterType === PaymasterType.ERC20
      ? ERC20Paymaster__factory.connect(this.address, this.runner)
      : SponsoredPaymaster__factory.connect(this.address, this.runner);
  }

  async addRestriction(address: Address): Promise<ContractTransactionResponse> {
    const paymaster = this.getPaymasterContract();
    return paymaster.addRestriction(address);
  }

  async getRestrictions(): Promise<string[]> {
    const paymaster = this.getPaymasterContract();
    return paymaster.getRestrictions();
  }

  async removeRestriction(
    address: Address
  ): Promise<ContractTransactionResponse> {
    const paymaster = this.getPaymasterContract();
    return paymaster.removeRestriction(address);
  }

  async checkTransactionEligibility(
    contractAddress: Address,
    functionToCall: InterfaceAbi,
    args: any[] = [],
    overrides?: PaymasterOverrides
  ): Promise<boolean> {
    let returnVal = true;

    const tx = await this.populatePaymasterTransaction(
      contractAddress,
      functionToCall,
      args,
      overrides
    );
    const formattedTx = formatTransaction(tx);
    const restrictions = await this.getRestrictions();

    for (const restriction of restrictions) {
      const restrictionContract = IRestriction__factory.connect(
        restriction,
        this.runner
      );
      const isEligible =
        await restrictionContract.canPayForTransaction(formattedTx);
      if (!isEligible) {
        returnVal = false;
        break;
      }
    }

    return returnVal;
  }

  async getMinimalAllowance(
    contractAddress: Address,
    functionToCall: InterfaceAbi,
    args?: any[],
    overrides?: PaymasterOverrides
  ): Promise<BigNumberish> {
    if (this.paymasterType !== PaymasterType.ERC20) {
      throw new PaymasterError(
        'Minimal allowance is only available for ERC20 paymasters',
        'UNSUPPORTED_PAYMASTER_TYPE'
      );
    }

    const gasLimit =
      overrides?.gasLimit ??
      (await this.estimateGas(
        await this.populatePaymasterTransaction(
          contractAddress,
          functionToCall,
          args,
          overrides
        )
      ));
    const maxFeePerGas =
      overrides?.maxFeePerGas ?? (await this.runner.provider.getGasPrice());

    // Added GAS_DIFF_FACTOR to the calculation because the gas estimation can be a little bit off when the 
    // transaction is executed. This is to ensure that the paymaster will have enough tokens to pay for the transaction.
    return ERC20Paymaster__factory.connect(
        this.address,
        this.runner
      ).calculateRequiredERC20Token(multiplyBigIntWithFLoat(BigInt(gasLimit) * BigInt(maxFeePerGas), GAS_DIFF_FACTOR));
  }
}

export async function getPaymaster(
  address: Address,
  runner: Signer | Wallet
): Promise<Paymaster> {
  const chainId = await sendRequest(runner, 'eth_chainId');

  const paymaster = ERC20Paymaster__factory.connect(address, runner);
  try {
    const token = await paymaster.ERC20Token();
    return new Paymaster(address, runner, PaymasterType.ERC20, chainId, token);
  } catch (error: any) {
    if (error.code === 'CALL_EXCEPTION') {
      return new Paymaster(address, runner, PaymasterType.SPONSORED, chainId);
    }
    throw new PaymasterError('Failed to get Paymaster instance', 'FAILED_TO_GET_PAYMASTER');
  }
}
