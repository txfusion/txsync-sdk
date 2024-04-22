// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MockERC1155 is ERC1155 {
    uint256 public constant COINS = 0;
    uint256 public constant NFT = 1;

    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC1155("") {}

    function mint(address _user) public {
        _mint(_user, COINS, 10 ** 18, "");
        _mint(_user, NFT, 1, "");
    }
}
