import React, { Component } from "react";
import { MenuItem, Menu } from "semantic-ui-react";
import { Link } from "../routes";

class Navbar extends Component {

  state = {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu>
        <MenuItem>
          <img alt='logo' src="https://i.ibb.co/0hkvb7N/logo.png" />
        </MenuItem>

        <MenuItem
          name='home'
          active={activeItem === 'home'}
          onClick={this.handleItemClick}
          as={Link}
          to="/"
        >
          Stake
        </MenuItem>

        <MenuItem
          name='unstake'
          active={activeItem === 'unstake'}
          onClick={this.handleItemClick}
          as={Link}
          to="/unstake"
        >
          Unstake
        </MenuItem>

        <MenuItem
          name='approve'
          active={activeItem === 'approve'}
          onClick={this.handleItemClick}
          as={Link}
          to="/approve"
        >
          Approve
        </MenuItem>

        <MenuItem
          name='approversList'
          active={activeItem === 'approversList'}
          onClick={this.handleItemClick}
          as={Link}
          to="/approversList"
        >
          Approvers
        </MenuItem>

      </Menu>
    )
  }
}

export default Navbar;