import '@matterlabs/hardhat-zksync';

const PRIVATE_KEY = "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";

module.exports = {
  zksolc: {
    settings: {},
  },
  networks: {
    zkSyncNetwork: {
      zksync: true,
      ethNetwork: 'http://127.0.0.1:15045 ',
      url: 'http://127.0.0.1:15100',
    },
    zkSyncTestnet: {
      zksync: true,
      ethNetwork: '',
      url: 'https://sepolia.era.zksync.dev',
      accounts: [
        PRIVATE_KEY,
      ],
      forceDeploy: false,
    },
  },
  solidity: {
    version: '0.8.17',
  },
};
