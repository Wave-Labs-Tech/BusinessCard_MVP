// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import { CardDataInit } from "./models/CardDataInit.sol";
import { Card } from "./models/Card.sol";
import { Company } from "./models/Company.sol";
import { CompanyInit } from "./models/CompanyInit.sol";
import { Contact } from "./models/Contact.sol";
import { ID } from "./models/ID.sol";
import { PublicInfoCard } from "./models/PublicInfoCard.sol";
import { PrivateInfoCard } from "./models/PrivateInfoCard.sol";

contract BusinnesCard is ERC721, Ownable {

    event CardCreated(address indexed owner, uint256 cardID, string name);
    event CompanyCreated(address indexed companyAddress, uint16 companyID);
    event SharedCard(address fromCard_, address indexed to_);

    address constant ZERO_ADDRESS = address(0);

    constructor() ERC721("Business Card", "BCARD") Ownable(msg.sender) { }

    //////////// Modifiers ///////////////

    modifier onlyCompanies() {
        require(companiesID[msg.sender].exists, "Only registered companies");
        _;
    }
    modifier addressNotHaveCard(address addr_) {
        require(!cards[addr_].exists, "Address already has Card");
        _;
    }

    uint16 lastCompanyID;
    uint256 lastCardID;
    uint256 feeCreateCompany;
   
    mapping(address => Card) cards;
    mapping(address => ID) companiesID;
    mapping(uint16 => Company) companies; //La clave es el campo id del struct ID relacionada a la address del owner de la Company en el mapping companiesID
    mapping(address => mapping(address => bool)) contacts; //

    /////// Getters ////////////////////
    function getMyCompanyID() public view onlyCompanies returns(uint16) {
        return companiesID[msg.sender].id;
    }

    function getCompanyName(uint16 id_) public view returns(string memory) {
        return companies[id_].initValues.companyName;
    }

    function getEmployedQty(uint16 id_) public view returns(uint16) {
        return companies[id_].companyEmployees;
    }
    
    function getMyCardId() public view returns(uint256){
        return cards[msg.sender].publicInfo.cardID;
    }
    ////////////////////////////////////////////////////

    function setFeeCreateCompany(uint256 _fee) public onlyOwner {
        feeCreateCompany = _fee;
    }

    // Esta funcion crea un perfil de empresa que queda vinculado uno a uno a la address del sender
    function createCompany(CompanyInit memory initValues_) public payable {
        require(!companiesID[msg.sender].exists, "Company already exists");
        require(msg.value >= feeCreateCompany, "Insufficient payment");
        /// Devolución de excedente (revisar)
        if (msg.value > feeCreateCompany) {
            payable(msg.sender).transfer(msg.value - feeCreateCompany);
        }
        /////  Ver que hacer con los fondos ///////////////
        Company memory newCompany = Company({
            initValues: initValues_,
            companyEmployees: 0,
            scoring: 0,
            verified: false
        });
        lastCompanyID++;
        companiesID[msg.sender] = ID({id: lastCompanyID, exists: true});
        companies[lastCompanyID] = newCompany;
        emit CompanyCreated(msg.sender, lastCompanyID);
        
    }

    function createCardFor( CardDataInit memory initValues_, address _for ) public onlyCompanies addressNotHaveCard(_for) {
        initValues_.companyID = companiesID[msg.sender].id;
        _safeCreateCard(initValues_, _for);
        companies[initValues_.companyID].companyEmployees ++;
    }
    
    function createMyCard( CardDataInit memory initValues_ ) public addressNotHaveCard(msg.sender) {
        _safeCreateCard(initValues_, msg.sender);
    }

    function shareMyCard(address to_) public {
        assert(cards[msg.sender].exists);
        contacts[msg.sender][to_] = true;
        emit SharedCard(msg.sender, to_);
    }

    function _safeCreateCard(CardDataInit memory initValues_, address to) private {
        lastCardID++;
        Card memory newCard;
        newCard.privateInfo.email = initValues_.email;
        newCard.publicInfo.cardID = lastCardID;
        newCard.publicInfo.name = initValues_.name;
        newCard.privateInfo.phone = initValues_.phone;
        newCard.publicInfo.position = initValues_.position;
        newCard.publicInfo.URLs = initValues_.URLs;
        newCard.exists = true;
        cards[to] = newCard;
        emit CardCreated(to, newCard.publicInfo.cardID, newCard.publicInfo.name);
    }



}
