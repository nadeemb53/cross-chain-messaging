#!/bin/bash

# Deploy L1Receiver on Ethereum Sepolia
npx hardhat run deployment/deployL1Receiver.ts --network ethereumSepolia

# Deploy L2Sender on Linea Sepolia
npx hardhat run deployment/deployL2Sender.ts --network lineaSepolia

echo "Deployment completed!"