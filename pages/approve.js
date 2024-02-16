import React, { Component } from "react";
import Layout from "../components/Layout";
import { web3 } from "../components/ButtonWeb3";
import MyToken from "../ethereum/mytoken";
import styles from "../src/Approve.module.css";
import {
    FormInput,
    FormGroup,
    FormCheckbox,
    Button,
    Form,
    Container,
    Header,
    List,
    ListItem,
    Message,
    Modal
  } from 'semantic-ui-react'

class Approve extends Component {

    state = {
        address: "",
        amount: "",
        messageError: "",
        successApprove: ""
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        const mytoken = MyToken();

        this.setState({ messageError: "" });

        try {
            await mytoken.methods.approve(
                this.state.address,
                this.state.amount
            ).send({
                from: accounts[0]
            });
        } catch (error) {
            this.setState({ messageError: error.message });
        }

        this.setState({ address: "", amount: ""});
    }

    render() {
        return (
            <Layout>
                <Container className={styles.containerApprove}>
                    <Header as='h1'>Approve</Header>
                    <p>Approve the amount of tokens to be used by the contract</p>
                    <List as='ul'>
                        <ListItem as='li'>Address: Address of Contract</ListItem>
                        <ListItem as='li'>Amount: Amount in HJK to Approve</ListItem>
                        <ListItem as='li'>Address to Approve: <a href="https://sepolia.etherscan.io/address/0x34816A47B58067d55B07F887384F253A4e98eB36">{process.env.NEXT_PUBLIC_ADDRESS_STAKE}</a></ListItem>
                    </List>

                </Container>
                <Form className={styles.formCenter} onSubmit={this.onSubmit} error={!!this.state.messageError}>
                    <FormGroup>
                        <FormInput
                            icon="user"
                            iconPosition="left"
                            label="Address"
                            placeholder="Enter token address"
                            type="text"
                            value={this.state.address}
                            onChange={(event) => this.setState({ address: event.target.value })}
                            required={true}
                        />
                        <FormInput
                            icon="ethereum"
                            iconPosition="left"
                            label="Amount"
                            placeholder="Enter amount to approve"
                            type="number"
                            onChange={(event) => this.setState({ amount: event.target.value })}
                            required={true}
                        />
                    </FormGroup>
                    <Button primary>Send</Button>
                    <Message
                        error
                        header="Error"
                        content={this.state.messageError}
                    />
                </Form>
            </Layout>
        );
    }
}

export default Approve;