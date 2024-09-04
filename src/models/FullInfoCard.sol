// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { PublicInfoCard } from "./PublicInfoCard.sol";
import { PrivateInfoCard } from "./PrivateInfoCard.sol";

struct FullInfoCard {
    PublicInfoCard publicInfo;
    PrivateInfoCard privateInfo;
    bool exists;
}
