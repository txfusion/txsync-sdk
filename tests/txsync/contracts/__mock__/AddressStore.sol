//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

contract AddressStore {
    address public wallet;

    constructor(address _wallet) {
        wallet = _wallet;
    }

    function setAddress(address _wallet) public {
        wallet = _wallet;
    }
}
