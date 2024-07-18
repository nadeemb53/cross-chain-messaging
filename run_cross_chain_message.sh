#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Loop to check L1 every 15 seconds for 20 minutes
for i in {1..20}
do
    sleep 15
    print_colored "Checking L1 (attempt $i of 20)..." $YELLOW
    npx hardhat run scripts/checkMessageOnL1.ts --network ethereumSepolia

    # Ask user if they want to continue checking
    if [ $i -lt 20 ]; then
        read -p "Do you want to check again? (y/n): " answer
        if [[ $answer != [Yy]* ]]; then
            break
        fi
    fi
done

print_colored "\nScript execution completed." $GREEN