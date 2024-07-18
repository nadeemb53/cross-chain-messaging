import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID || "";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    lineaSepolia: {
      url: "https://linea-sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      accounts: [PRIVATE_KEY],
    },
    ethereumSepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;
