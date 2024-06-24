// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract MyToken is ERC20, ERC20Burnable, Ownable, ERC20Permit {

    constructor()
        ERC20("MyToken", "HJK")
        Ownable(msg.sender)
        ERC20Permit("MyToken")
    {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}



error Staking__TransferFailed();
error Withdraw__TransferFailed();
error Staking__NeedsMoreThanZero();

contract Stake is MyToken{ 
    mapping(address => uint) public stakers;
    uint public totalSupplyStaked;
    // rastreio de tempo
    mapping(address => uint) internal lastUpdateTime;
    // rastreio de acumulação do token
    mapping(address => uint) public rewardAcumulatedPerUser;
    uint public constant rewardRate = 2; // taxa de 2%
    uint public constant rewardPeriod = 30; // ganho a cada 30s

    modifier updateData(address staker) {
        uint reward = policyRewardsperToken(staker);
        rewardAcumulatedPerUser[staker] += reward;
        lastUpdateTime[staker] = block.timestamp;
        _;
    }

    function returnBalanceHJK() public view returns (uint256) {
        return balanceOf(msg.sender);
    }

    // modifier para verificar se o saldo é maior que 0
    modifier moreThen0() {
        if (balanceOf(msg.sender) == 0) {
            revert Staking__NeedsMoreThanZero();
        }
        _;
    }

    // stake
    function stake(uint256 _amount) external updateData(msg.sender) moreThen0 {
        require(
            balanceOf(msg.sender) >= _amount,
            "Staking: Not enough balance to stake"
        );

        approve(msg.sender, _amount);

        stakers[msg.sender] += _amount;
        totalSupplyStaked += _amount;
        transferFrom(msg.sender, owner(), _amount);
        emit Approval(msg.sender, owner(), _amount);
    }

    // unstaked
    function unstaked(uint _amount) updateData(msg.sender) external {
        require(stakers[msg.sender] >= _amount, "Withdraw__TransferFailed");

        approve(owner(), _amount);
        stakers[msg.sender] -= _amount;
        totalSupplyStaked -= _amount;
        _transfer(owner(), msg.sender, _amount);
    }

    // policy rewards
    function policyRewardsperToken(address staker) public view returns(uint) {
        if (stakers[staker] == 0) {
            return 0;
        } else {
            uint currentBalance = stakers[staker]; 
            uint timeStaked = block.timestamp - lastUpdateTime[staker]; // tempo em stake

            uint totalReward = (currentBalance * rewardRate / 100) * (timeStaked / rewardPeriod);

            return totalReward;
        } 
    }

    // claimRewards
    function claimRewards() external updateData(msg.sender) {
        uint reward = rewardAcumulatedPerUser[msg.sender];
        require(reward > 0, "No rewards available");
        mint(msg.sender, reward);
        rewardAcumulatedPerUser[msg.sender] = 0;
        transfer(msg.sender, reward);
    }

    // All rewards for withdraw
    function totalWithdraw() external view returns(uint) {
        return policyRewardsperToken(msg.sender) + rewardAcumulatedPerUser[msg.sender];
    }
}