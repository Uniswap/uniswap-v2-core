pragma solidity =0.5.16;

// A library for performing various math operations

library Math {
    /**
     * @dev Returns the smaller of two numbers.
     */
    function min(uint x, uint y) internal pure returns (uint z) {
        z = x < y ? x : y;
    }

    /**
     * @dev Returns the square root of a number using the Babylonian method.
     *      This method is gas-efficient for the EVM and avoids overflows.
     */
    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1; // Initial estimate for Babylonian method
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
        // If y == 0, z remains 0 (default for uninitialized uint)
    }
}
