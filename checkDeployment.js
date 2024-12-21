require('dotenv').config();
const { ethers } = require('ethers');

const RPC_URL = process.env.RPC_URL;

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

// デプロイされたアドレス
const factoryAddress = '0xbF603B840D958FAD0021872506b64a66d613F824';
const pairAddress = '0xe86eF760CD9EB0D6627e6A7776b31e85F5c996F5';
const erc20Address = '0xF130DCa1d24b58378a6f0d521eB4189f54897372';

const checkDeployment = async () => {
    try {
        // コントラクトの検証
        const codeFactory = await provider.getCode(factoryAddress);
        const codePair = await provider.getCode(pairAddress);
        const codeERC20 = await provider.getCode(erc20Address);

        console.log(`Factory contract deployed: ${codeFactory !== '0x' ? 'Yes' : 'No'}`);
        console.log(`Pair contract deployed: ${codePair !== '0x' ? 'Yes' : 'No'}`);
        console.log(`ERC20 contract deployed: ${codeERC20 !== '0x' ? 'Yes' : 'No'}`);
    } catch (error) {
        console.error('Error checking deployment:', error);
    }
};

checkDeployment();
