pragma solidity =0.5.16;

// A library for handling binary fixed point numbers (https://en.wikipedia.org/wiki/Q_(number_format))

// range: [0, 2**112 - 1]
// resolution: 1 / 2**112
library UQ112x112 {
    uint224 constant Q112 = 2**112;

    /**
     * @dev Encodes a uint112 as a UQ112x112.
     * @param y The unsigned integer to encode
     * @return z The encoded value as UQ112x112
     */
    function encode(uint112 y) internal pure returns (uint224 z) {
        // Multiplication is safe as uint112 * 2**112 will not overflow uint224
        z = uint224(y) * Q112;
    }

    /**
     * @dev Divides a UQ112x112 by a uint112, returning a UQ112x112.
     * @param x The UQ112x112 value to divide
     * @param y The unsigned integer divisor
     * @return z The result of the division
     */
    function uqdiv(uint224 x, uint112 y) internal pure returns (uint224 z) {
        require(y != 0, "UQ112x112: DIV_BY_ZERO");
        z = x / uint224(y);
    }
}
