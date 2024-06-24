import {TASK_COMPILE} from 'hardhat/builtin-tasks/task-names';
import {resetHardhatContext} from 'hardhat/plugins-testing';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import '@matterlabs/hardhat-zksync-upgradable/dist/src/type-extensions';
import path from 'path';

declare module 'mocha' {
  interface Context {
    env: HardhatRuntimeEnvironment;
  }
}

export function useEnvironmentWithLocalSetup(
  fixtureProjectName: string,
  networkName = 'zkSyncNetwork'
) {
  const fixtureProjectDir = path.resolve(__dirname, fixtureProjectName);

  before('Run paymaster`s tests', async function () {
    process.chdir(fixtureProjectDir);
    process.env.HARDHAT_NETWORK = networkName;

    this.env = require('hardhat');
    await this.env.run(TASK_COMPILE);
  });

  after(async () => {
    resetHardhatContext();
  });
}
