// L2 Sender Script (sendMessage.ts)
import { ethers } from "hardhat";
import { L2Sender } from "../typechain-types";
import * as fs from "fs";

async function main() {
  const L2_CONTRACT_ADDRESS = "0x407339B14163C51a5f609D1d8111A75c710E1b61";
  const L2_MESSAGE_SERVICE = "0x971e727e956690b9957be6d51Ec16E73AcAC83A7";

  const l2Sender = (await ethers.getContractAt(
    "L2Sender",
    L2_CONTRACT_ADDRESS
  )) as L2Sender;

  const messageSentEventABI = [
    "event MessageSent(address indexed from, address indexed to, uint256 fee, uint256 value, uint256 nonce, bytes calldata, bytes32 indexed _messageHash)",
  ];
  const iface = new ethers.Interface(messageSentEventABI);

  const tx = await l2Sender.greet("Hello from Linea!", {
    value: ethers.parseEther("0.001"),
  });
  console.log("Message sent from L2 to L1");
  console.log("Transaction hash:", tx.hash);

  const receipt = await tx.wait();

  const messageSentLog = receipt?.logs.find(
    (log) => log.address.toLowerCase() === L2_MESSAGE_SERVICE.toLowerCase()
  );

  if (messageSentLog) {
    const event = iface.parseLog(messageSentLog as any);
    console.log("MessageSent event data:", event?.args);

    const eventData = {
      from: event?.args[0],
      to: event?.args[1],
      fee: event?.args[2].toString(),
      value: event?.args[3].toString(),
      nonce: event?.args[4].toString(),
      calldata: event?.args[5],
      _messageHash: event?.args[6],
    };

    fs.writeFileSync("messageData.json", JSON.stringify(eventData, null, 2));
    console.log("Message data saved to messageData.json");
  } else {
    console.log("MessageSent event not found in the transaction logs");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
