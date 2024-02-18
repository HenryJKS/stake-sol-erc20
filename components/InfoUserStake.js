import React, { Component } from "react";
import { web3 } from "./ButtonWeb3";
import Stake from "../ethereum/stake";
import Mytoken from "../ethereum/mytoken";
import { Container } from "semantic-ui-react";
import styles from "../components/InfoUserStake.module.css";
import { Divider } from "semantic-ui-react";

class InfoUserStake extends Component {
  state = {
    balanceHJK: "",
    account: "",
    totalStake: "",
    balanceUserStakedDecimals: "",
  };

  async componentDidMount() {
    this.loadBlockchainData();
    window.ethereum.on("accountsChanged", this.loadBlockchainData);
  }

  componentWillUnmount() {
    window.ethereum.removeListener("accountsChanged", this.loadBlockchainData);
  }

  loadBlockchainData = async () => {
    const stake = Stake();
    const mytoken = Mytoken();
    const accounts = await web3.eth.getAccounts();

    // verify if the user is connected to the wallet
    if (!accounts[0]) {
      console.log("Nenhuma conta logada no MetaMask");
      this.setState({ account: null });
      return;
    }

    //mytoken
    const decimals = await mytoken.methods.decimals().call();
    const balanceHJK = await mytoken.methods.balanceOf(accounts[0]).call();
    const balanceHJKDecimals = balanceHJK / 10 ** decimals;

    //stake
    const totalSupply = await stake.methods.totalSupplyStaked().call();
    const totalSupplyDecimals = totalSupply / 10 ** decimals;
    const balanceUserStaked = await stake.methods.stakers(accounts[0]).call();
    const balanceUserStakedDecimals = balanceUserStaked / 10 ** decimals;

    this.setState({
      balanceHJKDecimals,
      totalSupplyDecimals,
      balanceUserStakedDecimals,
      account: accounts[0],
    });
  };

  render() {
    if (!this.state.account) {
      return (
        <Container>
          <h1>User Status - Connect Your Wallet</h1>
          <hr></hr>
          <h5>Your Amount HJK:</h5>
          <h5>Balance Staked:</h5>
          <Divider horizontal>Pool Stake Info</Divider>
          <h5>Total Staked Pool: {this.state.totalSupplyDecimals}</h5>
        </Container>
      );
    }

    return (
      <Container className={styles.containerInfoUser}>
        <h1>User Status</h1>
        <hr />
        <h5>Your Amount HJK: {this.state.balanceHJKDecimals} HJK</h5>
        <h5>Balance Staked: {this.state.balanceUserStakedDecimals} HJK</h5>
        <Divider horizontal>Pool Stake Info</Divider>
        <h5>Total Staked Pool: {this.state.totalSupplyDecimals} HJK</h5>
      </Container>
    );
  }
}

export default InfoUserStake;
