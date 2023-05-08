import { task } from "hardhat/config";

task("block-number", "Prints the current block number").setAction(
  async (_, hre) => {
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log("Current block number: " + blockNumber);
  }
);

module.exports = {};
