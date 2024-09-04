// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

enum ConectionType {
    Initial,
    Professional,
    Personal
}
struct Contact {
    uint256 timestamp;
    uint256 counterConnections;
    ConectionType kind;
}
