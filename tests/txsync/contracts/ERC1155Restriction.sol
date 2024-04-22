// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Transaction} from "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

import {IRestriction} from "./interfaces/IRestriction.sol";

contract ERC1155Restriction is Ownable, IRestriction {
    string public name;
    address public contractAddress;

    struct ERC1155Item {
        uint256 tokenId;
        uint256 amount;
    }

    ERC1155Item[] public ERC1155WhitelistItems;

    event ERC1155ItemAdded(uint256 tokenId, uint256 amount);

    event ERC1155ItemRemoved(uint256 tokenId);

    event ERC1155ItemUpdated(uint256 tokenId, uint256 amount);

    constructor(
        string memory _name,
        address _contractAddress,
        uint256[] memory _tokenIds,
        uint256[] memory _amounts
    ) {
        name = _name;
        contractAddress = _contractAddress;
        batchAddERC1155Items(_tokenIds, _amounts);
    }

    function batchAddERC1155Items(
        uint256[] memory _tokenIds,
        uint256[] memory _amounts
    ) internal onlyOwner {
        require(
            _tokenIds.length == _amounts.length,
            "Array lengths must match"
        );

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            addERC1155Item(_tokenIds[i], _amounts[i]);
        }
    }

    function addERC1155Item(
        uint256 _tokenId,
        uint256 _amount
    ) public onlyOwner {
        require(_amount > 0, "Amount should be greater than 0");

        ERC1155WhitelistItems.push(ERC1155Item(_tokenId, _amount));
        emit ERC1155ItemAdded(_tokenId, _amount);
    }

    function removeERC1155Item(uint256 _index) public onlyOwner {
        require(_index < ERC1155WhitelistItems.length, "Index out of bounds");

        ERC1155Item memory item = ERC1155WhitelistItems[_index];
        uint256 tokenId = item.tokenId;

        for (uint256 i = _index; i < ERC1155WhitelistItems.length - 1; i++) {
            ERC1155WhitelistItems[i] = ERC1155WhitelistItems[i + 1];
        }
        ERC1155WhitelistItems.pop();

        emit ERC1155ItemRemoved(tokenId);
    }

    function updateERC1155Item(
        uint256 _index,
        uint256 _amount
    ) external onlyOwner {
        require(_amount > 0, "Amount should be greater than 0");
        ERC1155Item storage item = ERC1155WhitelistItems[_index];
        item.amount = _amount;
        emit ERC1155ItemUpdated(item.tokenId, _amount);
    }

    function updateContractAddress(address _contractAddress) public onlyOwner {
        contractAddress = _contractAddress;
    }

    function getERC1155WhitelistItems()
        public
        view
        returns (ERC1155Item[] memory)
    {
        return ERC1155WhitelistItems;
    }

    function canPayForTransaction(
        Transaction calldata _transaction
    ) external view override returns (bool) {
        address userAddress = address(uint160(_transaction.from));

        for (uint256 i = 0; i < ERC1155WhitelistItems.length; i++) {
            ERC1155Item memory Item = ERC1155WhitelistItems[i];
            if (
                IERC1155(contractAddress).balanceOf(
                    userAddress,
                    Item.tokenId
                ) >= Item.amount
            ) {
                return true;
            }
        }

        return false;
    }
}
