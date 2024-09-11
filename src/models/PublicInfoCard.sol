// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Struct de retorno para funciones de acceso a datos publicos
struct PublicInfoCard {
    uint256 cardId;
    uint16 companyId;
    string name;
    string photo; 
    string position;
    string[] urls;
    uint256 score;
    uint256 numberOfContacts;
}
