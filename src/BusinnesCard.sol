// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import { CardDataInit } from "./models/CardDataInit.sol";
import { FullInfoCard } from "./models/FullInfoCard.sol";
import { PublicInfoCard } from "./models/PublicInfoCard.sol";
import { PrivateInfoCard } from "./models/PrivateInfoCard.sol";

import { CompanyInit } from "./models/CompanyInit.sol";
import { Company } from "./models/Company.sol";
import { CompID } from "./models/CompID.sol";

import { Contact } from "./models/Contact.sol";

contract BusinnesCard is ERC721, Ownable{
    address constant ZERO_ADDRESS = address(0);

    constructor(string memory _name, string memory  _symbol) ERC721(_name, _symbol) Ownable(msg.sender) { }
    //////////// Modificadores ///////////////
 
    modifier onlyCompanies() {
        require(companiesID[msg.sender].exists, "Only registered companies can execute this function");
        _;
    }
    modifier addressNotHaveCard(address _addr) {
        require(!cards[_addr].exists, "There is already a card associated with your address");
        _;
    }

    //////////////////////////////////////////////

    uint16 nextCompanyID = 1;
    uint256 nextCardID = 1;
    uint256 feeCreateCompany;

    function setFeeCreateCompany(uint256 _fee) public onlyOwner{
        feeCreateCompany = _fee;
    }

    mapping(address => FullInfoCard) cards;
    
    mapping(address => CompID ) companiesID;
    mapping(uint16 => Company) companies; 

    event CompanyCreated(address indexed companyAddress, uint16 companyID);
    
    // Esta funcion crea un perfil de empresa que queda vinculado uno a uno a la address del sender
    function createCompany(CompanyInit memory _initValues) public payable {
        require(!companiesID[msg.sender].exists, "Company already exists");
        require(msg.value >= feeCreateCompany, "Insufficient payment");
        /// Devolución de excedente (revisar)
        if (msg.value > feeCreateCompany) {
            payable(msg.sender).transfer(msg.value - feeCreateCompany);
        }
        /////TODO Ver que hacer con los fondos ///////////////
        Company memory newCompany = Company({
            initValues: _initValues,
            companyEmployees: 0,
            scoring: 0,
            verified: false
        });
        companiesID[msg.sender] = CompID({id: nextCompanyID, exists: true}); 
        companies[nextCompanyID] = newCompany;
        emit CompanyCreated(msg.sender, nextCompanyID);
        nextCompanyID ++;
    }

    function createCardFor(CardDataInit memory _initValues, address _for) public onlyCompanies addressNotHaveCard(_for){    
        //TODO
    }

    function createMyCard(CardDataInit memory _initValues) public addressNotHaveCard(msg.sender){
        //TODO

    }


}
