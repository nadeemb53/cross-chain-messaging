import { ethers } from "hardhat";
import { L2Sender } from "../typechain-types";

async function main() {
  const L2_CONTRACT_ADDRESS = "0x1caC9e893BB61FbCf633Ce37c3f824Cf65f08062";

  // Connect to L2 contract
  const l2Sender = (await ethers.getContractAt(
    "L2Sender",
    L2_CONTRACT_ADDRESS
  )) as L2Sender;

  // Send a message from L2 to L1
  const tx = await l2Sender.greet("Hello from Linea!", {
    value: ethers.parseEther("0.0001"),
  });
  await tx.wait();
  console.log("Message sent from L2 to L1");
  console.log("Transaction hash:", tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
