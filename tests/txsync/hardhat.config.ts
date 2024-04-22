import '@matterlabs/hardhat-zksync';

module.exports = {
  zksolc: {
    settings: {},
  },
  networks: {
    zkSyncNetwork: {
      zksync: true,
      ethNetwork: 'localhost',
      url: 'http://localhost:8011',
    },
    zkSyncTestnet: {
      zksync: true,
      ethNetwork: '',
      url: 'https://sepolia.era.zksync.dev',
      accounts: [
        '<PRIVATE_KEY>',
      ],
      forceDeploy: false,
    },
  },
  solidity: {
    version: '0.8.17',
  },
};
