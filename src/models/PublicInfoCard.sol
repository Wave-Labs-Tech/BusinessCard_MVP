// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Struct de retorno para funciones de acceso a datos publicos
struct PublicInfoCard {
    uint128 cardID;
    string name;
    string photo;
    string[] URLs;
    uint256 score;
    uint256 numberOfContacts;
}
