// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Struct de retorno para funciones de acceso a datos publicos
struct PublicInfoCard {
    uint256 cardID;
    string name;
    string photo;
    uint16 companyID;
    string position;
    string[] URLs;
    uint256 score;
    uint256 numberOfContacts;
}
