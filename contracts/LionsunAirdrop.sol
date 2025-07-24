// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title LionsunAirdrop
 * @dev Smart contract for Lionsun token airdrop with referral system
 * @author Lionsuncoin Team
 */
contract LionsunAirdrop is Ownable, ReentrancyGuard, Pausable {
    IERC20 public immutable lionsunToken;
    
    // Airdrop configuration
    uint256 public constant BASE_AIRDROP_AMOUNT = 150 * 10**18; // 150 LIONSUN
    uint256 public constant REFERRAL_BONUS = 50 * 10**18;       // 50 LIONSUN bonus
    uint256 public constant MAX_REFERRALS_PER_USER = 10;        // Max referrals per user
    
    // Timing
    uint256 public airdropStartTime;
    uint256 public airdropEndTime;
    
    // Tracking
    mapping(address => bool) public hasClaimed;
    mapping(address => address[]) public referrals;
    mapping(address => address) public referredBy;
    mapping(address => uint256) public referralCount;
    mapping(address => uint256) public totalEarned;
    
    // Statistics
    uint256 public totalClaimed;
    uint256 public totalParticipants;
    uint256 public totalReferralBonuses;
    
    // Events
    event AirdropClaimed(address indexed user, uint256 amount, address indexed referrer);
    event ReferralBonusEarned(address indexed referrer, address indexed referred, uint256 bonus);
    event AirdropConfigured(uint256 startTime, uint256 endTime);
    event EmergencyWithdraw(uint256 amount);
    
    // Modifiers
    modifier airdropActive() {
        require(block.timestamp >= airdropStartTime, "Airdrop not started");
        require(block.timestamp <= airdropEndTime, "Airdrop ended");
        _;
    }
    
    modifier eligibleForClaim(address user) {
        require(!hasClaimed[user], "Already claimed");
        require(user != address(0), "Invalid address");
        _;
    }
    
    constructor(
        address _lionsunToken,
        uint256 _airdropDuration
    ) {
        require(_lionsunToken != address(0), "Invalid token address");
        
        lionsunToken = IERC20(_lionsunToken);
        airdropStartTime = block.timestamp;
        airdropEndTime = block.timestamp + _airdropDuration;
        
        emit AirdropConfigured(airdropStartTime, airdropEndTime);
    }
    
    /**
     * @dev Claim airdrop tokens with optional referrer
     * @param referrer Address of the referrer (optional)
     */
    function claimAirdrop(address referrer) 
        external 
        nonReentrant 
        whenNotPaused 
        airdropActive 
        eligibleForClaim(msg.sender) 
    {
        uint256 claimAmount = BASE_AIRDROP_AMOUNT;
        
        // Mark as claimed
        hasClaimed[msg.sender] = true;
        totalParticipants++;
        
        // Handle referral logic
        if (referrer != address(0) && 
            referrer != msg.sender && 
            hasClaimed[referrer] && 
            referralCount[referrer] < MAX_REFERRALS_PER_USER &&
            referredBy[msg.sender] == address(0)) {
            
            // Set referral relationship
            referredBy[msg.sender] = referrer;
            referrals[referrer].push(msg.sender);
            referralCount[referrer]++;
            
            // Give bonus to referrer
            uint256 referralBonus = REFERRAL_BONUS;
            totalEarned[referrer] += referralBonus;
            totalReferralBonuses += referralBonus;
            
            // Transfer bonus to referrer
            require(lionsunToken.transfer(referrer, referralBonus), "Referral bonus transfer failed");
            
            emit ReferralBonusEarned(referrer, msg.sender, referralBonus);
        }
        
        // Update user's total earnings
        totalEarned[msg.sender] += claimAmount;
        totalClaimed += claimAmount;
        
        // Transfer base airdrop amount to claimer
        require(lionsunToken.transfer(msg.sender, claimAmount), "Airdrop transfer failed");
        
        emit AirdropClaimed(msg.sender, claimAmount, referrer);
    }
    
    /**
     * @dev Get user's airdrop information
     * @param user Address to check
     * @return claimed Whether user has claimed
     * @return earned Total tokens earned (airdrop + referral bonuses)
     * @return referralCount Number of successful referrals
     * @return referredBy Address that referred this user
     */
    function getUserInfo(address user) 
        external 
        view 
        returns (
            bool claimed,
            uint256 earned,
            uint256 referralCount_,
            address referredBy_
        ) 
    {
        return (
            hasClaimed[user],
            totalEarned[user],
            referralCount[user],
            referredBy[user]
        );
    }
    
    /**
     * @dev Get user's referrals
     * @param user Address to check
     * @return Array of addresses referred by the user
     */
    function getUserReferrals(address user) external view returns (address[] memory) {
        return referrals[user];
    }
    
    /**
     * @dev Check if user is eligible to claim
     * @param user Address to check
     * @return eligible Whether user can claim
     * @return reason Reason if not eligible
     */
    function isEligibleToClaim(address user) 
        external 
        view 
        returns (bool eligible, string memory reason) 
    {
        if (user == address(0)) {
            return (false, "Invalid address");
        }
        if (hasClaimed[user]) {
            return (false, "Already claimed");
        }
        if (block.timestamp < airdropStartTime) {
            return (false, "Airdrop not started");
        }
        if (block.timestamp > airdropEndTime) {
            return (false, "Airdrop ended");
        }
        if (paused()) {
            return (false, "Airdrop paused");
        }
        
        return (true, "Eligible");
    }
    
    /**
     * @dev Get airdrop statistics
     * @return start Airdrop start time
     * @return end Airdrop end time
     * @return participants Total participants
     * @return claimed Total tokens claimed
     * @return referralBonuses Total referral bonuses distributed
     */
    function getAirdropStats() 
        external 
        view 
        returns (
            uint256 start,
            uint256 end,
            uint256 participants,
            uint256 claimed,
            uint256 referralBonuses
        ) 
    {
        return (
            airdropStartTime,
            airdropEndTime,
            totalParticipants,
            totalClaimed,
            totalReferralBonuses
        );
    }
    
    /**
     * @dev Get remaining time for airdrop
     * @return timeLeft Seconds remaining (0 if ended)
     */
    function getTimeLeft() external view returns (uint256 timeLeft) {
        if (block.timestamp >= airdropEndTime) {
            return 0;
        }
        return airdropEndTime - block.timestamp;
    }
    
    // Admin functions
    
    /**
     * @dev Extend airdrop duration (only owner)
     * @param additionalTime Additional time in seconds
     */
    function extendAirdrop(uint256 additionalTime) external onlyOwner {
        require(additionalTime > 0, "Invalid extension time");
        airdropEndTime += additionalTime;
        
        emit AirdropConfigured(airdropStartTime, airdropEndTime);
    }
    
    /**
     * @dev Pause the airdrop (only owner)
     */
    function pauseAirdrop() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the airdrop (only owner)
     */
    function unpauseAirdrop() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Emergency withdraw remaining tokens (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = lionsunToken.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        
        require(lionsunToken.transfer(owner(), balance), "Withdraw failed");
        
        emit EmergencyWithdraw(balance);
    }
    
    /**
     * @dev Get contract token balance
     * @return balance Current token balance of the contract
     */
    function getContractBalance() external view returns (uint256 balance) {
        return lionsunToken.balanceOf(address(this));
    }
    
    /**
     * @dev Add addresses to whitelist for claiming (batch operation)
     * @param users Array of addresses to whitelist
     */
    function batchWhitelist(address[] calldata users) external onlyOwner {
        for (uint256 i = 0; i < users.length; i++) {
            // This is a placeholder for future whitelist functionality
            // For now, anyone can claim during the airdrop period
        }
    }
}