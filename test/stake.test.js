const Stake = artifacts.require("Stake");
const MyToken = artifacts.require("MyToken");

var chai = require("chai");
const BN = web3.utils.BN;
const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const expect = chai.expect;

const { time, expectRevert } = require("@openzeppelin/test-helpers");

contract("Stake", (accounts) => {
  let stake;
  let myToken;

  let [owner, recipient, anotherAccount] = accounts;

  beforeEach(async () => {
    myToken = await MyToken.new();
    stake = await Stake.new(myToken.address);
  });

  it("should stake", async () => {
    let amount = new BN(1000);
    await expect(myToken.approve(stake.address, amount)).to.be.a.fulfilled;
    await expect(stake.stake(amount)).to.be.a.fulfilled;
    const balance = await stake.stakers(owner);
    expect(balance).to.be.a.bignumber.equal(amount);
  });

  it("should unstake", async () => {
    let amount = new BN(1000);
    let amountExpected = new BN(0);
    await expect(myToken.approve(stake.address, amount)).to.be.a.fulfilled;
    await expect(stake.stake(amount)).to.be.a.fulfilled;
    await expect(stake.unstaked(amount)).to.be.a.fulfilled;
    const balance = await stake.stakers(owner);
    expect(balance).to.be.a.bignumber.equal(amountExpected);
  });

  it("should accumulate rewards", async () => {
    const amount = new BN(1000);

    await expect(myToken.transfer(recipient, amount, { from: owner })).to.be.a
      .fulfilled;
    await expect(myToken.approve(stake.address, amount, { from: recipient })).to
      .be.a.fulfilled;

    await expect(stake.stake(amount, { from: recipient })).to.be.a.fulfilled;

    await time.increase(30);

    let expectRewards = await stake.policyRewardsperToken(recipient);
    expect(expectRewards).to.be.a.bignumber.equal(new BN(20));
  });

  it("should claim rewards", async () => {
    const amount = new BN(1000);

    await expect(myToken.transfer(recipient, amount, { from: owner })).to.be.a
      .fulfilled;
    await expect(myToken.approve(stake.address, amount, { from: recipient })).to
      .be.a.fulfilled;

    await expect(stake.stake(amount, { from: recipient })).to.be.a.fulfilled;

    await time.increase(30);

    const initialBalance = await myToken.balanceOf(recipient);
    await stake.claimRewards({ from: recipient });

    const finalBalance = await myToken.balanceOf(recipient);
    expect(finalBalance).to.be.a.bignumber.equal(
      initialBalance.add(new BN(20))
    );
  });

  it("should not allow claiming rewards if none available", async () => {
    await expect(stake.claimRewards()).to.be.rejectedWith(
      "No rewards available"
    );
  });

  it("should not allow staking 0 tokens", async () => {
    await expect(stake.stake(0)).to.be.rejectedWith(
      "Staking: Amount must be greater than zero"
    );
  });

  it("should not allow unstaking more than staked", async () => {
    const amount = new BN(1000);
    await myToken.approve(stake.address, amount);
    await stake.stake(amount);

    await expect(stake.unstaked(amount.add(new BN(1)))).to.be.rejectedWith(
      "Withdraw__TransferFailed"
    );
  });
});
