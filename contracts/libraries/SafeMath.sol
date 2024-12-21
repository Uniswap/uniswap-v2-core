pragma solidity =0.5.16;

// A library for performing overflow-safe math operations

library SafeMath {
    /**
     * @dev Adds two unsigned integers, reverts on overflow.
     * @param x First unsigned integer
     * @param y Second unsigned integer
     * @return z The sum of x and y
     */
    function add(uint x, uint y) internal pure returns (uint z) {
        require((z = x + y) >= x, 'SafeMath: addition overflow');
    }

    /**
     * @dev Subtracts two unsigned integers, reverts on underflow.
     * @param x First unsigned integer
     * @param y Second unsigned integer
     * @return z The difference of x and y
     */
    function sub(uint x, uint y) internal pure returns (uint z) {
        require((z = x - y) <= x, 'SafeMath: subtraction underflow');
    }

    /**
     * @dev Multiplies two unsigned integers, reverts on overflow.
     * @param x First unsigned integer
     * @param y Second unsigned integer
     * @return z The product of x and y
     */
    function mul(uint x, uint y) internal pure returns (uint z) {
        // Gas optimization: this is cheaper than requiring 'x' not being zero, but the benefit is lost if 'y' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        require(y == 0 || (z = x * y) / y == x, 'SafeMath: multiplication overflow');
    }
}
