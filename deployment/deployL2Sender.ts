import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  // Read L1Receiver address from file
  if (!fs.existsSync("l1ReceiverAddress.txt")) {
    throw new Error(
      "l1ReceiverAddress.txt not found. Please deploy L1Receiver first."
    );
  }
  const l1ReceiverAddress = fs
    .readFileSync("l1ReceiverAddress.txt", "utf-8")
    .trim();

  console.log("Deploying L2Sender to Linea Sepolia...");
  const L2Sender = await ethers.getContractFactory("L2Sender");
  const l2Sender = await L2Sender.deploy(l1ReceiverAddress);
  await l2Sender.waitForDeployment();
  const l2SenderAddress = await l2Sender.getAddress();
  console.log("L2Sender deployed to:", l2SenderAddress);

  // Save L2Sender address to file
  fs.writeFileSync("l2SenderAddress.txt", l2SenderAddress);
  console.log("L2Sender address saved to l2SenderAddress.txt");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
