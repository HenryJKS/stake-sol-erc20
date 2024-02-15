const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledStake = require("./build/Stake.json");
require("dotenv").config({
    path: "../.env.local",
});

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.API_INFURA
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth
    .getAccounts()
    .catch((err) => console.log(err));

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(compiledStake.abi)
    .deploy({
      data: compiledStake.evm.bytecode.object,
      // Endereço do contrato pai
      arguments: [process.env.NEXT_PUBLIC_ADDRESS_MYTOKEN],
    })
    .send({ gas: "1000000", from: accounts[0] })
    .catch((err) => console.error(err));

  console.log("Contract deployed to", result.options.address);

  provider.engine.stop();
};

deploy();
