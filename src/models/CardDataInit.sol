// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct CardDataInit {
    uint64 phone;
    string name;
    string email;
    string position;
    string[] urls; //Si no se proporcionan URL llega una lista vacia
    // string photo; //Token URI ipfs
}
