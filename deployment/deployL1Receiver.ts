import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  console.log("Deploying L1Receiver to Ethereum Sepolia...");
  const L1Receiver = await ethers.getContractFactory("L1Receiver");
  const l1Receiver = await L1Receiver.deploy(
    "0xB218f8A4Bc926cF1cA7b3423c154a0D627Bdb7E5"
  );
  await l1Receiver.waitForDeployment();
  const l1ReceiverAddress = await l1Receiver.getAddress();
  console.log("L1Receiver deployed to:", l1ReceiverAddress);

  // Save L1Receiver address to file
  fs.writeFileSync("l1ReceiverAddress.txt", l1ReceiverAddress);
  console.log("L1Receiver address saved to l1ReceiverAddress.txt");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
