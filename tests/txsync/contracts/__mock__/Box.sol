// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract Box {
    uint256 private value;
    uint256 private secondValue;
    uint256 private thirdValue;

    function initialize(uint256 initValue) public {
        value = initValue;
    }

    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }

    // Stores a new value in the contract
    function store(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }
    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);
}
