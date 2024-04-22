// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./ContractRestriction.sol";
import "./UserRestriction.sol";
import "./FunctionRestriction.sol";
import "./FunctionParamsRestriction.sol";
import "./NFT721Restriction.sol";
import "./interfaces/IDIAOracleV2.sol";
import "./ERC1155Restriction.sol";

/**
 * @title RestrictionFactory
 * @author TxFusion Team
 * @dev Facilitates the creation and management of various restrictions, including Contract, User, Function, and Function Params restrictions.
 * Users can create restrictions of different types, each associated with specific functionalities and parameters.
 * Restrictions are assignable to specific contracts or users, and the factory handles their creation and ownership transfer.
 */
contract RestrictionFactory is
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable
{
    // Enum to represent restriction methods (Supported Restriction types)
    enum Method {
        CONTRACT, //0
        USER, //1
        FUNCTION, //2
        FUNCTIONPARAMS, //3
        NFT721, //4
        ERC1155 // 5
    }

    struct RestrictionItem {
        Method method;
        address contractAddress;
    }

    // Mapping to track deployed restrictions for each user (userAddres=> array of deployed restrictions addresses)
    mapping(address => address[]) public deployedRestrictions;
    // Mapping to store the method of each restriction (restrictionAddress => Method)
    mapping(address => Method) public restrictionsMethod;
    // Mapping to store the price of  creating each restriction methods in USD (Method=>price)
    mapping(Method => uint256) public restrictionCreationPricesInUSD;
    // Address of the Oracle contract
    address public priceFeedAddress;

    event RestrictionCreated(address restriction);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    modifier onlyWithSufficientPayment(Method _method) {
        require(
            msg.value >=
                calculateRestrictionCreationRequiredETH(
                    restrictionCreationPricesInUSD[_method]
                ),
            "Insufficient value for restriction creation!"
        );
        _;
    }

    function initialize(address _priceFeedAddress) external initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
        priceFeedAddress = _priceFeedAddress;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    /**
     * @dev Creates a Contract Restriction.
     * @param _name Name of the restriction.
     * @param _contracts Array of contract addresses associated with the restriction.
     * @param _statuses Array of boolean statuses indicating restriction status for each corresponding contract. (true=> allowed | false=> not allowed)
     */
    function createContractRestriction(
        string memory _name,
        address[] memory _contracts,
        bool[] memory _statuses
    ) public payable onlyWithSufficientPayment(Method.CONTRACT) {
        ContractRestriction newRestriction = new ContractRestriction(
            _name,
            _contracts,
            _statuses
        );
        newRestriction.transferOwnership(msg.sender);
        deployedRestrictions[msg.sender].push(address(newRestriction));
        restrictionsMethod[address(newRestriction)] = Method.CONTRACT;
        emit RestrictionCreated(address(newRestriction));
    }

    /**
     * @dev Creates a User Restriction.
     * @param _name Name of the restriction.
     * @param _users Array of user addresses associated with the restriction.
     * @param _statuses Array of boolean statuses indicating restriction status for each corresponding user. (true=> allowed | false=> not allowed)
     */
    function createUserRestriction(
        string memory _name,
        address[] memory _users,
        bool[] memory _statuses
    ) public payable onlyWithSufficientPayment(Method.USER) {
        UserRestriction newRestriction = new UserRestriction(
            _name,
            _users,
            _statuses
        );
        newRestriction.transferOwnership(msg.sender);
        deployedRestrictions[msg.sender].push(address(newRestriction));
        restrictionsMethod[address(newRestriction)] = Method.USER;
        emit RestrictionCreated(address(newRestriction));
    }

    /**
     * @dev Creates a Function Restriction.
     * @param _name Name of the restriction.
     * @param _contracts Array of contract addresses associated with the restriction.
     * @param _selectors Array of function selectors associated with the restriction.
     * @param _statuses Array of boolean statuses indicating restriction status for each corresponding function. (true=> allowed | false=> not allowed)
     */
    function createFunctionRestriction(
        string memory _name,
        address[] memory _contracts,
        bytes4[] memory _selectors,
        bool[] memory _statuses
    ) public payable onlyWithSufficientPayment(Method.FUNCTION) {
        FunctionRestriction newRestriction = new FunctionRestriction(
            _name,
            _contracts,
            _selectors,
            _statuses
        );
        newRestriction.transferOwnership(msg.sender);
        deployedRestrictions[msg.sender].push(address(newRestriction));
        restrictionsMethod[address(newRestriction)] = Method.FUNCTION;
        emit RestrictionCreated(address(newRestriction));
    }

    /**
     * @dev Creates a Function Params Restriction.
     * @param _name Name of the restriction.
     * @param _contracts Array of contract addresses associated with the restriction.
     * @param _selectors Array of function selectors associated with the restriction.
     * @param _whitelistedParams Array of arrays representing whitelisted function parameters for each corresponding function.
     */
    function createFunctionParamsRestriction(
        string memory _name,
        address[] memory _contracts,
        bytes4[] memory _selectors,
        FunctionParamsRestriction.FunctionParamValidation[][]
            memory _whitelistedParams
    ) public payable onlyWithSufficientPayment(Method.FUNCTIONPARAMS) {
        FunctionParamsRestriction newRestriction = new FunctionParamsRestriction(
                _name,
                _contracts,
                _selectors,
                _whitelistedParams
            );
        newRestriction.transferOwnership(msg.sender);
        deployedRestrictions[msg.sender].push(address(newRestriction));
        restrictionsMethod[address(newRestriction)] = Method.FUNCTIONPARAMS;
        emit RestrictionCreated(address(newRestriction));
    }

    function createNFT721Restriction(
        string memory _name,
        address _NFTContract
    ) public payable onlyWithSufficientPayment(Method.NFT721) {
        NFT721Restriction newRestriction = new NFT721Restriction(
            _name,
            _NFTContract
        );
        newRestriction.transferOwnership(msg.sender);
        deployedRestrictions[msg.sender].push(address(newRestriction));
        restrictionsMethod[address(newRestriction)] = Method.NFT721;
        emit RestrictionCreated(address(newRestriction));
    }

    function createERC1155Restriction(
        string memory _name,
        address _ERC1155ContractAddress,
        uint256[] memory _tokenIds,
        uint256[] memory _amounts
    ) public payable onlyWithSufficientPayment(Method.ERC1155) {
        ERC1155Restriction newRestriction = new ERC1155Restriction(
            _name,
            _ERC1155ContractAddress,
            _tokenIds,
            _amounts
        );
        newRestriction.transferOwnership(msg.sender);
        deployedRestrictions[msg.sender].push(address(newRestriction));
        restrictionsMethod[address(newRestriction)] = Method.ERC1155;
        emit RestrictionCreated(address(newRestriction));
    }

    function getDeployedRestrictions() public view returns (address[] memory) {
        return deployedRestrictions[msg.sender];
    }

    function getRestrictionMethod(
        address _restriction
    ) public view returns (Method) {
        return restrictionsMethod[_restriction];
    }

    function calculateRestrictionCreationRequiredETH(
        uint256 priceInUSD
    ) public view returns (uint256) {
        if (priceInUSD == 0) return 0;
        (uint256 ETHUSDPrice, ) = IDIAOracleV2(priceFeedAddress).getValue(
            "ETH/USD"
        );
        return ((priceInUSD *
            // ETH: 18 decimals, DIA Oracle price: 8 decimals.
            1e26) / ETHUSDPrice);
    }

    // Function to withdraw funds from the contract, only callable by the owner
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "Failed to withdraw funds from Factory.");
        emit FundsWithdrawn(msg.sender, balance);
    }

    /**
     * @dev External function to update the DIA Oracle address, accessible only by the owner.
     * @param _priceFeedAddress The new address of the DIA Oracle.
     */
    function updatePriceFeedAddress(
        address _priceFeedAddress
    ) public onlyOwner {
        require(_priceFeedAddress != address(0), "Invalid address");
        priceFeedAddress = _priceFeedAddress;
    }

    function updateRestrictionCreationPriceInUSD(
        uint256 _restrictionCreationPriceInUSD,
        Method _method
    ) external onlyOwner {
        require(
            _restrictionCreationPriceInUSD > 0,
            "restriction creation cost should be more than 0"
        );
        restrictionCreationPricesInUSD[
            _method
        ] = _restrictionCreationPriceInUSD;
    }
}
