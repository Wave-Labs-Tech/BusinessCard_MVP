// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../lib/forge-std/src/Test.sol";
import "../src/BusinnesCard.sol"; // Importa tu contrato
import { CardDataInit } from "../src/models/CardDataInit.sol";
import { Card } from "../src/models/Card.sol";
import { PublicInfoCard } from "../src/models/PublicInfoCard.sol";
import { PrivateInfoCard } from "../src/models/PrivateInfoCard.sol";

import { CompanyInit } from "../src/models/CompanyInit.sol";
import { Company } from "../src/models/Company.sol";
import { ID } from "../src/models/ID.sol";

import { Contact } from "../src/models/Contact.sol";

contract BusinnesCardTest is Test {
    BusinnesCard businessCard;
    address owner = address(0x1); // Owner inicial
    address aliceAddress = address(0x2);  // Usuario para tests
    address companyAddress = address(0x3); // Dirección para crear una compañía
    address employed = address(0x4);
    address notCompanyAddress = address(0x5);

    function setUp() public {
        vm.startPrank(owner);  
        businessCard = new BusinnesCard("Business Card", "BCARD");  
        businessCard.setFeeCreateCompany(1 ether); 
        vm.stopPrank();
    }

    function testCreateCard() public {
        vm.startPrank(aliceAddress);
        string[] memory urls;
        CardDataInit memory dataInit = CardDataInit({
            name: "Alice Lopez",
            email: "alice_lopez@gmail.com",
            companyID: 0,
            position: "",
            phone: "+1234123412",
            URLs: urls
        });
        businessCard.createMyCard(dataInit);
        vm.stopPrank();
    }

    function testCreateOnlyOneCard() public {
        vm.startPrank(aliceAddress);
        string[] memory urls;
        CardDataInit memory dataInit = CardDataInit({
            name: "Alice Lopez",
            email: "alice_lopez@gmail.com",
            companyID: 0,
            position: "",
            phone: "+1234123412",
            URLs: urls
        });
        businessCard.createMyCard(dataInit);
        vm.stopPrank();
        vm.startPrank(aliceAddress);
        vm.expectRevert("Address already has Card");
        businessCard.createMyCard(dataInit);
        vm.stopPrank();
    }

    function testCreateCompany() public {
        // Simular como si 'companyOwner' enviara 1 ether al contrato
        vm.deal(companyAddress, 2 ether);  // Proveer fondos a companyOwner
        vm.prank(companyAddress);  // Hacer que companyOwner sea el msg.sender
        
        CompanyInit memory companyInit = CompanyInit({
            companyName: "TechCorp",
            companyWebsite: "https://techcorp.com",
            companyLocation: "Av. San Martin 1234",
            companyEmail: "techcorp@info.com",
            companyPhone: "+54226764738",
            companyIndustry: "Infomatica", //cambiar por un enum con enumeraciones predefinidas
            companyFoundedYear: 2020,
            companyCEO: "Carlos Manuel Tech",
            companyDescription: "Empresa familiar de servicios informaticos"
        });
        
        businessCard.createCompany{value: 1 ether}(companyInit); // Llamar a la función con 1 ether
    }


}

