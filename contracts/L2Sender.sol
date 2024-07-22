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
    address public l1ReceiverAddress;

    constructor(address _l1ReceiverAddress) {
        l1ReceiverAddress = _l1ReceiverAddress;
    }

    function greet(string memory messageToL1) external payable {
        bytes memory payload = abi.encodeWithSignature(
            "receiveMessage(string)",
            messageToL1
        );
        IL2MessageService(L2_MESSAGE_SERVICE).sendMessage(
            l1ReceiverAddress,
            0,
            payload
        );
    }
}
