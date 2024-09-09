// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct CardDataInit {
    uint64 phone;
    uint16 companyID;
    string name;
    string email;
    string position;
    string[] URLs; //Si no se proporcionan URL llega una lista vacia
    // string photo; //Token URI ipfs
}
