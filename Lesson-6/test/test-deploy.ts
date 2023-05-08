import { ethers } from "hardhat";
import { expect } from "chai";
import { SimpleStorage, SimpleStorage__factory } from "../typechain-types";

describe("SimpleStorage", async () => {
  let SimpleStorageFactory: SimpleStorage__factory,
    simpleStorage: SimpleStorage;

  beforeEach(async function () {
    const SimpleStorageFactory = await ethers.getContractFactory(
      "SimpleStorage"
    );
    simpleStorage = await SimpleStorageFactory.deploy();
  });

  it("Should start with a favorite number of 0", async () => {
    expect(await simpleStorage.retrieve()).to.equal(0);
  });

  it("Should update the favorite number", async () => {
    await simpleStorage.store(10);
    expect(await simpleStorage.retrieve()).to.equal(10);
  });

  it("Should add a new person with their favorite number", async () => {
    const name = "Alice";
    const favoriteNumber = 42;

    await simpleStorage.addPerson(name, favoriteNumber);

    const storedFavoriteNumber = await simpleStorage.nameToFavoriteNumber(name);
    expect(storedFavoriteNumber).to.equal(favoriteNumber);
  });
});
