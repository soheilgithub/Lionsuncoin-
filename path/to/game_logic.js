// path/to/game_logic.js

// Import necessary modules and dependencies
const Web3 = require('web3');
const { contractABI, contractAddress } = require('./smart_contract');

// Initialize Web3
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

// Create contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Game logic class
class GameLogic {
  constructor() {
    this.players = [];
    this.challenges = [];
    this.competitions = [];
    this.rewards = [];
  }

  // Add a new player
  addPlayer(playerId) {
    if (!this.players.includes(playerId)) {
      this.players.push(playerId);
    }
  }

  // Create a new challenge
  createChallenge(name, reward) {
    const challenge = {
      id: this.challenges.length + 1,
      name,
      reward,
      completedBy: [],
    };
    this.challenges.push(challenge);
  }

  // Complete a challenge
  completeChallenge(playerId, challengeId) {
    const challenge = this.challenges.find(ch => ch.id === challengeId);
    if (challenge && !challenge.completedBy.includes(playerId)) {
      challenge.completedBy.push(playerId);
      this.rewardPlayer(playerId, challenge.reward);
    }
  }

  // Create a new competition
  createCompetition(name, reward) {
    const competition = {
      id: this.competitions.length + 1,
      name,
      reward,
      participants: [],
    };
    this.competitions.push(competition);
  }

  // Join a competition
  joinCompetition(playerId, competitionId) {
    const competition = this.competitions.find(comp => comp.id === competitionId);
    if (competition && !competition.participants.includes(playerId)) {
      competition.participants.push(playerId);
    }
  }

  // Reward a player
  async rewardPlayer(playerId, amount) {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.transfer(playerId, amount).send({ from: accounts[0] });
      console.log(`Player ${playerId} rewarded with ${amount} Lionsun Coins.`);
    } catch (error) {
      console.error('Error rewarding player:', error);
    }
  }

  // Get player rewards
  getPlayerRewards(playerId) {
    return this.rewards.filter(reward => reward.playerId === playerId);
  }
}

// Export the GameLogic class
module.exports = GameLogic;

