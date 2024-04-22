// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

import {
    IPaymaster,
    ExecutionResult,
    PAYMASTER_VALIDATION_SUCCESS_MAGIC
} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
import {IPaymasterFlow} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymasterFlow.sol";
import {
    TransactionHelper,
    Transaction
} from "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";

import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";

import {Paymaster} from "./Paymaster.sol";
import "./interfaces/IDIAOracleV2.sol";
import "./interfaces/IRestriction.sol";

/**
 * @title ERC20Paymaster
 * @dev ERC20Paymaster is a paymaster contract specialized in processing transactions with ERC20 tokens as fees.
 */
contract ERC20Paymaster is Paymaster {
    using SafeERC20 for IERC20;

    // Address of the ERC20 token
    address public ERC20Token;
    // Key associated with the ERC20 token (foreign key to connect with token price feed oracle)
    string public priceFeedKey;
    // Address of the DIA Oracle priceFeedAddress
    address private priceFeedAddress;
    // Adjustment factor for token calculations: This factor, expressed as a percentage, influences the amount of ERC20 tokens required for a transaction. When set to 100, the required ERC20 amount matches the equivalent dollar value of the required ETH.
    uint256 public tokenAdjustmentFactor = 100;

    event TokensWithdrawn(address indexed owner, uint256 amount);
    event TokenAdjustmentFactorUpdated(uint256 newTokenAdjustmentFactor);
    event PriceFeedAddressUpdated(address newPriceFeedAddress);

    /**
     * @dev Constructor to initialize ERC20Paymaster with essential parameters.
     * @param _erc20 Address of the ERC20 token.
     * @param _name Name of the paymaster.
     * @param _priceFeedKey Key associated with the ERC20 token.
     * @param _priceFeedAddress Address of the DIA Oracle.
     */
    constructor(address _erc20, string memory _name, string memory _priceFeedKey, address _priceFeedAddress) {
        ERC20Token = _erc20;
        name = _name;
        priceFeedKey = _priceFeedKey;
        priceFeedAddress = _priceFeedAddress;
    }

    /**
     * @dev Retrieves the price from the DIA Oracle for a specified key.
     * @param _priceFeedKey The priceFeedKey for which the price is retrieved.
     * @return price The price value from the DIA Oracle.
     */
    function readPriceFeed(string memory _priceFeedKey) public view returns (uint256 price) {
        (price,) = IDIAOracleV2(priceFeedAddress).getValue(_priceFeedKey);
        require(price > 0);
        return price;
    }

    /**
     * @dev Internal function to calculate the required amount of ERC20 tokens based on the provided ETH amount.
     * @param _requiredETH The amount of ETH required for the transaction.
     * @return The calculated amount of ERC20 tokens required.
     */
    function _calculateRequiredERC20Token(uint256 _requiredETH) internal view returns (uint256) {
        // Read values from the oracle
        uint256 ETHUSDPrice = readPriceFeed("ETH/USD");
        uint256 TokenUSDPrice = readPriceFeed(priceFeedKey);
        uint8 decimals = IERC20Metadata(ERC20Token).decimals();

        // Calculate the required ERC20 tokens to be sent to the paymaster
        return (
            (_requiredETH * (10 ** decimals) * ETHUSDPrice * tokenAdjustmentFactor)
                / (
                    TokenUSDPrice
                    // 18 for ETH 2 for token tokenAdjustmentFactor
                    * (10 ** 20)
                )
        );
    }

    function calculateRequiredERC20Token(uint256 _requiredETH) external view returns (uint256) {
        return _calculateRequiredERC20Token(_requiredETH);
    }

    function validateAndPayForPaymasterTransaction(bytes32, bytes32, Transaction calldata _transaction)
        external
        payable
        override
        onlyBootloader
        onlyAllowedTransaction(_transaction)
        returns (bytes4 magic, bytes memory context)
    {
        // By default we consider the transaction as accepted.
        magic = PAYMASTER_VALIDATION_SUCCESS_MAGIC;

        bytes4 paymasterInputSelector = bytes4(_transaction.paymasterInput[0:4]);
        if (paymasterInputSelector == IPaymasterFlow.approvalBased.selector) {
            // While the transaction data consists of address, uint256 and bytes data,
            // the data is not needed for this paymaster
            (address token, uint256 amount) = abi.decode(_transaction.paymasterInput[4:], (address, uint256));

            // Verify if token is the correct one
            require(token == ERC20Token, "Invalid token");

            // We verify that the user has provided enough allowance
            address userAddress = address(uint160(_transaction.from));

            address thisAddress = address(this);

            uint256 providedAllowance = IERC20(token).allowance(userAddress, thisAddress);

            uint256 requiredETH = _transaction.gasLimit * _transaction.maxFeePerGas;

            // Calculate the required ERC20 tokens to be sent to the paymaster
            // (Equal to the value of requiredETH)

            uint256 requiredERC20 = _calculateRequiredERC20Token(requiredETH);
            require(providedAllowance >= requiredERC20, "Min paying allowance too low");

            // Note, that while the minimal amount of ETH needed is tx.gasPrice * tx.gasLimit,
            // neither paymaster nor account are allowed to access this context variable.
            try IERC20(token).transferFrom(userAddress, thisAddress, requiredERC20) {}
            catch (bytes memory revertReason) {
                // If the revert reason is empty or represented by just a function selector,
                // we replace the error with a more user-friendly message
                if (requiredERC20 > amount) {
                    revert("Not the required amount of tokens sent");
                }
                if (revertReason.length <= 4) {
                    revert("Failed to transferFrom from users' account");
                } else {
                    assembly {
                        revert(add(0x20, revertReason), mload(revertReason))
                    }
                }
            }

            // The bootloader never returns any data, so it can safely be ignored here.
            (bool success,) = payable(BOOTLOADER_FORMAL_ADDRESS).call{value: requiredETH}("");
            require(success, "Failed to transfer funds to the bootloader");
        } else {
            revert("Unsupported paymaster flow");
        }
    }

    /**
     * @dev External function to withdraw ERC20 tokens, accessible only by the owner.
     */
    function withdrawToken() external onlyOwner {
        IERC20 tokenContract = IERC20(ERC20Token);
        uint256 tokenBalance = tokenContract.balanceOf(address(this));
        tokenContract.safeTransfer(msg.sender, tokenBalance);
        emit TokensWithdrawn(msg.sender, tokenBalance);
    }

    /**
     * @dev External function to update the token adjustment factor, accessible only by the owner.
     * @param _tokenAdjustmentFactor The new token adjustment factor value.
     */
    function updateTokenAdjustmentFactor(uint256 _tokenAdjustmentFactor) public onlyOwner {
        require(_tokenAdjustmentFactor > 0, "value should be more than 0");
        tokenAdjustmentFactor = _tokenAdjustmentFactor;
        emit TokenAdjustmentFactorUpdated(_tokenAdjustmentFactor);
    }

    /**
     * @dev External function to update the DIA Oracle address, accessible only by the owner.
     * @param _priceFeedAddress The new address of the DIA Oracle.
     */
    function updatePriceFeedAddress(address _priceFeedAddress) public onlyOwner {
        require(_priceFeedAddress != address(0), "Invalid address");
        priceFeedAddress = _priceFeedAddress;
        emit PriceFeedAddressUpdated(_priceFeedAddress);
    }

    /**
     * @dev External function to update the price feed key, accessible only by the owner.
     * @param _priceFeedKey The new price feed key.
     */
    function updatePriceFeedKey(string memory _priceFeedKey) external onlyOwner {
        require(bytes(_priceFeedKey).length > 0, "Invalid price feed key");
        priceFeedKey = _priceFeedKey;
    }
}
