// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IL2MessageService {
    function sendMessage(address _to, bytes calldata _data) external payable;
}

contract L2Sender {
    address public constant L2_MESSAGE_SERVICE =
        0x971e727e956690b9957be6d51Ec16E73AcAC83A7;
    address public l1ContractAddress;

    constructor(address _l1ContractAddress) {
        l1ContractAddress = _l1ContractAddress;
    }

    function greet(string memory messageToL1) external payable {
        bytes memory payload = abi.encodeWithSignature(
            "receiveMessage(string)",
            messageToL1
        );
        IL2MessageService(L2_MESSAGE_SERVICE).sendMessage{value: msg.value}(
            l1ContractAddress,
            payload
        );
    }
}
