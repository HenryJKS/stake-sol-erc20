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
        successApprove: "",
        loadingButton: false
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        const mytoken = MyToken();

        this.setState({ messageError: "", loadingButton: true});

        try {
            await mytoken.methods.approve(
                this.state.address,
                this.state.amount
            ).send({
                from: accounts[0]
            });
            this.setState({ successApprove: "Success to Approve, check the list of approvers", address: "", amount: "", loadingButton: false})
        } catch (error) {
            this.setState({ messageError: error.message, address: "", amount: "", loadingButton: false});
        }
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
                            placeholder="Enter token address"
                            type="number"
                            value={this.state.amount}
                            onChange={(event) => this.setState({ amount: event.target.value })}
                            required={true}
                        />
                    </FormGroup>
                    <Button primary loading={this.state.loadingButton}>Approve</Button>
                    <Message
                        error
                        header="Error"
                        content={this.state.messageError}
                    />
                    <Modal
                    open={!!this.state.successApprove}
                    header='Success to Approve'
                    content={this.state.successApprove}
                    actions={[{ key: 'done', content: 'Done', positive: true }]}
                    onActionClick={() => this.setState({ successApprove: "" })}
                    size="small"
                    style={{ textAlign: "center" }}
                    />
                </Form>
            </Layout>
        );
    }
}

export default Approve;