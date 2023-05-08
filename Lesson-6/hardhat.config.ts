import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import "./tasks/block-num";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@typechain/hardhat"

const RPC_URL = process.env.RPC_URL || "https://eth-sepolia-rpc.herokuapp.com/";
const PRIVATE_KEY = process.env.PRIVATE_KEY! || "0xkey";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY! || "key";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY! || "key";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },

    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: false,
    outputFile: "gas-report.pdf",
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "MATIC",
  },
};

export default config;
