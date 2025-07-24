/**
 * Lionsun: The Roaring Quest - Game Engine
 * Complete 2D platformer with blockchain integration
 */

class LionsunGame {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = options.width || 1200;
        this.canvas.height = options.height || 800;
        
        // Game state
        this.gameState = 'menu'; // menu, playing, paused, gameover, victory
        this.currentLevel = 1;
        this.score = 0;
        this.lives = 3;
        this.coinsEarned = 0;
        this.memoryFragmentsCollected = 0;
        
        // Player (Star Mouse)
        this.player = {
            x: 100,
            y: 600,
            width: 32,
            height: 32,
            vx: 0,
            vy: 0,
            grounded: false,
            facing: 'right',
            health: 100,
            maxHealth: 100,
            abilities: {
                doubleJump: false,
                lightBeam: false,
                memoryVision: false
            },
            animations: {
                idle: { frames: 4, currentFrame: 0, timer: 0 },
                running: { frames: 6, currentFrame: 0, timer: 0 },
                jumping: { frames: 2, currentFrame: 0, timer: 0 }
            },
            currentAnimation: 'idle'
        };
        
        // Game physics
        this.gravity = 0.8;
        this.friction = 0.8;
        this.jumpPower = -15;
        this.moveSpeed = 5;
        
        // Camera
        this.camera = {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            smoothing: 0.1
        };
        
        // Game objects
        this.platforms = [];
        this.memoryFragments = [];
        this.enemies = [];
        this.lightBeams = [];
        this.barriers = [];
        this.collectibles = [];
        this.particles = [];
        
        // Input handling
        this.keys = {};
        this.setupInputHandlers();
        
        // Blockchain integration
        this.web3 = null;
        this.userAccount = null;
        this.lionsunCoinContract = null;
        this.lionsunNFTContract = null;
        
        // Asset loading
        this.assets = {
            images: {},
            sounds: {},
            loaded: false
        };
        
        // Level data
        this.levels = [];
        this.initializeLevels();
        
        // UI elements
        this.ui = {
            showDebug: false,
            notifications: [],
            dialogues: []
        };
        
        // Performance tracking
        this.lastFrameTime = 0;
        this.frameCount = 0;
        this.fps = 60;
        
