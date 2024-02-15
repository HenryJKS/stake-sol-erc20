import React, { Component } from "react";
import Web3 from "web3";
import { Button } from "semantic-ui-react";


let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  web3 = new Web3(window.ethereum);
} else {
  const provider = new Web3.providers.HttpProvider(process.env.API_INFURA);
  web3 = new Web3(provider);
}

class WalletButton extends Component {
  state = {
    loading: false,
    content: "Connect Wallet",
  };

  async componentDidMount() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        // A carteira já está conectada
        this.setState({ content: `Connected: ${accounts[0]}` });
        }

        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
                this.setState({ content: `Connected: ${accounts[0]}` });
            } else {
                this.setState({ content: "Connect Wallet" });
            }
            });
    }
  }

  connectWallet = async () => {
    this.setState({ loading: true });
    if (window.ethereum) {
      try {
        // Solicita ao usuário para conectar a carteira
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        // Atualiza o estado com o endereço da carteira conectada
        this.setState({ content: `Connected: ${accounts[0]}` });
      } catch (error) {
        console.error("Usuário recusou a conexão com a carteira");
        this.setState({ content: "Connect Wallet" });
      } finally {
        this.setState({ loading: false });
      }
    } else {
      console.error("Por favor, instale o MetaMask!");
      this.setState({ content: "Connect Wallet" });
      this.setState({ loading: false });
    }
  };

  render() {
    return (
        <Button
          content={this.state.content}
          icon="ethereum"
          primary
          labelPosition="right"
          onClick={this.connectWallet}
          loading={this.state.loading}
        />
    );
  }
}

export { web3 };

export default WalletButton;