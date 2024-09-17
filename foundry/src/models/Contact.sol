// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import { ConnectionType } from "../enums/ConnectionType.sol";

struct Contact {
    uint256 timestamp;
    uint256 counterConnections;
    ConnectionType kind;
}
