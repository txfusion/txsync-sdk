// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Transaction} from "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";
import {UnsafeBytes} from "@matterlabs/zksync-contracts/l1/contracts/common/libraries/UnsafeBytes.sol";

import {IRestriction} from "./interfaces/IRestriction.sol";

/**
 * @title FunctionRestriction
 * @dev FunctionRestriction allows for the selective whitelisting of specific functions within designated contracts, regulating access based on their individual whitelist status.
 */
contract FunctionRestriction is Ownable, IRestriction {
    string public name;
    // address => fun selector => true/false -> whitelists the whole function
    mapping(address => mapping(bytes4 => bool)) public isFunctionWhitelisted;

    event FunctionWhiteListUpdated(address indexed contractAddress, bytes4 selector, bool status);

    /**
     * @dev Constructor to initialize FunctionRestriction with a given name and an initial set of contracts, function selectors, and their whitelist statuses.
     * @param _name The name associated with the function restriction.
     * @param _contracts An array of contract addresses where functions are to be whitelisted or blacklisted.
     * @param _selectors An array of function selectors corresponding to the functions to be initially whitelisted or blacklisted.
     * @param _statuses An array of boolean statuses corresponding to the whitelist status of each function within its contract.
     */
    constructor(string memory _name, address[] memory _contracts, bytes4[] memory _selectors, bool[] memory _statuses) {
        name = _name;
        batchUpdateFunctionWhitelist(_contracts, _selectors, _statuses);
    }

    /**
     * @dev Updates the whitelist status of a specific function within a given contract.
     * @param _targetContract The address of the contract where the function resides.
     * @param _selector The function selector to be updated.
     * @param _status The new whitelist status for the function.
     */
    function updateFunctionWhitelist(address _targetContract, bytes4 _selector, bool _status) public onlyOwner {
        isFunctionWhitelisted[_targetContract][_selector] = _status;
        emit FunctionWhiteListUpdated(_targetContract, _selector, _status);
    }

    /**
     * @dev Updates the whitelist status for multiple functions within multiple contracts in a batch.
     * @param _targetContracts An array of contract addresses where functions are to be updated.
     * @param _selectors An array of function selectors corresponding to the functions to be updated.
     * @param _statuses An array of boolean statuses corresponding to the whitelist status of each function within its contract.
     */
    function batchUpdateFunctionWhitelist(
        address[] memory _targetContracts,
        bytes4[] memory _selectors,
        bool[] memory _statuses
    ) public onlyOwner {
        require(
            _targetContracts.length == _selectors.length && _targetContracts.length == _statuses.length,
            "Array lengths must match"
        );

        for (uint256 i = 0; i < _targetContracts.length; i++) {
            updateFunctionWhitelist(_targetContracts[i], _selectors[i], _statuses[i]);
        }
    }

    /**
     * @dev Checks if a function within a given contract is whitelisted and can be paid for in a transaction.
     * @param _transaction The transaction to be validated.
     * @return True if the function is whitelisted, allowing payment for the transaction, false otherwise.
     */
    function canPayForTransaction(Transaction calldata _transaction) external view returns (bool) {
        // get function selector, first 4 bytes belong to the function selector
        (uint32 functionSelector,) = UnsafeBytes.readUint32(_transaction.data, 0);
        // convert function selector from uint32 to bytes4
        bytes4 selector = bytes4(functionSelector);
        return isFunctionWhitelisted[address(uint160(uint256(_transaction.to)))][selector];
    }
}
