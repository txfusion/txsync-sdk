// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Transaction} from "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";
import {UnsafeBytes} from "@matterlabs/zksync-contracts/l1/contracts/common/libraries/UnsafeBytes.sol";

import {IRestriction} from "./interfaces/IRestriction.sol";

/**
 * @title FunctionParamsRestriction
 * @dev Manages restrictions on function parameters within specific contracts and functions.
 * This contract allows whitelisting specific parameters for certain functions in specified contracts.
 * It ensures that the provided function parameters match the whitelisted values, allowing or denying
 * transactions based on these conditions.
 */
contract FunctionParamsRestriction is Ownable, IRestriction {
    error InvalidFunctionCall();
    error InvalidAddress();
    error InvalidValue();

    enum DATA_TYPE {
        ADDRESS, // 0
        UINT256 // 1
    }

    struct FunctionParamValidation {
        bytes validValue;
        uint8 paramPosition;
        DATA_TYPE dataType;
    }

    string public name;

    // address => function selector => function validation data
    mapping(address => mapping(bytes4 => FunctionParamValidation[])) public whitelistedFunctionParams;
    // address => fun selector => true/false -> whitelists the whole function
    mapping(address => mapping(bytes4 => bool)) public isFunctionWhitelisted;

    event FunctionParamsWhitelistUpdated(
        address indexed targetContract, bytes4 indexed selector, FunctionParamValidation[] whitelistedParams
    );
    event FunctionWhiteListUpdated(address indexed contractAddress, bytes4 selector, bool status);

    /**
     * @dev Constructor to initialize the FunctionParamsRestriction contract.
     * @param _name The name of the restriction.
     * @param _contracts The array of contract addresses associated with the restriction.
     * @param _selectors The array of function selectors associated with the restriction.
     * @param _whitelistedParams The array of arrays of whitelisted function parameters.
     */
    constructor(
        string memory _name,
        address[] memory _contracts,
        bytes4[] memory _selectors,
        FunctionParamValidation[][] memory _whitelistedParams
    ) {
        name = _name;
        batchUpdateFunctionParamsWhitelist(_contracts, _selectors, _whitelistedParams);
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
     * @dev Updates the whitelist of function parameters for a specific function in a given contract.
     * @param _targetContract The target contract address.
     * @param _selector The function selector.
     * @param _whitelistedParams The array of whitelisted function parameters.
     */
    function updateFunctionParamsWhitelist(
        address _targetContract,
        bytes4 _selector,
        FunctionParamValidation[] memory _whitelistedParams
    ) public onlyOwner {
        whitelistedFunctionParams[_targetContract][_selector] = _whitelistedParams;
        emit FunctionParamsWhitelistUpdated(_targetContract, _selector, _whitelistedParams);
    }

    /**
     * @dev Updates the whitelist of function parameters for multiple functions in multiple contracts.
     * @param _targetContracts The array of target contract addresses.
     * @param _selectors The array of function selectors.
     * @param _whitelistedParams The array of arrays of whitelisted function parameters.
     */
    function batchUpdateFunctionParamsWhitelist(
        address[] memory _targetContracts,
        bytes4[] memory _selectors,
        FunctionParamValidation[][] memory _whitelistedParams
    ) public onlyOwner {
        require(
            _targetContracts.length == _selectors.length && _targetContracts.length == _whitelistedParams.length,
            "Array lengths must match"
        );

        for (uint256 i = 0; i < _targetContracts.length; i++) {
            updateFunctionParamsWhitelist(_targetContracts[i], _selectors[i], _whitelistedParams[i]);
        }
    }

    /**
     * @dev Checks if the transaction adheres to the whitelisted function parameter restrictions.
     * @param _transaction The transaction to be validated.
     * @return A boolean indicating whether the transaction is valid based on the whitelisted function parameters.
     */
    function canPayForTransaction(Transaction calldata _transaction) external view returns (bool) {
        address to = address(uint160(uint256(_transaction.to)));
        // get function selector, first 4 bytes belong to the function selector
        (uint32 functionSelector, uint256 offset) = UnsafeBytes.readUint32(_transaction.data, 0);
        // convert function selector from uint32 to bytes4
        bytes4 selector = bytes4(functionSelector);

        // checks if the whole function is whitelisted
        if (isFunctionWhitelisted[to][selector]) {
            return true;
        }

        // check if certain function params are whitelisted
        uint256 functionParamLength = whitelistedFunctionParams[to][selector].length;

        if (functionParamLength == 0) {
            revert InvalidFunctionCall();
        }

        // iterate over whitelisted function params
        for (uint256 i = 0; i < functionParamLength; i++) {
            bytes32 validData = bytes32(whitelistedFunctionParams[to][selector][i].validValue);
            uint8 paramPosition = whitelistedFunctionParams[to][selector][i].paramPosition;
            DATA_TYPE dataType = whitelistedFunctionParams[to][selector][i].dataType;

            bytes32 dataSlice;

            // this only works on non dynamic types
            if (paramPosition != 0) {
                // calculate offset based on param position
                offset = 4 + (32 * paramPosition);
            } else {
                // if it is a first param, start after function selector
                offset = 4;
            }

            // ready encoded value from data
            (dataSlice, offset) = UnsafeBytes.readBytes32(_transaction.data, offset);

            if (dataType == DATA_TYPE.ADDRESS) {
                address validAddress = address(uint160(uint256(bytes32(validData))));
                address receivedAddress = address(uint160(uint256(bytes32(dataSlice))));

                if (validAddress != receivedAddress) {
                    revert InvalidAddress();
                }
            } else if (dataType == DATA_TYPE.UINT256) {
                uint256 validValue = uint256(validData);
                uint256 receivedValue = uint256(dataSlice);

                if (validValue != receivedValue) {
                    revert InvalidValue();
                }
            }
        }
        return true;
    }
}
