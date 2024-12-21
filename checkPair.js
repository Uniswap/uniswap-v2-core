require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// RPC URL
const RPC_URL = process.env.RPC_URL;

if (!RPC_URL) {
    console.error('Please ensure RPC_URL is set in the .env file');
    process.exit(1);
}

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

// Factory コントラクトのアドレスとABI
const factoryAddress = '0xbF603B840D958FAD0021872506b64a66d613F824'; // Replace with your Factory contract address
const factoryABI = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'build/UniswapV2Factory.json'), 'utf8')
).abi;

// トークンアドレス
const tokenA = '0x73d53c0e08baa93362c4825b836dbce45855abf4';
const tokenB = '0x6497ce5dbe25ad343bef8a5be82c19802ba7cd71';

const checkPair = async () => {
    try {
        const factoryContract = new ethers.Contract(factoryAddress, factoryABI, provider);

        console.log(`Checking pair for tokens ${tokenA} and ${tokenB}...`);
        const pairAddress = await factoryContract.getPair(tokenA, tokenB);

        if (pairAddress !== ethers.constants.AddressZero) {
            console.log(`Pair exists at address: ${pairAddress}`);
        } else {
            console.log('No pair exists for the given tokens.');
        }
    } catch (error) {
        console.error('Error checking pair:', error);
    }
};

checkPair();