        this.loadAssets().then(() => {
            this.initializeLevel(this.currentLevel);
            this.gameLoop();
        });
    }
    
    async loadAssets() {
        console.log('🎮 Loading Lionsun game assets...');
        
        // Load images
        const imagePromises = [
            this.loadImage('starMouse', '/assets/star-mouse-sprite.png'),
            this.loadImage('lionsun', '/assets/lionsun-sprite.png'),
            this.loadImage('memoryFragment', '/assets/memory-fragment.png'),
            this.loadImage('platform', '/assets/platform.png'),
            this.loadImage('background', '/assets/background.png'),
            this.loadImage('lightBeam', '/assets/light-beam.png'),
            this.loadImage('barrier', '/assets/barrier.png'),
            this.loadImage('enemy', '/assets/shadow-enemy.png'),
            this.loadImage('collectible', '/assets/lc-coin.png')
        ];
        
        // Load sounds
        const soundPromises = [
            this.loadSound('jump', '/assets/sounds/jump.mp3'),
            this.loadSound('collect', '/assets/sounds/collect.mp3'),
            this.loadSound('hurt', '/assets/sounds/hurt.mp3'),
            this.loadSound('victory', '/assets/sounds/victory.mp3'),
            this.loadSound('memoryFound', '/assets/sounds/memory-found.mp3'),
            this.loadSound('lightBeam', '/assets/sounds/light-beam.mp3'),
            this.loadSound('backgroundMusic', '/assets/sounds/background-music.mp3')
        ];
        
        try {
            await Promise.all([...imagePromises, ...soundPromises]);
            this.assets.loaded = true;
            console.log('✅ All assets loaded successfully');
        } catch (error) {
            console.warn('⚠️ Some assets failed to load:', error);
            this.assets.loaded = true; // Continue with fallbacks
        }
    }
    
    loadImage(key, src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.assets.images[key] = img;
                resolve();
            };
            img.onerror = () => {
                // Create colored rectangle as fallback
                const canvas = document.createElement('canvas');
                canvas.width = 32;
                canvas.height = 32;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = this.getColorForAsset(key);
                ctx.fillRect(0, 0, 32, 32);
                this.assets.images[key] = canvas;
                resolve();
            };
            img.src = src;
        });
    }
    
    loadSound(key, src) {
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.oncanplaythrough = () => {
                this.assets.sounds[key] = audio;
                resolve();
            };
            audio.onerror = () => {
                // Silent fallback
                this.assets.sounds[key] = { play: () => {}, pause: () => {} };
                resolve();
            };
            audio.src = src;
        });
    }
    
    getColorForAsset(key) {
        const colors = {
            starMouse: '#FFD700',
            lionsun: '#FF6B35',
            memoryFragment: '#8B5CF6',
            platform: '#1E3A8A',
            background: '#0F0F23',
            lightBeam: '#FFFFFF',
            barrier: '#FF0000',
            enemy: '#333333',
            collectible: '#FFD700'
        };
        return colors[key] || '#CCCCCC';
    }
    
    initializeLevels() {
        this.levels = [
            // Level 1: The Awakening
            {
                name: "The Awakening",
                description: "Star Mouse awakens in the mystical realm",
                platforms: [
                    { x: 0, y: 750, width: 1200, height: 50 },
                    { x: 300, y: 650, width: 200, height: 20 },
                    { x: 600, y: 550, width: 200, height: 20 },
                    { x: 900, y: 450, width: 200, height: 20 }
                ],
                memoryFragments: [
                    { x: 350, y: 600, type: 'hope', value: 10 },
                    { x: 650, y: 500, type: 'courage', value: 15 },
                    { x: 950, y: 400, type: 'strength', value: 20 }
                ],
                enemies: [
                    { x: 400, y: 720, type: 'shadow', health: 50 },
                    { x: 700, y: 720, type: 'doubt', health: 30 }
                ],
                barriers: [
                    { x: 500, y: 650, width: 50, height: 100, type: 'fear' }
                ],
                collectibles: [
                    { x: 200, y: 700, type: 'coin', value: 5 },
                    { x: 400, y: 620, type: 'coin', value: 5 },
                    { x: 800, y: 520, type: 'coin', value: 10 }
                ],
                lionsunPosition: { x: 1000, y: 350 },
                requiredFragments: 2,
                rewardLC: 100
            },
            // Level 2: Fragments of Memory
            {
                name: "Fragments of Memory",
                description: "Deeper into Lionsun's consciousness",
                platforms: [
                    { x: 0, y: 750, width: 300, height: 50 },
                    { x: 400, y: 700, width: 150, height: 20 },
                    { x: 650, y: 600, width: 100, height: 20 },
                    { x: 800, y: 500, width: 150, height: 20 },
                    { x: 1000, y: 400, width: 200, height: 20 }
                ],
                memoryFragments: [
                    { x: 450, y: 650, type: 'love', value: 25 },
                    { x: 675, y: 550, type: 'wisdom', value: 30 },
                    { x: 1050, y: 350, type: 'power', value: 35 }
                ],
                enemies: [
                    { x: 500, y: 670, type: 'shadow', health: 60 },
                    { x: 750, y: 720, type: 'regret', health: 40 },
                    { x: 900, y: 470, type: 'shadow', health: 50 }
                ],
                barriers: [
                    { x: 350, y: 650, width: 30, height: 100, type: 'sadness' },
                    { x: 750, y: 550, width: 40, height: 150, type: 'anger' }
                ],
                lightBeams: [
                    { x: 200, y: 750, direction: 'up', length: 200 }
                ],
                collectibles: [
                    { x: 100, y: 700, type: 'coin', value: 10 },
                    { x: 550, y: 650, type: 'coin', value: 10 },
                    { x: 850, y: 450, type: 'heart', value: 20 }
                ],
                lionsunPosition: { x: 1100, y: 300 },
                requiredFragments: 3,
                rewardLC: 150
            }
        ];
    }
    
    initializeLevel(levelNum) {
        if (levelNum > this.levels.length) {
            this.gameState = 'victory';
            return;
        }
        
        const level = this.levels[levelNum - 1];
        
        // Reset player position
        this.player.x = 100;
        this.player.y = 600;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.health = this.player.maxHealth;
        
        // Load level data
        this.platforms = [...level.platforms];
        this.memoryFragments = [...level.memoryFragments];
        this.enemies = [...level.enemies];
        this.barriers = [...level.barriers];
        this.collectibles = [...level.collectibles];
        this.lightBeams = level.lightBeams || [];
        
        // Reset camera
        this.camera.x = 0;
        this.camera.y = 0;
        
        // Clear particles and effects
        this.particles = [];
        
        console.log(`🎮 Level ${levelNum} initialized: ${level.name}`);
        this.showNotification(`Level ${levelNum}: ${level.name}`, 3000);
    }
    
    setupInputHandlers() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Handle special actions
            if (e.code === 'Space' && this.gameState === 'playing') {
                this.playerJump();
            }
            if (e.code === 'KeyE' && this.gameState === 'playing') {
                this.activateLightBeam();
            }
            if (e.code === 'Escape') {
                this.togglePause();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Touch controls for mobile
        this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouch.bind(this));
    }
    
    handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        // Simple touch controls
        if (x < this.canvas.width / 3) {
            this.keys['ArrowLeft'] = true;
        } else if (x > this.canvas.width * 2 / 3) {
            this.keys['ArrowRight'] = true;
        } else {
            this.playerJump();
        }
    }
    
    gameLoop() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        
        // Calculate FPS
        this.frameCount++;
        if (this.frameCount % 60 === 0) {
            this.fps = Math.round(1000 / deltaTime);
        }
        
        // Update game state
        if (this.gameState === 'playing') {
            this.updateGame(deltaTime);
        }
        
        // Render game
        this.render();
        
        // Continue loop
        requestAnimationFrame(() => this.gameLoop());
    }
    
    updateGame(deltaTime) {
        this.updatePlayer(deltaTime);
        this.updateEnemies(deltaTime);
        this.updateParticles(deltaTime);
        this.updateCamera();
        this.updateAnimations(deltaTime);
        this.checkCollisions();
        this.updateUI(deltaTime);
    }
    
    updatePlayer(deltaTime) {
        // Handle input
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            this.player.vx = -this.moveSpeed;
            this.player.facing = 'left';
            this.player.currentAnimation = 'running';
        } else if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            this.player.vx = this.moveSpeed;
            this.player.facing = 'right';
            this.player.currentAnimation = 'running';
        } else {
            this.player.vx *= this.friction;
            if (Math.abs(this.player.vx) < 0.1) {
                this.player.vx = 0;
                this.player.currentAnimation = 'idle';
            }
        }
        
        // Apply gravity
        if (!this.player.grounded) {
            this.player.vy += this.gravity;
            this.player.currentAnimation = 'jumping';
        }
        
        // Update position
        this.player.x += this.player.vx;
        this.player.y += this.player.vy;
        
        // Check platform collisions
        this.player.grounded = false;
        for (const platform of this.platforms) {
            if (this.checkRectCollision(this.player, platform)) {
                if (this.player.vy > 0) { // Falling
                    this.player.y = platform.y - this.player.height;
                    this.player.vy = 0;
                    this.player.grounded = true;
                }
            }
        }
        
        // Keep player in bounds
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.y > this.canvas.height) {
            this.takeDamage(25);
            this.player.y = 600; // Respawn
        }
    }
    
    updateEnemies(deltaTime) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Simple AI: move towards player
            const dx = this.player.x - enemy.x;
            const distance = Math.abs(dx);
            
            if (distance < 200) { // Detection range
                enemy.x += Math.sign(dx) * 1;
            }
            
            // Remove defeated enemies
            if (enemy.health <= 0) {
                this.createParticleExplosion(enemy.x, enemy.y, '#8B5CF6');
                this.enemies.splice(i, 1);
                this.score += 50;
                this.awardLC(5);
            }
        }
    }
    
    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2; // Gravity
            particle.life -= deltaTime;
            particle.alpha = particle.life / particle.maxLife;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    updateCamera() {
        // Follow player
        this.camera.targetX = this.player.x - this.canvas.width / 2;
        this.camera.targetY = this.player.y - this.canvas.height / 2;
        
        // Smooth camera movement
        this.camera.x += (this.camera.targetX - this.camera.x) * this.camera.smoothing;
        this.camera.y += (this.camera.targetY - this.camera.y) * this.camera.smoothing;
        
        // Keep camera in bounds
        this.camera.x = Math.max(0, this.camera.x);
        this.camera.y = Math.max(-200, Math.min(0, this.camera.y));
    }
    
    updateAnimations(deltaTime) {
        const anim = this.player.animations[this.player.currentAnimation];
        anim.timer += deltaTime;
        
        if (anim.timer > 150) { // 150ms per frame
            anim.currentFrame = (anim.currentFrame + 1) % anim.frames;
            anim.timer = 0;
        }
    }
    
    updateUI(deltaTime) {
        // Update notifications
        for (let i = this.ui.notifications.length - 1; i >= 0; i--) {
            const notification = this.ui.notifications[i];
            notification.timer -= deltaTime;
            
            if (notification.timer <= 0) {
                this.ui.notifications.splice(i, 1);
            }
        }
    }
    
    checkCollisions() {
        // Memory fragments
        for (let i = this.memoryFragments.length - 1; i >= 0; i--) {
            const fragment = this.memoryFragments[i];
            if (this.checkRectCollision(this.player, fragment)) {
                this.collectMemoryFragment(fragment);
                this.memoryFragments.splice(i, 1);
            }
        }
        
        // Collectibles
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const collectible = this.collectibles[i];
            if (this.checkRectCollision(this.player, collectible)) {
                this.collectItem(collectible);
                this.collectibles.splice(i, 1);
            }
        }
        
        // Enemies
        for (const enemy of this.enemies) {
            if (this.checkRectCollision(this.player, enemy)) {
                this.takeDamage(10);
                // Knockback
                this.player.vx = Math.sign(this.player.x - enemy.x) * 5;
                this.player.vy = -5;
            }
        }
        
        // Check level completion
        const level = this.levels[this.currentLevel - 1];
        if (this.memoryFragmentsCollected >= level.requiredFragments) {
            const lionsun = level.lionsunPosition;
            if (this.checkRectCollision(this.player, { ...lionsun, width: 64, height: 64 })) {
                this.completeLevel();
            }
        }
    }
    
    checkRectCollision(rect1, rect2) {
        return rect1.x < rect2.x + (rect2.width || 32) &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + (rect2.height || 32) &&
               rect1.y + rect1.height > rect2.y;
    }
    
    playerJump() {
        if (this.player.grounded) {
            this.player.vy = this.jumpPower;
            this.player.grounded = false;
            this.playSound('jump');
        }
    }
    
    activateLightBeam() {
        if (!this.player.abilities.lightBeam) return;
        
        // Create light beam to break barriers
        const beam = {
            x: this.player.x + this.player.width / 2,
            y: this.player.y,
            direction: this.player.facing,
            length: 100,
            life: 1000
        };
        
        this.lightBeams.push(beam);
        this.playSound('lightBeam');
        
        // Check for barrier destruction
        for (let i = this.barriers.length - 1; i >= 0; i--) {
            const barrier = this.barriers[i];
            if (this.checkRectCollision(beam, barrier)) {
                this.createParticleExplosion(barrier.x, barrier.y, '#FFFFFF');
                this.barriers.splice(i, 1);
                this.score += 100;
            }
        }
    }
    
    collectMemoryFragment(fragment) {
        this.memoryFragmentsCollected++;
        this.score += fragment.value * 10;
        this.awardLC(fragment.value);
        
        this.createParticleExplosion(fragment.x, fragment.y, '#8B5CF6');
        this.playSound('memoryFound');
        this.showNotification(`Memory Fragment: ${fragment.type} (+${fragment.value} LC)`, 2000);
        
        // Unlock abilities based on fragments
        if (this.memoryFragmentsCollected >= 2) {
            this.player.abilities.lightBeam = true;
            if (!this.player.abilities.lightBeam) {
                this.showNotification('Light Beam ability unlocked! Press E to use', 4000);
            }
        }
    }
    
    collectItem(item) {
        if (item.type === 'coin') {
            this.score += item.value;
            this.awardLC(item.value);
            this.playSound('collect');
        } else if (item.type === 'heart') {
            this.player.health = Math.min(this.player.maxHealth, this.player.health + item.value);
            this.playSound('collect');
        }
        
        this.createParticleExplosion(item.x, item.y, '#FFD700');
        this.showNotification(`+${item.value} ${item.type}`, 1000);
    }
    
    takeDamage(amount) {
        this.player.health -= amount;
        this.playSound('hurt');
        this.createParticleExplosion(this.player.x, this.player.y, '#FF0000');
        
        if (this.player.health <= 0) {
            this.lives--;
            if (this.lives <= 0) {
                this.gameState = 'gameover';
            } else {
                this.player.health = this.player.maxHealth;
                this.initializeLevel(this.currentLevel); // Restart level
            }
        }
    }
    
    completeLevel() {
        const level = this.levels[this.currentLevel - 1];
        this.awardLC(level.rewardLC);
        this.score += 1000;
        
        this.playSound('victory');
        this.showNotification(`Level Complete! +${level.rewardLC} LC`, 3000);
        
        // Award NFT for level completion
        this.awardNFT('completion', this.currentLevel);
        
        this.currentLevel++;
        if (this.currentLevel > this.levels.length) {
            this.gameState = 'victory';
        } else {
            setTimeout(() => {
                this.initializeLevel(this.currentLevel);
            }, 2000);
        }
    }
    
    awardLC(amount) {
        this.coinsEarned += amount;
        
        // Send to blockchain if connected
        if (this.userAccount && this.lionsunCoinContract) {
            this.distributeBlockchainReward(amount);
        }
    }
    
    async awardNFT(type, level) {
        if (!this.userAccount || !this.lionsunNFTContract) return;
        
        try {
            // Determine NFT type and rarity based on achievement
            let collectionType = 0; // MEMORY_SHARD
            let rarity = 1; // RARE
            let gameBonus = 500; // 5%
            let stakingBonus = 300; // 3%
            
            if (type === 'completion' && level === 1) {
                collectionType = 3; // PIONEER_BADGE
                rarity = 3; // LEGENDARY
                gameBonus = 1000; // 10%
                stakingBonus = 500; // 5%
            }
            
            const attributes = JSON.stringify({
                type: type,
                level: level,
                timestamp: Date.now(),
                achievement: `Completed Level ${level}`
            });
            
            await this.lionsunNFTContract.mintNFT(
                this.userAccount,
                collectionType,
                rarity,
                gameBonus,
                stakingBonus,
                attributes
            );
            
            this.showNotification('NFT Reward Earned!', 3000);
        } catch (error) {
            console.error('Failed to award NFT:', error);
        }
    }
    
    async distributeBlockchainReward(amount) {
        try {
            const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');
            await this.lionsunCoinContract.methods
                .distributeGameReward(this.userAccount, amountWei, 'lionsun-game')
                .send({ from: this.userAccount });
        } catch (error) {
            console.error('Failed to distribute LC reward:', error);
        }
    }
    
    createParticleExplosion(x, y, color) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                color: color,
                life: 1000,
                maxLife: 1000,
                alpha: 1,
                size: Math.random() * 4 + 2
            });
        }
    }
    
    showNotification(text, duration = 2000) {
        this.ui.notifications.push({
            text: text,
            timer: duration,
            alpha: 1
        });
    }
    
    playSound(soundName) {
        if (this.assets.sounds[soundName]) {
            this.assets.sounds[soundName].currentTime = 0;
            this.assets.sounds[soundName].play().catch(() => {});
        }
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Save context for camera
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Render background
        this.renderBackground();
        
        // Render game objects
        this.renderPlatforms();
        this.renderBarriers();
        this.renderMemoryFragments();
        this.renderCollectibles();
        this.renderEnemies();
        this.renderPlayer();
        this.renderLightBeams();
        this.renderParticles();
        this.renderLionsun();
        
        // Restore context
        this.ctx.restore();
        
        // Render UI (not affected by camera)
        this.renderUI();
        
        // Render game state overlays
        if (this.gameState === 'paused') {
            this.renderPauseScreen();
        } else if (this.gameState === 'gameover') {
            this.renderGameOverScreen();
        } else if (this.gameState === 'victory') {
            this.renderVictoryScreen();
        }
    }
    
    renderBackground() {
        // Gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1E3A8A');
        gradient.addColorStop(1, '#0F0F23');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(this.camera.x, this.camera.y, this.canvas.width, this.canvas.height);
        
        // Stars
        this.ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 50; i++) {
            const x = (i * 137) % (this.canvas.width + this.camera.x);
            const y = (i * 97) % (this.canvas.height + this.camera.y);
            this.ctx.fillRect(x, y, 2, 2);
        }
    }
    
    renderPlatforms() {
        this.ctx.fillStyle = '#1E3A8A';
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 2;
        
        for (const platform of this.platforms) {
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        }
    }
    
    renderPlayer() {
        const anim = this.player.animations[this.player.currentAnimation];
        const frame = anim.currentFrame;
        
        this.ctx.save();
        
        // Flip sprite if facing left
        if (this.player.facing === 'left') {
            this.ctx.scale(-1, 1);
            this.ctx.translate(-this.player.x - this.player.width, 0);
        }
        
        // Draw player (Star Mouse)
        if (this.assets.images.starMouse) {
            this.ctx.drawImage(
                this.assets.images.starMouse,
                frame * 32, 0, 32, 32,
                this.player.x, this.player.y, this.player.width, this.player.height
            );
        } else {
            // Fallback rectangle
            this.ctx.fillStyle = '#FFD700';
            this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
            
            // Add simple face
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(this.player.x + 8, this.player.y + 8, 4, 4);
            this.ctx.fillRect(this.player.x + 20, this.player.y + 8, 4, 4);
            this.ctx.fillRect(this.player.x + 12, this.player.y + 20, 8, 2);
        }
        
        this.ctx.restore();
        
        // Health bar
        const barWidth = 40;
        const barHeight = 6;
        const barX = this.player.x;
        const barY = this.player.y - 15;
        
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(barX, barY, barWidth, barHeight);
        
        this.ctx.fillStyle = '#00FF00';
        const healthPercent = this.player.health / this.player.maxHealth;
        this.ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    }
    
    renderMemoryFragments() {
        for (const fragment of this.memoryFragments) {
            // Glowing effect
            this.ctx.save();
            this.ctx.shadowColor = '#8B5CF6';
            this.ctx.shadowBlur = 20;
            
            if (this.assets.images.memoryFragment) {
                this.ctx.drawImage(
                    this.assets.images.memoryFragment,
                    fragment.x, fragment.y, 32, 32
                );
            } else {
                this.ctx.fillStyle = '#8B5CF6';
                this.ctx.fillRect(fragment.x, fragment.y, 32, 32);
            }
            
            this.ctx.restore();
            
            // Floating animation
            const floatOffset = Math.sin(Date.now() * 0.005 + fragment.x) * 5;
            fragment.y += floatOffset * 0.01;
        }
    }
    
    renderCollectibles() {
        for (const collectible of this.collectibles) {
            this.ctx.save();
            this.ctx.shadowColor = '#FFD700';
            this.ctx.shadowBlur = 15;
            
            if (this.assets.images.collectible) {
                this.ctx.drawImage(
                    this.assets.images.collectible,
                    collectible.x, collectible.y, 24, 24
                );
            } else {
                this.ctx.fillStyle = collectible.type === 'coin' ? '#FFD700' : '#FF6B35';
                this.ctx.fillRect(collectible.x, collectible.y, 24, 24);
            }
            
            this.ctx.restore();
        }
    }
    
    renderEnemies() {
        for (const enemy of this.enemies) {
            if (this.assets.images.enemy) {
                this.ctx.drawImage(
                    this.assets.images.enemy,
                    enemy.x, enemy.y, 32, 32
                );
            } else {
                this.ctx.fillStyle = '#333333';
                this.ctx.fillRect(enemy.x, enemy.y, 32, 32);
            }
            
            // Enemy health bar
            const barWidth = 30;
            const barHeight = 4;
            const barX = enemy.x;
            const barY = enemy.y - 10;
            
            this.ctx.fillStyle = '#FF0000';
            this.ctx.fillRect(barX, barY, barWidth, barHeight);
            
            this.ctx.fillStyle = '#FFFF00';
            const healthPercent = enemy.health / 50; // Assuming 50 max health
            this.ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        }
    }
    
    renderBarriers() {
        for (const barrier of this.barriers) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.7;
            this.ctx.fillStyle = '#FF0000';
            this.ctx.fillRect(barrier.x, barrier.y, barrier.width, barrier.height);
            
            // Add electric effect
            this.ctx.strokeStyle = '#FFFF00';
            this.ctx.lineWidth = 2;
            for (let i = 0; i < 5; i++) {
                const x = barrier.x + Math.random() * barrier.width;
                const y = barrier.y + Math.random() * barrier.height;
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20);
                this.ctx.stroke();
            }
            
            this.ctx.restore();
        }
    }
    
    renderLightBeams() {
        for (let i = this.lightBeams.length - 1; i >= 0; i--) {
            const beam = this.lightBeams[i];
            
            this.ctx.save();
            this.ctx.globalAlpha = beam.life / 1000;
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.shadowColor = '#FFFFFF';
            this.ctx.shadowBlur = 20;
            
            if (beam.direction === 'right') {
                this.ctx.fillRect(beam.x, beam.y, beam.length, 10);
            } else {
                this.ctx.fillRect(beam.x - beam.length, beam.y, beam.length, 10);
            }
            
            this.ctx.restore();
            
            beam.life -= 16; // Roughly 60fps
            if (beam.life <= 0) {
                this.lightBeams.splice(i, 1);
            }
        }
    }
    
    renderParticles() {
        for (const particle of this.particles) {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
            this.ctx.restore();
        }
    }
    
    renderLionsun() {
        const level = this.levels[this.currentLevel - 1];
        if (!level) return;
        
        const lionsun = level.lionsunPosition;
        
        // Only show if enough fragments collected
        if (this.memoryFragmentsCollected >= level.requiredFragments) {
            this.ctx.save();
            this.ctx.shadowColor = '#FF6B35';
            this.ctx.shadowBlur = 30;
            
            if (this.assets.images.lionsun) {
                this.ctx.drawImage(
                    this.assets.images.lionsun,
                    lionsun.x, lionsun.y, 64, 64
                );
            } else {
                this.ctx.fillStyle = '#FF6B35';
                this.ctx.fillRect(lionsun.x, lionsun.y, 64, 64);
            }
            
            this.ctx.restore();
            
            // Interaction prompt
            const distance = Math.abs(this.player.x - lionsun.x) + Math.abs(this.player.y - lionsun.y);
            if (distance < 100) {
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.font = '16px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('Press SPACE to free Lionsun!', lionsun.x + 32, lionsun.y - 20);
            }
        }
    }
    
    renderUI() {
        // Game stats
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'left';
        
        this.ctx.fillText(`Score: ${this.score}`, 20, 30);
        this.ctx.fillText(`LC Earned: ${this.coinsEarned}`, 20, 55);
        this.ctx.fillText(`Lives: ${this.lives}`, 20, 80);
        this.ctx.fillText(`Level: ${this.currentLevel}`, 20, 105);
        this.ctx.fillText(`Memory Fragments: ${this.memoryFragmentsCollected}`, 20, 130);
        
        // Abilities
        this.ctx.fillText('Abilities:', 20, 165);
        this.ctx.fillStyle = this.player.abilities.lightBeam ? '#00FF00' : '#666666';
        this.ctx.fillText('• Light Beam (E)', 30, 185);
        
        // Notifications
        for (let i = 0; i < this.ui.notifications.length; i++) {
            const notification = this.ui.notifications[i];
            this.ctx.save();
            this.ctx.globalAlpha = notification.alpha;
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                notification.text,
                this.canvas.width / 2,
                100 + i * 30
            );
            this.ctx.restore();
        }
        
        // Debug info
        if (this.ui.showDebug) {
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = '12px monospace';
            this.ctx.textAlign = 'right';
            this.ctx.fillText(`FPS: ${this.fps}`, this.canvas.width - 20, 20);
            this.ctx.fillText(`Player: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`, this.canvas.width - 20, 35);
            this.ctx.fillText(`Camera: ${Math.round(this.camera.x)}, ${Math.round(this.camera.y)}`, this.canvas.width - 20, 50);
        }
    }
    
    renderPauseScreen() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Press ESC to resume', this.canvas.width / 2, this.canvas.height / 2 + 50);
        this.ctx.restore();
    }
    
    renderGameOverScreen() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#FF0000';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText(`LC Earned: ${this.coinsEarned}`, this.canvas.width / 2, this.canvas.height / 2 + 30);
        this.ctx.fillText('Refresh to try again', this.canvas.width / 2, this.canvas.height / 2 + 80);
        this.ctx.restore();
    }
    
    renderVictoryScreen() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('VICTORY!', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Lionsun is free!', this.canvas.width / 2, this.canvas.height / 2 - 10);
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        this.ctx.fillText(`Total LC Earned: ${this.coinsEarned}`, this.canvas.width / 2, this.canvas.height / 2 + 50);
        this.ctx.fillText('Thank you for playing!', this.canvas.width / 2, this.canvas.height / 2 + 100);
        this.ctx.restore();
    }
    
    // Blockchain integration methods
    async connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                this.web3 = new Web3(window.ethereum);
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                this.userAccount = accounts[0];
                
                // Initialize contracts (you'll need to set these addresses after deployment)
                const LC_CONTRACT_ADDRESS = 'YOUR_LC_CONTRACT_ADDRESS';
                const NFT_CONTRACT_ADDRESS = 'YOUR_NFT_CONTRACT_ADDRESS';
                
                this.lionsunCoinContract = new this.web3.eth.Contract(LC_ABI, LC_CONTRACT_ADDRESS);
                this.lionsunNFTContract = new this.web3.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS);
                
                this.showNotification('Wallet connected!', 3000);
                return true;
            } catch (error) {
                console.error('Failed to connect wallet:', error);
                this.showNotification('Failed to connect wallet', 3000);
                return false;
            }
        } else {
            this.showNotification('No Web3 wallet detected', 3000);
            return false;
        }
    }
    
    // Game control methods
    startGame() {
        this.gameState = 'playing';
        this.currentLevel = 1;
        this.score = 0;
        this.lives = 3;
        this.coinsEarned = 0;
        this.memoryFragmentsCollected = 0;
        this.initializeLevel(1);
        
        // Start background music
        if (this.assets.sounds.backgroundMusic) {
            this.assets.sounds.backgroundMusic.loop = true;
            this.assets.sounds.backgroundMusic.volume = 0.3;
            this.assets.sounds.backgroundMusic.play().catch(() => {});
        }
    }
    
    toggleDebug() {
        this.ui.showDebug = !this.ui.showDebug;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LionsunGame;
}