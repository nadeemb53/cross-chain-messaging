import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID || "";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    lineaSepolia: {
      url: "https://rpc.sepolia.linea.build",
      accounts: [PRIVATE_KEY],
    },
    ethereumSepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;
