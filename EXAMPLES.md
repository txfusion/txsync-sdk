# Usage Examples

This document provides examples of how to use the `Paymaster` class and its associated functionality for interacting with Paymaster contracts on the zkSync network. The examples cover various scenarios and use cases, demonstrating the different methods and types available in the library.

The `Paymaster` class is a utility class that simplifies the process of sending transactions through Paymaster contracts, either `ERC20Paymaster` or `SponsoredPaymaster`. It abstracts away the complexities of constructing and formatting transactions, handling gas estimation, and interacting with the Paymaster contracts.

In addition to the core functionality of sending transactions, the `Paymaster` class also provides methods for managing restrictions, which are external smart contracts that can enforce specific conditions or rules for transactions to be eligible for payment by the Paymaster.

The examples in this document will cover the following aspects:

- Initializing and setting up the `Paymaster` instance
- Sending transactions through the Paymaster
- Estimating gas requirements for transactions
- Adding, retrieving, and removing restrictions
- Checking transaction eligibility based on restrictions
- Calculating the minimal allowance required for ERC20 Paymasters

Each example will be accompanied by a brief description, code snippets, and explanations of the relevant methods and parameters used. These examples can serve as a starting point for understanding and integrating the `Paymaster` library into your own applications or projects.

Note that these examples assume familiarity with the zkSync network, Ethereum development, and the overall context in which the `Paymaster` library operates.

## Preparation

Before you can start using the `Paymaster` class, you need to obtain a signer instance. In the context of a web application, you can use the `BrowserProvider` from the `zksync-ethers` library to get a signer from the user's Web3 provider (e.g., MetaMask). Also, please include imports for Paymaster abstractions, like showed in the following code.

```javascript
import { getPaymaster, createRestriction, types, typechain } from "txsync-sdk";
import { BrowserProvider } from "zksync-ethers";

const signer = await new BrowserProvider(window.ethereum!).getSigner();
```

## Obtaining the Paymaster Instance

To create a new instance of the `Paymaster` class, you can use the `getPaymaster` helper function provided by the package. This function takes the address of the Paymaster contract and the signer instance (obtained in the previous step) as input parameters.

```javascript
const Paymaster = await getPaymaster(paymasterAddress, signer);

console.log(`PaymasterType: ${Paymaster.paymasterType === types.PaymasterType.ERC20 ? "ERC20" : "Sponsored"}`)
console.log(`Token Address: ${Paymaster.token}`);
```

As you can see, the `getPaymaster` method automatically infers the type of the Paymaster contract (`ERC20Paymaster` or `SponsoredPaymaster`) based on the provided Paymaster address. Additionally, if the Paymaster is an `ERC20Paymaster`, it also retrieves the address of the associated ERC20 token.

## Sending a Transaction through the Paymaster

To send a transaction through the Paymaster, you can use the `sendPaymasterTransaction` method provided by the `Paymaster` class. This method takes the contract address, the function to call interface (check docs), an optional array of arguments as input parameters, and optional overrides for the transaction.

```javascript
const greeterAddress = "0x..."; // Replace with the actual contract address
const functionToCallSignature = "function setGreeting(string memory _greeting)";
const args = ["Hello from paymaster"];

const txResponse = await Paymaster.sendPaymasterTransaction(greeterAddress, functionToCallSignature, args);
```

To simplify the process of passing arguments to the `sendPaymasterTransaction` method, the package provides a type called `PaymasterParams`. This type is a tuple that defines the order and types of the parameters, making it easier to pass the  arguments. Here's an example of using `PaymasterParams`:

```javascript
const PaymasterParams: types.PaymasterParams = [
  "0x...", // Replace with the actual contract address
  "function setGreeting(string memory _greeting)",
  ["Hello from paymaster"],
];

const txResponse = await Paymaster.sendPaymasterTransaction(...PaymasterParams);
```

## Populating a Paymaster Transaction

The `sendPaymasterTransaction` method is a convenient way to send a transaction through the Paymaster, as it handles the entire process for you. It calls `populatePaymasterTransaction` internally to populate the `TransactionRequest` object based on the provided parameters. Additionally, it estimates the gas required for the transaction and uses the runner's (signer/wallet) `sendTransaction` method to send the populated transaction.

