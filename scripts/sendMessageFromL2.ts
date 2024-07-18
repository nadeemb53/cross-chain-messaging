import { ethers } from "hardhat";
import { L2Sender } from "../typechain-types";

// ABI for the MessageSent event
const messageSentEventABI = [
  "event MessageSent(address indexed from, address indexed to, uint256 fee, uint256 value, uint256 nonce, bytes calldata, bytes32 indexed _messageHash)",
];

async function main() {
  const L2_CONTRACT_ADDRESS = "0xBEe9D9F0C7532ac74f066f0d0025C80cc9CC22F3";
  const L2_MESSAGE_SERVICE = "0x971e727e956690b9957be6d51Ec16E73AcAC83A7";

  // Connect to L2 contract
  const l2Sender = (await ethers.getContractAt(
    "L2Sender",
    L2_CONTRACT_ADDRESS
  )) as L2Sender;

  // Create an interface for the MessageSent event
  const iface = new ethers.Interface(messageSentEventABI);

  // Send a message from L2 to L1
  const tx = await l2Sender.greet("Hello from Linea!", {
    value: ethers.parseEther("0.0001"),
  });
  console.log("Message sent from L2 to L1");
  console.log("Transaction hash:", tx.hash);

  // Wait for the transaction to be mined
  const receipt = await tx.wait();

  // Find the MessageSent event in the logs
  const messageSentLog = receipt?.logs.find(
    (log) => log.address.toLowerCase() === L2_MESSAGE_SERVICE.toLowerCase()
  );

  if (messageSentLog) {
    const event = iface.parseLog(messageSentLog as any);
    console.log("MessageSent event data:", event?.args);

    // Save event data to a file for use in L1 script
    const fs = require("fs");
    fs.writeFileSync("messageData.json", JSON.stringify(event?.args));
  } else {
    console.log("MessageSent event not found in the transaction logs");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
