import { ethers } from "hardhat";
import { L1Receiver } from "../typechain-types";
import * as fs from "fs";

// ABI for the claimMessage function
const messageServiceABI = [
  {
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "fee", type: "uint256" },
      { name: "value", type: "uint256" },
      { name: "feeRecipient", type: "address" },
      { name: "calldata", type: "bytes" },
      { name: "nonce", type: "uint256" },
    ],
    name: "claimMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function main() {
  const L1_CONTRACT_ADDRESS = "0x015cF32B8a65AD5F304bF98d6B77834718D5A903";
  const MESSAGE_SERVICE_ADDRESS = "0xB218f8A4Bc926cF1cA7b3423c154a0D627Bdb7E5";

  // Read message data from file
  const messageData = JSON.parse(fs.readFileSync("messageData.json", "utf-8"));

  // Connect to L1 contract
  const l1Receiver = (await ethers.getContractAt(
    "L1Receiver",
    L1_CONTRACT_ADDRESS
  )) as L1Receiver;

  // Connect to Message Service contract
  const messageService = new ethers.Contract(
    MESSAGE_SERVICE_ADDRESS,
    messageServiceABI,
    await ethers.provider.getSigner()
  );

  console.log("Attempting to claim message...");

  try {
    const tx = await messageService.claimMessage(
      messageData.from,
      messageData.to,
      ethers.getBigInt(messageData.fee),
      ethers.getBigInt(messageData.value),
      (
        await ethers.provider.getSigner()
      ).address, // feeRecipient
      messageData.calldata,
      ethers.getBigInt(messageData.nonce)
    );

    await tx.wait();
    console.log("Message claimed successfully");

    // Check the received message on L1
    const receivedMessage = await l1Receiver.lastReceivedMessage();
    console.log("Received message on L1:", receivedMessage);
  } catch (error: any) {
    console.log("Error occurred:", error.message);
    if (error.code === "BAD_DATA" && error.value === "0x") {
      console.log(
        "No message received yet. The L1 contract's lastReceivedMessage is empty."
      );
    } else {
      // If it's a different error, we'll log it
      console.error("Unexpected error:", error);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
