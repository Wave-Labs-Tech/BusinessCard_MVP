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

import {Contact} from "../src/models/Contact.sol";

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

    function createCard() private {
        string[] memory urls;
        CardDataInit memory dataInit = CardDataInit({
            name: "Alice Lopez",
            email: "alice_lopez@gmail.com",
            position: "",
            phone: 1234123412,
            urls: urls
        });
        businessCard.createMyCard(dataInit);
    }

    function testCreateCard() public {
        vm.startPrank(aliceAddress);
        createCard();

        vm.startPrank(aliceAddress);
        uint256 cardId = businessCard.getMyCardId();
        assertEq(cardId, 1);
        vm.stopPrank();
    }

    function testCreateOnlyOneCard() public {
        vm.startPrank(aliceAddress);
        createCard(); // crea la primera card card
        vm.expectRevert("Address already has Card");
        createCard(); // Se espera que falle al intentar crear una segunda card
        vm.stopPrank();
    }

    function createCompany(string memory companyName_) private {
        CompanyInit memory companyInit = CompanyInit({
            companyName: companyName_,
            companyWebsite: "https://techcorp.com",
            companyLocation: "Av. San Martin 1234",
            companyEmail: "techcorp@info.com",
            companyPhone: 54226764738,
            companyIndustry: "Infomatica", //cambiar por un enum con enumeraciones predefinidas
            companyFoundedYear: 2020,
            companyCeo: "Carlos Manuel Tech",
            companyDescription: "Empresa familiar de servicios informaticos"
        });
        businessCard.createCompany{value: 1 ether}(companyInit); // Llamar a la función con 1 ether
    }

    function testCreateCompany() public {
        // Simular como si 'companyOwner' enviara 1 ether al contrato
        string memory companyName = "TechCorp";
        vm.deal(companyAddress, 2 ether); // Proveer fondos a companyOwner
        vm.startPrank(companyAddress); // Hacer que companyOwner sea el msg.sender
        createCompany(companyName);
        vm.expectRevert("Company already exists");
        createCompany(companyName);
        uint16 myCompanyId = businessCard.getMyCompanyId();
        assertEq(myCompanyId, 1);
        assertEq(businessCard.getCompanyName(myCompanyId), companyName);
    }

    function testCreateCardForEmployed() public {

        string memory companyName = "TechCorp";
        vm.startPrank(companyAddress); // Hacer que companyOwner sea el msg.sender

        vm.expectRevert(); // Se espera que revierda por falta de fondos
        createCompany(companyName);
        vm.deal(companyAddress, 2 ether); // Proveer fondos a companyOwner
        createCompany(companyName);
        uint16 myCompanyId = businessCard.getMyCompanyId();

        string[] memory urls;
        CardDataInit memory dataEmployed1 = CardDataInit({
            name: "Empleado1",
            email: "empleado_1@gmail.com",
            position: "Supervisor",
            phone: 1234123412,
            urls: urls
        });

        CardDataInit memory dataEmployed2 = CardDataInit({
            name: "Empleado2",
            email: "empleado_2@gmail.com",
            position: "Arquitecto",
            phone: 3141592654,
            urls: urls
        });

        businessCard.createCardFor(dataEmployed1, employed1);
        businessCard.createCardFor(dataEmployed2, employed2);

        vm.expectRevert("Address already has Card");
        businessCard.createCardFor(dataEmployed1, employed1);
        vm.stopPrank();

        vm.prank(employed1);
        vm.expectRevert("Address already has Card");
        createCard();

        vm.prank(employed1);
        uint256 cardId = businessCard.getMyCardId();
        assertEq(cardId, 1);

        vm.prank(employed2);
        cardId = businessCard.getMyCardId();
        assertEq(cardId, 2);

        vm.stopPrank();
        assertEq(businessCard.getEmployedQty(myCompanyId), 2);
    }

    function testShareMyCard_ReadCard() public {
        vm.prank(aliceAddress);
        createCard();
        vm.prank(aliceAddress);
        businessCard.shareMyCard(employed1);
        vm.prank(employed2);
        assertEq(businessCard.readCard(aliceAddress).privateInfo.phone, 0);
        vm.prank(employed1);
        assertEq(businessCard.readCard(aliceAddress).privateInfo.phone, 1234123412);
    }
}
