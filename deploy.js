require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Load environment variables
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!RPC_URL || !PRIVATE_KEY) {
    console.error('Please ensure RPC_URL and PRIVATE_KEY are set in the .env file');
    process.exit(1);
}

// Initialize provider and wallet
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Load compiled contracts
const loadContract = (fileName) => {
    const filePath = path.resolve(__dirname, 'build', fileName);
    const contractJson = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(contractJson);
};

// Deploy a contract
const deployContract = async (contractName, args = []) => {
    const contractJson = loadContract(`${contractName}.json`);
    const contractFactory = new ethers.ContractFactory(
        contractJson.abi,
        contractJson.evm.bytecode.object,
        wallet
    );

    console.log(`Deploying ${contractName}...`);
    const contract = await contractFactory.deploy(...args);
    await contract.deployed();
    console.log(`${contractName} deployed at: ${contract.address}`);
    return contract.address;
};

// Main deployment function
const main = async () => {
    try {
        // Deploy UniswapV2Factory
        const factoryAddress = await deployContract('UniswapV2Factory', [wallet.address]);

        // Deploy UniswapV2ERC20 (Optional, for testing or standalone token deployment)
        const erc20Address = await deployContract('UniswapV2ERC20');

        // Deploy UniswapV2Pair (Will typically be created by the factory)
        const pairAddress = await deployContract('UniswapV2Pair');

        console.log('Deployment complete!');
        console.log('Factory Address:', factoryAddress);
        console.log('ERC20 Address (if deployed):', erc20Address);
        console.log('Pair Address (if deployed):', pairAddress);
    } catch (error) {
        console.error('Error during deployment:', error);
    }
};

main();
