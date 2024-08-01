const MyToken = artifacts.require("MyToken");
const Stake = artifacts.require("Stake");

module.exports = async function (deployer) {
    await deployer.deploy(MyToken);
    const myTokenInstance = await MyToken.deployed();

    await deployer.deploy(Stake, myTokenInstance.address);
};
