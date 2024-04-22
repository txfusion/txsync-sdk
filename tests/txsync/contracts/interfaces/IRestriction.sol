// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Transaction} from "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";

interface IRestriction {
    function canPayForTransaction(Transaction calldata _transaction) external view returns (bool);
}
