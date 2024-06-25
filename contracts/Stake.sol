// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract MyToken is ERC20, ERC20Burnable, Ownable {

    constructor()
        ERC20("MyToken", "HJK")
        Ownable(msg.sender)
    {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

error Staking__TransferFailed();
error Withdraw__TransferFailed();
error Staking__NeedsMoreThanZero();

contract Stake { 
    MyToken private mytoken;
    address public owner;

    constructor(address tokenAddress) {
        mytoken = MyToken(tokenAddress);
        owner = mytoken.owner();
    }

    mapping(address => uint) public stakers;
    uint public totalSupplyStaked;
    // rastreio de tempo
    mapping(address => uint) internal lastUpdateTime;
    // rastreio de acumulação do token
    mapping(address => uint) public rewardAcumulatedPerUser;
    uint public constant rewardRate = 2; // taxa de 2%
    uint public constant rewardPeriod = 30; // ganho a cada 30s

    event ApprovalStake(address approver, address spender, uint amount);

    modifier updateData(address staker) {
        uint reward = policyRewardsperToken(staker);
        rewardAcumulatedPerUser[staker] += reward;
        lastUpdateTime[staker] = block.timestamp;
        _;
    }
    
    // stake
    function stake(uint256 _amount) external updateData(msg.sender) {
        require(_amount > 0, "Staking: Amount must be greater than zero");

        // Transfer tokens from user to contract
        mytoken.transferFrom(msg.sender, address(this), _amount);

        stakers[msg.sender] += _amount;
        totalSupplyStaked += _amount;

        emit ApprovalStake(msg.sender, address(this), _amount);
    }

    // unstaked
    function unstaked(uint _amount) external updateData(msg.sender) {
        require(stakers[msg.sender] >= _amount, "Withdraw__TransferFailed");

        stakers[msg.sender] -= _amount;
        totalSupplyStaked -= _amount;

        // Transfer tokens from contract to user
        mytoken.transfer(msg.sender, _amount);
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

        mytoken.mint(address(this), reward);
        rewardAcumulatedPerUser[msg.sender] = 0;
        mytoken.transfer(msg.sender, reward);
    }

    // All rewards for withdraw
    function totalWithdrawPerUser() external view returns(uint) {
        return policyRewardsperToken(msg.sender) + rewardAcumulatedPerUser[msg.sender];
    }
}
