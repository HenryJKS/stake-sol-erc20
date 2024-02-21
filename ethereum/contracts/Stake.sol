// SPDX-License-Identifier: MIT
pragma solidity >0.8.9;

library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
        if (a == 0) {
            return 0;
        }
        c = a * b;
        assert(c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        // uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return a / b;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
        c = a + b;
        assert(c >= a);
        return c;
    }
}

interface ERC20Interface {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256 balance);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool success);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256 remaining);

    function approve(address spender, uint256 amount)
        external
        returns (bool success);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool success);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

// Contrato para chamar quando alguém aprova uma transferência de tokens para um contrato específico
interface ApproveAndCallFallBack {
    function receiveApproval(
        address from,
        uint256 tokens,
        address token,
        bytes memory data
    ) external;
}

contract myToken is ERC20Interface {
    using SafeMath for uint256;

    string public symbol;
    string public name;
    uint8 public decimals;
    uint256 public _totalSupply;
    uint256 public mintToken;
    uint256 public burnToken;
    uint256 public totalTransfer;
    event TransferWithBlock(
        address from,
        address to,
        uint256 amount,
        uint256 blockNumber,
        uint256 timestamp
    );

    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowed;

    constructor() {
        symbol = "HJK";
        name = "Token HJK";
        decimals = 2;
        _totalSupply = 1000.00;
        balances[0x26F44aBBbd1547aac7EB4deDdde38C3f69Ed300d] = _totalSupply;
        emit Transfer(
            address(0),
            0x26F44aBBbd1547aac7EB4deDdde38C3f69Ed300d,
            _totalSupply
        );
    }

    //Retorna o fornecimento total de tokens do contrato
    function totalSupply() public view override returns (uint256) {
        return _totalSupply - balances[address(0)];
    }

    // Retorna o saldo de tokens detidos pelo enderço owner
    function balanceOf(address tokenOwner)
        public
        view
        override
        returns (uint256 balance)
    {
        return balances[tokenOwner];
    }

    // enviar uma quantidade de tokens para endereço "to"
    function transfer(address to, uint256 tokens)
        public
        override
        returns (bool success)
    {
        require(balances[msg.sender] >= tokens, "Saldo insuficiente");
        balances[msg.sender] = balances[msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        totalTransfer = totalTransfer.add(tokens);
        emit Transfer(msg.sender, to, tokens);
        emit TransferWithBlock(
            msg.sender,
            to,
            tokens,
            block.number,
            block.timestamp
        );
        return true;
    }

    // proprietário dos tokens aprove um endereço específico (spender) a gastar uma quantidade especificada de tokens em seu nome
    function approve(address spender, uint256 tokens)
        public
        override
        returns (bool success)
    {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }

    // Permite que o contrato do token mova tokens da conta de um remetente (from) para a conta de um destinatário (to)
// Permite que o contrato do token mova tokens da conta de um remetente (from) para a conta de um destinatário (to)
    function transferFrom(
        address from,
        address to,
        uint256 tokens
    ) public override returns (bool success) {
        require(balances[from] >= tokens, "Saldo insuficiente");
        require(allowed[from][msg.sender] >= tokens, "Permissao Insuficiente");

        balances[from] = balances[from].sub(tokens);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);

        emit Transfer(from, to, tokens);
        return true;
    }


    //Retorna a quantidade de tokens que um endereço (spender) está autorizado a gastar em nome de outro endereço (tokenOwner)
    function allowance(address tokenOwner, address spender)
        public
        view
        override
        returns (uint256 remaining)
    {
        return allowed[tokenOwner][spender];
    }

    // Permite que o remetente aprove um endereço (spender) a gastar uma quantidade específica de tokens em seu nome
    function approveAndCall(
        address spender,
        uint256 tokens,
        bytes memory data
    ) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        ApproveAndCallFallBack(spender).receiveApproval(
            msg.sender,
            tokens,
            address(this),
            data
        );
        return true;
    }

    // Permite que o proprietário do contrato (quem o implantou) crie novos tokens, adicionando-os ao saldo do contrato
    function mint(uint256 amount) external {
        balances[msg.sender] = balances[msg.sender].add(amount);
        _totalSupply = _totalSupply.add(amount);
        mintToken = mintToken.add(amount);
        emit Transfer(address(0), msg.sender, amount);
    }

    //Permite que o proprietário do contrato destrua tokens, removendo-os do saldo do contrato
    function burn(uint256 amount) external {
        balances[msg.sender] = balances[msg.sender].sub(amount);
        _totalSupply = _totalSupply.sub(amount);
        burnToken = burnToken.add(amount);
        emit Transfer(msg.sender, address(0), amount);
    }

    // rejeitar todas as transferências de Ether que não correspondam a nenhuma função específica do contrato
    receive() external payable {
        revert();
    }
}

error Staking__TransferFailed();
error Withdraw__TransferFailed();
error Staking__NeedsMoreThanZero();

contract Stake {
    using SafeMath for uint256;
    myToken mytoken;
    mapping(address => uint) public stakers;
    uint public totalSupplyStaked;
    // rastreio de tempo
    mapping(address => uint) internal lastUpdateTime;
    // rastreio de acumulação do token
    mapping(address => uint) public rewardAcumulatedPerUser;
    uint public constant rewardRate = 2; // taxa de 2%
    uint public constant rewardPeriod = 30; // ganho a cada 30s

    constructor(myToken _token) {
        mytoken = _token;
    }

    modifier updateData(address staker) {
        uint reward = policyRewardsperToken(staker);
        rewardAcumulatedPerUser[staker] += reward;
        lastUpdateTime[staker] = block.timestamp;
        _;
    }

    function returnBalanceHJK() public view returns (uint256) {
        return mytoken.balanceOf(msg.sender);
    }

    // modifier para verificar se o saldo é maior que 0
    modifier moreThen0() {
        if (returnBalanceHJK() == 0) {
            revert Staking__NeedsMoreThanZero();
        }
        _;
    }

    // stake
    function stake(uint256 _amount) external updateData(msg.sender) moreThen0 {
        require(
            mytoken.balanceOf(msg.sender) >= _amount,
            "Staking: Not enough balance to stake"
        );

        stakers[msg.sender] += _amount;
        totalSupplyStaked += _amount;
        mytoken.transferFrom(msg.sender, address(this), _amount);
    }

    // unstaked
    function unstaked(uint _amount) updateData(msg.sender) external {
        require(stakers[msg.sender] >= _amount, "Withdraw__TransferFailed");
        stakers[msg.sender] -= _amount;
        totalSupplyStaked -= _amount;
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
        rewardAcumulatedPerUser[msg.sender] = 0;
        mytoken.transfer(msg.sender, reward);
    }
}

