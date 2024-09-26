// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import { Card } from "./models/Card.sol";
import { CardDataInit } from "./models/CardDataInit.sol";
import { Company } from "./models/Company.sol";
import { CompanyInit } from "./models/CompanyInit.sol";
import { Connection } from "./models/Connection.sol";
import { ConnectionType } from "./enums/ConnectionType.sol";
import { Id } from "./models/Id.sol";
import { PrivateInfoCard } from "./models/PrivateInfoCard.sol";
import { PublicInfoCard } from "./models/PublicInfoCard.sol";


/**
 * @title Business Card Contract
 * @dev This contract manages the creation and sharing of business cards and company profiles.
 * It allows companies to create business cards for employees and users to share their cards.
 */
contract BusinessCard is ERC721, Ownable, ERC721URIStorage {

    /// @notice Emitted when a new business card is created.
    /// @param owner The address that owns the card.
    /// @param cardID The unique ID of the created card.
    event CardCreated(address indexed owner, uint256 cardID);

    /// @notice Emitted when a new company is created.
    /// @param companyAddress The address of the company creator.
    /// @param companyID The unique ID of the created company.
    event CompanyCreated(address indexed companyAddress, uint16 companyID);

    /// @notice Emitted when a business card is shared with another user.
    /// @param fromCard_ The address that shares their card.
    /// @param to_ The address that receives the shared card.
    event SharedCard(address fromCard_, address indexed to_);

    address constant ZERO_ADDRESS = address(0);
    uint16 lastCompanyId;
    uint256 lastCardId;
    uint256 feeCreateCompany;
    address[] publishCards;


    mapping(address => Card) private cards;
    mapping(address => Id) private companiesId;
    mapping(uint16 => Company) private companies; // The key is the ID field from the ID struct related to the owner's address in companiesID
    mapping(address => mapping(address => Connection[])) private contacts; // Tracks if a card was shared with another address

    ///////////////////////////////////// Modifiers /////////////////////////////////////////////////

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

    /**
     * @dev Ensures that there is an established contact between two addresses.
     * The modifier checks if both addresses have a non-zero length of contacts 
     * between them, meaning they have mutually exchanged contact information.
     * Reverts if there is no connection between the two addresses.
     * @param a_ The first address to check.
     * @param b_ The second address to check.
     */
    modifier onlyBetweenContact(address a_, address b_) {
        require(contacts[a_][b_].length != 0 && contacts[b_][a_].length != 0);
        _;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * @notice Constructor for the Business Card contract.
     * @dev Initializes the ERC721 contract with the token name "Business Card" and symbol "BCARD".
     */
    constructor() ERC721("Business Card", "BCARD") Ownable(msg.sender) { }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function tokenUriByAddress(address owner) public view returns(string memory) {
        require(cards[owner].exists, "The address provided does not have any associated card.");
        return tokenURI(cards[owner].tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    //////////////////////////////////////////// Getters //////////////////////////////////////////////

    /**
     * @notice Retrieves the business card information of a given address.
     * @dev If the caller is not a contact of the card owner, private information (phone and email) will be hidden.
     * @param cardOwner The address of the card owner whose information will be retrieved.
     */
    function getContactInfoCard(address cardOwner) public view returns(string memory) {
        if(contacts[cardOwner][msg.sender].length > 0){
            return cards[cardOwner].privateInfoURL;
        }
        return "";
    }
    
    /**
     * @notice Retrieves the business card information of the caller.
     * @dev This function returns the full business card data for the caller's own address.
     * It includes both public and private information, such as phone and email.
     * @return The complete business card data of the caller.
     */
    function getMyCard() public view returns(Card memory) {
        return cards[msg.sender];
    }

    /**
     * @notice Checks if the provided address is a mutual contact of the sender.
     * @dev This function checks if there is a bidirectional connection between the sender and the given address.
     * A mutual contact means both addresses have exchanged their business cards with each other.
     * @param c_ The address to check if it's a mutual contact with the sender.
     * @return bool Returns true if there is a mutual contact; otherwise, false.
     */
    function isMyContact(address c_) public view returns(bool) {
        return contacts[msg.sender][c_].length != 0 && contacts[c_][msg.sender].length != 0 ? true : false;
    }

    // function getMyContacts() public view return (address, strings[]) {
    //     string[] result;
    //     for(user in contacts[msg.sender]){
    //         if(isMyContact(user))
    //     }
    // }
    
    function getContactQtyByOwner(address card) public view returns(uint32) {
        require(cards[card].exists, "The address provided does not have any associated card.");
        return cards[card].numberOfContacts;
    }
    /**
     * @notice Get the ID of the company associated with the sender.
     * @dev Only callable by registered companies.
     * @return The ID of the sender's company.
     */
    function getMyCompanyId() public view onlyCompanies returns(uint16) {
        return companiesId[msg.sender].id;
    }

    /**
     * @notice Retrieves the company profile associated with the caller's address.
     * @dev This function returns the company data for the caller based on their registered company ID.
     * It pulls the company information from the `companies` mapping using the caller's ID stored in `companiesId`.
     * @return The company profile associated with the caller.
     */
    function getMyCompany() public view returns(Company memory) {
        return companies[companiesId[msg.sender].id];
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
     * @notice Retrieves the company associated with a given owner's address.
     * @dev Returns the company that corresponds to the provided owner's address.
     * @param owner_ The address of the owner whose company is being retrieved.
     * @return The company struct associated with the given owner.
     */
    function getCompanyByOwner(address owner_) public view returns(Company memory) {
        return companies[companiesId[owner_].id];
    }

    /**
     * @notice Retrieves the list of public business cards.
     * @dev Iterates through the array of public card holders and returns their associated token URIs.
     * @return An array of strings containing the token URIs of all public business cards.
     */
    function getPublicCards() public view returns(string[] memory) {
        string[] memory result = new string[](publishCards.length);
        for (uint i = 0; i < publishCards.length; i++) {
            result[i] = tokenUriByAddress(publishCards[i]);
        }
        return result;
    }

    ///////////////////////////////////////  Setters  /////////////////////////////////////////////

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
     * @notice Create a new company profile linked to a specific address.
     * @dev Only the contract owner can call this function. 
     * No payment is required for this function. 
     * @param initValues_ The initial data for the company.
     * @param to_ The address to which the company profile will be linked.
     */

    function createForCompany(CompanyInit memory initValues_, address to_) public onlyOwner {
        require(!companiesId[to_].exists, "Company already exists");
        Company memory newCompany = Company({
            initValues: initValues_,
            companyEmployees: 0,
            scoring: 0,
            verified: false
        });
        lastCompanyId++;
        companiesId[to_] = Id({id: lastCompanyId, exists: true});
        companies[lastCompanyId] = newCompany;
        emit CompanyCreated(to_, lastCompanyId);
    }

    /**
     * @notice Create a new business card for an address.
     * @dev Only callable by registered companies. The address must not already have a card.
     * @param for_ The address for which the card is being created.
     */
    function createCardFor(string memory tokenURI_, string memory privateInfoURL_, address for_) public onlyCompanies addressNotHaveCard(for_) {
        uint16 companyId = companiesId[msg.sender].id;
        _safeCreateCard(tokenURI_, privateInfoURL_, for_, companyId);
        companies[companyId].companyEmployees++;
    }

    // /**
    //  * @notice Create a new business card for the sender.
    //  * @dev The sender must not already have a card.
    //  */
    // function createMyCard(string memory tokenURI_, string memory privateInfoURL_) public addressNotHaveCard(msg.sender) {
    //     // uint16 companyId = 0; //Not belonging to any company
    //     _safeCreateCard(tokenURI_,privateInfoURL_ , msg.sender, 0);
    // }

    /**
     * @notice Sets the visibility of the sender's business card.
     * @dev The card must exist for the sender. If `visibility` is true, the card is added to the list of public cards. 
     *   If `visibility` is false, the card is removed from the list of public cards.
     * @param visibility A boolean value indicating whether the sender's card should be visible (true) or not (false).
     */
    function setVisibilityCard(bool visibility) public {
        require(cards[msg.sender].exists, "There is no Card associated with your address");
        if (visibility) {
            for (uint i = 0; i < publishCards.length; i++) {
                if (msg.sender == publishCards[i]) {
                    return;
                }
            }
            publishCards.push(msg.sender);
        } else {
            for (uint i = 0; i < publishCards.length; i++) {
                if (msg.sender == publishCards[i]) {
                    publishCards[i] = publishCards[publishCards.length - 1]; // Mover el último elemento al lugar de i
                    publishCards.pop();
                    return;
                }
            }
        }
    }

    /**
     * @notice Share the sender's business card with another address.
     * @dev The card must exist for the sender.
     * @param to_ The address with whom the card is being shared.
     */
    function shareMyCard(address to_) public {
        assert(cards[msg.sender].exists);
        require(contacts[msg.sender][to_].length == 0, "You have already shared the Card with that user");
        //Si to_ habia compartido previamente la Card con el sender, se completa la conexion y se incrementan los contadores de contactos de ambos
        if(contacts[to_][msg.sender].length > 0){   
            cards[msg.sender].numberOfContacts += 1;
            cards[to_].numberOfContacts += 1;
        }
        Connection memory newConnection = Connection({
            timestamp: block.timestamp,
            kind: ConnectionType.Share
        });
        contacts[msg.sender][to_].push(newConnection);
        emit SharedCard(msg.sender, to_);
    }

    /**
     * @notice Set the fee required to create a new company profile.
     * @dev Only callable by the contract owner.
     * @param _fee The new fee amount in wei.
     */
    function setFeeCreateCompany(uint256 _fee) public onlyOwner {
        feeCreateCompany = _fee;
    }

    /**
     * @dev Internal function to safely create a business card for a given address.
     * @param tokenURI_ The initial data for the business card.
     * @param to The address for which the card is being created.
     */
    function _safeCreateCard(string memory tokenURI_, string memory privateInfoURL, address to, uint16 companyId_) private {
        lastCardId++;
        Card memory newCard;
        newCard.tokenId = lastCardId++;
        newCard.privateInfoURL = privateInfoURL;
        newCard.companyID = companyId_;
        newCard.exists = true;
        cards[to] = newCard;
        _safeMint(to, lastCardId);
        _setTokenURI(lastCardId, tokenURI_);
        emit CardCreated(to,lastCardId);
    }

}
