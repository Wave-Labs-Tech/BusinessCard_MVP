// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { CompanyInit } from "./CompanyInit.sol";

struct Company {
    bool exists;
    bool verified;
    uint16 companyEmployees;
    uint32 scoring;
    CompanyInit initValues;
}
