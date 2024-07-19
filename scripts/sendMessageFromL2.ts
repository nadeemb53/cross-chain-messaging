import { ethers } from "hardhat";
import { L2Sender } from "../typechain-types";
import * as fs from "fs";

// ABI for the MessageSent event
const messageSentEventABI = [
  "event MessageSent(address indexed from, address indexed to, uint256 fee, uint256 value, uint256 nonce, bytes calldata, bytes32 indexed _messageHash)",
];

async function main() {
  const L2_CONTRACT_ADDRESS = "0x7e945de3f728BB4EaD1688e07c7944c3A33958F1";
  const L2_MESSAGE_SERVICE = "0x971e727e956690b9957be6d51Ec16E73AcAC83A7";

  // Connect to L2 contract
  const l2Sender = (await ethers.getContractAt(
    "L2Sender",
    L2_CONTRACT_ADDRESS
  )) as L2Sender;

  // Create an interface for the MessageSent event
  const iface = new ethers.Interface(messageSentEventABI);

  // Send a message from L2 to L1
  const tx = await l2Sender.greet("Hello from Linea!");
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

    // Convert BigInt values to strings
    const eventData = {
      from: event?.args[0],
      to: event?.args[1],
      fee: event?.args[2].toString(),
      value: event?.args[3].toString(),
      nonce: event?.args[4].toString(),
      calldata: event?.args[5],
      _messageHash: event?.args[6],
    };

    // Save event data to a file for use in L1 script
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
