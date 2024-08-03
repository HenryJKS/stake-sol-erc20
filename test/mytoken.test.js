const MyToken = artifacts.require("MyToken");

var chai = require("chai");
const BN = web3.utils.BN;
const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const expect = chai.expect;

contract("MyToken", (accounts) => {
  let mytoken;

  [owner, recipient, anotherAccount] = accounts;

  beforeEach(async () => {
    mytoken = await MyToken.new();
  });

  it("owner should be owner the contract", async () => {
    const owner = await mytoken.owner();
    assert.equal(owner, accounts[0]);
  });

  it("Balance of owner in big number", async () => {
    const balance = await mytoken.balanceOf(owner);
    const totalSupply = await mytoken.totalSupply();
    expect(balance).to.be.a.bignumber.equal(totalSupply);
  });

  it("mint 100 token", async () => {
    let tokenMint = new BN(100);
    await mytoken.mint(accounts[1], tokenMint);
    const balanceOfRecipient = await mytoken.balanceOf(recipient);
    expect(balanceOfRecipient).to.be.a.bignumber.equal(tokenMint);
  });

  it("transfer 100 token", async () => {
    let amount = new BN(100);
    const initialSupply = await mytoken.totalSupply();

    await expect(mytoken.transfer(recipient, amount, {from: owner})).to.be.a.fulfilled;

    const balanceOfRecipient = await mytoken.balanceOf(recipient);
    expect(balanceOfRecipient).to.be.a.bignumber.equal(amount);

    const balanceOfOwner = await mytoken.balanceOf(owner);
    expect(balanceOfOwner).to.be.a.bignumber.equal(initialSupply.sub(amount));
  });

  it("approve 100 token to spend", async () => {
    let amount = new BN(100)
    await mytoken.approve(recipient, amount, { from: owner});
    const balanceAllow = await mytoken.allowance(owner, recipient);
    expect(balanceAllow).to.be.a.bignumber.equal(amount);
  });
});
