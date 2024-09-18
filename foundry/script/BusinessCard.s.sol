// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { BusinessCard } from "../src/BusinessCard.sol";

contract BusinessCardScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        BusinessCard businessCard = new BusinessCard();
        console.log("BusinessCard contract deployed at: ", address(businessCard));
        
        vm.stopBroadcast();
        emit Deployed(address(businessCard));
    }

    event Deployed(address contractAddress);
}
