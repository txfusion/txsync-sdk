// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IPaymaster, ExecutionResult} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
import {Transaction} from "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";
import {IRestriction} from "./interfaces/IRestriction.sol";

/**
 * @title Paymaster
 * @dev The Paymaster contract serves as a foundational contract overseeing restriction management, Ethereum withdrawal, and
 * includes the logic for verifying paymaster restrictions before processing transactions.
 */
contract Paymaster is IPaymaster, Ownable {
    string public name;
    // Array of addresses representing associated restrictions
    address[] public restrictions;

    event TransactionExecuted(ExecutionResult result, uint256 from, uint256 to, uint256 requiredEth);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    modifier onlyBootloader() {
        require(msg.sender == BOOTLOADER_FORMAL_ADDRESS, "Only bootloader can call this method");
        // Continue execution if called from the bootloader.
        _;
    }

    /**
     * @dev Modifier to ensure that a transaction is allowed based on registered restrictions.
     * @param _transaction The transaction to be validated.
     */
    modifier onlyAllowedTransaction(Transaction calldata _transaction) {
        require(_transaction.paymasterInput.length >= 4, "The standard paymaster input must be at least 4 bytes long");

        for (uint256 i = 0; i < restrictions.length; i++) {
            require(
                IRestriction(restrictions[i]).canPayForTransaction(_transaction),
                "Paymaster is not useable for this transaction."
            );
        }
        _;
    }

    function addRestriction(address _restriction) public onlyOwner {
        restrictions.push(_restriction);
    }

    function removeRestriction(address _restriction) public onlyOwner {
        uint256 indexToRemove = type(uint256).max;
        for (uint256 i = 0; i < restrictions.length; i++) {
            if (restrictions[i] == _restriction) {
                indexToRemove = i;
                break;
            }
        }
        require(indexToRemove != type(uint256).max, "Restriction not found");

        for (uint256 i = indexToRemove; i < restrictions.length - 1; i++) {
            restrictions[i] = restrictions[i + 1];
        }
        restrictions.pop();
    }

    function getRestrictionsCount() public view returns (uint256) {
        return restrictions.length;
    }

    function getRestrictions() public view returns (address[] memory) {
        return restrictions;
    }

    /**
     * @dev Validates and processes payment for a paymaster transaction.
     * bytes32: First part of the hash to validate (filled by bootloader).
     * bytes32: Second part of the hash to validate (filled by bootloader).
     * @param _transaction The transaction to be validated and paid for.
     * @return magic The magic and context of the transaction (to be utilized by the bootloader).
     */
    function validateAndPayForPaymasterTransaction(bytes32, bytes32, Transaction calldata _transaction)
        external
        payable
        virtual
        onlyBootloader
        onlyAllowedTransaction(_transaction)
        returns (bytes4 magic, bytes memory context)
    {}

    /**
     * @dev Callback function executed after a transaction.
     * bytes: _data Additional data for the callback.
     * bytes32: First part of the hash.
     * bytes32: Second part of the hash.
     * @param _transaction The transaction that was executed.
     * @param _txResult The result of the transaction execution. (0: Revert, 1: Success)
     * uint256: The fee associated with the transaction.
     */
    function postTransaction(
        bytes calldata,
        Transaction calldata _transaction,
        bytes32,
        bytes32,
        ExecutionResult _txResult,
        uint256
    ) external payable override onlyBootloader {
        // Refunds are not supported yet.
        emit TransactionExecuted(
            _txResult, _transaction.from, _transaction.to, _transaction.gasLimit * _transaction.maxFeePerGas
        );
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success,) = payable(msg.sender).call{value: balance}("");
        require(success, "Failed to withdraw funds from paymaster.");
        emit FundsWithdrawn(msg.sender, balance);
    }

    receive() external payable {}
}
