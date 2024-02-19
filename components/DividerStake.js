import React, { Component } from "react";
import { web3 } from "../components/ButtonWeb3";
import {
  GridColumn,
  FormInput,
  Button,
  Divider,
  Form,
  Grid,
  Segment,
  List,
  ListIcon,
  ListItem,
  ListContent,
  Container,
} from "semantic-ui-react";
import stake from "../ethereum/stake";
import mytoken from "../ethereum/mytoken";
import { Router } from "../routes";

class DividerStake extends Component {
  state = {
    address: "",
    amount: "",
    stakeLoading: false
  };

  async componentDidMount() {
    const myTokenInstance = mytoken();
    const stakeInstance = stake();
    const symbol = await myTokenInstance.methods.symbol().call();

    // Policy Rewards
    const rewardRate = await stakeInstance.methods.rewardRate().call();
    const rewardPeriod = await stakeInstance.methods.rewardPeriod().call();

    this.setState({ symbol, rewardRate, rewardPeriod });
  }

  onStake = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    const stakeInstance = stake();

    this.setState({ stakeLoading: true });

    try {
      await stakeInstance.methods.stake(this.state.amount).send({
        from: accounts[0],
      });
      Router.pushRoute("/");
      this.setState({ stakeLoading: false });
    } catch (error) {
      console.log(error.message);
      this.setState({ stakeLoading: false });
    }
  };

  render() {
    return (
      <Segment placeholder>
        <Grid columns={2} relaxed="very" stackable>
          <GridColumn>
            <Form onSubmit={this.onStake}>
              <FormInput
                icon="ethereum"
                iconPosition="left"
                label="Amount"
                placeholder={`Enter amount of ${this.state.symbol} to stake`}
                type="value"
                value={this.state.amount}
                onChange={(event) =>
                  this.setState({ amount: event.target.value })
                }
                required={true}
              />
              <Button content="Stake" loading={this.state.stakeLoading} primary/>
            </Form>
          </GridColumn>

          <GridColumn verticalAlign="middle">
            <h1 style={{ textAlign: "center" }}>Policy Rewards</h1>
            <List>
              <ListItem>
                <ListIcon name="money" color="green" />
                <ListContent>Rate: {this.state.rewardRate}%</ListContent>
              </ListItem>
              <ListItem>
                <ListIcon name="time" color="blue" />
                <ListContent>
                  Period: {this.state.rewardPeriod} seconds
                </ListContent>
              </ListItem>
            </List>
            <p>Stake your {this.state.symbol} to earn rewards</p>
          </GridColumn>
        </Grid>

        <Divider vertical content="Info" />
      </Segment>
    );
  }
}

export default DividerStake;
