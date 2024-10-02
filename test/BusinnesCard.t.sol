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
    address aliceAddress = address(0x2);
    address bobAddress = address(0x3);
    address companyAddress = address(0x4); // Dirección para crear una compañía
    address employed1 = address(0x5);
    address employed2 = address(0x6);
    address notCompanyAddress = address(0x7);
    string publicCompanyDataCid = "1111111111111111111";
    string privateCompanyDataCid = "2222222222222222222";
    string publicCardDataCid = "33333333333333333333333";
    string privateCardDataCid = "44444444444444444444444";

    function setUp() public {
        vm.startPrank(owner);
        businessCard = new BusinessCard();
        businessCard.setFeeCreateCompany(1 ether);
        vm.stopPrank();
    }

    function testCreateForCompany() public {
        vm.prank(owner);
        businessCard.createForCompany(
            CompanyInit({
                publicDataCid: publicCompanyDataCid,
                privateDataCid: privateCompanyDataCid}),
            companyAddress);
        
        vm.assertEq(businessCard.getCompanyByOwner(companyAddress).initValues.publicDataCid, publicCompanyDataCid);
        vm.prank(companyAddress);
        vm.assertEq(businessCard.getMyCompany().initValues.publicDataCid, publicCompanyDataCid);
    }

    function testCreateCardForEmployed() public {
        vm.prank(owner);
        businessCard.createForCompany(
            CompanyInit({
                publicDataCid: publicCompanyDataCid,
                privateDataCid: privateCompanyDataCid}),
            companyAddress);

        vm.expectRevert("Only registered companies");
        businessCard.createCardFor(publicCardDataCid, privateCardDataCid, employed1);

        vm.startPrank(companyAddress);
        businessCard.createCardFor(publicCardDataCid, privateCardDataCid, employed1);

        vm.expectRevert("Address already has Card");
        businessCard.createCardFor(publicCardDataCid, privateCardDataCid, employed1);
        vm.stopPrank();
        
        vm.prank(employed1);
        vm.assertEq(businessCard.getMyCard().privateInfoURL, privateCardDataCid);
    }

    function testShareMyCardAndIsMyContact() public {
        vm.prank(owner);
        businessCard.createForCompany(
            CompanyInit({
                publicDataCid: publicCompanyDataCid,
                privateDataCid: privateCompanyDataCid}),
            companyAddress);

        vm.startPrank(companyAddress);
        businessCard.createCardFor(publicCardDataCid, privateCardDataCid, employed1);
        businessCard.createCardFor(publicCardDataCid, privateCardDataCid, employed2);
        vm.stopPrank();

        vm.expectRevert("Sender not have Card");
        businessCard.getMyCard();
        vm.startPrank(employed1);
        businessCard.shareMyCard(employed2);
        vm.assertEq(businessCard.isMyContact(employed2), false);

        vm.assertEq(businessCard.getMyCard().privateInfoURL, privateCardDataCid);

        vm.stopPrank();
        vm.startPrank(employed2);
        businessCard.shareMyCard(employed1);

        vm.expectRevert("You have already shared the Card with that user");
        businessCard.shareMyCard(employed1);

        vm.assertEq(businessCard.isMyContact(employed1), true);
        vm.stopPrank();
        vm.prank(employed1);
        vm.assertEq(businessCard.isMyContact(employed2), true);

        vm.assertEq(businessCard.getContactQtyByOwner(employed1), 1);
        assert(businessCard.getContactQtyByOwner(employed1) != 2);

        vm.assertEq(businessCard.getContactInfoCard(employed1), "");

        vm.prank(employed2);
        vm.assertEq(businessCard.getContactInfoCard(employed1), privateCardDataCid);
        
        vm.assertEq(businessCard.tokenUriByAddress(employed2),publicCardDataCid);
    }
    function testSetVisibility() public {
        vm.prank(owner);
        businessCard.createForCompany(
            CompanyInit({
                publicDataCid: publicCompanyDataCid,
                privateDataCid: privateCompanyDataCid}),
            companyAddress);

        vm.startPrank(companyAddress);
        businessCard.createCardFor(publicCardDataCid, privateCardDataCid, employed1);
        businessCard.createCardFor(publicCardDataCid, privateCardDataCid, employed2);
        businessCard.createCardFor(publicCardDataCid, privateCardDataCid, aliceAddress);
        vm.stopPrank();

        vm.assertEq(businessCard.getPublicCards().length, 3);

        vm.prank(bobAddress);
        vm.expectRevert("There is no Card associated with your address");
        businessCard.setVisibilityCard(true);

        vm.prank(employed1);
        businessCard.setVisibilityCard(false);
        vm.assertEq(businessCard.getPublicCards().length, 2);
        vm.prank(employed2);
        businessCard.setVisibilityCard(false);
        vm.prank(employed2);
        businessCard.setVisibilityCard(false);
        vm.assertEq(businessCard.getPublicCards().length, 1);
        vm.assertEq(businessCard.getPublicCards()[0].owner, aliceAddress);
        vm.prank(employed1);
        businessCard.setVisibilityCard(true);
        vm.prank(employed1);
        businessCard.setVisibilityCard(true);
        vm.assertEq(businessCard.getPublicCards().length, 2);

    }
}
