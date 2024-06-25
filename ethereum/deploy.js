const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledStake = require("../build/contracts/Stake.json");
require("dotenv").config({ path: "../.env" });

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.API_INFURA
);

const web3 = new Web3(provider);

const addressMyToken = process.env.NEXT_PUBLIC_ADDRESS_MYTOKEN;

const deploy = async () => {
  try {
    const accounts = await web3.eth.getAccounts();

    const contract = new web3.eth.Contract(compiledStake.abi);

    const estimatedGas = await contract.deploy({
        data: compiledStake.bytecode,
        arguments: [addressMyToken],
      })
      .estimateGas();

    console.log("Estimated gas:", estimatedGas);
    console.log("Attempting to deploy from account", accounts[0]);

    // Realizar o deploy usando o gás estimado
    const result = await contract.deploy({
        data: compiledStake.bytecode,
        arguments: [addressMyToken],
      })
      .send({
        gas: estimatedGas,
        from: accounts[0]
      });

    console.log("Contract deployed to", result.options.address);
    provider.engine.stop();
  } catch (error) {
    console.error("Error deploying contract:", error);
    provider.engine.stop();
  }
};

deploy();
