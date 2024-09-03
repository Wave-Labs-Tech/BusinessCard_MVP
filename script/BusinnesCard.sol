// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BusinnesCard is ERC721 {

    constructor() ERC721("BusinessCard", "BC") {}

    // mapping(uint256 => )

    //Struct para enviar a la funcion mintear BC
    mapping(uint256 => Company) companies;

    struct Company {
        uint256 companyID;
        string companyName;
        string companyAddress;
        string companyWebsite;
        string companyEmail;
        uint256 companyPhone;
        string companyIndustry; //cambiar por un enum con enumeraciones predefinidas
        string companyFoundedYear;
        string companyCEO;
        uint16 companyEmployees;
        string companyDescription;
    }

    struct CardDataInit { 
        string name;
        string email;
        uint256 companyID;
        string cargo;  
        uint256 phone;
        string[] URLs; //Si no se proporcionan URL llega una lista vacia
        // string photo; //Token URI ipfs
    }
    // Struct de retorno para funciones de acceso a datos publicos
    struct PublicInfoCard {
        uint256 id;
        string name;
        string photo;
        string[] URLs;
        uint256 score; 
        uint256 numberOfContacts;
    }
    // Struct de retorno para funciones de acceso a datos publicos
    struct PrivateInfoCard {
        uint256 phone;
        string email;
    }
    struct FullInfoCard {
        PublicInfoCard publicInfo;
        PrivateInfoCard privateInfo;
    }
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

}