However, if you need to inspect or modify the populated transaction before sending it, or if you want to perform additional checks or operations on the transaction data, you can use the `populatePaymasterTransaction` method directly. This method returns the populated `TransactionRequest` object, giving you a glimpse into how the transaction will look before it's sent. You can then make any necessary modifications to the transaction object and send it using the `sendTransaction` method.

```javascript
const PaymasterParams: types.PaymasterParams = [
  "0x...", // Replace with the actual contract address
  "function setGreeting(string memory _greeting)",
  ["Hello from paymaster"],
];

const populatedTx = await Paymaster.populatePaymasterTransaction(...PaymasterParams);
```

## Estimating Gas for Paymaster Transactions

The `estimateGas` method provided by the `Paymaster` class allows you to estimate the gas required for a transaction that will be sent through the Paymaster. While this method can be used to estimate gas for any transaction, it is specifically tailored to handle the nuances of Paymaster Paymasters.

```javascript
const gasLimit = await Paymaster.estimateGas(populatedTx);
```

## Sending Transaction

```javascript
const txResponse = await Paymaster.sendTransaction(populatedTx);
```

## Getting the Minimal Allowance for ERC20 Paymasters

When using an `ERC20Paymaster`, it's necessary to approve/check if the Paymaster contract has a sufficient allowance of ERC20 token. The `getMinimalAllowance` method provided by the `Paymaster` class allows you to calculate the minimal allowance required for a specific transaction, ensuring that the Paymaster has enough token allowance to pay for the transaction fees.

```javascript
if (Paymaster.paymasterType === types.PaymasterType.ERC20) {
 // Returns ethers.Contract instance of the ERC20 token
 const erc20Contract = typechain.ERC20Token__factory.connect(tokenAddress, signer);

 const allowance = await Paymaster.getMinimalAllowance(...PaymasterParams);

 // Approves needed allowance for paying transaction fees.
 await (await erc20Contract.approve(paymasterAddress, allowance)).wait();
}

const txResponse = await Paymaster.sendPaymasterTransaction(...PaymasterParams);
```

## Creating a Restriction

The package provides a `createRestriction` function that allows you to create various types of restrictions for your Paymaster contract. Restrictions are external smart contracts that enforce specific conditions or rules for transactions to be eligible for payment by the Paymaster.

```javascript
const userRestrictionAddress = await createRestriction(
 "USER_RESTRICTION", // Name of the restriction
 types.RestrictionMethod.USER, // Restriction type
 signer, // Runner used to deploy restriction
 [signer.address], // In this specific case (when user restirction is created), only this address will be available to use Paymaster
 restrictionFactoryAddress, // Optional. This is prefilled based on chain ID (TODO: Ask for Factory Addresses on testnet and mainnet).
);
```

## Managing Restrictions

After creating a restriction contract, you can add it to your Paymaster using the `addRestriction` method provided by the `Paymaster` instance. Additionally, you can retrieve a list of all added restrictions and remove a specific restriction if needed.

```javascript
await (await Paymaster.addRestriction(userRestrictionAddress)).wait();

console.log(await Paymaster.getRestrictions());

// Remove restriction at index 0
await (await Paymaster.removeRestriction((await Paymaster.getRestrictions())[0])).wait();
```

## Checking Transaction Eligibility

Before sending a transaction through the Paymaster, you can check if the transaction is eligible for payment based on the added restrictions. The `checkTransactionEligibility` method provided by the `Paymaster` instance allows you to perform this check.

```javascript
const isEligible = await Paymaster.checkTransactionEligibility(...PaymasterParams);
console.log(`Transaction is eligible: ${isEligible}`);
```

## Typechain

In order to make it easier for users to interact with paymaster, restriction or other contracts, package exports typechain for the mentioned abstraction as well. 

```javascript
const userRestrictionContract = typechain.UserRestriction__factory.connect(userRestrictionAddress, signer);
console.log(await userRestrictionContract.userWhitelist(await signer.getAddress()));

const erc20TokenContract = typechain.ERC20Token__factory.connect(tokenAddress, signer);
console.log(await erc20TokenContract.balanceOf(await signer.getAddress()));
```
