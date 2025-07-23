// Main Application JavaScript for Lionsuncoin Gaming Platform

class LionsuncoinApp {
  constructor() {
    this.socket = null;
    this.currentUser = null;
    this.currentGame = null;
    this.loadingScreen = document.getElementById('loadingScreen');
    this.init();
  }

  async init() {
    try {
      this.showLoading();
      this.setupEventListeners();
      this.setupNavigation();
      this.setupModals();
      this.initializeSocket();
      await this.loadGames();
      await this.loadLeaderboard();
      this.checkAuthStatus();
      this.setupHeroGame();
      this.hideLoading();
    } catch (error) {
      console.error('App initialization error:', error);
      this.showToast('Failed to initialize application', 'error');
      this.hideLoading();
    }
  }

  showLoading() {
    if (this.loadingScreen) {
      this.loadingScreen.style.display = 'flex';
    }
  }

  hideLoading() {
    if (this.loadingScreen) {
      setTimeout(() => {
        this.loadingScreen.style.display = 'none';
      }, 1500);
    }
  }

  setupEventListeners() {
    // Navigation toggle for mobile
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
      });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href');
        if (target.startsWith('#')) {
          this.scrollToSection(target);
          this.setActiveNavLink(link);
          if (navMenu) navMenu.classList.remove('active');
        }
      });
    });

    // Hero action buttons
    const playNowBtn = document.getElementById('playNowBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');

    if (playNowBtn) {
      playNowBtn.addEventListener('click', () => {
        if (this.currentUser) {
          this.scrollToSection('#games');
        } else {
          this.openModal('loginModal');
        }
      });
    }

    if (learnMoreBtn) {
      learnMoreBtn.addEventListener('click', () => {
        this.scrollToSection('#platforms');
      });
    }

    // Window events
    window.addEventListener('scroll', () => this.handleScroll());
    window.addEventListener('resize', () => this.handleResize());
  }

  setupNavigation() {
    // Set up navigation highlighting on scroll
    this.handleScroll();
  }

  setupModals() {
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const modalId = btn.getAttribute('data-modal');
        if (modalId) {
          this.closeModal(modalId);
        }
      });
    });

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach((modal) => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });

    // Modal switchers
    const showSignupModal = document.getElementById('showSignupModal');
    const showLoginModal = document.getElementById('showLoginModal');

    if (showSignupModal) {
      showSignupModal.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeModal('loginModal');
        this.openModal('signupModal');
      });
    }

    if (showLoginModal) {
      showLoginModal.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeModal('signupModal');
        this.openModal('loginModal');
      });
    }

    // Auth buttons
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginBtn) {
      loginBtn.addEventListener('click', () => this.openModal('loginModal'));
    }

    if (signupBtn) {
      signupBtn.addEventListener('click', () => this.openModal('signupModal'));
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }
  }

  initializeSocket() {
    try {
      this.socket = io();

      this.socket.on('connect', () => {
        console.log('Connected to server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      this.socket.on('player-joined', (data) => {
        this.showToast(`${data.userId} joined the game!`, 'success');
      });

      this.socket.on('opponent-move', (data) => {
        if (this.currentGame) {
          this.currentGame.handleOpponentMove(data);
        }
      });
    } catch (error) {
      console.error('Socket initialization error:', error);
    }
  }

  async loadGames() {
    try {
      const response = await fetch('/api/games');
      if (response.ok) {
        const games = await response.json();
        this.renderGames(games);
      } else {
        throw new Error('Failed to load games');
      }
    } catch (error) {
      console.error('Error loading games:', error);
      this.showToast('Failed to load games', 'error');
    }
  }

  renderGames(games) {
    const gamesGrid = document.getElementById('gamesGrid');
    if (!gamesGrid) return;

    gamesGrid.innerHTML = games.map((game) => this.createGameCard(game)).join('');

    // Add event listeners to play buttons
    gamesGrid.querySelectorAll('.play-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const gameId = btn.getAttribute('data-game-id');
        this.playGame(gameId);
      });
    });

    // Add event listeners to favorite buttons
    gamesGrid.querySelectorAll('.favorite-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.toggle('active');
        this.showToast('Added to favorites!', 'success');
      });
    });
  }

  createGameCard(game) {
    const platformIcons = {
      web: 'fab fa-chrome',
      ios: 'fab fa-apple',
      android: 'fab fa-android',
      ps5: 'fab fa-playstation',
      windows: 'fab fa-windows',
      linux: 'fab fa-linux'
    };

    const gameIcons = {
      'puzzle-master': 'fas fa-puzzle-piece',
      'space-defender': 'fas fa-rocket',
      'coin-runner': 'fas fa-running',
      'strategy-empire': 'fas fa-crown'
    };

    return `
      <div class="game-card" data-game-id="${game.id}">
        <div class="game-banner">
          <i class="game-icon ${gameIcons[game.id] || 'fas fa-gamepad'}"></i>
        </div>
        <div class="game-content">
          <h3 class="game-title">${game.name}</h3>
          <p class="game-description">${game.description}</p>
          <div class="game-meta">
            <span class="game-category">${game.category}</span>
            <div class="game-rewards">
              <i class="fas fa-coins"></i>
              <span>${game.minCoinsReward}-${game.maxCoinsReward}</span>
            </div>
          </div>
          <div class="game-platforms">
            <div class="platforms-list">
              ${game.platforms.map((platform) => `
                <span class="platform-badge">
                  <i class="${platformIcons[platform] || 'fas fa-desktop'}"></i>
                  ${platform}
                </span>
              `).join('')}
            </div>
          </div>
          <div class="game-actions">
            <button class="play-btn" data-game-id="${game.id}">
              <i class="fas fa-play"></i>
              Play Now
            </button>
            <button class="favorite-btn">
              <i class="fas fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  async loadLeaderboard() {
    try {
      const response = await fetch('/api/leaderboard');
      if (response.ok) {
        const leaderboard = await response.json();
        this.renderLeaderboard(leaderboard);
      } else {
        throw new Error('Failed to load leaderboard');
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      this.showToast('Failed to load leaderboard', 'error');
    }
  }

  renderLeaderboard(leaderboard) {
    const leaderboardTable = document.getElementById('leaderboardTable');
    if (!leaderboardTable) return;

    const getRankClass = (rank) => {
      if (rank === 1) return 'gold';
      if (rank === 2) return 'silver';
      if (rank === 3) return 'bronze';
      return '';
    };

    const headerHtml = `
      <div class="leaderboard-header">
        <div>Rank</div>
        <div>Player</div>
        <div>Level</div>
        <div>Experience</div>
        <div>Coins</div>
      </div>
    `;

    const rowsHtml = leaderboard.map((player, index) => {
      const rank = index + 1;
      const rankClass = getRankClass(rank);

      return `
        <div class="leaderboard-row">
          <div class="rank ${rankClass}">#${rank}</div>
          <div class="player-info">
            <div class="player-avatar">${player.username.charAt(0).toUpperCase()}</div>
            <span class="player-name">${player.username}</span>
          </div>
          <div class="level-badge">${player.level}</div>
          <div class="experience-points">${player.experience.toLocaleString()}</div>
          <div class="coin-amount">
            <i class="fas fa-coins"></i>
            ${player.lionsunCoins.toLocaleString()}
          </div>
        </div>
      `;
    }).join('');

    leaderboardTable.innerHTML = headerHtml + rowsHtml;
  }

  checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.validateToken(token);
    }
  }

  async validateToken(token) {
    try {
      const response = await fetch('/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const user = await response.json();
        this.setCurrentUser(user);
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('authToken');
    }
  }

  setCurrentUser(user) {
    this.currentUser = user;
    this.updateUI();
  }

  updateUI() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const userMenu = document.getElementById('userMenu');
    const username = document.getElementById('username');
    const userCoins = document.getElementById('userCoins');
    const walletBalance = document.getElementById('walletBalance');
    const currentLevel = document.getElementById('currentLevel');
    const gamesPlayed = document.getElementById('gamesPlayed');

    if (this.currentUser) {
      // Hide auth buttons, show user menu
      if (loginBtn) loginBtn.classList.add('hidden');
      if (signupBtn) signupBtn.classList.add('hidden');
      if (userMenu) userMenu.classList.remove('hidden');

      // Update user info
      if (username) username.textContent = this.currentUser.username;
      if (userCoins) userCoins.textContent = this.currentUser.lionsunCoins.toLocaleString();
      if (walletBalance) walletBalance.textContent = this.currentUser.lionsunCoins.toLocaleString();
      if (currentLevel) currentLevel.textContent = this.currentUser.level;
      if (gamesPlayed) gamesPlayed.textContent = this.currentUser.gamesPlayed;
    } else {
      // Show auth buttons, hide user menu
      if (loginBtn) loginBtn.classList.remove('hidden');
      if (signupBtn) signupBtn.classList.remove('hidden');
      if (userMenu) userMenu.classList.add('hidden');
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    this.currentUser = null;
    this.updateUI();
    this.showToast('Logged out successfully', 'success');
  }

  async playGame(gameId) {
    if (!this.currentUser) {
      this.openModal('loginModal');
      return;
    }

    try {
      const response = await fetch('/api/game/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          gameType: gameId,
          platform: this.detectPlatform()
        })
      });

      if (response.ok) {
        const gameSession = await response.json();
        this.startGame(gameId, gameSession.sessionId);
      } else {
        throw new Error('Failed to start game');
      }
    } catch (error) {
      console.error('Error starting game:', error);
      this.showToast('Failed to start game', 'error');
    }
  }

  startGame(gameId, sessionId) {
    // Set game title
    const gameTitle = document.getElementById('gameTitle');
    if (gameTitle) {
      const gameNames = {
        'puzzle-master': 'Puzzle Master',
        'space-defender': 'Space Defender',
        'coin-runner': 'Coin Runner',
        'strategy-empire': 'Strategy Empire'
      };
      gameTitle.textContent = gameNames[gameId] || 'Game';
    }

    // Open game modal
    this.openModal('gameModal');

    // Initialize game based on type
    switch (gameId) {
      case 'puzzle-master':
        this.currentGame = new PuzzleGame(sessionId);
        break;
      case 'space-defender':
        this.currentGame = new SpaceDefender(sessionId);
        break;
      case 'coin-runner':
        this.currentGame = new CoinRunner(sessionId);
        break;
      case 'strategy-empire':
        this.currentGame = new StrategyEmpire(sessionId);
        break;
      default:
        this.currentGame = new DemoGame(sessionId);
    }

    // Setup game controls
    this.setupGameControls();
  }

  setupGameControls() {
    const startBtn = document.getElementById('startGameBtn');
    const pauseBtn = document.getElementById('pauseGameBtn');
    const resetBtn = document.getElementById('resetGameBtn');

    if (startBtn) {
      startBtn.onclick = () => {
        if (this.currentGame) {
          this.currentGame.start();
          startBtn.textContent = 'Resume';
        }
      };
    }

    if (pauseBtn) {
      pauseBtn.onclick = () => {
        if (this.currentGame) {
          this.currentGame.pause();
        }
      };
    }

    if (resetBtn) {
      resetBtn.onclick = () => {
        if (this.currentGame) {
          this.currentGame.reset();
          startBtn.textContent = 'Start Game';
        }
      };
    }
  }

  setupHeroGame() {
    // Simple animated demo for hero section
    const canvas = document.getElementById('heroGameCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    const particles = [];

    // Create particles
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        color: `hsl(${Math.random() * 60 + 30}, 70%, 60%)`
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(26, 26, 58, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  detectPlatform() {
    const userAgent = navigator.userAgent.toLowerCase();

    if (/android/.test(userAgent)) return 'android';
    if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
    if (/windows/.test(userAgent)) return 'windows';
    if (/linux/.test(userAgent)) return 'linux';
    if (/mac/.test(userAgent)) return 'web';

    return 'web';
  }

  scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  setActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.remove('active');
    });
    activeLink.classList.add('active');
  }

  handleScroll() {
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    // Add/remove navbar background on scroll
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 15, 35, 0.98)';
      } else {
        navbar.style.background = 'rgba(15, 15, 35, 0.95)';
      }
    }

    // Highlight current section in navigation
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  handleResize() {
    // Handle responsive adjustments
    const navMenu = document.getElementById('navMenu');
    if (navMenu && window.innerWidth > 992) {
      navMenu.classList.remove('active');
    }
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
    `;

    toastContainer.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.remove();
    }, 5000);

    // Remove on click
    toast.addEventListener('click', () => {
      toast.remove();
    });
  }
}

