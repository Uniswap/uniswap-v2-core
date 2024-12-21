require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// RPC URLと秘密鍵
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!RPC_URL || !PRIVATE_KEY) {
    console.error('Please ensure RPC_URL and PRIVATE_KEY are set in the .env file');
    process.exit(1);
}

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Factory コントラクトのアドレスとABI
const factoryAddress = '0xbF603B840D958FAD0021872506b64a66d613F824'; // Replace with your Factory contract address
const factoryABI = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'build/UniswapV2Factory.json'), 'utf8')
).abi;

// トークンアドレス
const tokenA = '0x73d53c0e08baa93362c4825b836dbce45855abf4';
const tokenB = '0x6497ce5dbe25ad343bef8a5be82c19802ba7cd71';

const createPair = async () => {
    try {
        const factoryContract = new ethers.Contract(factoryAddress, factoryABI, wallet);

        console.log(`Creating pair for tokens ${tokenA} and ${tokenB}...`);
        const tx = await factoryContract.createPair(tokenA, tokenB);
        console.log(`Transaction sent: ${tx.hash}`);
        
        const receipt = await tx.wait();
        console.log(`Transaction confirmed: ${receipt.transactionHash}`);
    } catch (error) {
        console.error('Error creating pair:', error);
    }
};

createPair();
