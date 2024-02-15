import React, { Component } from "react";
import Layout from "../components/Layout";
import WalletButton from "../components/ButtonWeb3";
import DividerStake from "../components/DividerStake";

class Index extends Component {
  render() {
    return (
      <Layout>
        <WalletButton/>
        <DividerStake />
      </Layout>
    );
  }
}

export default Index;