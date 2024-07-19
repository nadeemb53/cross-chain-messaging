import { ethers } from "hardhat";
import { L1Receiver } from "../typechain-types";

async function main() {
  const L1_CONTRACT_ADDRESS = "0xB68c6d93bA4a38d0E78C6486c13F637AA248ccbE";

  // Connect to L1 contract
  const l1Receiver = (await ethers.getContractAt(
    "L1Receiver",
    L1_CONTRACT_ADDRESS
  )) as L1Receiver;

  try {
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
