import {expect} from 'chai';
import {Wallet, Contract} from 'zksync-ethers';
import {getPaymaster} from '../src/paymaster';
import {createRestriction} from '../src/restriction';
import {PaymasterType, RestrictionMethod, PaymasterParams} from '../src/types';
import {
  ContractRestriction__factory,
  UserRestriction__factory,
} from '../src/typechain';
import {useEnvironmentWithLocalSetup} from './helpers';
import {HDNodeWallet, id, parseEther} from 'ethers';
import {EIP712_TX_TYPE} from 'zksync-ethers/build/utils';

describe('Test paymaster and restrictions', async () => {
  useEnvironmentWithLocalSetup('txsync');

  let wallet: Wallet;
  let emptyWallet: HDNodeWallet;
  let erc20Contract: Contract;
  let greeterContract: Contract;
  let addressStoreContract: Contract;
  let mockDIAOracleContract: Contract;
  let NFT721Contract: Contract;
  let ERC1155Contract: Contract;
  let boxContact: Contract;

  let paymasterFactoryContract: Contract;
  let restrictionFactoryContract: Contract;
  let sponsoredPaymasterAddress: string;
  let erc20PaymasterAddress: string;

  before('Setup and deploy contracts', async function () {
    wallet = await this.env.deployer.getWallet();
    emptyWallet = Wallet.createRandom();

    console.log('=== Deploying mock contracts ===');

    const erc20Artifact = await this.env.deployer.loadArtifact('ERC20Token');
    const NFT721Artifact = await this.env.deployer.loadArtifact('NFT721');
    const greeterArtifact = await this.env.deployer.loadArtifact('Greeter');
    const addressStoreArtifact =
      await this.env.deployer.loadArtifact('AddressStore');
    const mockDIAOracleArtifact =
      await this.env.deployer.loadArtifact('MockDIAOracle');
    const ERC1155Artifact = await this.env.deployer.loadArtifact('MockERC1155');
    const BoxArtifact = await this.env.deployer.loadArtifact('Box');

    erc20Contract = await this.env.deployer.deploy(erc20Artifact, [
      'USDC',
      'USDC',
      18,
    ]);
    greeterContract = await this.env.deployer.deploy(greeterArtifact, [
      'Hello World!',
    ]);
    addressStoreContract = await this.env.deployer.deploy(
      addressStoreArtifact,
      ['0x0000000000000000000000000000000000000000']
    );
    mockDIAOracleContract = await this.env.deployer.deploy(
      mockDIAOracleArtifact
    );
    NFT721Contract = await this.env.deployer.deploy(NFT721Artifact);
    ERC1155Contract = await this.env.deployer.deploy(ERC1155Artifact);
    boxContact = await this.env.deployer.deploy(BoxArtifact);

    await (await mockDIAOracleContract.setValue('ETH/USD', 2500, 1)).wait();
    await (await mockDIAOracleContract.setValue('USDC/USD', 1, 1)).wait();

    console.log('=== Deploying Paymaster Factory ===');

    const paymasterFactoryArtifact =
      await this.env.deployer.loadArtifact('Factory');
    paymasterFactoryContract = await this.env.zkUpgrades.deployProxy(
      wallet,
      paymasterFactoryArtifact,
      [await mockDIAOracleContract.getAddress(), 1],
      {initializer: 'initialize'}
    );
    await (
      await paymasterFactoryContract.addTokenConfig(
        await erc20Contract.getAddress(),
        'USDC/USD'
      )
    ).wait();

    console.log('=== Deploying Sponsored and ERC20 Paymasters ===');
    const creationETH =
      await paymasterFactoryContract.calculatePaymasterCreationRequiredETH();

    const sponsoredPaymasterReceipt = await (
      await paymasterFactoryContract.createSponsoredPaymaster(
        'SponsoredPaymaster',
        {value: creationETH.toString()}
      )
    ).wait();
    sponsoredPaymasterAddress = sponsoredPaymasterReceipt.logs
      .filter((logs: any) => logs.topics[0] === id('PaymasterCreated(address)'))
      .map((log: any) => '0x' + log.data.slice(26))[0];
    const erc20PaymasterReceipt = await (
      await paymasterFactoryContract.createERC20Paymaster(
        await erc20Contract.getAddress(),
        'ERC20Paymaster',
        {value: creationETH.toString()}
      )
    ).wait();
    erc20PaymasterAddress = erc20PaymasterReceipt.logs
      .filter((logs: any) => logs.topics[0] === id('PaymasterCreated(address)'))
      .map((log: any) => '0x' + log.data.slice(26))[0];

    console.log(`Sponsored paymaster address: ${sponsoredPaymasterAddress}`);
    console.log(`ERC20 paymaster address: ${erc20PaymasterAddress}`);

    console.log('=== Contracts Restriction Factory ===');

    const restrictionFactoryArtifact =
      await this.env.deployer.loadArtifact('RestrictionFactory');
    restrictionFactoryContract = await this.env.zkUpgrades.deployProxy(
      wallet,
      restrictionFactoryArtifact,
      [await mockDIAOracleContract.getAddress()],
      {initializer: 'initialize'}
    );

    // Transfer ETH and ERC20
    await wallet.transfer({
      to: sponsoredPaymasterAddress,
      amount: parseEther('0.001'),
    });
    await wallet.transfer({
      to: erc20PaymasterAddress,
      amount: parseEther('0.001'),
    });
    await (
      await erc20Contract.mint(wallet.address, '5000000000000000000000000')
    ).wait();
  });

  describe('Paymaster Tests', () => {
    it('getPaymaster - Sponsored', async () => {
      const paymaster = await getPaymaster(sponsoredPaymasterAddress, wallet);

      expect(paymaster).to.not.be.undefined;
      expect(paymaster.address).to.be.equal(sponsoredPaymasterAddress);
      expect(paymaster.runner).to.be.equal(wallet);
      expect(paymaster.paymasterType).to.be.equal(PaymasterType.SPONSORED);
      expect(paymaster.token).to.be.undefined;
    });

    it('getPaymaster - ERC20', async () => {
      const paymaster = await getPaymaster(erc20PaymasterAddress, wallet);

      expect(paymaster).to.not.be.undefined;
      expect(paymaster.address).to.be.equal(erc20PaymasterAddress);
      expect(paymaster.runner).to.be.equal(wallet);
      expect(paymaster.paymasterType).to.be.equal(PaymasterType.ERC20);
      expect(paymaster.token).to.not.be.undefined;
    });

    it('populatePaymasterTransaction', async () => {
      const paymaster = await getPaymaster(sponsoredPaymasterAddress, wallet);
      const paymasterTx = await paymaster.populatePaymasterTransaction(
        await greeterContract.getAddress(),
        'function setGreeting(string memory _greeting)',
        ['Hello World!']
      );
      expect(paymasterTx).to.not.be.undefined;
      expect(paymasterTx.type).to.be.equal(EIP712_TX_TYPE);
      expect(paymasterTx.to).to.be.equal(await greeterContract.getAddress());
      expect(paymasterTx.from).to.be.equal(await wallet.getAddress());
      expect(paymasterTx.data).to.be.equal(
        '0xa41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000c48656c6c6f20576f726c64210000000000000000000000000000000000000000'
      );
      expect(paymasterTx.customData).to.not.be.undefined;
      expect(paymasterTx.customData!.paymasterParams).to.not.be.undefined;
      expect(paymasterTx.customData!.paymasterParams!.paymaster).to.be.equal(
        sponsoredPaymasterAddress
      );
      expect(
        paymasterTx.customData!.paymasterParams!.paymasterInput
      ).to.be.equal(
        '0x8c5a344500000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000'
      );
    });

    it('getPaymasterCustomData', async () => {
      const paymasterSponsored = await getPaymaster(
        sponsoredPaymasterAddress,
        wallet
      );
      const paymasterCustomDataSponsored =
        paymasterSponsored.getPaymasterCustomData({minimalAllowance: 100n});

      expect(paymasterCustomDataSponsored).to.not.be.undefined;
      expect(paymasterCustomDataSponsored.paymaster).to.be.equal(
        sponsoredPaymasterAddress
      );
      expect(paymasterCustomDataSponsored.paymasterInput).to.be.equal(
        '0x8c5a344500000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000'
      );

      const paymasterErc20 = await getPaymaster(erc20PaymasterAddress, wallet);
      const paymasterCustomDataErc20 = paymasterErc20.getPaymasterCustomData({
        minimalAllowance: 100n,
      });

      expect(paymasterCustomDataErc20).to.not.be.undefined;
      expect(paymasterCustomDataErc20.paymaster).to.be.equal(
        erc20PaymasterAddress
      );
      // Allways chaning because of the address of the token
      // expect(paymasterCustomDataErc20.paymasterInput).to.be.equal('0x949431dc000000000000000000000000361abb326562e6574a6323b44d5cbc0ce54a0853000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000');
    });

    it('sendPaymasterTransaction - Sponsored', async () => {
      const paymaster = await getPaymaster(sponsoredPaymasterAddress, wallet);
      const PaymasterParams: PaymasterParams = [
        await greeterContract.getAddress(),
        'function setGreeting(string memory _greeting)',
        ['Hello from sponsored paymaster'],
      ];

      await (
        await paymaster.sendPaymasterTransaction(...PaymasterParams)
      ).wait();
      expect(await greeterContract.greet()).to.be.equal(
        'Hello from sponsored paymaster'
      );
    });

    // TODO: Do more benchmarks and tests so we can set the OVERHEAD based on the chain id
    it('sendPaymasterTransaction - ERC20', async () => {
      const paymaster = await getPaymaster(erc20PaymasterAddress, wallet);
      const PaymasterParams: PaymasterParams = [
        await greeterContract.getAddress(),
        'function setGreeting(string memory _greeting)',
        ['Hello from erc20 paymaster'],
      ];

      const allowance = await paymaster.getMinimalAllowance(...PaymasterParams);
      await (
        await erc20Contract.approve(erc20PaymasterAddress, allowance)
      ).wait();

      await (
        await paymaster.sendPaymasterTransaction(...PaymasterParams)
      ).wait();
      expect(await greeterContract.greet()).to.be.equal(
        'Hello from erc20 paymaster'
      );
    });

    it('getPaymasterContract', async () => {
      const paymasterSponsored = await getPaymaster(
        sponsoredPaymasterAddress,
        wallet
      );
      const paymasterSponsoredContract =
        paymasterSponsored.getPaymasterContract();

      expect(paymasterSponsoredContract).to.not.be.undefined;
      expect(paymasterSponsoredContract).to.be.instanceOf(Contract);

      const erc20Contract = await getPaymaster(erc20PaymasterAddress, wallet);
      const paymasterERC20 = erc20Contract.getPaymasterContract();

      expect(paymasterERC20).to.not.be.undefined;
      expect(paymasterERC20).to.be.instanceOf(Contract);
    });

    it('estimateGas', async () => {
      const paymaster = await getPaymaster(sponsoredPaymasterAddress, wallet);
      const PaymasterParams: PaymasterParams = [
        await greeterContract.getAddress(),
        'function setGreeting(string memory _greeting)',
        ['Hello from sponsored paymaster'],
      ];

      const tx = await paymaster.populatePaymasterTransaction(
        ...PaymasterParams
      );
      const gasLimit = await paymaster.estimateGas(tx);

      // TODO: Add Checks
    });
  });

  describe('Restriction tests', () => {
    it('createRestriction - USER', async () => {
      const restrictionAddress = await createRestriction(
        'UserRestriction',
        RestrictionMethod.USER,
        wallet,
        [await emptyWallet.getAddress()],
        await restrictionFactoryContract.getAddress()
      );

      expect(restrictionAddress).to.not.be.undefined;
      expect(restrictionAddress).to.be.a('string');

      const userRestriction = UserRestriction__factory.connect(
        restrictionAddress,
        wallet
      );

      expect(await userRestriction.name()).to.be.equal('UserRestriction');
      expect(
        await userRestriction.userWhitelist(await emptyWallet.getAddress())
      ).to.be.true;
      expect(await userRestriction.userWhitelist(await wallet.getAddress())).to
        .be.false;

      await (
        await userRestriction.batchUpdateUserWhiteList(
          [await wallet.getAddress(), await emptyWallet.getAddress()],
          [true, false]
        )
      ).wait();

      expect(
        await userRestriction.userWhitelist(await emptyWallet.getAddress())
      ).to.be.false;
      expect(await userRestriction.userWhitelist(await wallet.getAddress())).to
        .be.true;
    });

    it('createRestriction - CONTRACT', async () => {
      const restrictionAddress = await createRestriction(
        'ContractRestriction',
        RestrictionMethod.CONTRACT,
        wallet,
        [{address: await greeterContract.getAddress()}],
        await restrictionFactoryContract.getAddress()
      );

      expect(restrictionAddress).to.not.be.undefined;
      expect(restrictionAddress).to.be.a('string');

      const contractRestriction = ContractRestriction__factory.connect(
        restrictionAddress,
        wallet
      );

      expect(await contractRestriction.name()).to.be.equal(
        'ContractRestriction'
      );
      expect(
        await contractRestriction.contractWhitelist(
          await greeterContract.getAddress()
        )
      ).to.be.true;
      expect(
        await contractRestriction.contractWhitelist(
          await boxContact.getAddress()
        )
      ).to.be.false;

      await (
        await contractRestriction.batchUpdateContractWhiteList(
          [await boxContact.getAddress(), await greeterContract.getAddress()],
          [true, false]
        )
      ).wait();

      expect(
        await contractRestriction.contractWhitelist(
          await greeterContract.getAddress()
        )
      ).to.be.false;
      expect(
        await contractRestriction.contractWhitelist(
          await boxContact.getAddress()
        )
      ).to.be.true;
    });

    // TODO: FunctionRestriction

    it('createRestriction - INVALID_TYPE error', async () => {
      try {
        await createRestriction(
          'InvalidRestriction',
          // @ts-ignore
          3,
          wallet,
          undefined,
          await restrictionFactoryContract.getAddress()
        );
      } catch (error: any) {
        expect(error.name).to.be.equal('PaymasterError');
        expect(error.errorCode).to.be.equal('INVALID_TYPE');
        expect(error.message).to.be.equal('Invalid restriction type provided');
      }
    });
  });

  describe('Restriction and TsukPaymastero tests combined', () => {
    beforeEach(async () => {
      const creationETH =
        await paymasterFactoryContract.calculatePaymasterCreationRequiredETH();

      const sponsoredPaymasterReceipt = await (
        await paymasterFactoryContract.createSponsoredPaymaster(
          'SponsoredPaymaster',
          {value: creationETH.toString()}
        )
      ).wait();
      sponsoredPaymasterAddress = sponsoredPaymasterReceipt.logs
        .filter(
          (logs: any) => logs.topics[0] === id('PaymasterCreated(address)')
        )
        .map((log: any) => '0x' + log.data.slice(26))[0];
    });

    it('addRestriction', async () => {
      const paymaster = await getPaymaster(sponsoredPaymasterAddress, wallet);
      const restrictionAddress = await createRestriction(
        'UserRestriction',
        RestrictionMethod.USER,
        wallet,
        [await emptyWallet.getAddress()],
        await restrictionFactoryContract.getAddress()
      );

      await (await paymaster.addRestriction(restrictionAddress)).wait();
      expect((await paymaster.getRestrictions())[0].toLowerCase()).to.be.equal(
        restrictionAddress.toLowerCase()
      );
    });

    it('removeRestriction', async () => {
      const paymaster = await getPaymaster(sponsoredPaymasterAddress, wallet);
      const restrictionAddress = await createRestriction(
        'UserRestriction',
        RestrictionMethod.USER,
        wallet,
        [await emptyWallet.getAddress()],
        await restrictionFactoryContract.getAddress()
      );

      await (await paymaster.addRestriction(restrictionAddress)).wait();
      expect((await paymaster.getRestrictions())[0].toLowerCase()).to.be.equal(
        restrictionAddress.toLowerCase()
      );

      await (await paymaster.removeRestriction(restrictionAddress)).wait();
      expect(await paymaster.getRestrictions()).to.be.empty;
    });

    it('checkTransactionEligibility', async () => {
      const paymaster = await getPaymaster(sponsoredPaymasterAddress, wallet);
      const PaymasterParams: PaymasterParams = [
        await greeterContract.getAddress(),
        'function setGreeting(string memory _greeting)',
        ['Hello from sponsored paymaster'],
      ];

      const restrictionAddress = await createRestriction(
        'UserRestriction',
        RestrictionMethod.USER,
        wallet,
        [],
        await restrictionFactoryContract.getAddress()
      );
      await (await paymaster.addRestriction(restrictionAddress)).wait();

      expect(await paymaster.checkTransactionEligibility(...PaymasterParams)).to
        .be.false;

      const userRestriction = UserRestriction__factory.connect(
        restrictionAddress,
        wallet
      );
      await (
        await userRestriction.updateUserWhiteList(
          await wallet.getAddress(),
          true
        )
      ).wait();

      expect(await paymaster.checkTransactionEligibility(...PaymasterParams)).to
        .be.true;
    });
  });

  describe('Benchmarks for allowance - ERC20', () => {
    it('Benchmarks', async () => {
      const paymaster = await getPaymaster(erc20PaymasterAddress, wallet);

      const greet = 'Here we go again.';
      const greetParams: PaymasterParams = [
        await greeterContract.getAddress(),
        'function setGreeting(string memory _greeting)',
        [greet],
      ];

      const boxValue = 200000000;
      const boxParams: PaymasterParams = [
        await boxContact.getAddress(),
        'function store(uint256 newValue) public',
        [boxValue],
      ];

      const nftParams: PaymasterParams = [
        await NFT721Contract.getAddress(),
        'function mintNFT(address _recepient, string memory _tokenURI) public',
        [await wallet.getAddress(), '1'],
      ];

      const greeterEstimateGas =
        await greeterContract.setGreeting.estimateGas(greet);
      const paymasterEstimateGasBeforeApproval = await paymaster.estimateGas(
        await paymaster.populatePaymasterTransaction(...greetParams)
      );

      console.log(`Greeter estimate gas: ${greeterEstimateGas}`);
      console.log(
        `Paymaster estimate gas before approval: ${paymasterEstimateGasBeforeApproval}`
      );

      await (
        await erc20Contract.approve(
          erc20PaymasterAddress,
          738313125000000000000n
        )
      ).wait();
      const paymasterEstimateGasAfterApproval = await paymaster.estimateGas(
        await paymaster.populatePaymasterTransaction(...greetParams)
      );
      console.log(
        `Paymaster estimate gas after approval: ${paymasterEstimateGasAfterApproval}`
      );

      console.log(
        `GREETER - Difference before approval: ${
          BigInt(paymasterEstimateGasBeforeApproval) - greeterEstimateGas
        }`
      );
      console.log(
        `GREETER - Difference after approval: ${
          BigInt(paymasterEstimateGasAfterApproval) - greeterEstimateGas
        }`
      );

      // Delete allowance
      await (await erc20Contract.approve(erc20PaymasterAddress, 0n)).wait();

      const boxValueEstimateGas = await boxContact.store.estimateGas(boxValue);
      const paymasterBoxEstimateGasBeforeApproval = await paymaster.estimateGas(
        await paymaster.populatePaymasterTransaction(...boxParams)
      );

      console.log(`Box value estimate gas: ${boxValueEstimateGas}`);
      console.log(
        `Paymaster box value estimate gas before approval: ${paymasterBoxEstimateGasBeforeApproval}`
      );

      await (
        await erc20Contract.approve(
          erc20PaymasterAddress,
          738313125000000000000n
        )
      ).wait();
      const paymasterBoxEstimateGasAfterApproval = await paymaster.estimateGas(
        await paymaster.populatePaymasterTransaction(...boxParams)
      );
      console.log(
        `Paymaster box value estimate gas after approval: ${paymasterBoxEstimateGasAfterApproval}`
      );

      console.log(
        `BOX - Difference before approval: ${
          BigInt(paymasterBoxEstimateGasBeforeApproval) - boxValueEstimateGas
        }`
      );
      console.log(
        `BOX - Difference after approval: ${
          BigInt(paymasterBoxEstimateGasAfterApproval) - boxValueEstimateGas
        }`
      );

      // Delete allowance
      await (await erc20Contract.approve(erc20PaymasterAddress, 0n)).wait();

      const nftMintEstimateGas = await NFT721Contract.mintNFT.estimateGas(
        await wallet.getAddress(),
        '1'
      );
      const nftMintEstimateGasBeforeApproval = await paymaster.estimateGas(
        await paymaster.populatePaymasterTransaction(...nftParams)
      );

      console.log(`NFT mint estimate gas: ${nftMintEstimateGas}`);
      console.log(
        `NFT mint estimate gas before approval: ${nftMintEstimateGasBeforeApproval}`
      );

      await (
        await erc20Contract.approve(
          erc20PaymasterAddress,
          738313125000000000000n
        )
      ).wait();
      const nftMintEstimateGasAfterApproval = await paymaster.estimateGas(
        await paymaster.populatePaymasterTransaction(...nftParams)
      );
      console.log(
        `NFT mint estimate gas after approval: ${nftMintEstimateGasAfterApproval}`
      );

      console.log(
        `NFT - Difference before approval: ${
          BigInt(nftMintEstimateGasBeforeApproval) - nftMintEstimateGas
        }`
      );
      console.log(
        `NFT - Difference after approval: ${
          BigInt(nftMintEstimateGasAfterApproval) - nftMintEstimateGas
        }`
      );
    });
  });
});
