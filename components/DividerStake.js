import React, { Component } from "react";
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

class DividerStake extends Component {
  state = {
    address: "",
    amount: "",
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

  render() {
    return (
      <Segment placeholder>
        <Grid columns={2} relaxed="very" stackable>
          <GridColumn>
            <Form>
              <FormInput
                icon="ethereum"
                iconPosition="left"
                label="Amount"
                placeholder={`Enter amount of ${this.state.symbol} to stake`}
                type="value"
              />

              <Button content="Send" primary />
            </Form>
          </GridColumn>

          <GridColumn verticalAlign="middle">
            <h1 style={{textAlign: 'center'}}>Policy Rewards</h1>
            <List>
                <ListItem>
                    <ListIcon name="money" color="green"/>
                    <ListContent>Rate: {this.state.rewardRate}%</ListContent>
                </ListItem>
                <ListItem>
                    <ListIcon name="time" color="blue"/>
                    <ListContent>Period: {this.state.rewardPeriod} seconds</ListContent>
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
