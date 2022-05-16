import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Penis, Penis__factory } from "../typechain";
import { writeFile } from "fs";


describe("Penis contract", function() {
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];
  let PenisC: Penis__factory;
  let penis: Penis;
  let mintValue = BigInt(1536000000000000000);
  async function mintAndPrintSVG(penis: Penis, ballId: number, bodyId: number, eyeId: number, accessoryId: number, wingId: number, paletteId: number) {
    const nft = await penis.mint(ballId, bodyId, eyeId, accessoryId, wingId, paletteId, {
      value: mintValue,
    });
    const receipt = await nft.wait();
    const penisId = ethers.BigNumber.from(receipt.logs[0].topics[3]).toNumber()
    const tokenURI = await penis.callStatic.tokenURI(penisId)
    const data = tokenURI.substring(tokenURI.indexOf('<'), tokenURI.length - 2)
    writeFile("output" + penisId.toString() + ".svg", data, () => { });
  }
  beforeEach(async function() {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    PenisC = await ethers.getContractFactory("Penis");
    penis = await PenisC.deploy();

    await penis.deployed();
  });
  it("Owner should be its creator", async function() {
    expect(await penis.owner()).to.equal(await owner.getAddress());
  });

  it("Minting should fail without enough gas", async function() {
    await expect(penis.mint(0, 0, 0, 0, 0, 0)).to.be.revertedWith(
      "Pay at least " + mintValue.toString() + " MATIC to mint"
    );
  });

  it("Minting unique NFTs", async function() {
    expect(await penis.mint(0, 0, 0, 0, 0, 0, { value: mintValue }));
    await expect(
      penis.mint(0, 0, 0, 0, 0, 0, { value: mintValue })
    ).to.be.revertedWith("This token was already minted");
  });

  it("Token URI returns metadata and SVG", async function() {
  });

  it("Mint to another account", async function() {
    const returnValue = await penis._mintPrice();
    const mintPrice = returnValue.value
    console.log('mintPrice:', mintPrice)
    console.log(await penis.mintTo(addr1.address, 0, 0, 0, 0, 0, 0, { value: mintPrice }));
  });
  it("Print many SVGs", async function() {
    // ball, body, eye, accessory, wing, palette
    await mintAndPrintSVG(penis, 0, 0, 0, 0, 0, 0)
    await mintAndPrintSVG(penis, 1, 1, 1, 1, 1, 1)
    await mintAndPrintSVG(penis, 2, 2, 2, 2, 2, 2)
    await mintAndPrintSVG(penis, 3, 3, 3, 3, 3, 3)
    await mintAndPrintSVG(penis, 4, 4, 4, 4, 4, 4)
    await mintAndPrintSVG(penis, 5, 5, 5, 5, 5, 5)
    await mintAndPrintSVG(penis, 6, 6, 6, 6, 6, 6)
    await mintAndPrintSVG(penis, 7, 7, 7, 7, 7, 7)
    await mintAndPrintSVG(penis, 8, 8, 8, 8, 8, 8)
    await mintAndPrintSVG(penis, 9, 9, 9, 9, 9, 9)
    await mintAndPrintSVG(penis, 0, 10, 0, 10, 0, 19)
  });
});
