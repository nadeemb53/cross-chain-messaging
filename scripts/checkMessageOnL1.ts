import { ethers } from "hardhat";
import { L1Receiver } from "../typechain-types";

async function main() {
  const L1_CONTRACT_ADDRESS = "0x5da14768c529EF145Ed597325aEfbbE4f37f114D";

  const l1Receiver = (await ethers.getContractAt(
    "L1Receiver",
    L1_CONTRACT_ADDRESS
  )) as L1Receiver;

  try {
    const receivedMessage = await l1Receiver.lastReceivedMessage();
    console.log("Received message on L1:", receivedMessage);
  } catch (error: any) {
    console.log("Error occurred:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
