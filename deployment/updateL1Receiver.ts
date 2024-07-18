import { ethers } from "hardhat";
import * as fs from "fs";
import { L1Receiver } from "../typechain-types"; // Import the generated type

async function main() {
  if (
    !fs.existsSync("l1ReceiverAddress.txt") ||
    !fs.existsSync("l2SenderAddress.txt")
  ) {
    throw new Error(
      "Address files not found. Please deploy both contracts first."
    );
  }

  const l1ReceiverAddress = fs
    .readFileSync("l1ReceiverAddress.txt", "utf-8")
    .trim();
  const l2SenderAddress = fs
    .readFileSync("l2SenderAddress.txt", "utf-8")
    .trim();

  console.log("Updating L2 contract address in L1 contract...");
  const L1ReceiverFactory = await ethers.getContractFactory("L1Receiver");
  const l1ReceiverContract = (await L1ReceiverFactory.attach(
    l1ReceiverAddress
  )) as L1Receiver;

  const tx = await l1ReceiverContract.setL2ContractAddress(l2SenderAddress);
  await tx.wait();
  console.log("L2 contract address updated in L1 contract");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
