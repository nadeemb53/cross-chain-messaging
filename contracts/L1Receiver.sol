// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract L1Receiver {
    string public lastReceivedMessage;
    address public l2MessageServiceAddress;

    constructor(address _l2MessageServiceAddress) {
        l2MessageServiceAddress = _l2MessageServiceAddress;
    }

    function receiveMessage(string memory message) external {
        require(
            msg.sender == l2MessageServiceAddress,
            "Only callable by L2MessageService"
        );
        lastReceivedMessage = message;
    }
}
