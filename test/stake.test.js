const Stake = artifacts.require("Stake");
const MyToken = artifacts.require("MyToken");

contract("Stake", (accounts) => {
  let stake;
  let myToken;

  beforeEach(async () => {
    myToken = await MyToken.new();
    stake = await Stake.new(myToken.address);
  });

  it("should stake", async () => {
    await myToken.approve(stake.address, 1000);
    await stake.stake(1000);
    const balance = await stake.stakers(accounts[0]);
    assert.equal(balance, 1000);
  });
  
  it("should unstake", async () => {
    await myToken.approve(stake.address, 1000);
    await stake.stake(1000);
    await stake.unstaked(1000);
    const balance = await stake.stakers(accounts[0]);
    assert.equal(balance, 0);
  })
});
