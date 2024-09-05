// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import { CardDataInit } from "./models/CardDataInit.sol";
import { Card } from "./models/Card.sol";
import { PublicInfoCard } from "./models/PublicInfoCard.sol";
import { PrivateInfoCard } from "./models/PrivateInfoCard.sol";

import {CompanyInit } from "./models/CompanyInit.sol";
import { Company } from "./models/Company.sol";
import { ID } from "./models/ID.sol";

import { Contact } from "./models/Contact.sol";

contract BusinnesCard is ERC721, Ownable {
    address constant ZERO_ADDRESS = address(0);

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) Ownable(msg.sender) {}

    //////////// Modificadores ///////////////

    modifier onlyCompanies() {
        require(
            companiesID[msg.sender].exists,
            "Only registered companies can execute this function"
        );
        _;
    }
    modifier addressNotHaveCard(address _addr) {
        require(
            !cards[_addr].exists,
            "There is already a card associated with your address"
        );
        _;
    }

    //////////////////////////////////////////////

    uint16 nextCompanyID = 1;
    uint256 nextCardID = 1;
    uint256 feeCreateCompany;

    function setFeeCreateCompany(uint256 _fee) public onlyOwner {
        feeCreateCompany = _fee;
    }

    mapping(address => Card) cards;

    mapping(address => ID) companiesID;
    mapping(uint16 => Company) companies; //La clave es el campo id del struct ID relacionada a la address del owner de la Company en el mapping companiesID

    event CompanyCreated(address indexed companyAddress, uint16 companyID);

    // Esta funcion crea un perfil de empresa que queda vinculado uno a uno a la address del sender
    function createCompany(CompanyInit memory _initValues) public payable {
        require(!companiesID[msg.sender].exists, "Company already exists");
        require(msg.value >= feeCreateCompany, "Insufficient payment");
        /// Devolución de excedente (revisar)
        if (msg.value > feeCreateCompany) {
            payable(msg.sender).transfer(msg.value - feeCreateCompany);
        }
        /////  Ver que hacer con los fondos ///////////////
        Company memory newCompany = Company({
            initValues: _initValues,
            companyEmployees: 0,
            scoring: 0,
            verified: false
        });
        companiesID[msg.sender] = ID({id: nextCompanyID, exists: true});
        companies[nextCompanyID] = newCompany;
        emit CompanyCreated(msg.sender, nextCompanyID);
        nextCompanyID ++;
    }

    function createCardFor( CardDataInit memory _initValues, address _for ) public onlyCompanies addressNotHaveCard(_for) {
        _initValues.companyID = companiesID[msg.sender].id;
        _safeCreateCard(_initValues, _for);
    }

    function createMyCard(CardDataInit memory _initValues) public addressNotHaveCard(msg.sender) {
        _safeCreateCard(_initValues, msg.sender);
    }

    function _safeCreateCard(CardDataInit memory _initValues, address to ) private {
        Card memory newCard;
        newCard.privateInfo.email = _initValues.email;
        newCard.publicInfo.cardID = nextCardID;
        newCard.publicInfo.name = _initValues.name;
        newCard.privateInfo.phone = _initValues.phone;  
        newCard.publicInfo.position = _initValues.position;
        newCard.publicInfo.URLs = _initValues.URLs;

        newCard.exists = true;
        cards[to] = newCard;
        nextCardID ++;
    }
}
