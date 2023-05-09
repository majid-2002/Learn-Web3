import { deployments, ethers, getNamedAccounts } from "hardhat";
import { expect, assert } from "chai";
import { FundMe, MockV3Aggregator } from "../../typechain-types";

describe("fundMe", async () => {
  let fundMe: FundMe;
  let deployer: string;
  let mockV3Aggregator: MockV3Aggregator;
  const fundAmount = ethers.utils.parseEther("1");

  //? beforeEach is a hook that runs before each test
  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    fundMe = await ethers.getContract("FundMe", deployer);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator");
  });

  describe("constructor", async () => {
    it("sets the aggregator address correctly", async () => {
      const response = await fundMe.s_priceFeed();
      expect(response).to.equal(mockV3Aggregator.address);
    });
  });

  describe("fund", async () => {
    it("fails if not send enough ETH", async () => {
      await expect(fundMe.fund()).to.be.revertedWith(
        "You need to spend more ETH!"
      );
    });

    it("updates the amount funded data structure", async () => {
      await fundMe.fund({ value: fundAmount });
      const response = await fundMe.s_addressToAmountFunded(deployer);
      expect(response).to.equal(fundAmount);
    });

    it("should add funders to the funders array", async () => {
      await fundMe.fund({ value: fundAmount });
      const response = await fundMe.s_funders(0);
      expect(response).to.equal(deployer);
    });
  });

  describe("withdraw", async () => {
    beforeEach(async () => {
      await fundMe.fund({ value: fundAmount });
    });

    it("withdraw ETH from a single founder", async () => {
      const startingBalance = await ethers.provider.getBalance(fundMe.address);
      const startingDeployerBalance = await ethers.provider.getBalance(
        deployer
      );

      //? calls the withdraw function by the owner or deployer
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);

      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = effectiveGasPrice.mul(gasUsed);

      const endingBalance = await ethers.provider.getBalance(fundMe.address);
      const endingDeployerBalance = await ethers.provider.getBalance(deployer);

      assert.equal(endingBalance.toString(), "0");
      assert.equal(
        startingBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(gasCost).toString()
      );
    });

    it("allows multiple funders to withdraw", async () => {
      const accounts = await ethers.getSigners();
      for (let i = 0; i < 6; i++) {
        await fundMe.connect(accounts[i]).fund({ value: fundAmount });
      }

      const startingBalance = await ethers.provider.getBalance(fundMe.address);
      const startingDeployerBalance = await ethers.provider.getBalance(
        deployer
      );

      //? calls the withdraw function by the owner or deployer
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);

      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = effectiveGasPrice.mul(gasUsed);

      const endingBalance = await ethers.provider.getBalance(fundMe.address);
      const endingDeployerBalance = await ethers.provider.getBalance(deployer);

      assert.equal(endingBalance.toString(), "0");
      assert.equal(
        startingBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(gasCost).toString()
      );

      //? make sure the funders are removed from the funders array
      expect(await fundMe.s_funders.length).to.equal(0);

      for (let i = 0; i < 6; i++) {
        expect(
          await fundMe.s_addressToAmountFunded(accounts[i].address)
        ).to.equal(0);
      }
    });

    it("Only allows the owner to withdraw", async () => {
      const accounts = await ethers.getSigners();
      const attacker = accounts[1];
      await expect(fundMe.connect(attacker).withdraw()).to.be.revertedWith(
        "You are not the owner!"
      );
    });
  });
});
