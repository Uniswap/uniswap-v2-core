require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Load environment variables
const RPC_URL = process.env.RPC_URL;

if (!RPC_URL) {
    console.error('Please ensure RPC_URL is set in the .env file');
    process.exit(1);
}

// Initialize provider
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

// Load compiled Factory contract
const loadContract = (fileName) => {
    const filePath = path.resolve(__dirname, 'build', fileName);
    const contractJson = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(contractJson);
};

// Specify the transaction hash
const txHash = '0xd74807dadf593dbd2d2c7bc9b191515b29f71c675743cd55fc7c2705413037d2'; // Replace with your transaction hash

const checkTransaction = async () => {
    try {
        const receipt = await provider.getTransactionReceipt(txHash);
        console.log('Transaction Receipt:', receipt);

        // Load Factory contract ABI
        const factoryJson = loadContract('UniswapV2Factory.json');
        const factoryAddress = '0x9184676B5E9a2Fc02e1aEb019cD4DAC60CA89e0C'; // Replace with your Factory contract address

        const factoryContract = new ethers.Contract(factoryAddress, factoryJson.abi, provider);

        // Parse logs to find the event
        const event = receipt.logs.find(log =>
            log.address.toLowerCase() === factoryContract.address.toLowerCase()
        );

        if (event) {
            console.log('Event found:', event);
        } else {
            console.log('No relevant event found in the logs.');
        }
    } catch (error) {
        console.error('Error checking transaction logs:', error);
    }
};

checkTransaction();
