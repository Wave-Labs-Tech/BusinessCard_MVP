// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Structs.sol";

contract BusinnesCard is ERC721 {
    address constant ZERO_ADDRESS = address(0);
    address public owner;

    constructor() ERC721("BusinessCard", "BC") {
        owner = msg.sender;
    }
    //////////// Modificadores ///////////////
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can execute this function");
        _;
    }

    modifier onlyCompanies() {
        require(companiesID[msg.sender].exists, "Only registered companies can execute this function");
        _;
    }
    modifier senderNotHaveCard() {
        require(!cards[msg.sender].exists, "There is already a card associated with your address");
        _;
    }

    //////////////////////////////////////////////

    uint16 nextCompanyID = 1;
    uint256 nextCardID = 1;
    uint256 feeCreateCompany;

    function setFeeCreateCompany(uint256 _fee) public onlyOwner{
        feeCreateCompany = _fee;
    }

    mapping(address => Structs.FullInfoCard) cards;
    // Evaluar la asignación de un id de empresa como valor y la inclusion de un map (IDEmpresa => Company) para evitar que la address
    // de las empresas queden expuestas en las business card
    mapping(address => Structs.CompID) companiesID;
    mapping(uint16 => Structs.Company) companies; 

    event CompanyCreated(address indexed companyAddress, uint16 companyID);
    
    // Esta funcion crea un perfil de empresa que queda vinculado uno a uno a la address del sender
    function createCompany(Structs.CompanyInit memory initValues) public payable {
        require(!companiesID[msg.sender].exists, "Company already exists");
        require(msg.value >= feeCreateCompany, "Insufficient payment");
        /// Devolución de excedente (revisar)
        if (msg.value > feeCreateCompany) {
            payable(msg.sender).transfer(msg.value - feeCreateCompany);
        }
        ///// Ver que hacer con los fondos ///////////////
        Structs.Company memory newCompany = Structs.Company({
            initValues: initValues,
            companyEmployees: 0,
            scoring: 0,
            verified: false
        });
        companiesID[msg.sender] = Structs.CompID({id: nextCompanyID, exists: true}); 
        companies[nextCompanyID] = newCompany;
        emit CompanyCreated(msg.sender, nextCompanyID);
        nextCompanyID ++;
    }

    function createCardFor(Structs.CardDataInit memory _initValues, address _for) public onlyCompanies{    

    }

    function createMyCard(Structs.CardDataInit memory initValues) public senderNotHaveCard{
        

    }


}
