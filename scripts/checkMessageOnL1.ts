import { ethers } from "hardhat";
import { L1Receiver } from "../typechain-types";

async function main() {
  const L1_CONTRACT_ADDRESS = "0xC0532195994aA0B89Ed26a64462048f4c2750Eb5";

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
    if (error.code === "BAD_DATA" && error.value === "0x") {
      console.log(
        "No message received yet. The L1 contract's lastReceivedMessage is empty."
      );
    } else {
      // If it's a different error, we'll rethrow it
      throw error;
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
