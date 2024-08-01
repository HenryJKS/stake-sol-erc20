const MyToken = artifacts.require("MyToken");

contract("MyToken", (accounts) => {
  let mytoken;

  beforeEach(async () => {
    mytoken = await MyToken.new();
  });

  it("owner should be owner the contract", async () => {
    const owner = await mytoken.owner();
    assert.equal(owner, accounts[0]);
  });

  it("balance of owner", async () => {
    const balanceOfOwner = await mytoken.balanceOf(accounts[0]);

    assert.equal(balanceOfOwner, 1000 * 10 ** 18);
  });

  it("mint 100 token", async () => {
    await mytoken.mint(accounts[1], 100);
    const balance = await mytoken.balanceOf(accounts[1]);
    assert.equal(balance, 100);
  });

  it("transfer 100 token", async () => {
    await mytoken.transfer(accounts[1], 100, { from: accounts[0] });
    const balance = await mytoken.balanceOf(accounts[1]);
    assert.equal(balance, 100);
  });

  it("approve 100 token to spend", async () => {
    await mytoken.approve(accounts[1], 100, { from: accounts[0] });
    const balanceAllow = await mytoken.allowance(accounts[0], accounts[1]);
    assert.equal(balanceAllow, 100);
  });
});
