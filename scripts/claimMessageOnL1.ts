// L1 Claimer Script (claimMessage.ts)
import { ethers } from "hardhat";
import { L1Receiver } from "../typechain-types";
import * as fs from "fs";

async function main() {
  const L1_CONTRACT_ADDRESS = "0xB68c6d93bA4a38d0E78C6486c13F637AA248ccbE";
  const MESSAGE_SERVICE_ADDRESS = "0xB218f8A4Bc926cF1cA7b3423c154a0D627Bdb7E5";

  const messageData = JSON.parse(fs.readFileSync("messageData.json", "utf-8"));
  console.log("Message data:", messageData);

  const l1Receiver = (await ethers.getContractAt(
    "L1Receiver",
    L1_CONTRACT_ADDRESS
  )) as L1Receiver;

  const messageServiceABI = [
    "function claimMessage(address from, address to, uint256 fee, uint256 value, address feeRecipient, bytes calldata, uint256 nonce) external",
  ];
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
      messageData.fee,
      messageData.value,
      (
        await ethers.provider.getSigner()
      ).address, // feeRecipient
      messageData.calldata,
      messageData.nonce
    );

    console.log("Transaction sent. Hash:", tx.hash);
    await tx.wait();
    console.log("Message claimed successfully");

    const receivedMessage = await l1Receiver.lastReceivedMessage();
    console.log("Received message on L1:", receivedMessage);
  } catch (error: any) {
    console.error("Error occurred:", error.message);
    if (error.code === "CALL_EXCEPTION") {
      console.error(
        "Call exception. Ensure the message data is correct and the message has not been already claimed."
      );
    } else {
      console.error("Unexpected error:", error);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
