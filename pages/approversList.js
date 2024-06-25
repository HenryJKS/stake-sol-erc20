import React, { Component } from "react";
import Layout from "../components/Layout";
import Stake from "../ethereum/stake";
import MyToken from "../ethereum/mytoken";
import {
  TableRow,
  TableHeaderCell,
  TableCell,
  Table,
  TableHeader,
  TableBody,
} from "semantic-ui-react";

class ApproversList extends Component {
  static async getInitialProps() {
    const stake = Stake();
    const mytoken = MyToken();
    const decimals = await mytoken.methods.decimals().call();
    const eventApprovers = await stake.getPastEvents("ApprovalStake", {
      fromBlock: 0,
      toBlock: "latest",
    });

    const approvers = eventApprovers.map((event) => event.returnValues.approver);
    const spender = eventApprovers.map((event) => event.returnValues.spender);
    const value = eventApprovers.map((event) => event.returnValues.amount);
    const valueHJK = value.map((value) => value / 10 ** decimals);

    return { approvers, spender, valueHJK };
  }

  renderRows() {
    return this.props.approvers.map((approvers, index) => {
      return (
        <TableRow>
          <TableCell textAlign="center">{approvers}</TableCell>
          <TableCell textAlign="center">{this.props.spender[index]}</TableCell>
          <TableCell textAlign="center">
            {this.props.valueHJK[index]} HJK
          </TableCell>
        </TableRow>
      );
    });
  }

  render() {
    return (
      <Layout>
        <Table color="black">
          <TableHeader>
            <TableRow>
              <TableHeaderCell textAlign="center">User</TableHeaderCell>
              <TableHeaderCell textAlign="center">
                Contract Address
              </TableHeaderCell>
              <TableHeaderCell textAlign="center">Value</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>{this.renderRows()}</TableBody>
        </Table>
      </Layout>
    );
  }
}

export default ApproversList;
