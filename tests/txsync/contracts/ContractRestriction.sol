// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Transaction} from "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";
import {IRestriction} from "./interfaces/IRestriction.sol";

/**
 * @title ContractRestriction
 * @dev ContractRestriction manages a whitelist of contracts that are permitted to pay for transactions, providing control over transaction execution.
 */
contract ContractRestriction is Ownable, IRestriction {
    string public name;
    // Mapping to track the whitelist status of contracts. (contract address => is whitelisted)
    mapping(address => bool) public contractWhitelist;

    event ContractWhiteListUpdated(address indexed contractAddress, bool status);

    /**
     * @dev Constructor to initialize ContractRestriction with a given name and an initial set of contracts and their whitelist statuses.
     * @param _name The name associated with the contract restriction.
     * @param _contracts An array of contract addresses to be initially whitelisted or blacklisted.
     * @param _statuses An array of boolean statuses corresponding to the whitelist status of each contract.
     */
    constructor(string memory _name, address[] memory _contracts, bool[] memory _statuses) {
        name = _name;
        batchUpdateContractWhiteList(_contracts, _statuses);
    }

    /**
     * @dev Updates the whitelist status of a specific contract.
     * @param _contractAddress The address of the contract to be updated.
     * @param _status The new whitelist status for the contract.
     */
    function updateContractWhiteList(address _contractAddress, bool _status) public onlyOwner {
        contractWhitelist[_contractAddress] = _status;
        emit ContractWhiteListUpdated(_contractAddress, _status);
    }

    /**
     * @dev Updates the whitelist status for multiple contracts in a batch.
     * @param _contracts An array of contract addresses to be updated.
     * @param _statuses An array of boolean statuses corresponding to the whitelist status of each contract.
     */
    function batchUpdateContractWhiteList(address[] memory _contracts, bool[] memory _statuses) public onlyOwner {
        require(_contracts.length == _statuses.length, "Array lengths must match");

        for (uint256 i = 0; i < _contracts.length; i++) {
            updateContractWhiteList(_contracts[i], _statuses[i]);
        }
    }

    /**
     * @dev Checks if a contract is whitelisted and can pay for a given transaction.
     * @param _transaction The transaction to be validated.
     * @return True if the contract is whitelisted and allowed to pay for the transaction, false otherwise.
     */
    function canPayForTransaction(Transaction calldata _transaction) external view returns (bool) {
        return contractWhitelist[address(uint160(uint256(_transaction.to)))];
    }
}
