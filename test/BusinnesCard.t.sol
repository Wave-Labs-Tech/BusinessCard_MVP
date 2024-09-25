// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../lib/forge-std/src/Test.sol";
import "../src/BusinessCard.sol";
import {CardDataInit} from "../src/models/CardDataInit.sol";
import {Card} from "../src/models/Card.sol";
import {PublicInfoCard} from "../src/models/PublicInfoCard.sol";
import {PrivateInfoCard} from "../src/models/PrivateInfoCard.sol";

import {CompanyInit} from "../src/models/CompanyInit.sol";
import {Company} from "../src/models/Company.sol";
import {Id} from "../src/models/Id.sol";

import {Connection} from "../src/models/Connection.sol";

contract BusinnesCardTest is Test {
    BusinessCard businessCard;
    address owner = address(0x1); // Owner inicial
    address aliceAddress = address(0x2); // Usuario para tests
    address companyAddress = address(0x3); // Dirección para crear una compañía
    address employed1 = address(0x4);
    address employed2 = address(0x5);
    address notCompanyAddress = address(0x6);

    function setUp() public {
        vm.startPrank(owner);
        businessCard = new BusinessCard();
        businessCard.setFeeCreateCompany(1 ether);
        vm.stopPrank();
    }

    function createCompany() private {
        
    }

    function testCreateCompany() public {
        
        
    }

    function testCreateCompanyAndCard() public {
       
    }

    function testCreateCardForEmployed() public {

    }

    function testShareMyCard_ReadCard() public {
  
    }
}
