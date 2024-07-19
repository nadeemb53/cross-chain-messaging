// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract L1Receiver {
    string public lastReceivedMessage;
    address public l2ContractAddress;

    constructor(address _l2ContractAddress) {
        l2ContractAddress = _l2ContractAddress;
    }

    function receiveMessage(string memory message) external {
        // require(
        //     msg.sender == l2ContractAddress,
        //     "Only callable by L2MessageService"
        // );
        lastReceivedMessage = message;
    }

    function setL2ContractAddress(address _l2ContractAddress) external {
        l2ContractAddress = _l2ContractAddress;
    }
}
