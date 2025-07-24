// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./LionsunCoin.sol";

/**
 * @title LionsunNFT
 * @dev NFT contract for Lionsun ecosystem collectibles
 * Includes Memory Shards, Star Echoes, and Lightforms
 */
contract LionsunNFT is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    Counters.Counter private _tokenIdCounter;
    LionsunCoin public lionsunCoin;

    // NFT Collection Types
    enum CollectionType { MEMORY_SHARD, STAR_ECHO, LIGHTFORM, PIONEER_BADGE }
    
    // Rarity levels
    enum Rarity { COMMON, RARE, EPIC, LEGENDARY }

    struct NFTMetadata {
        CollectionType collectionType;
        Rarity rarity;
        uint256 gameBonus; // Percentage bonus for gameplay (in basis points)
        uint256 stakingBonus; // Bonus for LC staking (in basis points)
        string attributes; // JSON string of additional attributes
        uint256 mintTimestamp;
        bool isTransferable;
    }

    // NFT metadata mapping
    mapping(uint256 => NFTMetadata) public nftMetadata;
    
    // Collection limits
    mapping(CollectionType => mapping(Rarity => uint256)) public maxSupply;
    mapping(CollectionType => mapping(Rarity => uint256)) public currentSupply;
    
    // Marketplace functionality
    struct MarketListing {
        address seller;
        uint256 price; // Price in LC tokens
        bool isActive;
        uint256 listingTime;
    }
    
    mapping(uint256 => MarketListing) public marketListings;
    mapping(address => bool) public authorizedMinters;
    
    // Staking for NFTs
    mapping(uint256 => address) public stakedNFTs;
    mapping(address => uint256[]) public userStakedNFTs;
    mapping(uint256 => uint256) public stakingStartTime;
    
    // Events
    event NFTMinted(uint256 indexed tokenId, address indexed to, CollectionType collectionType, Rarity rarity);
    event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event NFTSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event NFTListingCancelled(uint256 indexed tokenId, address indexed seller);
    event NFTStaked(uint256 indexed tokenId, address indexed owner);
    event NFTUnstaked(uint256 indexed tokenId, address indexed owner);

    // Marketplace fees
    uint256 public marketplaceFeePercent = 250; // 2.5%
    address public feeRecipient;
    
    // Base URIs for different collections
    mapping(CollectionType => string) public baseURIs;

    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "LionsunNFT: Not authorized to mint");
        _;
    }

    modifier onlyTokenOwner(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "LionsunNFT: Not token owner");
        _;
    }

    constructor(address _lionsunCoin) ERC721("Lionsun NFT Collection", "LNFT") {
        lionsunCoin = LionsunCoin(_lionsunCoin);
        feeRecipient = owner();
        
        // Set collection limits
        _setCollectionLimits();
        
        // Set base URIs
        baseURIs[CollectionType.MEMORY_SHARD] = "https://api.lionsun.game/metadata/memory-shards/";
        baseURIs[CollectionType.STAR_ECHO] = "https://api.lionsun.game/metadata/star-echoes/";
        baseURIs[CollectionType.LIGHTFORM] = "https://api.lionsun.game/metadata/lightforms/";
        baseURIs[CollectionType.PIONEER_BADGE] = "https://api.lionsun.game/metadata/pioneer-badges/";
    }

    /**
     * @dev Set collection supply limits
     */
    function _setCollectionLimits() internal {
        // Memory Shards
        maxSupply[CollectionType.MEMORY_SHARD][Rarity.COMMON] = 1000;
        maxSupply[CollectionType.MEMORY_SHARD][Rarity.RARE] = 500;
        maxSupply[CollectionType.MEMORY_SHARD][Rarity.EPIC] = 100;
        maxSupply[CollectionType.MEMORY_SHARD][Rarity.LEGENDARY] = 25;
        
        // Star Echoes
        maxSupply[CollectionType.STAR_ECHO][Rarity.COMMON] = 2000;
        maxSupply[CollectionType.STAR_ECHO][Rarity.RARE] = 800;
        maxSupply[CollectionType.STAR_ECHO][Rarity.EPIC] = 200;
        maxSupply[CollectionType.STAR_ECHO][Rarity.LEGENDARY] = 50;
        
        // Lightforms (earned only)
        maxSupply[CollectionType.LIGHTFORM][Rarity.RARE] = 500;
        maxSupply[CollectionType.LIGHTFORM][Rarity.EPIC] = 200;
        maxSupply[CollectionType.LIGHTFORM][Rarity.LEGENDARY] = 100;
        
        // Pioneer Badges
        maxSupply[CollectionType.PIONEER_BADGE][Rarity.LEGENDARY] = 1000;
    }

    /**
     * @dev Mint NFT to specific address
     */
    function mintNFT(
        address to,
        CollectionType collectionType,
        Rarity rarity,
        uint256 gameBonus,
        uint256 stakingBonus,
        string memory attributes
    ) external onlyAuthorizedMinter returns (uint256) {
        require(to != address(0), "LionsunNFT: Invalid recipient");
        require(currentSupply[collectionType][rarity] < maxSupply[collectionType][rarity], 
                "LionsunNFT: Max supply reached");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);

        nftMetadata[tokenId] = NFTMetadata({
            collectionType: collectionType,
            rarity: rarity,
            gameBonus: gameBonus,
            stakingBonus: stakingBonus,
            attributes: attributes,
            mintTimestamp: block.timestamp,
            isTransferable: true
        });

        currentSupply[collectionType][rarity]++;

        emit NFTMinted(tokenId, to, collectionType, rarity);
        return tokenId;
    }

    /**
     * @dev Mint Pioneer Badge for early adopters
     */
    function mintPioneerBadge(address to) external onlyOwner returns (uint256) {
        require(currentSupply[CollectionType.PIONEER_BADGE][Rarity.LEGENDARY] < 
                maxSupply[CollectionType.PIONEER_BADGE][Rarity.LEGENDARY], 
                "LionsunNFT: Pioneer badges sold out");

        uint256 tokenId = mintNFT(
            to,
            CollectionType.PIONEER_BADGE,
            Rarity.LEGENDARY,
            1000, // 10% game bonus
            500,  // 5% staking bonus
            "{\"type\":\"pioneer\",\"benefits\":[\"permanent_bonuses\",\"exclusive_access\",\"early_features\"]}"
        );

        // Pioneer badges are non-transferable initially
        nftMetadata[tokenId].isTransferable = false;

        return tokenId;
    }

    /**
     * @dev Batch mint for airdrops and promotions
     */
    function batchMint(
        address[] memory recipients,
        CollectionType collectionType,
        Rarity rarity,
        uint256 gameBonus,
        uint256 stakingBonus,
        string memory attributes
    ) external onlyAuthorizedMinter {
        require(recipients.length > 0, "LionsunNFT: Empty recipients array");
        require(currentSupply[collectionType][rarity].add(recipients.length) <= 
                maxSupply[collectionType][rarity], "LionsunNFT: Batch would exceed max supply");

        for (uint256 i = 0; i < recipients.length; i++) {
            if (recipients[i] != address(0)) {
                mintNFT(recipients[i], collectionType, rarity, gameBonus, stakingBonus, attributes);
            }
        }
    }

    /**
     * @dev List NFT on marketplace
     */
    function listNFT(uint256 tokenId, uint256 priceInLC) external onlyTokenOwner(tokenId) {
        require(nftMetadata[tokenId].isTransferable, "LionsunNFT: Token not transferable");
        require(priceInLC > 0, "LionsunNFT: Invalid price");
        require(stakedNFTs[tokenId] == address(0), "LionsunNFT: Cannot list staked NFT");

        marketListings[tokenId] = MarketListing({
            seller: msg.sender,
            price: priceInLC,
            isActive: true,
            listingTime: block.timestamp
        });

        // Transfer NFT to contract for escrow
        _transfer(msg.sender, address(this), tokenId);

        emit NFTListed(tokenId, msg.sender, priceInLC);
    }

    /**
     * @dev Purchase NFT from marketplace
     */
    function purchaseNFT(uint256 tokenId) external nonReentrant {
        MarketListing storage listing = marketListings[tokenId];
        require(listing.isActive, "LionsunNFT: NFT not for sale");
        require(msg.sender != listing.seller, "LionsunNFT: Cannot buy own NFT");

        uint256 price = listing.price;
        uint256 fee = price.mul(marketplaceFeePercent).div(10000);
        uint256 sellerAmount = price.sub(fee);

        // Transfer LC tokens
        require(lionsunCoin.transferFrom(msg.sender, listing.seller, sellerAmount), 
                "LionsunNFT: LC transfer to seller failed");
        require(lionsunCoin.transferFrom(msg.sender, feeRecipient, fee), 
                "LionsunNFT: Fee transfer failed");

        // Transfer NFT to buyer
        _transfer(address(this), msg.sender, tokenId);

        emit NFTSold(tokenId, listing.seller, msg.sender, price);

        // Clear listing
        delete marketListings[tokenId];
    }

    /**
     * @dev Cancel NFT listing
     */
    function cancelListing(uint256 tokenId) external {
        MarketListing storage listing = marketListings[tokenId];
        require(listing.isActive, "LionsunNFT: No active listing");
        require(listing.seller == msg.sender, "LionsunNFT: Not the seller");

        // Return NFT to seller
        _transfer(address(this), listing.seller, tokenId);

        emit NFTListingCancelled(tokenId, listing.seller);

        // Clear listing
        delete marketListings[tokenId];
    }

    /**
     * @dev Stake NFT for additional benefits
     */
    function stakeNFT(uint256 tokenId) external onlyTokenOwner(tokenId) {
        require(stakedNFTs[tokenId] == address(0), "LionsunNFT: NFT already staked");
        require(marketListings[tokenId].isActive == false, "LionsunNFT: Cannot stake listed NFT");

        stakedNFTs[tokenId] = msg.sender;
        userStakedNFTs[msg.sender].push(tokenId);
        stakingStartTime[tokenId] = block.timestamp;

        emit NFTStaked(tokenId, msg.sender);
    }

    /**
     * @dev Unstake NFT
     */
    function unstakeNFT(uint256 tokenId) external {
        require(stakedNFTs[tokenId] == msg.sender, "LionsunNFT: Not staked by caller");

        stakedNFTs[tokenId] = address(0);
        stakingStartTime[tokenId] = 0;

        // Remove from user's staked array
        uint256[] storage userStaked = userStakedNFTs[msg.sender];
        for (uint256 i = 0; i < userStaked.length; i++) {
            if (userStaked[i] == tokenId) {
                userStaked[i] = userStaked[userStaked.length - 1];
                userStaked.pop();
                break;
            }
        }

        emit NFTUnstaked(tokenId, msg.sender);
    }

    /**
     * @dev Get total bonuses for a user from owned/staked NFTs
     */
    function getUserBonuses(address user) external view returns (uint256 gameBonus, uint256 stakingBonus) {
        uint256 userBalance = balanceOf(user);
        uint256[] memory stakedTokens = userStakedNFTs[user];

        // Calculate bonuses from owned NFTs
        for (uint256 i = 0; i < userBalance; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(user, i);
            NFTMetadata memory metadata = nftMetadata[tokenId];
            gameBonus = gameBonus.add(metadata.gameBonus);
            stakingBonus = stakingBonus.add(metadata.stakingBonus);
        }

        // Add extra bonuses from staked NFTs
        for (uint256 i = 0; i < stakedTokens.length; i++) {
            NFTMetadata memory metadata = nftMetadata[stakedTokens[i]];
            // Staked NFTs provide double bonuses
            gameBonus = gameBonus.add(metadata.gameBonus);
            stakingBonus = stakingBonus.add(metadata.stakingBonus);
        }
    }

    /**
     * @dev Get user's staked NFTs
     */
    function getUserStakedNFTs(address user) external view returns (uint256[] memory) {
        return userStakedNFTs[user];
    }

    /**
     * @dev Get NFT collection statistics
     */
    function getCollectionStats(CollectionType collectionType) external view returns (
        uint256 totalMinted,
        uint256 commonMinted,
        uint256 rareMinted,
        uint256 epicMinted,
        uint256 legendaryMinted
    ) {
        totalMinted = currentSupply[collectionType][Rarity.COMMON]
            .add(currentSupply[collectionType][Rarity.RARE])
            .add(currentSupply[collectionType][Rarity.EPIC])
            .add(currentSupply[collectionType][Rarity.LEGENDARY]);
        
        commonMinted = currentSupply[collectionType][Rarity.COMMON];
        rareMinted = currentSupply[collectionType][Rarity.RARE];
        epicMinted = currentSupply[collectionType][Rarity.EPIC];
        legendaryMinted = currentSupply[collectionType][Rarity.LEGENDARY];
    }

    /**
     * @dev Set base URI for a collection
     */
    function setBaseURI(CollectionType collectionType, string memory baseURI) external onlyOwner {
        baseURIs[collectionType] = baseURI;
    }

    /**
     * @dev Override tokenURI to use collection-specific base URIs
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        require(_exists(tokenId), "LionsunNFT: URI query for nonexistent token");

        string memory baseURI = baseURIs[nftMetadata[tokenId].collectionType];
        return bytes(baseURI).length > 0 ? 
            string(abi.encodePacked(baseURI, Strings.toString(tokenId), ".json")) : "";
    }

    /**
     * @dev Add authorized minter
     */
    function addAuthorizedMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
    }

    /**
     * @dev Remove authorized minter
     */
    function removeAuthorizedMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
    }

    /**
     * @dev Set marketplace fee
     */
    function setMarketplaceFee(uint256 feePercent) external onlyOwner {
        require(feePercent <= 1000, "LionsunNFT: Fee too high"); // Max 10%
        marketplaceFeePercent = feePercent;
    }

    /**
     * @dev Set fee recipient
     */
    function setFeeRecipient(address recipient) external onlyOwner {
        require(recipient != address(0), "LionsunNFT: Invalid recipient");
        feeRecipient = recipient;
    }

    /**
     * @dev Make Pioneer Badge transferable (after initial period)
     */
    function makePioneerBadgeTransferable(uint256 tokenId) external onlyOwner {
        require(nftMetadata[tokenId].collectionType == CollectionType.PIONEER_BADGE, 
                "LionsunNFT: Not a Pioneer Badge");
        nftMetadata[tokenId].isTransferable = true;
    }

    /**
     * @dev Override transfer to check transferability
     */
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        if (from != address(0) && to != address(0)) {
            require(nftMetadata[tokenId].isTransferable, "LionsunNFT: Token not transferable");
            require(stakedNFTs[tokenId] == address(0), "LionsunNFT: Cannot transfer staked NFT");
        }
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /**
     * @dev Override required by Solidity
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    /**
     * @dev Override required by Solidity
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Emergency withdrawal
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