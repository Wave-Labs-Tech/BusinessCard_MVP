// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

contract Structs {
    struct CompanyInit {
        string companyName;
        string companyLocation;
        string companyWebsite;
        string companyEmail;
        string companyPhone;
        string companyIndustry; //cambiar por un enum con enumeraciones predefinidas
        string companyFoundedYear;
        string companyCEO;
        string companyDescription;
    }

    struct CompID {
        uint16 id;
        bool exists;
    }

    struct Company {
        CompanyInit initValues;
        bool verified;
        uint16 companyEmployees;
        uint32 scoring;
    }

    struct CardDataInit {
        string name;
        string email;
        uint256 companyID;
        string position;
        uint256 phone;
        string[] URLs; //Si no se proporcionan URL llega una lista vacia
        // string photo; //Token URI ipfs
    }
    // Struct de retorno para funciones de acceso a datos publicos
    struct PublicInfoCard {
        uint128 cardID;
        string name;
        string photo;
        string[] URLs;
        uint256 score;
        uint256 numberOfContacts;
    }
    // Struct de retorno para funciones de acceso a datos publicos
    struct PrivateInfoCard {
        uint64 companyID; // Publico o privado?
        uint256 phone;
        string email;
    }
    struct FullInfoCard {
        PublicInfoCard publicInfo;
        PrivateInfoCard privateInfo;
        bool exists;
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
