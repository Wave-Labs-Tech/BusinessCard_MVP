// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import { ConnectionType } from "../enums/ConnectionType.sol";

struct Connection {
    uint256 timestamp;
    ConnectionType kind;
}
