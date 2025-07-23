// Game Implementations for Lionsuncoin Gaming Platform

// Puzzle Master Game
class PuzzleGame extends BaseGame {
  constructor(sessionId) {
    super(sessionId);
    this.gridSize = 4;
    this.tileSize = 80;
    this.tiles = [];
    this.emptyIndex = 15;
    this.moves = 0;
    this.isWin = false;
    this.initializePuzzle();
  }

  initializePuzzle() {
    // Create ordered tiles
    this.tiles = Array.from({ length: 15 }, (_, i) => i + 1);
    this.tiles.push(null); // Empty space

    // Shuffle tiles
    this.shuffleTiles();
    this.setupControls();
  }

  shuffleTiles() {
    // Ensure puzzle is solvable by making valid moves
    for (let i = 0; i < 1000; i++) {
      const validMoves = this.getValidMoves();
      if (validMoves.length > 0) {
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        this.moveTile(randomMove, false); // false = don't count as player move
      }
    }
    this.moves = 0;
  }

  getValidMoves() {
    const moves = [];
    const emptyRow = Math.floor(this.emptyIndex / this.gridSize);
    const emptyCol = this.emptyIndex % this.gridSize;

    // Check all four directions
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1] // up, down, left, right
    ];

    directions.forEach(([dRow, dCol]) => {
      const newRow = emptyRow + dRow;
      const newCol = emptyCol + dCol;

      if (newRow >= 0 && newRow < this.gridSize && newCol >= 0 && newCol < this.gridSize) {
        moves.push(newRow * this.gridSize + newCol);
      }
    });

    return moves;
  }

  setupControls() {
    if (!this.canvas) return;

    this.canvas.addEventListener('click', (e) => {
      if (!this.isRunning || this.isPaused || this.isWin) return;

      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const col = Math.floor(x / this.tileSize);
      const row = Math.floor(y / this.tileSize);
      const clickedIndex = row * this.gridSize + col;

      if (this.getValidMoves().includes(clickedIndex)) {
        this.moveTile(clickedIndex, true);
      }
    });
  }

  moveTile(tileIndex, countMove = true) {
    // Swap tile with empty space
    [this.tiles[tileIndex], this.tiles[this.emptyIndex]] = [this.tiles[this.emptyIndex], this.tiles[tileIndex]];
    this.emptyIndex = tileIndex;

    if (countMove) {
      this.moves++;
      this.score = Math.max(0, 1000 - this.moves * 10);
      this.coins = Math.floor(this.score / 100);

      if (this.checkWin()) {
        this.isWin = true;
        this.score += 500; // Bonus for winning
        this.coins += 50;
        setTimeout(() => this.endGame(), 1000);
      }
    }
  }

  checkWin() {
    for (let i = 0; i < 15; i++) {
      if (this.tiles[i] !== i + 1) return false;
    }
    return this.tiles[15] === null;
  }

  update() {
    // No continuous updates needed for puzzle game
  }

  render() {
    this.clearCanvas();

    // Draw grid
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;

    for (let i = 0; i <= this.gridSize; i++) {
      // Vertical lines
      this.ctx.beginPath();
      this.ctx.moveTo(i * this.tileSize, 0);
      this.ctx.lineTo(i * this.tileSize, this.gridSize * this.tileSize);
      this.ctx.stroke();

      // Horizontal lines
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * this.tileSize);
      this.ctx.lineTo(this.gridSize * this.tileSize, i * this.tileSize);
      this.ctx.stroke();
    }

    // Draw tiles
    this.ctx.font = '24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    for (let i = 0; i < 16; i++) {
      if (this.tiles[i] !== null) {
        const row = Math.floor(i / this.gridSize);
        const col = i % this.gridSize;
        const x = col * this.tileSize;
        const y = row * this.tileSize;

        // Tile background
        this.ctx.fillStyle = '#3b82f6';
        this.ctx.fillRect(x + 2, y + 2, this.tileSize - 4, this.tileSize - 4);

        // Tile number
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(this.tiles[i].toString(),
          x + this.tileSize / 2,
          y + this.tileSize / 2);
      }
    }

    // Draw instructions
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Moves: ${this.moves}`, 10, this.gridSize * this.tileSize + 30);
    this.ctx.fillText('Click tiles adjacent to empty space to move them', 10, this.gridSize * this.tileSize + 60);

    if (this.isWin) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.fillStyle = '#f59e0b';
      this.ctx.font = '32px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Puzzle Solved!', this.canvas.width / 2, this.canvas.height / 2);
    }
  }
}

// Space Defender Game
class SpaceDefender extends BaseGame {
  constructor(sessionId) {
    super(sessionId);
    this.player = {
      x: this.canvas.width / 2,
      y: this.canvas.height - 60,
      width: 40,
      height: 30,
      speed: 5
    };
    this.bullets = [];
    this.enemies = [];
    this.particles = [];
    this.keys = {};
    this.enemySpawnTimer = 0;
    this.setupControls();
  }

  setupControls() {
    if (!this.canvas) return;

    document.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'Space') {
        e.preventDefault();
        this.shootBullet();
      }
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Touch controls for mobile
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.shootBullet();
    });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      this.player.x = touch.clientX - rect.left - this.player.width / 2;
    });
  }

  shootBullet() {
    if (!this.isRunning || this.isPaused) return;

    this.bullets.push({
      x: this.player.x + this.player.width / 2,
      y: this.player.y,
      width: 3,
      height: 10,
      speed: 7
    });
  }

  spawnEnemy() {
    this.enemies.push({
      x: Math.random() * (this.canvas.width - 30),
      y: -30,
      width: 30,
      height: 20,
      speed: 1 + Math.random() * 2,
      health: 1
    });
  }

  createParticles(x, y, color = '#f59e0b') {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 30,
        maxLife: 30,
        color
      });
    }
  }

  update() {
    // Player movement
    if (this.keys.ArrowLeft || this.keys.KeyA) {
      this.player.x = Math.max(0, this.player.x - this.player.speed);
    }
    if (this.keys.ArrowRight || this.keys.KeyD) {
      this.player.x = Math.min(this.canvas.width - this.player.width, this.player.x + this.player.speed);
    }

    // Update bullets
    this.bullets = this.bullets.filter((bullet) => {
      bullet.y -= bullet.speed;
      return bullet.y > -bullet.height;
    });

    // Spawn enemies
    this.enemySpawnTimer++;
    if (this.enemySpawnTimer > 60) {
      this.spawnEnemy();
      this.enemySpawnTimer = 0;
    }

    // Update enemies
    this.enemies = this.enemies.filter((enemy) => {
      enemy.y += enemy.speed;

      // Check collision with player
      if (this.checkCollision(enemy, this.player)) {
        this.createParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#ef4444');
        this.score = Math.max(0, this.score - 100);
        return false;
      }

      return enemy.y < this.canvas.height + enemy.height;
    });

    // Check bullet-enemy collisions
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        if (this.checkCollision(this.bullets[i], this.enemies[j])) {
          this.createParticles(this.enemies[j].x + this.enemies[j].width / 2, this.enemies[j].y + this.enemies[j].height / 2);
          this.score += 100;
          this.coins += 10;
          this.bullets.splice(i, 1);
          this.enemies.splice(j, 1);
          break;
        }
      }
    }

    // Update particles
    this.particles = this.particles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
      return particle.life > 0;
    });

    // End game after 2 minutes
    if (this.startTime && Date.now() - this.startTime > 120000) {
      this.endGame();
    }
  }

  checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width
           && rect1.x + rect1.width > rect2.x
           && rect1.y < rect2.y + rect2.height
           && rect1.y + rect1.height > rect2.y;
  }

  render() {
    this.clearCanvas();

    // Draw player
    this.ctx.fillStyle = '#f59e0b';
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);

    // Draw bullets
    this.ctx.fillStyle = '#ffffff';
    this.bullets.forEach((bullet) => {
      this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw enemies
    this.ctx.fillStyle = '#ef4444';
    this.enemies.forEach((enemy) => {
      this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Draw particles
    this.particles.forEach((particle) => {
      const alpha = particle.life / particle.maxLife;
      this.ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      this.ctx.fillRect(particle.x, particle.y, 3, 3);
    });

    // Draw instructions
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '16px Arial';
    this.ctx.fillText('Arrow keys or A/D to move, Space or tap to shoot', 10, 30);
  }
}

// Coin Runner Game
class CoinRunner extends BaseGame {
  constructor(sessionId) {
    super(sessionId);
    this.player = {
      x: 100,
      y: this.canvas.height - 100,
      width: 30,
      height: 40,
      velY: 0,
      onGround: true,
      speed: 3
    };
    this.platforms = [];
    this.coins = [];
    this.obstacles = [];
    this.cameraX = 0;
    this.distance = 0;
    this.gravity = 0.5;
    this.jumpPower = -12;
    this.initializeLevel();
    this.setupControls();
  }

  initializeLevel() {
    // Create platforms
    for (let i = 0; i < 50; i++) {
      this.platforms.push({
        x: i * 200,
        y: this.canvas.height - 20,
        width: 200,
        height: 20
      });

      // Add floating platforms
      if (i > 5 && Math.random() < 0.3) {
        this.platforms.push({
          x: i * 200 + 50,
          y: this.canvas.height - 150 - Math.random() * 100,
          width: 100,
          height: 20
        });
      }
    }

    // Create coins
    for (let i = 0; i < 100; i++) {
      this.coins.push({
        x: Math.random() * 10000,
        y: Math.random() * (this.canvas.height - 200) + 50,
        width: 20,
        height: 20,
        collected: false
      });
    }

    // Create obstacles
    for (let i = 0; i < 30; i++) {
      this.obstacles.push({
        x: 500 + i * 300 + Math.random() * 200,
        y: this.canvas.height - 50,
        width: 30,
        height: 30
      });
    }
  }

  setupControls() {
    if (!this.canvas) return;

    document.addEventListener('keydown', (e) => {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && this.player.onGround) {
        e.preventDefault();
        this.jump();
      }
    });

    // Touch controls
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (this.player.onGround) {
        this.jump();
      }
    });
  }

  jump() {
    if (!this.isRunning || this.isPaused) return;

    this.player.velY = this.jumpPower;
    this.player.onGround = false;
  }

  update() {
    // Move player forward automatically
    this.player.x += this.player.speed;
    this.distance = Math.floor(this.player.x / 10);

    // Apply gravity
    this.player.velY += this.gravity;
    this.player.y += this.player.velY;

    // Check platform collisions
    this.player.onGround = false;
    this.platforms.forEach((platform) => {
      if (this.checkCollision(this.player, platform) && this.player.velY > 0) {
        this.player.y = platform.y - this.player.height;
        this.player.velY = 0;
        this.player.onGround = true;
      }
    });

    // Check coin collection
    this.coins.forEach((coin) => {
      if (!coin.collected && this.checkCollision(this.player, coin)) {
        coin.collected = true;
        this.score += 50;
        this.coins += 5;
      }
    });

    // Check obstacle collisions
    this.obstacles.forEach((obstacle) => {
      if (this.checkCollision(this.player, obstacle)) {
        this.endGame();
      }
    });

    // Update camera
    this.cameraX = this.player.x - this.canvas.width / 3;

    // End game if player falls too far
    if (this.player.y > this.canvas.height + 100) {
      this.endGame();
    }

    // Add distance bonus to score
    this.score += 1;
  }

  checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width
           && rect1.x + rect1.width > rect2.x
           && rect1.y < rect2.y + rect2.height
           && rect1.y + rect1.height > rect2.y;
  }

  render() {
    this.clearCanvas();

    // Save context for camera transformation
    this.ctx.save();
    this.ctx.translate(-this.cameraX, 0);

    // Draw platforms
    this.ctx.fillStyle = '#8b5cf6';
    this.platforms.forEach((platform) => {
      this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw coins
    this.ctx.fillStyle = '#f59e0b';
    this.coins.forEach((coin) => {
      if (!coin.collected) {
        this.ctx.beginPath();
        this.ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });

    // Draw obstacles
    this.ctx.fillStyle = '#ef4444';
    this.obstacles.forEach((obstacle) => {
      this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Draw player
    this.ctx.fillStyle = '#22c55e';
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);

    // Restore context
    this.ctx.restore();

    // Draw UI
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '16px Arial';
    this.ctx.fillText(`Distance: ${this.distance}m`, 10, 30);
    this.ctx.fillText('Space or tap to jump', 10, 60);
  }
}

// Strategy Empire Game (Simple version)
class StrategyEmpire extends BaseGame {
  constructor(sessionId) {
    super(sessionId);
    this.gridSize = 8;
    this.cellSize = 60;
    this.buildings = [];
    this.resources = { gold: 100, population: 10 };
    this.selectedCell = null;
    this.buildingTypes = [
      {
        name: 'House', cost: 50, produces: 'population', amount: 5
      },
      {
        name: 'Mine', cost: 100, produces: 'gold', amount: 20
      },
      {
        name: 'Farm', cost: 75, produces: 'food', amount: 15
      }
    ];
    this.setupControls();
  }

  setupControls() {
    if (!this.canvas) return;

    this.canvas.addEventListener('click', (e) => {
      if (!this.isRunning || this.isPaused) return;

      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const gridX = Math.floor(x / this.cellSize);
      const gridY = Math.floor(y / this.cellSize);

      if (gridX >= 0 && gridX < this.gridSize && gridY >= 0 && gridY < this.gridSize) {
        this.selectedCell = { x: gridX, y: gridY };
        this.handleCellClick(gridX, gridY);
      }
    });
  }

  handleCellClick(x, y) {
    const existingBuilding = this.buildings.find((b) => b.x === x && b.y === y);

    if (!existingBuilding) {
      // Try to build a house (simplest building)
      if (this.resources.gold >= 50) {
        this.buildings.push({
          x,
          y,
          type: 'House',
          age: 0
        });
        this.resources.gold -= 50;
        this.score += 100;
        this.coins += 10;
      }
    }
  }

  update() {
    // Update buildings and resources
    this.buildings.forEach((building) => {
      building.age++;

      // Produce resources every 60 frames (1 second at 60fps)
      if (building.age % 60 === 0) {
        const buildingType = this.buildingTypes.find((bt) => bt.name === building.type);
        if (buildingType) {
          if (buildingType.produces === 'gold') {
            this.resources.gold += buildingType.amount;
            this.score += 10;
            this.coins += 1;
          } else if (buildingType.produces === 'population') {
            this.resources.population += buildingType.amount;
          }
        }
      }
    });

    // Win condition: build 20 buildings
    if (this.buildings.length >= 20) {
      this.score += 1000;
      this.coins += 100;
      this.endGame();
    }
  }

  render() {
    this.clearCanvas();

    // Draw grid
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 1;

    for (let i = 0; i <= this.gridSize; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * this.cellSize, 0);
      this.ctx.lineTo(i * this.cellSize, this.gridSize * this.cellSize);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(0, i * this.cellSize);
      this.ctx.lineTo(this.gridSize * this.cellSize, i * this.cellSize);
      this.ctx.stroke();
    }

    // Highlight selected cell
    if (this.selectedCell) {
      this.ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
      this.ctx.fillRect(this.selectedCell.x * this.cellSize,
        this.selectedCell.y * this.cellSize,
        this.cellSize,
        this.cellSize);
    }

    // Draw buildings
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'center';
    this.buildings.forEach((building) => {
      this.ctx.fillStyle = '#3b82f6';
      this.ctx.fillRect(building.x * this.cellSize + 5,
        building.y * this.cellSize + 5,
        this.cellSize - 10,
        this.cellSize - 10);

      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillText(building.type[0], // First letter of building type
        building.x * this.cellSize + this.cellSize / 2,
        building.y * this.cellSize + this.cellSize / 2);
    });

    // Draw UI
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'left';
    const uiY = this.gridSize * this.cellSize + 20;
    this.ctx.fillText(`Gold: ${this.resources.gold}`, 10, uiY);
    this.ctx.fillText(`Population: ${this.resources.population}`, 150, uiY);
    this.ctx.fillText(`Buildings: ${this.buildings.length}/20`, 300, uiY);
    this.ctx.fillText('Click empty cells to build houses (50 gold)', 10, uiY + 30);
  }
}

// Export classes for use in main app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PuzzleGame, SpaceDefender, CoinRunner, StrategyEmpire
  };
}
