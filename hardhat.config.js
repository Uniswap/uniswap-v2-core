require('@nomicfoundation/hardhat-toolbox')
require('hardhat-deploy')
require('hardhat-deploy')
require('hardhat-deploy-ethers')

/** @type import('hardhat/config').HardhatUserConfig */

const accounts = {
  mnemonic: process.env.MNEMONIC || 'test test test test test test test test test test test wheel'
}
module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.5.16',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: '0.8.17',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  namedAccounts: {
    deployer: {
      default: 0
    }
  },

  networks: {
    localhost: {
      url: 'http://localhost:8545/',
      accounts,
      live: false,
      saveDeployments: true,
      tags: ['local']
    },

    hardhat: {
      accounts,
      live: false,
      saveDeployments: true,
      tags: ['test', 'local']
    },

    goerli: {
      chainId: 5,
      url: 'https://endpoints.omniatech.io/v1/eth/goerli/public',
      accounts,
      live: true,
      saveDeployments: true
    }
  }
}
