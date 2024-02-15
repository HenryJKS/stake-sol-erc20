const assert = require('chai').assert;
const ganache = require('ganache');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledStake = require("../ethereum/build/Stake.json"); 
require("dotenv").config({
    path: "../.env",
});

const compiledMyToken = require("../ethereum/build/myToken.json");


let accounts;
let stake;
let mytoken;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    stake = await new web3.eth.Contract(compiledStake.abi)
        .deploy({data: compiledStake.evm.bytecode.object, arguments: [process.env.ADDRESS_MYTOKEN]})
        .send({from: accounts[0], gas: '1000000'});

    mytoken = await new web3.eth.Contract(compiledMyToken.abi)
        .deploy({data: compiledMyToken.evm.bytecode.object})
        .send({from: accounts[0], gas: '2000000'});

})

describe('Stake contract', () => {
    it('Deploy a contract', () => {
        assert.ok(stake.options.address);
    });

    it("balance", async () => {
        await mytoken.methods.mint(100).send({from: accounts[0]});
        await mytoken.methods.balanceOf(accounts[0]).call().then((balance) => {
            assert.equal(balance, 100);
        });
    });
    
    it("check balanceOf", async () => {
        await mytoken.methods.mint(100).send({from: accounts[0]})
        await mytoken.methods.balanceOf(accounts[0]).call().then((balance) => {
            assert.equal(balance, 100);
        })
    });

    it("approve and stake", async () => {
        await mytoken.methods.mint(100).send({from: accounts[0]});
        await mytoken.methods.approve(stake.options.address, 100).send({from: accounts[0]});
        await stake.methods.stake(100).send({from: accounts[0]});
    })
    

})
