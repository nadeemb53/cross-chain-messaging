import { ethers } from "hardhat";
import { L2Sender } from "../typechain-types";

async function main() {
  const L2_CONTRACT_ADDRESS = "0xBEe9D9F0C7532ac74f066f0d0025C80cc9CC22F3";

  // Connect to L2 contract
  const l2Sender = (await ethers.getContractAt(
    "L2Sender",
    L2_CONTRACT_ADDRESS
  )) as L2Sender;

  // Send a message from L2 to L1
  const tx = await l2Sender.greet("Hello from Linea!", {
    value: ethers.parseEther("0"),
  });
  await tx.wait();
  console.log("Message sent from L2 to L1");
  console.log("Transaction hash:", tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
