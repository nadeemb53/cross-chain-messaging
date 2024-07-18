// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IL2MessageService {
    function sendMessage(
        address _to,
        uint256 _fee,
        bytes calldata _data
    ) external payable;
}

contract L2Sender {
    address public constant L2_MESSAGE_SERVICE =
        0x971e727e956690b9957be6d51Ec16E73AcAC83A7;
    address public l1ContractAddress;
    uint256 public constant MESSAGE_FEE = 0 ether; // Example fee, adjust as needed

    constructor(address _l1ContractAddress) {
        l1ContractAddress = _l1ContractAddress;
    }

    function greet(string memory messageToL1) external payable {
        require(msg.value >= MESSAGE_FEE, "Insufficient fee");

        bytes memory payload = abi.encodeWithSignature(
            "receiveMessage(string)",
            messageToL1
        );

        IL2MessageService(L2_MESSAGE_SERVICE).sendMessage{value: msg.value}(
            l1ContractAddress,
            MESSAGE_FEE,
            payload
        );
    }
}
