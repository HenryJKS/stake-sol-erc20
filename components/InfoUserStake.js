import React, { Component } from "react";
import { web3 } from "./ButtonWeb3";
import Stake from "../ethereum/stake";
import Mytoken from "../ethereum/mytoken";
import { Container } from "semantic-ui-react";
import styles from "../components/InfoUserStake.module.css";
import { Divider, Button, Step, StepContent, StepDescription, StepGroup, StepTitle, Icon, Statistic, StatisticLabel, StatisticValue, Popup } from "semantic-ui-react";

class InfoUserStake extends Component {
  state = {
    balanceHJK: "",
    account: "",
    totalStake: "",
    balanceUserStakedDecimals: "",
    rewards: "",
    loadingClaimRewards: false,
    interval: ""
  };

  async componentDidMount() {
    this.loadBlockchainData();
    this.interval = setInterval(this.loadBlockchainData, 30000);
    window.ethereum.on("accountsChanged", this.loadBlockchainData);
  }

  componentWillUnmount() {
    window.ethereum.removeListener("accountsChanged", this.loadBlockchainData);
    clearInterval(this.interval);
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
    const rewards = await stake.methods.policyRewardsperToken(accounts[0]).call();
    const rewardsDecimals = rewards / 10 ** decimals;
    const rewardsAcumulatedPerUser = await stake.methods.rewardAcumulatedPerUser(accounts[0]).call();
    const rewardsAcumulatedPerUserDecimals = rewardsAcumulatedPerUser / 10 ** decimals;


    this.setState({
      balanceHJKDecimals,
      totalSupplyDecimals,
      balanceUserStakedDecimals,
      rewardsDecimals,
      rewardsAcumulatedPerUserDecimals,
      account: accounts[0],
    });
  };

  clainRewards = async () => {
    const stake = Stake();
    const accounts = await web3.eth.getAccounts();
    this.setState({ loadingClaimRewards: true });
    try {
      await stake.methods.claimRewards().send({
        from: accounts[0],
      })
      this.setState({ loadingClaimRewards: false });
    } catch (error) {
      this.setState({ loadingClaimRewards: false });
    }

    this.loadBlockchainData();
  }

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
        <StepGroup>
          <Step>
            <Icon name="user" />
            <StepContent>
              <StepTitle>Your Amount HJK</StepTitle>
              <StepDescription>{this.state.balanceHJKDecimals} HJK</StepDescription>
            </StepContent>
          </Step>
          <Step>
            <Icon name="ethereum" />
            <StepContent>
              <StepTitle>Balance Staked</StepTitle>
              <StepDescription>{this.state.balanceUserStakedDecimals} HJK</StepDescription>
            </StepContent>
          </Step>
        </StepGroup>
        <Divider horizontal>Pool Stake Info</Divider>
        <StepGroup className={styles.stepCenter}>
          <Step href="/approve">
            <Icon name="ethereum" />
            <StepContent>
              <StepTitle>Approve your tokens</StepTitle>
            </StepContent>
          </Step>
          <Step>
            <Icon name="ethereum" />
            <StepContent>
              <StepTitle>Stake your tokens</StepTitle>
            </StepContent>
          </Step>
          <Step>
            <Icon name="ethereum" />
            <StepContent>
              <StepTitle>Take your rewards :D</StepTitle>
            </StepContent>
          </Step>
        </StepGroup>
        <div>
          <Statistic horizontal size="tiny" style={{ 'margin': '1%' }}>
            <StatisticValue>{this.state.totalSupplyDecimals} HJK</StatisticValue>
            <StatisticLabel>Total Staked Pool</StatisticLabel>
          </Statistic>
        </div>
        <div>
          <Statistic horizontal size="tiny" style={{ 'margin': '1%' }}>
            <StatisticValue>{this.state.rewardsDecimals} HJK</StatisticValue>
            <StatisticLabel>Your Rewards</StatisticLabel>
          </Statistic>
        </div>
        <div>
          <Popup content="This value is accumulated after you unstake and have not yet claimed your reward." trigger={
            <Statistic horizontal size="tiny" style={{ 'margin': '1%' }}>
              <StatisticValue>{this.state.rewardsAcumulatedPerUserDecimals} HJK</StatisticValue>
              <StatisticLabel>Your Rewards Acumulated</StatisticLabel>
            </Statistic>
          } />
        </div>
        <Button color="green" onClick={this.clainRewards} loading={this.state.loadingClaimRewards}>Claim Rewards</Button>
      </Container>
    );
  }
}

export default InfoUserStake;
