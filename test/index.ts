import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Penis, Penis__factory } from "../typechain";

describe("Penis contract", function () {
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];
  let PenisC: Penis__factory;
  let penis: Penis;
  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    PenisC = await ethers.getContractFactory("Penis");
    penis = await PenisC.deploy();

    await penis.deployed();
  });

  it("Owner should be its creator", async function () {
    expect(await penis.owner()).to.equal(await owner.getAddress());
  });

  it("Minting should fail without enough gas", async function () {
    await expect(penis.mint(0, 0, 0, 0, 0, 0)).to.be.revertedWith(
      "Pay at least 0.05 ETH to mint"
    );
  });

  it("Minting unique NFTs", async function () {
    expect(await penis.mint(0, 0, 0, 0, 0, 0, { value: "50000000000000000" }));
    await expect(
      penis.mint(0, 0, 0, 0, 0, 0, { value: "50000000000000000" })
    ).to.be.revertedWith("This token was already minted");
  });

  it("Token URI returns metadata and SVG", async function () {
    await penis.mint(0, 0, 0, 0, 0, 0, { value: "50000000000000000" });
    await penis.mint(0, 0, 0, 0, 0, 1, { value: "50000000000000000" });
    await penis.mint(0, 0, 0, 0, 0, 2, { value: "50000000000000000" });
    await penis.mint(0, 0, 0, 0, 1, 0, { value: "50000000000000000" });
    await penis.mint(0, 0, 0, 0, 1, 1, { value: "50000000000000000" });

    const nft = await penis.mint(0, 0, 0, 0, 1, 2, {
      value: "50000000000000000",
    });
    const receipt = await nft.wait();

    //console.log(
    //  await penis.callStatic.tokenURI(
    //    ethers.BigNumber.from(receipt.logs[0].topics[3]).toNumber()
    //  )
    //);
  });

  it("Mint 9 NFTs paying and 1 not paying", async function () {
    await penis.mint(0, 0, 0, 0, 0, 1, { value: "50000000000000000" });
    await penis.mint(0, 0, 0, 0, 0, 2, { value: "50000000000000000" });
    await penis.mint(0, 0, 0, 0, 0, 3, { value: "50000000000000000" });
    await penis.mint(0, 0, 0, 0, 0, 4, { value: "50000000000000000" });
    await penis.mint(0, 0, 0, 0, 0, 5, { value: "50000000000000000" });
    await penis.mint(0, 0, 0, 0, 0, 6, { value: "50000000000000000" });
    await penis.mint(0, 0, 0, 0, 0, 7, { value: "50000000000000000" });
    await penis.mint(0, 0, 0, 0, 0, 8, { value: "50000000000000000" });
    await penis.mint(0, 0, 0, 0, 0, 9, { value: "50000000000000000" });

    const nft = await penis.mintOwnerToken(0, 0, 0, 0, 0, 9, { value: "50000000000000000" });
    const receipt = await nft.wait();

  });
});
