#!/bin/bash

# Deploy L1Receiver on Ethereum Sepolia
npx hardhat run scripts/deployL1Receiver.ts --network ethereumSepolia

# Deploy L2Sender on Linea Sepolia
npx hardhat run scripts/deployL2Sender.ts --network lineaSepolia

# Update L1Receiver with L2Sender address on Ethereum Sepolia
npx hardhat run scripts/updateL1Receiver.ts --network ethereumSepolia

echo "Deployment completed!"