// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct CardDataInit {
    string name;
    string email;
    uint16 companyID;
    string position;
    uint256 phone;
    string[] URLs; //Si no se proporcionan URL llega una lista vacia
    // string photo; //Token URI ipfs
}
