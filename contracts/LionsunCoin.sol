// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title LionsunCoin
 * @dev Implementation of the Lionsun Coin (LC) with gaming rewards, staking, and governance features
 * شیروخورشید کوین - The Lion Sun Coin
 */
contract LionsunCoin is ERC20, ERC20Burnable, ERC20Pausable, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    // Token Details
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1 billion LC
    uint256 public constant BURN_RATE_BASIS_POINTS = 200; // 2% burn rate
    uint256 public constant MAX_TRANSACTION_FEE = 500; // 5% max fee
    
    // Distribution Allocations
    uint256 public constant COMMUNITY_ALLOCATION = 400_000_000 * 10**18; // 40%
    uint256 public constant TEAM_ALLOCATION = 200_000_000 * 10**18; // 20%
    uint256 public constant ECOSYSTEM_ALLOCATION = 250_000_000 * 10**18; // 25%
    uint256 public constant RESERVE_ALLOCATION = 150_000_000 * 10**18; // 15%

    // Staking System
    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lastClaimTime;
        uint256 rewardRate; // APY in basis points (e.g., 1200 = 12%)
    }

    mapping(address => StakeInfo) public stakes;
    mapping(address => bool) public gameContracts;
    mapping(address => uint256) public gameRewards;
    
    // Governance
    mapping(address => uint256) public votingPower;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    // Events
    event GameReward(address indexed player, uint256 amount, string gameType);
    event Staked(address indexed user, uint256 amount, uint256 rewardRate);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);
    event RewardClaimed(address indexed user, uint256 reward);
    event GameContractAdded(address indexed gameContract);
    event GameContractRemoved(address indexed gameContract);
    event BurnExecuted(uint256 amount, string reason);

    // Team and investor vesting
    mapping(address => uint256) public vestedTokens;
    mapping(address => uint256) public vestingStartTime;
    mapping(address => uint256) public vestingDuration;

    // Game statistics
    uint256 public totalGameRewards;
    uint256 public totalBurned;
    uint256 public totalStaked;
    
    // Minimum stake amounts and durations
    uint256 public constant MIN_STAKE_AMOUNT = 1000 * 10**18; // 1000 LC minimum
    uint256 public constant MIN_STAKE_DURATION = 7 days;
    uint256 public constant MAX_STAKE_DURATION = 365 days;

    modifier onlyGameContract() {
        require(gameContracts[msg.sender], "LionsunCoin: Caller is not authorized game contract");
        _;
    }

    modifier validStakeAmount(uint256 amount) {
        require(amount >= MIN_STAKE_AMOUNT, "LionsunCoin: Stake amount too low");
        _;
    }

    constructor() ERC20("Lionsun Coin", "LC") {
        _mint(address(this), TOTAL_SUPPLY);
        
        // Transfer initial allocations
        _transfer(address(this), owner(), TEAM_ALLOCATION);
        
        // Set up vesting for team tokens
        vestingStartTime[owner()] = block.timestamp;
        vestingDuration[owner()] = 4 * 365 days; // 4 year vesting
        vestedTokens[owner()] = TEAM_ALLOCATION;
    }

    /**
     * @dev Distribute community rewards to players
     * Can only be called by authorized game contracts
     */
    function distributeGameReward(address player, uint256 amount, string memory gameType) 
        external 
        onlyGameContract 
        nonReentrant 
    {
        require(player != address(0), "LionsunCoin: Invalid player address");
        require(amount > 0, "LionsunCoin: Invalid reward amount");
        require(balanceOf(address(this)) >= amount, "LionsunCoin: Insufficient contract balance");

        _transfer(address(this), player, amount);
        gameRewards[player] = gameRewards[player].add(amount);
        totalGameRewards = totalGameRewards.add(amount);

        emit GameReward(player, amount, gameType);
    }

    /**
     * @dev Stake tokens for governance voting power and rewards
     */
    function stake(uint256 amount, uint256 duration) 
        external 
        validStakeAmount(amount) 
        nonReentrant 
    {
        require(duration >= MIN_STAKE_DURATION && duration <= MAX_STAKE_DURATION, 
                "LionsunCoin: Invalid stake duration");
        require(stakes[msg.sender].amount == 0, "LionsunCoin: Already staking");
        require(balanceOf(msg.sender) >= amount, "LionsunCoin: Insufficient balance");

        // Calculate reward rate based on duration (longer = higher APY)
        uint256 rewardRate = calculateRewardRate(duration);
        
        _transfer(msg.sender, address(this), amount);

        stakes[msg.sender] = StakeInfo({
            amount: amount,
            startTime: block.timestamp,
            lastClaimTime: block.timestamp,
            rewardRate: rewardRate
        });

        votingPower[msg.sender] = amount;
        totalStaked = totalStaked.add(amount);

        emit Staked(msg.sender, amount, rewardRate);
    }

    /**
     * @dev Calculate staking reward rate based on duration
     */
    function calculateRewardRate(uint256 duration) public pure returns (uint256) {
        if (duration >= 365 days) return 1200; // 12% APY for 1 year+
        if (duration >= 180 days) return 800;  // 8% APY for 6 months+
        if (duration >= 90 days) return 600;   // 6% APY for 3 months+
        if (duration >= 30 days) return 400;   // 4% APY for 1 month+
        return 200; // 2% APY for minimum duration
    }

    /**
     * @dev Claim staking rewards without unstaking
     */
    function claimStakingRewards() external nonReentrant {
        StakeInfo storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "LionsunCoin: No active stake");

        uint256 reward = calculateStakingReward(msg.sender);
        require(reward > 0, "LionsunCoin: No rewards available");

        userStake.lastClaimTime = block.timestamp;
        
        // Mint rewards (inflation for staking incentives)
        _mint(msg.sender, reward);

        emit RewardClaimed(msg.sender, reward);
    }

    /**
     * @dev Calculate pending staking rewards
     */
    function calculateStakingReward(address staker) public view returns (uint256) {
        StakeInfo memory userStake = stakes[staker];
        if (userStake.amount == 0) return 0;

        uint256 timeStaked = block.timestamp.sub(userStake.lastClaimTime);
        uint256 annualReward = userStake.amount.mul(userStake.rewardRate).div(10000);
        uint256 reward = annualReward.mul(timeStaked).div(365 days);

        return reward;
    }

    /**
     * @dev Unstake tokens and claim all rewards
     */
    function unstake() external nonReentrant {
        StakeInfo storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "LionsunCoin: No active stake");
        require(block.timestamp >= userStake.startTime.add(MIN_STAKE_DURATION), 
                "LionsunCoin: Minimum stake duration not met");

        uint256 stakedAmount = userStake.amount;
        uint256 reward = calculateStakingReward(msg.sender);

        // Reset stake info
        delete stakes[msg.sender];
        votingPower[msg.sender] = 0;
        totalStaked = totalStaked.sub(stakedAmount);

        // Transfer staked amount back
        _transfer(address(this), msg.sender, stakedAmount);
        
        // Mint and transfer rewards
        if (reward > 0) {
            _mint(msg.sender, reward);
        }

        emit Unstaked(msg.sender, stakedAmount, reward);
    }

    /**
     * @dev Execute burn mechanism for deflationary pressure
     */
    function executeBurn(uint256 amount, string memory reason) external onlyOwner {
        require(amount > 0, "LionsunCoin: Invalid burn amount");
        require(balanceOf(address(this)) >= amount, "LionsunCoin: Insufficient contract balance");

        _burn(address(this), amount);
        totalBurned = totalBurned.add(amount);

        emit BurnExecuted(amount, reason);
    }

    /**
     * @dev Auto burn on certain transactions (gaming purchases)
     */
    function _burnOnTransaction(address from, uint256 amount) internal {
        if (gameContracts[from] || gameContracts[msg.sender]) {
            uint256 burnAmount = amount.mul(BURN_RATE_BASIS_POINTS).div(10000);
            if (burnAmount > 0 && balanceOf(address(this)) >= burnAmount) {
                _burn(address(this), burnAmount);
                totalBurned = totalBurned.add(burnAmount);
                emit BurnExecuted(burnAmount, "Automatic transaction burn");
            }
        }
    }

    /**
     * @dev Add authorized game contract
     */
    function addGameContract(address gameContract) external onlyOwner {
        require(gameContract != address(0), "LionsunCoin: Invalid contract address");
        gameContracts[gameContract] = true;
        emit GameContractAdded(gameContract);
    }

    /**
     * @dev Remove game contract authorization
     */
    function removeGameContract(address gameContract) external onlyOwner {
        gameContracts[gameContract] = false;
        emit GameContractRemoved(gameContract);
    }

    /**
     * @dev Distribute tokens to community (airdrops, promotions)
     */
    function distributeCommunityTokens(address[] memory recipients, uint256[] memory amounts) 
        external 
        onlyOwner 
    {
        require(recipients.length == amounts.length, "LionsunCoin: Arrays length mismatch");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount = totalAmount.add(amounts[i]);
        }
        
        require(balanceOf(address(this)) >= totalAmount, "LionsunCoin: Insufficient contract balance");

        for (uint256 i = 0; i < recipients.length; i++) {
            if (recipients[i] != address(0) && amounts[i] > 0) {
                _transfer(address(this), recipients[i], amounts[i]);
            }
        }
    }

    /**
     * @dev Vesting mechanism for team tokens
     */
    function withdrawVestedTokens() external {
        require(vestedTokens[msg.sender] > 0, "LionsunCoin: No vested tokens");
        
        uint256 vestedAmount = calculateVestedAmount(msg.sender);
        require(vestedAmount > 0, "LionsunCoin: No tokens vested yet");

        vestedTokens[msg.sender] = vestedTokens[msg.sender].sub(vestedAmount);
        _transfer(address(this), msg.sender, vestedAmount);
    }

    /**
     * @dev Calculate available vested tokens
     */
    function calculateVestedAmount(address beneficiary) public view returns (uint256) {
        if (vestedTokens[beneficiary] == 0) return 0;
        
        uint256 elapsed = block.timestamp.sub(vestingStartTime[beneficiary]);
        if (elapsed >= vestingDuration[beneficiary]) {
            return vestedTokens[beneficiary];
        }
        
        uint256 totalVested = TEAM_ALLOCATION;
        uint256 vestedAmount = totalVested.mul(elapsed).div(vestingDuration[beneficiary]);
        uint256 alreadyWithdrawn = totalVested.sub(vestedTokens[beneficiary]);
        
        return vestedAmount.sub(alreadyWithdrawn);
    }

    /**
     * @dev Emergency pause functionality
     */
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Override transfer to include burn mechanism
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._beforeTokenTransfer(from, to, amount);
        
        if (from != address(0) && to != address(0)) {
            _burnOnTransaction(from, amount);
        }
    }

    /**
     * @dev Get user's total LC ecosystem stats
     */
    function getUserStats(address user) external view returns (
        uint256 balance,
        uint256 stakedAmount,
        uint256 pendingRewards,
        uint256 totalGameRewardsEarned,
        uint256 votingPowerAmount
    ) {
        balance = balanceOf(user);
        stakedAmount = stakes[user].amount;
        pendingRewards = calculateStakingReward(user);
        totalGameRewardsEarned = gameRewards[user];
        votingPowerAmount = votingPower[user];
    }

    /**
     * @dev Get contract statistics
     */
    function getContractStats() external view returns (
        uint256 totalSupplyAmount,
        uint256 totalBurnedAmount,
        uint256 totalStakedAmount,
        uint256 totalGameRewardsAmount,
        uint256 contractBalance
    ) {
        totalSupplyAmount = totalSupply();
        totalBurnedAmount = totalBurned;
        totalStakedAmount = totalStaked;
        totalGameRewardsAmount = totalGameRewards;
        contractBalance = balanceOf(address(this));
    }

    /**
     * @dev Emergency withdrawal (only owner, for extreme circumstances)
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            payable(owner()).transfer(amount);
        } else {
            IERC20(token).transfer(owner(), amount);
        }
    }

    // Fallback function to receive ETH
    receive() external payable {}
}