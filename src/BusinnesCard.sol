// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import { Card } from "./models/Card.sol";
import { CardDataInit } from "./models/CardDataInit.sol";
import { Company } from "./models/Company.sol";
import { CompanyInit } from "./models/CompanyInit.sol";
import { Contact } from "./models/Contact.sol";
import { Id } from "./models/Id.sol";
import { PrivateInfoCard } from "./models/PrivateInfoCard.sol";
import { PublicInfoCard } from "./models/PublicInfoCard.sol";

/**
 * @title Business Card Contract
 * @dev This contract manages the creation and sharing of business cards and company profiles.
 * It allows companies to create business cards for employees and users to share their cards.
 */
contract BusinnesCard is ERC721, Ownable {

    /// @notice Emitted when a new business card is created.
    /// @param owner The address that owns the card.
    /// @param cardID The unique ID of the created card.
    /// @param name The name associated with the card.
    event CardCreated(address indexed owner, uint256 cardID, string name);

    /// @notice Emitted when a new company is created.
    /// @param companyAddress The address of the company creator.
    /// @param companyID The unique ID of the created company.
    event CompanyCreated(address indexed companyAddress, uint16 companyID);

    /// @notice Emitted when a business card is shared with another user.
    /// @param fromCard_ The address that shares their card.
    /// @param to_ The address that receives the shared card.
    event SharedCard(address fromCard_, address indexed to_);

    address constant ZERO_ADDRESS = address(0);

    /**
     * @notice Constructor for the Business Card contract.
     * @dev Initializes the ERC721 contract with the token name "Business Card" and symbol "BCARD".
     */
    constructor() ERC721("Business Card", "BCARD") Ownable(msg.sender) { }

    //////////// Modifiers ///////////////

    /**
     * @dev Ensures that only registered companies can call certain functions.
     */
    modifier onlyCompanies() {
        require(companiesId[msg.sender].exists, "Only registered companies");
        _;
    }

    /**
     * @dev Ensures that the provided address does not already have a business card.
     * @param addr_ The address to check.
     */
    modifier addressNotHaveCard(address addr_) {
        require(!cards[addr_].exists, "Address already has Card");
        _;
    }

    uint16 lastCompanyId;
    uint256 lastCardId;
    uint256 feeCreateCompany;

    mapping(address => Card) cards;
    mapping(address => Id) companiesId;
    mapping(uint16 => Company) companies; // The key is the ID field from the ID struct related to the owner's address in companiesID
    mapping(address => mapping(address => bool)) contacts; // Tracks if a card was shared with another address

    /////// Getters ////////////////////

    /**
     * @notice Get the ID of the company associated with the sender.
     * @dev Only callable by registered companies.
     * @return The ID of the sender's company.
     */
    function getMyCompanyId() public view onlyCompanies returns(uint16) {
        return companiesId[msg.sender].id;
    }

    /**
     * @notice Get the name of a company by its ID.
     * @param id_ The ID of the company.
     * @return The name of the company.
     */
    function getCompanyName(uint16 id_) public view returns(string memory) {
        return companies[id_].initValues.companyName;
    }

    /**
     * @notice Get the number of employees in a company by its ID.
     * @param id_ The ID of the company.
     * @return The number of employees in the company.
     */
    function getEmployedQty(uint16 id_) public view returns(uint16) {
        return companies[id_].companyEmployees;
    }

    /**
     * @notice Get the ID of the card owned by the sender.
     * @return The ID of the sender's card.
     */
    function getMyCardId() public view returns(uint256){
        return cards[msg.sender].publicInfo.cardId;
    }

    ////////////////////////////////////////////////////

    /**
     * @notice Set the fee required to create a new company profile.
     * @dev Only callable by the contract owner.
     * @param _fee The new fee amount in wei.
     */
    function setFeeCreateCompany(uint256 _fee) public onlyOwner {
        feeCreateCompany = _fee;
    }

    /**
     * @notice Create a new company profile linked to the sender's address.
     * @dev Requires a payment equal to or greater than the fee. Any excess is refunded.
     * @param initValues_ The initial data for the company.
     */
    function createCompany(CompanyInit memory initValues_) public payable {
        require(!companiesId[msg.sender].exists, "Company already exists");
        require(msg.value >= feeCreateCompany, "Insufficient payment");
        /// Refund excess payment if any
        if (msg.value > feeCreateCompany) {
            payable(msg.sender).transfer(msg.value - feeCreateCompany);
        }
        ///// Process funds (decide what to do with the collected funds)
        Company memory newCompany = Company({
            initValues: initValues_,
            companyEmployees: 0,
            scoring: 0,
            verified: false
        });
        lastCompanyId++;
        companiesId[msg.sender] = Id({id: lastCompanyId, exists: true});
        companies[lastCompanyId] = newCompany;
        emit CompanyCreated(msg.sender, lastCompanyId);
    }

    /**
     * @notice Create a new business card for an address.
     * @dev Only callable by registered companies. The address must not already have a card.
     * @param initValues_ The initial data for the business card.
     * @param _for The address for which the card is being created.
     */
    function createCardFor(CardDataInit memory initValues_, address _for) public onlyCompanies addressNotHaveCard(_for) {
        initValues_.companyId = companiesId[msg.sender].id;
        _safeCreateCard(initValues_, _for);
        companies[initValues_.companyId].companyEmployees++;
    }

    /**
     * @notice Create a new business card for the sender.
     * @dev The sender must not already have a card.
     * @param initValues_ The initial data for the business card.
     */
    function createMyCard(CardDataInit memory initValues_) public addressNotHaveCard(msg.sender) {
        _safeCreateCard(initValues_, msg.sender);
    }

    /**
     * @notice Share the sender's business card with another address.
     * @dev The card must exist for the sender.
     * @param to_ The address with whom the card is being shared.
     */
    function shareMyCard(address to_) public {
        assert(cards[msg.sender].exists);
        contacts[msg.sender][to_] = true;
        emit SharedCard(msg.sender, to_);
    }

    /**
     * @dev Internal function to safely create a business card for a given address.
     * @param initValues_ The initial data for the business card.
     * @param to The address for which the card is being created.
     */
    function _safeCreateCard(CardDataInit memory initValues_, address to) private {
        lastCardId++;
        Card memory newCard;
        newCard.privateInfo.email = initValues_.email;
        newCard.publicInfo.cardId = lastCardId;
        newCard.publicInfo.name = initValues_.name;
        newCard.privateInfo.phone = initValues_.phone;
        newCard.publicInfo.position = initValues_.position;
        newCard.publicInfo.URLs = initValues_.URLs;
        newCard.exists = true;
        cards[to] = newCard;
        emit CardCreated(to, newCard.publicInfo.cardId, newCard.publicInfo.name);
    }

    /**
     * @notice Retrieves the business card information of a given address.
     * @dev If the caller is not a contact of the card owner, private information (phone and email) will be hidden.
     * @param cardOwner The address of the card owner whose information will be retrieved.
     * @return result A `Card` struct containing the public (and private, if applicable) information of the card owner.
     */
    function readCard(address cardOwner) public view returns(Card memory) {
        Card memory result = cards[cardOwner];
        if(!contacts[cardOwner][msg.sender]){
            result.privateInfo.phone = 0;
            result.privateInfo.email = "";
        }
        return result;
    }

}
