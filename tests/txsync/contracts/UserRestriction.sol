// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Transaction} from "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";
import {IRestriction} from "./interfaces/IRestriction.sol";

/**
 * @title UserRestriction
 * @dev UserRestriction manages a whitelist of user addresses that are permitted to pay for transactions, providing control over transaction execution.
 */
contract UserRestriction is Ownable, IRestriction {
    string public name;
    // Mapping to track the whitelist status of user addresses.(user address => is whitelisted)
    mapping(address => bool) public userWhitelist;

    event UserWhiteListUpdated(address indexed userAddress, bool status);

    /**
     * @dev Constructor to initialize UserRestriction with a given name and an initial set of users and their whitelist statuses.
     * @param _name The name associated with the user restriction.
     * @param _users An array of user addresses to be initially whitelisted or blacklisted.
     * @param _statuses An array of boolean statuses corresponding to the whitelist status of each user address.
     */
    constructor(string memory _name, address[] memory _users, bool[] memory _statuses) {
        name = _name;
        batchUpdateUserWhiteList(_users, _statuses);
    }

    /**
     * @dev Updates the whitelist status of a specific user address.
     * @param _userAddress The address of the user to be updated.
     * @param _status The new whitelist status for the user address.
     */
    function updateUserWhiteList(address _userAddress, bool _status) public onlyOwner {
        userWhitelist[_userAddress] = _status;
        emit UserWhiteListUpdated(_userAddress, _status);
    }

    /**
     * @dev Updates the whitelist status for multiple user addresses in a batch.
     * @param _users An array of user addresses to be updated.
     * @param _statuses An array of boolean statuses corresponding to the whitelist status of each user address.
     */
    function batchUpdateUserWhiteList(address[] memory _users, bool[] memory _statuses) public onlyOwner {
        require(_users.length == _statuses.length, "Array lengths must match");

        for (uint256 i = 0; i < _users.length; i++) {
            updateUserWhiteList(_users[i], _statuses[i]);
        }
    }

    /**
     * @dev Checks if a user address is whitelisted and can pay for a given transaction.
     * @param _transaction The transaction to be validated.
     * @return True if the user address is whitelisted and allowed to pay for the transaction, false otherwise.
     */
    function canPayForTransaction(Transaction calldata _transaction) external view returns (bool) {
        return userWhitelist[address(uint160(_transaction.from))];
    }
}
