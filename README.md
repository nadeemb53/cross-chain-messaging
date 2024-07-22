# Linea to Ethereum Cross-Chain Messaging

This project demonstrates how to send messages from Linea (L2) to Ethereum (L1) using cross-chain messaging. It includes smart contracts for both L1 and L2, along with scripts to deploy contracts, send messages, and claim messages.

## Prerequisites

- Node.js and npm installed
- Hardhat
- Ethereum wallet with some ETH on both Linea Sepolia and Ethereum Sepolia networks

## Setup

1. Clone the repository:

   ```
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory and add your private key:
   ```
   PRIVATE_KEY=your_private_key_here
   INFURA_PROJECT_ID=your_infura_key_for_sepolia_here
   ```

## Deployment

1. Make the deployment script executable:

   ```
   chmod +x deployment/deploy.sh
   ```

2. Run the deployment script:

   ```
   ./deployment/deploy.sh
   ```

   This script will deploy both the L1 and L2 contracts on Ethereum Sepolia and Linea Sepolia respectively.

3. After deployment, update the contract addresses in the scripts located in the `scripts/` directory.

## Usage

1. Send a message from L2 to L1:

   ```
   npx hardhat run scripts/sendMessageFromL2.ts --network lineaSepolia
   ```

   This will initiate the cross-chain message from Linea to Ethereum.

2. Wait for message propagation:
   The message typically takes 8 to 32 hours to propagate from L2 to L1.

3. Claim the message on L1:

   ```
   npx hardhat run scripts/claimWithSDK.ts --network ethereumSepolia
   ```

   This script uses the Linea SDK to claim the message on Ethereum Sepolia.

4. Check the received message on L1:

   ```
   npx hardhat run scripts/checkMessageOnL1.ts --network ethereumSepolia
   ```

   This will display the last received message on the L1 contract.

## How It Works

### L2 to L1 Messaging on Linea

1. **Sending a Message (L2)**:

   - The L2 contract (`L2Sender`) calls the `sendMessage` function on Linea's `L2MessageService` contract.
   - This function packages the message with necessary metadata (sender, recipient, nonce, etc.).
   - An event `MessageSent` is emitted on L2 with all the message details.

2. **Message Propagation**:

   - Linea's infrastructure monitors these `MessageSent` events.
   - The message data is included in the next batch that is submitted to Ethereum L1.
   - This process involves creating and verifying zero-knowledge proofs, which is why it takes several hours.

3. **Claiming the Message (L1)**:
   - Once the batch containing the message is processed on L1, the message becomes available for claiming.
   - The `claimMessage` function on the L1 `MessageService` contract is called (either manually or via the Linea SDK).
   - This function verifies the message and executes the intended call on the target L1 contract.

### Smart Contracts

1. **L2Sender (on Linea Sepolia)**:

   - Initiates the cross-chain message.
   - Interacts with Linea's `L2MessageService` to send messages.

2. **L1Receiver (on Ethereum Sepolia)**:
   - Receives and stores messages from L2.
   - Can only be called by the L1 `MessageService` contract.

### Security Considerations

- The L1 contract verifies that messages are coming from the authentic Linea `MessageService` contract.
- Messages are associated with a unique nonce to prevent replay attacks.
- The claiming process on L1 can only be executed once per message.

## Troubleshooting

- Ensure you have sufficient ETH on both networks for gas fees.
- Double-check that contract addresses are correctly updated in all scripts.
- If a message fails to claim, verify that enough time has passed for it to be processed on L1.

## Further Resources

- [Linea Documentation](https://docs.linea.build/)
