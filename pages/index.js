import React, { Component } from "react";
import Layout from "../components/Layout";
import WalletButton from "../components/ButtonWeb3";
import DividerStake from "../components/DividerStake";
import InfoUser from "../components/InfoUser";

class Index extends Component {
  render() {
    return (
      <Layout>
        <WalletButton/>
        <DividerStake />
        <InfoUser />
      </Layout>
    );
  }
}

export default Index;