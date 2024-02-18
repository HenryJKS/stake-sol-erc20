import React, { Component } from "react";
import Layout from "../components/Layout";
import WalletButton from "../components/ButtonWeb3";
import DividerStake from "../components/DividerStake";
import InfoUserStake from "../components/InfoUserStake";

class Index extends Component {
  render() {
    return (
      <Layout>
        <WalletButton />
        <DividerStake />
        <InfoUserStake />
      </Layout>
    );
  }
}

export default Index;
