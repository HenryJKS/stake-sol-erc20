import React, { Component } from "react";
import Layout from "../components/Layout";
import stake from "../ethereum/stake";
import mytoken from "../ethereum/mytoken";
import { Form, Button, FormInput, FormField, Modal } from "semantic-ui-react";
import { web3 } from "../components/ButtonWeb3";

class Unstake extends Component {
  state = {
    loadingUnstake: false,
    valueUnstake: "",
    errorMessage: "",
    successMessage: "",
    balanceUserStaked: 0,
    decimals: 0,
  };

  async componentDidMount() {
    let accounts = await web3.eth.getAccounts();

    const stakeInstance = stake();
    const mytokenInstance = mytoken();
    const decimals = await mytokenInstance.methods.decimals().call();

    const balanceUserStaked = await stakeInstance.methods
      .stakers(accounts[0])
      .call();

    this.setState({
      balanceTotalStaked: balanceUserStaked / 10 ** decimals,
      decimals,
    });
  }

  onUnstake = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    const stakeInstance = stake();

    this.setState({ loadingUnstake: true, errorMessage: "" });

    try {
      await stakeInstance.methods
        .unstaked(
          (this.state.valueUnstake * 10 ** this.state.decimals).toString()
        )
        .send({
          from: accounts[0],
        });
      this.setState({
        valueUnstake: "",
        loadingUnstake: false,
        errorMessage: "",
        successMessage: "Unstaked with success",
      });
    } catch (error) {
      this.setState({ loadingUnstake: false, errorMessage: error.message });
    }
  };

  render() {
    return (
      <Layout>
        <Form onSubmit={this.onUnstake} error={!!this.state.errorMessage}>
          <FormField>
            <FormInput
              icon="ethereum"
              iconPosition="left"
              label="Unstake"
              placeholder="Amount"
              type="number"
              value={this.state.valueUnstake}
              onChange={(event) =>
                this.setState({ valueUnstake: event.target.value })
              }
            />
            <p>Total balance available: {this.state.balanceUserStaked}</p>
          </FormField>
          <FormField>
            <Button primary loading={this.state.loadingUnstake}>
              Unstake
            </Button>
          </FormField>
        </Form>
        <Modal
          open={!!this.state.successMessage}
          header="Success"
          content={this.state.successMessage}
          actions={[{ key: "done", content: "Done", positive: true }]}
          size="tiny"
          onActionClick={() => this.setState({ successMessage: "" })}
          style={{ textAlign: "center" }}
        />
      </Layout>
    );
  }
}

export default Unstake;
