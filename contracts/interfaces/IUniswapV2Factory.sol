pragma solidity >=0.5.0;

interface IUniswapV2Factory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint feeRate);

    function feeTo() external view returns (address);
    function feeToSetter() external view returns (address);

    function getPair(address tokenA, address tokenB, uint256 feeRate) external view returns (address pair);
    function allPairs(uint) external view returns (address pair);
    function allPairsLength() external view returns (uint);

    function createPair(address tokenA, address tokenB, uint256 feerate) external returns (address pair);

    function setFeeTo(address) external;
    function setFeeToSetter(address) external;

    function setLpMtRatio(address pool, uint ratio) external;
}
