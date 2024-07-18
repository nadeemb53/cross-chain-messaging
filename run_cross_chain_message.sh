#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_colored() {
    echo -e "${2}${1}${NC}"
}

# Execute the L2 script
print_colored "Sending message from L2 (Linea Sepolia)..." $YELLOW
npx hardhat run scripts/sendMessageFromL2.ts --network lineaSepolia

# Wait for the message to be relayed
print_colored "\nWaiting for the message to be relayed to L1..." $YELLOW
print_colored "This may take several minutes. Please wait...\n" $YELLOW

# Attempt to claim the message once
print_colored "Attempting to claim the message on L1..." $YELLOW
claim_result=$(npx hardhat run scripts/claimMessageOnL1.ts --network ethereumSepolia)
print_colored "$claim_result" $GREEN

# Check if the claim was successful
if [[ $claim_result == *"Message claimed successfully"* ]]; then
    print_colored "Message claimed successfully. Checking the received message..." $GREEN
    npx hardhat run scripts/checkMessageOnL1.ts --network ethereumSepolia
else
    print_colored "Failed to claim the message. Please check the logs and try again later." $RED
fi

# Loop to check L1 up to 5 times if the message wasn't received
for i in {1..5}
do
    print_colored "Checking L1 (attempt $i of 5)..." $YELLOW
    check_result=$(npx hardhat run scripts/checkMessageOnL1.ts --network ethereumSepolia)
    print_colored "$check_result" $YELLOW
    
    if [[ $check_result != *"No message received yet"* ]]; then
        print_colored "Message received successfully!" $GREEN
        break
    fi

    # Ask user if they want to continue checking
    if [ $i -lt 5 ]; then
        read -p "Do you want to check again? (y/n): " answer
        if [[ $answer != [Yy]* ]]; then
            break
        fi
    fi
done

print_colored "\nScript execution completed." $GREEN