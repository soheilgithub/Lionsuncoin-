// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title LionsunToken
 * @dev The native token for the Lionsuncoin Gaming Platform
 * Features:
 * - ERC20 standard compliance
 * - Burnable tokens
 * - Pausable transfers
 * - Gaming rewards distribution
 * - Airdrop functionality
 * - Anti-whale mechanisms
 * 
 * شیروخورشید کوین - The cosmic lion's currency
 */
contract LionsunToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable, ReentrancyGuard {
    
    // Token configuration
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant MAX_TRANSACTION_AMOUNT = 10_000_000 * 10**18; // 1% of total supply
    uint256 public constant MAX_WALLET_AMOUNT = 20_000_000 * 10**18; // 2% of total supply
    
    // Distribution allocations
    uint256 public constant AIRDROP_ALLOCATION = 100_000_000 * 10**18; // 10%
    uint256 public constant GAMING_REWARDS_ALLOCATION = 300_000_000 * 10**18; // 30%
    uint256 public constant TEAM_ALLOCATION = 150_000_000 * 10**18; // 15%
    uint256 public constant MARKETING_ALLOCATION = 100_000_000 * 10**18; // 10%
    uint256 public constant LIQUIDITY_ALLOCATION = 200_000_000 * 10**18; // 20%
    uint256 public constant TREASURY_ALLOCATION = 150_000_000 * 10**18; // 15%
    
    // Gaming platform integration
    mapping(address => bool) public isGameContract;
    mapping(address => bool) public isExcludedFromLimits;
    mapping(address => uint256) public gameRewardsEarned;
    
    // Airdrop management
    address public airdropContract;
    uint256 public airdropDistributed;
    
    // Gaming rewards
    address public gamingRewardsPool;
    uint256 public totalGameRewardsDistributed;
    
    // Team vesting
    address public teamWallet;
    uint256 public teamTokensReleased;
    uint256 public teamVestingStart;
    uint256 public constant TEAM_VESTING_DURATION = 730 days; // 2 years
    
    // Events
    event GameContractUpdated(address indexed gameContract, bool isAuthorized);
    event GameRewardDistributed(address indexed player, uint256 amount, string gameType);
    event AirdropContractSet(address indexed airdropContract);
    event TeamTokensReleased(address indexed teamWallet, uint256 amount);
    event LimitsExclusionUpdated(address indexed account, bool isExcluded);
    
    // Modifiers
    modifier onlyGameContract() {
        require(isGameContract[msg.sender], "Not authorized game contract");
        _;
    }
    
    modifier validAddress(address addr) {
        require(addr != address(0), "Invalid address");
        _;
    }
    
    constructor(
        address _teamWallet,
        address _gamingRewardsPool
    ) ERC20("Lionsun", "LIONSUN") validAddress(_teamWallet) validAddress(_gamingRewardsPool) {
        
        teamWallet = _teamWallet;
        gamingRewardsPool = _gamingRewardsPool;
        teamVestingStart = block.timestamp;
        
        // Exclude specific addresses from transfer limits
        isExcludedFromLimits[owner()] = true;
        isExcludedFromLimits[address(this)] = true;
        isExcludedFromLimits[_teamWallet] = true;
        isExcludedFromLimits[_gamingRewardsPool] = true;
        
        // Initial token distribution
        _mint(owner(), LIQUIDITY_ALLOCATION + MARKETING_ALLOCATION + TREASURY_ALLOCATION);
        _mint(_gamingRewardsPool, GAMING_REWARDS_ALLOCATION);
        _mint(address(this), AIRDROP_ALLOCATION + TEAM_ALLOCATION);
        
        emit Transfer(address(0), owner(), LIQUIDITY_ALLOCATION + MARKETING_ALLOCATION + TREASURY_ALLOCATION);
        emit Transfer(address(0), _gamingRewardsPool, GAMING_REWARDS_ALLOCATION);
        emit Transfer(address(0), address(this), AIRDROP_ALLOCATION + TEAM_ALLOCATION);
    }
    
    /**
     * @dev Set the airdrop contract address
     * @param _airdropContract Address of the airdrop contract
     */
    function setAirdropContract(address _airdropContract) external onlyOwner validAddress(_airdropContract) {
        airdropContract = _airdropContract;
        isExcludedFromLimits[_airdropContract] = true;
        
        // Transfer airdrop allocation to airdrop contract
        _transfer(address(this), _airdropContract, AIRDROP_ALLOCATION);
        
        emit AirdropContractSet(_airdropContract);
    }
    
    /**
     * @dev Authorize or deauthorize a game contract
     * @param gameContract Address of the game contract
     * @param isAuthorized Whether the contract is authorized
     */
    function setGameContract(address gameContract, bool isAuthorized) 
        external 
        onlyOwner 
        validAddress(gameContract) 
    {
        isGameContract[gameContract] = isAuthorized;
        if (isAuthorized) {
            isExcludedFromLimits[gameContract] = true;
        }
        
        emit GameContractUpdated(gameContract, isAuthorized);
    }
    
    /**
     * @dev Distribute gaming rewards to a player
     * @param player Address of the player
     * @param amount Amount of tokens to reward
     * @param gameType Type of game that generated the reward
     */
    function distributeGameReward(
        address player, 
        uint256 amount, 
        string calldata gameType
    ) external onlyGameContract validAddress(player) {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(gamingRewardsPool) >= amount, "Insufficient rewards pool balance");
        
        // Transfer from gaming rewards pool to player
        _transfer(gamingRewardsPool, player, amount);
        
        // Update tracking
        gameRewardsEarned[player] += amount;
        totalGameRewardsDistributed += amount;
        
        emit GameRewardDistributed(player, amount, gameType);
    }
    
    /**
     * @dev Release vested team tokens
     */
    function releaseTeamTokens() external nonReentrant {
        require(msg.sender == teamWallet || msg.sender == owner(), "Not authorized");
        
        uint256 vestedAmount = getVestedTeamTokens();
        uint256 releasableAmount = vestedAmount - teamTokensReleased;
        
        require(releasableAmount > 0, "No tokens to release");
        require(balanceOf(address(this)) >= releasableAmount, "Insufficient contract balance");
        
        teamTokensReleased += releasableAmount;
        _transfer(address(this), teamWallet, releasableAmount);
        
        emit TeamTokensReleased(teamWallet, releasableAmount);
    }
    
    /**
     * @dev Calculate vested team tokens based on time
     * @return vestedAmount Amount of tokens vested
     */
    function getVestedTeamTokens() public view returns (uint256 vestedAmount) {
        if (block.timestamp < teamVestingStart) {
            return 0;
        }
        
        uint256 elapsedTime = block.timestamp - teamVestingStart;
        
        if (elapsedTime >= TEAM_VESTING_DURATION) {
            return TEAM_ALLOCATION;
        }
        
        return (TEAM_ALLOCATION * elapsedTime) / TEAM_VESTING_DURATION;
    }
    
    /**
     * @dev Get releasable team tokens
     * @return releasableAmount Amount of tokens that can be released
     */
    function getReleasableTeamTokens() external view returns (uint256 releasableAmount) {
        uint256 vestedAmount = getVestedTeamTokens();
        return vestedAmount - teamTokensReleased;
    }
    
    /**
     * @dev Update limits exclusion for an account
     * @param account Address to update
     * @param isExcluded Whether to exclude from limits
     */
    function setLimitsExclusion(address account, bool isExcluded) 
        external 
        onlyOwner 
        validAddress(account) 
    {
        isExcludedFromLimits[account] = isExcluded;
        emit LimitsExclusionUpdated(account, isExcluded);
    }
    
    /**
     * @dev Get player's gaming statistics
     * @param player Address of the player
     * @return totalEarned Total tokens earned from gaming
     */
    function getPlayerStats(address player) external view returns (uint256 totalEarned) {
        return gameRewardsEarned[player];
    }
    
    /**
     * @dev Get overall platform statistics
     * @return totalDistributed Total gaming rewards distributed
     * @return airdropDistributed_ Total airdrop tokens distributed
     * @return teamReleased Total team tokens released
     */
    function getPlatformStats() external view returns (
        uint256 totalDistributed,
        uint256 airdropDistributed_,
        uint256 teamReleased
    ) {
        return (
            totalGameRewardsDistributed,
            airdropDistributed,
            teamTokensReleased
        );
    }
    
    /**
     * @dev Override transfer function to include anti-whale mechanisms
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Pausable) {
        super._beforeTokenTransfer(from, to, amount);
        
        // Skip limits for excluded addresses
        if (isExcludedFromLimits[from] || isExcludedFromLimits[to]) {
            return;
        }
        
        // Check transaction amount limit
        require(amount <= MAX_TRANSACTION_AMOUNT, "Transaction amount exceeds limit");
        
        // Check wallet balance limit for recipient
        if (to != address(0)) {
            require(
                balanceOf(to) + amount <= MAX_WALLET_AMOUNT, 
                "Recipient wallet would exceed limit"
            );
        }
    }
    
    /**
     * @dev Pause all token transfers (emergency function)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause all token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Emergency function to recover accidentally sent tokens
     * @param tokenAddress Address of the token to recover
     * @param amount Amount to recover
     */
    function recoverToken(address tokenAddress, uint256 amount) 
        external 
        onlyOwner 
        validAddress(tokenAddress) 
    {
        require(tokenAddress != address(this), "Cannot recover own tokens");
        IERC20(tokenAddress).transfer(owner(), amount);
    }
    
    /**
     * @dev Get token information for display purposes
     * @return name_ Token name
     * @return symbol_ Token symbol
     * @return decimals_ Token decimals
     * @return totalSupply_ Total supply
     */
    function getTokenInfo() external view returns (
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 totalSupply_
    ) {
        return (name(), symbol(), decimals(), totalSupply());
    }
}