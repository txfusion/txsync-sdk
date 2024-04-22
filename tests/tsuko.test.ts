import {expect} from 'chai';
import {Wallet, Contract} from 'zksync-ethers';
import {getTsuko} from '../src/tsuko';
import {createRestriction} from '../src/restriction';
import {PaymasterType, RestrictionMethod, TsukoParams} from '../src/types';
import {
  ContractRestriction__factory,
  UserRestriction__factory,
} from '../src/typechain';
import {useEnvironmentWithLocalSetup} from './helpers';
import {HDNodeWallet, id, parseEther} from 'ethers';
import {EIP712_TX_TYPE} from 'zksync-ethers/build/utils';

describe('Test tsuko and restrictions', async () => {
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

  describe('Tsuko Tests', () => {
    it('getTsuko - Sponsored', async () => {
      const tsuko = await getTsuko(sponsoredPaymasterAddress, wallet);

      expect(tsuko).to.not.be.undefined;
      expect(tsuko.address).to.be.equal(sponsoredPaymasterAddress);
      expect(tsuko.runner).to.be.equal(wallet);
      expect(tsuko.paymasterType).to.be.equal(PaymasterType.SPONSORED);
      expect(tsuko.token).to.be.undefined;
    });

    it('getTsuko - ERC20', async () => {
      const tsuko = await getTsuko(erc20PaymasterAddress, wallet);

      expect(tsuko).to.not.be.undefined;
      expect(tsuko.address).to.be.equal(erc20PaymasterAddress);
      expect(tsuko.runner).to.be.equal(wallet);
      expect(tsuko.paymasterType).to.be.equal(PaymasterType.ERC20);
      expect(tsuko.token).to.not.be.undefined;
    });

    it('populateTsukoTransaction', async () => {
      const tsuko = await getTsuko(sponsoredPaymasterAddress, wallet);
      const tsukoTx = await tsuko.populateTsukoTransaction(
        await greeterContract.getAddress(),
        'function setGreeting(string memory _greeting)',
        ['Hello World!']
      );
      expect(tsukoTx).to.not.be.undefined;
      expect(tsukoTx.type).to.be.equal(EIP712_TX_TYPE);
      expect(tsukoTx.to).to.be.equal(await greeterContract.getAddress());
      expect(tsukoTx.from).to.be.equal(await wallet.getAddress());
      expect(tsukoTx.data).to.be.equal(
        '0xa41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000c48656c6c6f20576f726c64210000000000000000000000000000000000000000'
      );
      expect(tsukoTx.customData).to.not.be.undefined;
      expect(tsukoTx.customData!.paymasterParams).to.not.be.undefined;
      expect(tsukoTx.customData!.paymasterParams!.paymaster).to.be.equal(
        sponsoredPaymasterAddress
      );
      expect(tsukoTx.customData!.paymasterParams!.paymasterInput).to.be.equal(
        '0x8c5a344500000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000'
      );
    });

    it('getPaymasterCustomData', async () => {
      const tsukoSponsored = await getTsuko(sponsoredPaymasterAddress, wallet);
      const paymasterCustomDataSponsored =
        tsukoSponsored.getPaymasterCustomData({minimalAllowance: 100n});

      expect(paymasterCustomDataSponsored).to.not.be.undefined;
      expect(paymasterCustomDataSponsored.paymaster).to.be.equal(
        sponsoredPaymasterAddress
      );
      expect(paymasterCustomDataSponsored.paymasterInput).to.be.equal(
        '0x8c5a344500000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000'
      );

      const tsukoErc20 = await getTsuko(erc20PaymasterAddress, wallet);
      const paymasterCustomDataErc20 = tsukoErc20.getPaymasterCustomData({
        minimalAllowance: 100n,
      });

      expect(paymasterCustomDataErc20).to.not.be.undefined;
      expect(paymasterCustomDataErc20.paymaster).to.be.equal(
        erc20PaymasterAddress
      );
      // Allways chaning because of the address of the token
      // expect(paymasterCustomDataErc20.paymasterInput).to.be.equal('0x949431dc000000000000000000000000361abb326562e6574a6323b44d5cbc0ce54a0853000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000');
    });

    it('sendTsukoTransaction - Sponsored', async () => {
      const tsuko = await getTsuko(sponsoredPaymasterAddress, wallet);
      const tsukoParams: TsukoParams = [
        await greeterContract.getAddress(),
        'function setGreeting(string memory _greeting)',
        ['Hello from sponsored paymaster'],
      ];

      await (await tsuko.sendTsukoTransaction(...tsukoParams)).wait();
      expect(await greeterContract.greet()).to.be.equal(
        'Hello from sponsored paymaster'
      );
    });

    // TODO: Do more benchmarks and tests so we can set the OVERHEAD based on the chain id
    it('sendTsukoTransaction - ERC20', async () => {
      const tsuko = await getTsuko(erc20PaymasterAddress, wallet);
      const tsukoParams: TsukoParams = [
        await greeterContract.getAddress(),
        'function setGreeting(string memory _greeting)',
        ['Hello from erc20 paymaster'],
      ];

      const allowance = await tsuko.getMinimalAllowance(...tsukoParams);
      await (
        await erc20Contract.approve(erc20PaymasterAddress, allowance)
      ).wait();

      await (await tsuko.sendTsukoTransaction(...tsukoParams)).wait();
      expect(await greeterContract.greet()).to.be.equal(
        'Hello from erc20 paymaster'
      );
    });

    it('getPaymasterContract', async () => {
      const tsukoSponsored = await getTsuko(sponsoredPaymasterAddress, wallet);
      const paymasterSponsored = tsukoSponsored.getPaymasterContract();

      expect(paymasterSponsored).to.not.be.undefined;
      expect(paymasterSponsored).to.be.instanceOf(Contract);

      const erc20Contract = await getTsuko(erc20PaymasterAddress, wallet);
      const paymasterERC20 = erc20Contract.getPaymasterContract();

      expect(paymasterERC20).to.not.be.undefined;
      expect(paymasterERC20).to.be.instanceOf(Contract);
    });

    it('estimateGas', async () => {
      const tsuko = await getTsuko(sponsoredPaymasterAddress, wallet);
      const tsukoParams: TsukoParams = [
        await greeterContract.getAddress(),
        'function setGreeting(string memory _greeting)',
        ['Hello from sponsored paymaster'],
      ];

      const tx = await tsuko.populateTsukoTransaction(...tsukoParams);
      const gasLimit = await tsuko.estimateGas(tx);

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
        expect(error.name).to.be.equal('TsukoError');
        expect(error.errorCode).to.be.equal('INVALID_TYPE');
        expect(error.message).to.be.equal('Invalid restriction type provided');
      }
    });
  });

  describe('Restriction and Tsuko tests combined', () => {
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
      const tsuko = await getTsuko(sponsoredPaymasterAddress, wallet);
      const restrictionAddress = await createRestriction(
        'UserRestriction',
        RestrictionMethod.USER,
        wallet,
        [await emptyWallet.getAddress()],
        await restrictionFactoryContract.getAddress()
      );

      await (await tsuko.addRestriction(restrictionAddress)).wait();
      expect((await tsuko.getRestrictions())[0].toLowerCase()).to.be.equal(
        restrictionAddress.toLowerCase()
      );
    });

    it('removeRestriction', async () => {
      const tsuko = await getTsuko(sponsoredPaymasterAddress, wallet);
      const restrictionAddress = await createRestriction(
        'UserRestriction',
        RestrictionMethod.USER,
        wallet,
        [await emptyWallet.getAddress()],
        await restrictionFactoryContract.getAddress()
      );

      await (await tsuko.addRestriction(restrictionAddress)).wait();
      expect((await tsuko.getRestrictions())[0].toLowerCase()).to.be.equal(
        restrictionAddress.toLowerCase()
      );

      await (await tsuko.removeRestriction(restrictionAddress)).wait();
      expect(await tsuko.getRestrictions()).to.be.empty;
    });

    it('checkTransactionEligibility', async () => {
      const tsuko = await getTsuko(sponsoredPaymasterAddress, wallet);
      const tsukoParams: TsukoParams = [
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
      await (await tsuko.addRestriction(restrictionAddress)).wait();

      expect(await tsuko.checkTransactionEligibility(...tsukoParams)).to.be
        .false;

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

      expect(await tsuko.checkTransactionEligibility(...tsukoParams)).to.be
        .true;
    });
  });

  describe('Benchmarks for allowance - ERC20', () => {
    it('Benchmarks', async () => {
      const tsuko = await getTsuko(erc20PaymasterAddress, wallet);

      const greet = 'Here we go again.';
      const greetParams: TsukoParams = [
        await greeterContract.getAddress(),
        'function setGreeting(string memory _greeting)',
        [greet],
      ];

      const boxValue = 200000000;
      const boxParams: TsukoParams = [
        await boxContact.getAddress(),
        'function store(uint256 newValue) public',
        [boxValue],
      ];

      const nftParams: TsukoParams = [
        await NFT721Contract.getAddress(),
        'function mintNFT(address _recepient, string memory _tokenURI) public',
        [await wallet.getAddress(), '1'],
      ];

      const greeterEstimateGas =
        await greeterContract.setGreeting.estimateGas(greet);
      const tsukoEstimateGasBeforeApproval = await tsuko.estimateGas(
        await tsuko.populateTsukoTransaction(...greetParams)
      );

      console.log(`Greeter estimate gas: ${greeterEstimateGas}`);
      console.log(
        `Tsuko estimate gas before approval: ${tsukoEstimateGasBeforeApproval}`
      );

      await (
        await erc20Contract.approve(
          erc20PaymasterAddress,
          738313125000000000000n
        )
      ).wait();
      const tsukoEstimateGasAfterApproval = await tsuko.estimateGas(
        await tsuko.populateTsukoTransaction(...greetParams)
      );
      console.log(
        `Tsuko estimate gas after approval: ${tsukoEstimateGasAfterApproval}`
      );

      console.log(
        `GREETER - Difference before approval: ${
          BigInt(tsukoEstimateGasBeforeApproval) - greeterEstimateGas
        }`
      );
      console.log(
        `GREETER - Difference after approval: ${
          BigInt(tsukoEstimateGasAfterApproval) - greeterEstimateGas
        }`
      );

      // Delete allowance
      await (await erc20Contract.approve(erc20PaymasterAddress, 0n)).wait();

      const boxValueEstimateGas = await boxContact.store.estimateGas(boxValue);
      const tsukoBoxEstimateGasBeforeApproval = await tsuko.estimateGas(
        await tsuko.populateTsukoTransaction(...boxParams)
      );

      console.log(`Box value estimate gas: ${boxValueEstimateGas}`);
      console.log(
        `Tsuko box value estimate gas before approval: ${tsukoBoxEstimateGasBeforeApproval}`
      );

      await (
        await erc20Contract.approve(
          erc20PaymasterAddress,
          738313125000000000000n
        )
      ).wait();
      const tsukoBoxEstimateGasAfterApproval = await tsuko.estimateGas(
        await tsuko.populateTsukoTransaction(...boxParams)
      );
      console.log(
        `Tsuko box value estimate gas after approval: ${tsukoBoxEstimateGasAfterApproval}`
      );

      console.log(
        `BOX - Difference before approval: ${
          BigInt(tsukoBoxEstimateGasBeforeApproval) - boxValueEstimateGas
        }`
      );
      console.log(
        `BOX - Difference after approval: ${
          BigInt(tsukoBoxEstimateGasAfterApproval) - boxValueEstimateGas
        }`
      );

      // Delete allowance
      await (await erc20Contract.approve(erc20PaymasterAddress, 0n)).wait();

      const nftMintEstimateGas = await NFT721Contract.mintNFT.estimateGas(
        await wallet.getAddress(),
        '1'
      );
      const nftMintEstimateGasBeforeApproval = await tsuko.estimateGas(
        await tsuko.populateTsukoTransaction(...nftParams)
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
      const nftMintEstimateGasAfterApproval = await tsuko.estimateGas(
        await tsuko.populateTsukoTransaction(...nftParams)
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
