// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./ERC20Paymaster.sol";
import "./SponsoredPaymaster.sol";

import "./interfaces/IDIAOracleV2.sol";

/**
 * @title Factory
 * @author TxFusion Team
 * @dev The Factory contract allows users to create and manage their paymasters, configure supported tokens for ERC20 paymasters,
 * and manage Oracle addresses for price information. Users can create paymasters using either the ERC20 or Sponsored payment methods.
 * Paymaster creation incurs a cost, and the contract handles charging users appropriately.
 */
contract Factory is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    // Enum to represent payment methods (Supported Paymaster types)
    enum PaymentMethod {
        SPONSORED,
        ERC20
    }

    // Struct to represent a deployed paymaster item
    struct TsukoItem {
        PaymentMethod method;
        address contractAddress;
    }

    // Struct to represent token configuration for ERC20 Paymaster creation
    struct TokenConfig {
        string priceFeedKey;
        bool whitelisted;
    }

    // Mapping to track deployed paymasters for each user
    mapping(address => TsukoItem[]) public deployedPaymasters;
    // Mapping to store token configurations(tokenAddress=>Configuration)
    mapping(address => TokenConfig) public tokenConfigs;
    // Address of the Oracle contract
    address public priceFeedAddress;
    // Price in USD for paymaster creation
    uint256 public paymasterCreationPriceInUSD;

    event PaymasterCreated(address paymaster);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    event TokenConfigAdded(address indexed tokenAddress, string priceFeedKey);
    event TokenWhitelistStatusUpdated(address indexed tokenAddress, bool whitelisted);

    /**
     * @dev Initializes the Factory contract with the Oracle address and paymaster creation cost.
     * @param _priceFeedAddress Address of the ptice feed Oracle contract.
     * @param _paymasterCreationPriceInUSD Cost in USD for paymaster creation.
     */
    function initialize(address _priceFeedAddress, uint256 _paymasterCreationPriceInUSD) external initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
        priceFeedAddress = _priceFeedAddress;
        paymasterCreationPriceInUSD = _paymasterCreationPriceInUSD;
    }

    // Function to authorize upgrades, only callable by the owner
    function _authorizeUpgrade(address) internal override onlyOwner {}

    function createERC20Paymaster(address _tokenAddress, string memory _name) public payable {
        require(tokenConfigs[_tokenAddress].whitelisted, "Token is not supported");
        require(msg.value >= calculatePaymasterCreationRequiredETH(), "Insufficient value for paymaster creation!");

        string memory _priceFeedKey = tokenConfigs[_tokenAddress].priceFeedKey;

        ERC20Paymaster newPaymaster = new ERC20Paymaster(
            _tokenAddress,
            _name,
            _priceFeedKey,
            priceFeedAddress
        );
        newPaymaster.transferOwnership(msg.sender);
        deployedPaymasters[msg.sender].push(
            TsukoItem({contractAddress: address(newPaymaster), method: PaymentMethod.ERC20})
        );

        emit PaymasterCreated(address(newPaymaster));
    }

    function createSponsoredPaymaster(string memory _name) public payable {
        require(msg.value >= calculatePaymasterCreationRequiredETH(), "Insufficient value for paymaster creation!");
        SponsoredPaymaster newPaymaster = new SponsoredPaymaster(_name);
        newPaymaster.transferOwnership(msg.sender);
        deployedPaymasters[msg.sender].push(
            TsukoItem({contractAddress: address(newPaymaster), method: PaymentMethod.SPONSORED})
        );

        emit PaymasterCreated(address(newPaymaster));
    }

    function getDeployedPaymasters() public view returns (TsukoItem[] memory) {
        return deployedPaymasters[msg.sender];
    }

    function addTokenConfig(address _tokenAddress, string memory _priceFeedKey) external onlyOwner {
        tokenConfigs[_tokenAddress] = TokenConfig(_priceFeedKey, true);
        emit TokenConfigAdded(_tokenAddress, _priceFeedKey);
    }

    function updateTokenWhitelistStatus(address _tokenAddress, bool _newValue) external onlyOwner {
        tokenConfigs[_tokenAddress].whitelisted = _newValue;
        emit TokenWhitelistStatusUpdated(_tokenAddress, _newValue);
    }

    function updatePaymasterCreationPriceInUSD(uint256 _paymasterCreationPriceInUSD) external onlyOwner {
        require(_paymasterCreationPriceInUSD > 0, "paymaster creation cost should be more than 0");
        paymasterCreationPriceInUSD = _paymasterCreationPriceInUSD;
    }

    function calculatePaymasterCreationRequiredETH() public view returns (uint256) {
        (uint256 ETHUSDPrice,) = IDIAOracleV2(priceFeedAddress).getValue("ETH/USD");
        return (
            (
                paymasterCreationPriceInUSD
                // ETH: 18 decimals, DIA Oracle price: 8 decimals.
                * 1e4
            ) / ETHUSDPrice
        );
    }

    // Function to withdraw funds from the contract, only callable by the owner
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success,) = payable(msg.sender).call{value: balance}("");
        require(success, "Failed to withdraw funds from Factory.");
        emit FundsWithdrawn(msg.sender, balance);
    }

    /**
     * @dev External function to update the DIA Oracle address, accessible only by the owner.
     * @param _priceFeedAddress The new address of the DIA Oracle.
     */
    function updatePriceFeedAddress(address _priceFeedAddress) public onlyOwner {
        require(_priceFeedAddress != address(0), "Invalid address");
        priceFeedAddress = _priceFeedAddress;
    }
}
