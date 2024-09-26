// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { PublicInfoCard } from "./PublicInfoCard.sol";
import { PrivateInfoCard } from "./PrivateInfoCard.sol";

struct Card {
    bool exists;
    uint32 companyID;
    uint32 numberOfContacts;
    uint64 score;
    uint256 tokenId;
    string privateInfoURL;
}
