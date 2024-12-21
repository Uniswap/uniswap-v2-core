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

// Load compiled UniswapV2Pair contract
const loadContract = (fileName) => {
    const filePath = path.resolve(__dirname, 'build', fileName);
    const contractJson = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(contractJson);
};

const deployPairContract = async () => {
    try {
        // Load UniswapV2Pair.json
        const pairContractJson = loadContract('UniswapV2Pair.json');
        
        // Create ContractFactory
        const pairContractFactory = new ethers.ContractFactory(
            pairContractJson.abi,
            pairContractJson.evm.bytecode.object,
            wallet
        );

        console.log('Deploying UniswapV2Pair contract...');
        
        // Deploy the contract
        const pairContract = await pairContractFactory.deploy();
        await pairContract.deployed();

        console.log('UniswapV2Pair deployed successfully!');
        console.log('Pair Contract Address:', pairContract.address);

        return pairContract.address;
    } catch (error) {
        console.error('Error deploying UniswapV2Pair contract:', error);
    }
};

deployPairContract();
