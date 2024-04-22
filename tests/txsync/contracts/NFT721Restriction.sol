// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";
import "./interfaces/IRestriction.sol";

contract NFT721Restriction is Ownable, IRestriction {
    string public name;
    address public nftContract;

    constructor(string memory _name, address _nftContract) {
        name = _name;
        nftContract = _nftContract;
    }

    function updateNftContract(address _nftContract) external onlyOwner {
        nftContract = _nftContract;
    }

    function canPayForTransaction(
        Transaction calldata _transaction
    ) external view override returns (bool) {
        address userAddress = address(uint160(_transaction.from));
        return (IERC721(nftContract).balanceOf(userAddress) > 0);
    }
}
