import * as dotenv from "dotenv";
import { LineaSDK } from "@consensys/linea-sdk";
import { OnChainMessageStatus } from "@consensys/linea-sdk/dist/lib/utils/enum";

dotenv.config();
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID || "";

async function main() {
  // Initialize the Linea SDK
  const sdk = new LineaSDK({
    l1RpcUrl: `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`,
    l2RpcUrl: "https://rpc.sepolia.linea.build",
    l1SignerPrivateKey: process.env.PRIVATE_KEY || "",
    l2SignerPrivateKey: process.env.PRIVATE_KEY || "",
    network: "linea-sepolia",
    mode: "read-write",
  });

  const l2Contract = sdk.getL2Contract();
  const l1ClaimingService = sdk.getL1ClaimingService();

  // Replace with your actual message hash
  const messageHash =
    "0xdb90a74aad44bdec0d84f3a22d44c59db268e1ff07770d61f0f4c034d88b46a4";

  try {
    // Get the message details
    const message = await l2Contract.getMessageByMessageHash(messageHash);
    console.log("Message details:", message);
    if (!message) return;
    // Check the message status
    const messageStatus = await l1ClaimingService.getMessageStatus(messageHash);
    console.log("Message status:", messageStatus);

    if (messageStatus === OnChainMessageStatus.CLAIMABLE) {
      console.log("Message is claimable. Proceeding with claim...");

      // Estimate gas (optional)
      const estimatedGas = await l1ClaimingService.estimateClaimMessageGas(
        message
      );
      console.log("Estimated gas for claiming:", estimatedGas.toString());

      // Claim the message
      const claimTx = await l1ClaimingService.claimMessage(message);
      console.log("Claim transaction sent. Transaction hash:", claimTx.hash);

      // Wait for the transaction to be mined
      const receipt = await claimTx.wait();
      console.log("Claim transaction mined. Transaction receipt:", receipt);

      console.log("Message claimed successfully!");
    } else {
      console.log(
        "Message is not claimable at this time. Current status:",
        messageStatus
      );
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
