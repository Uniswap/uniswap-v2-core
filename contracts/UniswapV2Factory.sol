pragma solidity =0.5.16;

import './interfaces/IUniswapV2Factory.sol';
import './UniswapV2Pair.sol';

contract UniswapV2Factory is IUniswapV2Factory {
    address public feeTo;
    address public feeToSetter;

    mapping(address => mapping(address => mapping(uint256 => address))) public getPair; // getPair[token0][token1][feerate] || getPair[token1][token0][feerate]
    address[] public allPairs;

    event PairCreated(address indexed token0, address indexed token1, address pair, uint feeRate, uint);

    constructor(address _feeToSetter) public {
        feeToSetter = _feeToSetter;
    }

    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    function createPair(address tokenA, address tokenB, uint256 feeRate) external returns (address pair) {
        require(tokenA != tokenB, 'UniswapV2: IDENTICAL_ADDRESSES');
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(feeRate >= 0 && feeRate <= 1e18, 'UniswapV2: FEE_RATE_OVERFLOW');
        require(token0 != address(0), 'UniswapV2: ZERO_ADDRESS');
        require(getPair[token0][token1][feeRate] == address(0), 'UniswapV2: PAIR_EXISTS'); // single check is sufficient
        bytes memory bytecode = type(UniswapV2Pair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1, feeRate));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        IUniswapV2Pair(pair).initialize(token0, token1);
        IUniswapV2Pair(pair).setFeeRate(feeRate);
        getPair[token0][token1][feeRate] = pair;
        getPair[token1][token0][feeRate] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, feeRate, allPairs.length);
    }

    function setLpMtRatio(address pool, uint ratio) external {
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        IUniswapV2Pair(pool).setLpMtRatio(ratio);
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        feeToSetter = _feeToSetter;
    }
}
