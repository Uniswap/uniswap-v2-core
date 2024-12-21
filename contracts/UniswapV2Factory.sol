pragma solidity =0.5.16;

import './interfaces/IUniswapV2Factory.sol';

contract UniswapV2Factory is IUniswapV2Factory {
    address public feeTo;
    address public feeToSetter;

    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    constructor(address _feeToSetter) public {
        feeToSetter = _feeToSetter;
    }

    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    function createPair(address tokenA, address tokenB) external returns (address pair) {
        require(tokenA != tokenB, 'UniswapV2: IDENTICAL_ADDRESSES');
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'UniswapV2: ZERO_ADDRESS');
        require(getPair[token0][token1] == address(0), 'UniswapV2: PAIR_EXISTS'); // single check is sufficient

        bytes memory bytecode = abi.encodePacked(
            hex"608060405234801561001057600080fd5b5060405161054e38038061054e8339818101604052602081101561003357600080fd5b50516040805160018054600160a060020a0319169190921790556100ca806100596000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063c5af0dff14602d575b600080fd5b60336035565b005b60405163ffffffff909216815260200160405180910390f35b600054600160a060020a031681565b60006020528060005260406000206000915090505481565b600054600160a060020a0316fffea165627a7a7230582096b0a552a5e7b4e0e09c29f88076495e27db7c899f2a28c3d08951cba82762030029"
        );

        assembly {
            pair := create(0, add(bytecode, 32), mload(bytecode))
        }
        require(pair != address(0), "UniswapV2: PAIR_CREATION_FAILED");

        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
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
