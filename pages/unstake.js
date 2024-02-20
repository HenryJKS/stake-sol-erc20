import React, { Component } from "react";
import Layout from "../components/Layout";
import stake from "../ethereum/stake";
import { Form, Button, FormInput, FormField, Modal } from "semantic-ui-react";
import { web3 } from "../components/ButtonWeb3";

class Unstake extends Component {
  state = {
    loadingUnstake: false,
    valueUnstake: "",
    errorMessage: "",
    sucessMessage: "",
  }

  onUnstake = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    const stakeInstance = stake();

    this.setState({ loadingUnstake: true, errorMessage: "" });

    try {
      await stakeInstance.methods.unstaked(this.state.valueUnstake).send({
        from: accounts[0],
      });
      this.setState({ valueUnstake: "", loadingUnstake: false, errorMessage: "", sucessMessage: "Unstaked with success" });
    } catch (error) {
      this.setState({ loadingUnstake: false, errorMessage: error.message })
    }
  };

  render() {
    return (
      <Layout>
        <Form onSubmit={this.onUnstake}>
          <FormField>
            <FormInput
              icon='ethereum'
              iconPosition='left'
              label='Unstake'
              placeholder='Amount'
              type="value"
              value={this.state.valueUnstake}
              width={8}
              onChange={(event) => this.setState({ valueUnstake: event.target.value })}
            />
          </FormField>
          <FormField>
            <Button primary loading={this.state.loadingUnstake}>Unstake</Button>
          </FormField>
        </Form>
        <Modal
          open={!!this.state.sucessMessage}
          header="Success"
          content={this.state.sucessMessage}
          actions={[{ key: 'done', content: 'Done', positive: true }]}
          size="tiny"
          onActionClick={() => this.setState({ sucessMessage: "" })}
          style={{ textAlign: "center" }}
        />
      </Layout>
    );
  }
}

export default Unstake;