// Base Game Class for common functionality
class BaseGame {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.isRunning = false;
    this.isPaused = false;
    this.score = 0;
    this.coins = 0;
    this.startTime = null;
    this.setupCanvas();
  }

  setupCanvas() {
    if (!this.canvas) return;

    // Make canvas responsive
    this.canvas.width = 800;
    this.canvas.height = 600;
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.isPaused = false;
      this.startTime = Date.now();
      this.gameLoop();
    } else if (this.isPaused) {
      this.isPaused = false;
      this.gameLoop();
    }
  }

  pause() {
    this.isPaused = true;
  }

  reset() {
    this.isRunning = false;
    this.isPaused = false;
    this.score = 0;
    this.coins = 0;
    this.startTime = null;
    this.updateGameUI();
    this.clearCanvas();
  }

  gameLoop() {
    if (!this.isRunning || this.isPaused) return;

    this.update();
    this.render();
    this.updateGameUI();

    requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    // Override in subclasses
  }

  render() {
    // Override in subclasses
    if (this.ctx) {
      this.clearCanvas();
    }
  }

  clearCanvas() {
    if (this.ctx) {
      this.ctx.fillStyle = '#1a1a3a';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  updateGameUI() {
    const scoreElement = document.getElementById('gameScore');
    const coinsElement = document.getElementById('gameCoins');
    const timeElement = document.getElementById('gameTime');

    if (scoreElement) scoreElement.textContent = this.score.toLocaleString();
    if (coinsElement) coinsElement.textContent = this.coins.toLocaleString();

    if (timeElement && this.startTime) {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  async endGame() {
    this.isRunning = false;

    try {
      const duration = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;

      const response = await fetch('/api/game/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          score: this.score,
          duration
        })
      });

      if (response.ok) {
        const result = await response.json();
        this.showGameResults(result);
      } else {
        throw new Error('Failed to complete game');
      }
    } catch (error) {
      console.error('Error ending game:', error);
    }
  }

  showGameResults(result) {
    // You could show a results modal here
    app.showToast(`Game completed! Earned ${result.coinsEarned} coins!`, 'success');

    if (result.newLevel > app.currentUser.level) {
      app.showToast(`Level up! You're now level ${result.newLevel}!`, 'success');
    }

    // Update user data
    if (app.currentUser) {
      app.currentUser.lionsunCoins = result.totalCoins;
      app.currentUser.experience = result.totalExperience;
      app.currentUser.level = result.newLevel;
      app.updateUI();
    }
  }
}

