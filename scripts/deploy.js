const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Lionsun Smart Contract Deployment...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ETH");

  // Deploy LionsunCoin first
  console.log("\n🦁 Deploying LionsunCoin...");
  const LionsunCoin = await ethers.getContractFactory("LionsunCoin");
  const lionsunCoin = await LionsunCoin.deploy();
  await lionsunCoin.deployed();
  
  console.log("✅ LionsunCoin deployed to:", lionsunCoin.address);
  console.log("🔗 Transaction hash:", lionsunCoin.deployTransaction.hash);

  // Deploy LionsunNFT
  console.log("\n🎨 Deploying LionsunNFT...");
  const LionsunNFT = await ethers.getContractFactory("LionsunNFT");
  const lionsunNFT = await LionsunNFT.deploy(lionsunCoin.address);
  await lionsunNFT.deployed();
  
  console.log("✅ LionsunNFT deployed to:", lionsunNFT.address);
  console.log("🔗 Transaction hash:", lionsunNFT.deployTransaction.hash);

  // Add NFT contract as authorized game contract for LC rewards
  console.log("\n🔐 Setting up contract permissions...");
  const addGameContractTx = await lionsunCoin.addGameContract(lionsunNFT.address);
  await addGameContractTx.wait();
  console.log("✅ LionsunNFT added as authorized game contract");

  // Add NFT contract as authorized minter
  const addMinterTx = await lionsunNFT.addAuthorizedMinter(deployer.address);
  await addMinterTx.wait();
  console.log("✅ Deployer added as authorized minter for NFTs");

  // Initialize some test data (only on testnets)
  const network = await ethers.provider.getNetwork();
  if (network.chainId !== 1 && network.chainId !== 137) { // Not mainnet or Polygon mainnet
    console.log("\n🧪 Initializing test data...");
    
    // Distribute some community tokens for testing
    const testAddresses = [deployer.address];
    const testAmounts = [ethers.utils.parseEther("10000")]; // 10,000 LC for testing
    
    const distributeTx = await lionsunCoin.distributeCommunityTokens(testAddresses, testAmounts);
    await distributeTx.wait();
    console.log("✅ Test tokens distributed");

    // Mint some test NFTs
    const mintTx = await lionsunNFT.mintNFT(
      deployer.address,
      0, // MEMORY_SHARD
      1, // RARE
      500, // 5% game bonus
      300, // 3% staking bonus
      '{"test": true, "description": "Test Memory Shard"}'
    );
    await mintTx.wait();
    console.log("✅ Test NFT minted");
  }

  // Verify contract statistics
  console.log("\n📊 Contract Statistics:");
  const coinStats = await lionsunCoin.getContractStats();
  console.log("🪙 Total LC Supply:", ethers.utils.formatEther(coinStats.totalSupplyAmount));
  console.log("💼 Contract LC Balance:", ethers.utils.formatEther(coinStats.contractBalance));
  
  const nftStats = await lionsunNFT.getCollectionStats(0); // MEMORY_SHARD
  console.log("🎨 Memory Shards Minted:", nftStats.totalMinted.toString());

  // Save deployment addresses
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId,
    deployer: deployer.address,
    contracts: {
      LionsunCoin: lionsunCoin.address,
      LionsunNFT: lionsunNFT.address,
    },
    blockNumbers: {
      LionsunCoin: lionsunCoin.deployTransaction.blockNumber,
      LionsunNFT: lionsunNFT.deployTransaction.blockNumber,
    },
    timestamp: new Date().toISOString(),
  };

  console.log("\n📋 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Save to file
  const fs = require('fs');
  const path = require('path');
  
  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const filename = `${network.name}-${Date.now()}.json`;
  const filepath = path.join(deploymentsDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("💾 Deployment info saved to:", filepath);

  // Verification instructions
  console.log("\n🔍 To verify contracts on Etherscan/Polygonscan:");
  console.log(`npx hardhat verify --network ${network.name} ${lionsunCoin.address}`);
  console.log(`npx hardhat verify --network ${network.name} ${lionsunNFT.address} "${lionsunCoin.address}"`);

  console.log("\n🎉 Deployment completed successfully!");
  console.log("🌐 Visit https://lionsun.game to interact with your contracts");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });