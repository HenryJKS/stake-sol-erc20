import React, { Component } from "react";
import { web3 } from "./ButtonWeb3";
import Stake from "../ethereum/stake";
import Mytoken from "../ethereum/mytoken";
import { Container } from "semantic-ui-react";
import styles from "../components/InfoUserStake.module.css";
import {
  Divider,
  Button,
  Step,
  StepContent,
  StepDescription,
  StepGroup,
  StepTitle,
  Icon,
  Statistic,
  StatisticLabel,
  StatisticValue,
  Popup,
} from "semantic-ui-react";

class InfoUserStake extends Component {
  state = {
    balanceHJK: "",
    account: "",
    totalStake: "",
    balanceUserStakedDecimals: "",
    rewards: "",
    loadingClaimRewards: false,
    interval: "",
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

    if (!accounts[0]) {
      console.log("Nenhuma conta logada no MetaMask");
      this.setState({ account: null });
      return;
    }

    const decimals = await mytoken.methods.decimals().call();
    const balanceHJK = await mytoken.methods.balanceOf(accounts[0]).call();
    const balanceHJKDecimals = balanceHJK / 10 ** decimals;

    const totalSupply = await stake.methods.totalSupplyStaked().call();
    const totalSupplyDecimals = totalSupply / 10 ** decimals;

    const balanceUserStaked = await stake.methods.stakers(accounts[0]).call();
    const balanceUserStakedDecimals = balanceUserStaked / 10 ** decimals;


    const policyRewardsperToken = await stake.methods.policyRewardsperToken(accounts[0]).call();
    const policyRewardsperTokenDecimals = policyRewardsperToken / 10 ** decimals;

    const rewardsAcumulatedPerUser = await stake.methods.rewardAcumulatedPerUser(accounts[0]).call();
    const rewardsAcumulatedPerUserDecimals = rewardsAcumulatedPerUser / 10 ** decimals;

    const rewards = policyRewardsperTokenDecimals + rewardsAcumulatedPerUserDecimals;


    this.setState({
      balanceHJKDecimals,
      totalSupplyDecimals,
      balanceUserStakedDecimals,
      rewards,
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
      });
      this.setState({ loadingClaimRewards: false });
    } catch (error) {
      this.setState({ loadingClaimRewards: false });
    }

    this.loadBlockchainData();
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
          <h5>
            Total Staked Pool:{" "}
            {Math.floor(this.state.totalSupplyDecimals * 100) / 100} HJK
          </h5>
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
              <StepDescription>
                {Math.floor(this.state.balanceHJKDecimals * 100) / 100} HJK
              </StepDescription>
            </StepContent>
          </Step>
          <Step>
            <Icon name="ethereum" />
            <StepContent>
              <StepTitle>Balance Staked</StepTitle>
              <StepDescription>
                {Math.floor(this.state.balanceUserStakedDecimals * 100) / 100}{" "}
                HJK
              </StepDescription>
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
          <Statistic horizontal size="tiny" style={{ margin: "1%" }}>
            <StatisticValue>
              {Math.floor(this.state.totalSupplyDecimals * 100) / 100} HJK
            </StatisticValue>
            <StatisticLabel>Total Staked Pool</StatisticLabel>
          </Statistic>
        </div>
        <div>
          <Popup
            content="This values is your total rewards for claim"
            trigger={
              <Statistic horizontal size="tiny" style={{ margin: "1%" }}>
                <StatisticValue>
                  {Math.floor(this.state.rewards * 100) / 100} HJK
                </StatisticValue>
                <StatisticLabel>Your Rewards</StatisticLabel>
              </Statistic>
            }
          />
        </div>
        <Button
          color="green"
          onClick={this.clainRewards}
          loading={this.state.loadingClaimRewards}
        >
          Claim Rewards
        </Button>
      </Container>
    );
  }
}

export default InfoUserStake;