// Demo Game Implementation
class DemoGame extends BaseGame {
  constructor(sessionId) {
    super(sessionId);
    this.player = {
      x: 400, y: 300, size: 20, color: '#f59e0b'
    };
    this.targets = [];
    this.setupControls();
  }

  setupControls() {
    if (!this.canvas) return;

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isRunning && !this.isPaused) {
        const rect = this.canvas.getBoundingClientRect();
        this.player.x = e.clientX - rect.left;
        this.player.y = e.clientY - rect.top;
      }
    });

    this.canvas.addEventListener('click', (e) => {
      if (this.isRunning && !this.isPaused) {
        this.score += 10;
        this.coins += 1;
      }
    });
  }

  update() {
    // Spawn targets randomly
    if (Math.random() < 0.02) {
      this.targets.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: 15,
        color: '#3b82f6'
      });
    }

    // Remove old targets
    this.targets = this.targets.filter((target, index) => {
      const distance = Math.sqrt((target.x - this.player.x) ** 2
        + (target.y - this.player.y) ** 2);

      if (distance < this.player.size + target.size) {
        this.score += 50;
        this.coins += 5;
        return false;
      }

      return index < 10; // Keep max 10 targets
    });

    // End game after 30 seconds
    if (this.startTime && Date.now() - this.startTime > 30000) {
      this.endGame();
    }
  }

  render() {
    this.clearCanvas();

    // Draw targets
    this.targets.forEach((target) => {
      this.ctx.fillStyle = target.color;
      this.ctx.beginPath();
      this.ctx.arc(target.x, target.y, target.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Draw player
    this.ctx.fillStyle = this.player.color;
    this.ctx.beginPath();
    this.ctx.arc(this.player.x, this.player.y, this.player.size, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw instructions
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '16px Arial';
    this.ctx.fillText('Move mouse to control player, click to score!', 10, 30);
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new LionsuncoinApp();
});
