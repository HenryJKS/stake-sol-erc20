import React, { Component } from "react";
import { web3 } from "../components/ButtonWeb3";
import Stake from "../ethereum/stake";
import Mytoken from "../ethereum/mytoken";
import { Container } from "semantic-ui-react";
import styles from "../components/InfoUser.module.css";

class InfoUser extends Component {

    state = {
        balanceHJK: "",
        account: "",
        totalStake:""
    }

    async componentDidMount() {
        this.loadBlockchainData();
        window.ethereum.on('accountsChanged', this.loadBlockchainData);
    }

    componentWillUnmount() {
        window.ethereum.removeListener('accountsChanged', this.loadBlockchainData);
    }

    loadBlockchainData = async () => {
        const stake = Stake();
        const mytoken = Mytoken();
        const accounts = await web3.eth.getAccounts();
    
        if (!accounts[0]) {
            console.log('Nenhuma conta logada no MetaMask');
            this.setState({ account: null });
            return;
        }
    
        const decimals = await mytoken.methods.decimals().call();
        const balanceHJK = await mytoken.methods.balanceOf(accounts[0]).call();
    
        const balanceHJKDecimals = balanceHJK / (10 ** decimals);
    
        this.setState({ balanceHJKDecimals, account: accounts[0] });
    }

    render() {
        if (!this.state.account) {
            return (
                <Container>
                    <h1>User Status</h1>
                    <hr></hr>   
                    <h5>Your Amount HJK:</h5>
                </Container>
            )
        }
    
        return (
            <Container className={styles.containerInfoUser}>
                <h1>User Status</h1>
                <hr/>   
                <h5>Your Amount HJK: {this.state.balanceHJKDecimals} HJK</h5>
            </Container>
        )
    }
    
}

export default InfoUser