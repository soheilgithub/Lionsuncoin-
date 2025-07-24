import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { emotionDetector, EmotionData } from '../utils/EmotionDetection';

// Types for AI Level Generation
interface PlayerProfile {
  id: string;
  skillLevel: number; // 0-100
  emotionalState: 'excited' | 'frustrated' | 'focused' | 'bored' | 'challenged';
  playTime: number;
  preferredDifficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  completedLevels: number;
  averageCompletionTime: number;
  itemsCollected: number;
  deathCount: number;
  consecutiveWins: number;
  lastPlaySession: Date;
}

interface GeneratedLevel {
  id: string;
  name: string;
  theme: string;
  difficulty: number;
  environment: {
    type: 'forest' | 'cave' | 'mountain' | 'cosmic' | 'urban' | 'underwater';
    weather: 'sunny' | 'rainy' | 'stormy' | 'foggy' | 'clear';
    timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
  };
  enemies: Array<{
    type: string;
    count: number;
    difficulty: number;
    behavior: 'passive' | 'aggressive' | 'strategic' | 'random';
  }>;
  obstacles: Array<{
    type: string;
    intensity: number;
    placement: 'scattered' | 'clustered' | 'path-blocking';
  }>;
  rewards: Array<{
    type: 'coin' | 'powerup' | 'health' | 'special';
    value: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }>;
  music: {
    genre: 'epic' | 'ambient' | 'intense' | 'peaceful' | 'mysterious';
    tempo: 'slow' | 'medium' | 'fast' | 'variable';
  };
  specialFeatures: string[];
  aiPersonalization: {
    adaptedFor: string;
    confidenceScore: number;
    reasoningTags: string[];
  };
}

const Container = styled(motion.div)`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 20px;
  padding: 2rem;
  margin: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 2px solid #ffd700;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  .subtitle {
    color: #a0a0a0;
    font-size: 1.1rem;
  }
`;

const AISection = styled(motion.div)`
  background: rgba(255, 215, 0, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  margin: 1rem 0;
  border: 1px solid rgba(255, 215, 0, 0.3);
`;

const GenerationStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  
  .status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #00ff00;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const LevelCard = styled(motion.div)`
  background: linear-gradient(135deg, #2a2a4e 0%, #1e1e3f 100%);
  border-radius: 15px;
  padding: 1.5rem;
  margin: 1rem 0;
  border: 1px solid #4a4a6a;
  
  &:hover {
    border-color: #ffd700;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 215, 0, 0.2);
  }
`;

const LevelHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
  
  .level-name {
    font-size: 1.4rem;
    font-weight: bold;
    color: #ffd700;
  }
  
  .difficulty-badge {
    background: linear-gradient(45deg, #ff6b6b, #ee5a24);
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: bold;
  }
`;

const LevelDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  
  .detail-section {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    padding: 1rem;
    
    h4 {
      color: #ffd700;
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }
    
    ul {
      list-style: none;
      padding: 0;
      
      li {
        color: #e0e0e0;
        margin-bottom: 0.3rem;
        font-size: 0.9rem;
        
        &::before {
          content: "→ ";
          color: #ffd700;
        }
      }
    }
  }
`;

const AIInsights = styled.div`
  background: linear-gradient(135deg, #4a90e2 0%, #7b68ee 100%);
  border-radius: 10px;
  padding: 1rem;
  margin-top: 1rem;
  
  .ai-tag {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 0.2rem 0.6rem;
    border-radius: 15px;
    font-size: 0.8rem;
    margin: 0.2rem;
    display: inline-block;
  }
`;

const GenerateButton = styled(motion.button)`
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  color: #1a1a2e;
  border: none;
  border-radius: 25px;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  margin: 1rem 0;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 215, 0, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const AILevelGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<GeneratedLevel | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null);
  const [emotionDetectionEnabled, setEmotionDetectionEnabled] = useState(false);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>({
    id: 'player_001',
    skillLevel: 65,
    emotionalState: 'focused',
    playTime: 1250,
    preferredDifficulty: 'adaptive',
    completedLevels: 12,
    averageCompletionTime: 245,
    itemsCollected: 89,
    deathCount: 23,
    consecutiveWins: 3,
    lastPlaySession: new Date()
  });

  // Initialize emotion detection
  useEffect(() => {
    const initEmotionDetection = async () => {
      const initialized = await emotionDetector.initialize();
      if (initialized) {
        setEmotionDetectionEnabled(true);
        emotionDetector.onEmotionDetected((emotion) => {
          setCurrentEmotion(emotion);
          // Auto-update player emotional state
          setPlayerProfile(prev => ({
            ...prev,
            emotionalState: mapEmotionToGameState(emotion.primary)
          }));
        });
        // Start privacy mode by default (no camera/mic)
        emotionDetector.enablePrivacyMode();
      }
    };
    
    initEmotionDetection();
    
    return () => {
      emotionDetector.stopDetection();
    };
  }, []);

  // Map AI emotion to game emotional state
  const mapEmotionToGameState = (emotion: string): PlayerProfile['emotionalState'] => {
    const mapping: Record<string, PlayerProfile['emotionalState']> = {
      happy: 'excited',
      excited: 'excited',
      frustrated: 'frustrated',
      focused: 'focused',
      bored: 'bored',
      challenged: 'challenged',
      calm: 'focused',
      angry: 'frustrated'
    };
    return mapping[emotion] || 'focused';
  };

  // AI Level Generation Algorithm
  const generateLevel = useCallback(async (): Promise<GeneratedLevel> => {
    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // AI Decision Making based on player profile
    const adaptDifficulty = () => {
      let baseDifficulty = playerProfile.skillLevel / 100;
      
      // Emotional state adjustments
      switch (playerProfile.emotionalState) {
        case 'frustrated':
          baseDifficulty -= 0.2; // Make it easier
          break;
        case 'bored':
          baseDifficulty += 0.3; // Increase challenge
          break;
        case 'excited':
          baseDifficulty += 0.1; // Slight increase
          break;
        case 'focused':
          // Keep optimal challenge
          break;
        case 'challenged':
          baseDifficulty += 0.15;
          break;
      }
      
      // Consecutive wins adjustment
      if (playerProfile.consecutiveWins > 5) {
        baseDifficulty += 0.25;
      } else if (playerProfile.deathCount > playerProfile.completedLevels * 2) {
        baseDifficulty -= 0.15;
      }
      
      return Math.max(0.1, Math.min(1.0, baseDifficulty));
    };
    
    const selectEnvironment = () => {
      const environments = ['forest', 'cave', 'mountain', 'cosmic', 'urban', 'underwater'] as const;
      const weights = {
        forest: playerProfile.emotionalState === 'peaceful' ? 0.3 : 0.15,
        cave: playerProfile.emotionalState === 'focused' ? 0.25 : 0.1,
        mountain: playerProfile.skillLevel > 70 ? 0.2 : 0.1,
        cosmic: playerProfile.emotionalState === 'excited' ? 0.25 : 0.15,
        urban: playerProfile.consecutiveWins > 3 ? 0.2 : 0.15,
        underwater: playerProfile.emotionalState === 'challenged' ? 0.2 : 0.15
      };
      
      const random = Math.random();
      let cumulative = 0;
      for (const [env, weight] of Object.entries(weights)) {
        cumulative += weight;
        if (random <= cumulative) {
          return env as typeof environments[number];
        }
      }
      return 'forest';
    };
    
    const difficulty = adaptDifficulty();
    const environment = selectEnvironment();
    
    const level: GeneratedLevel = {
      id: `ai_level_${Date.now()}`,
      name: generateLevelName(environment, difficulty),
      theme: `AI-Generated ${environment.charAt(0).toUpperCase() + environment.slice(1)} Challenge`,
      difficulty: Math.round(difficulty * 100),
      environment: {
        type: environment,
        weather: selectWeather(playerProfile.emotionalState),
        timeOfDay: selectTimeOfDay(playerProfile.playTime)
      },
      enemies: generateEnemies(difficulty, environment),
      obstacles: generateObstacles(difficulty, playerProfile.skillLevel),
      rewards: generateRewards(difficulty, playerProfile.itemsCollected),
      music: selectMusic(environment, playerProfile.emotionalState),
      specialFeatures: generateSpecialFeatures(playerProfile),
      aiPersonalization: {
        adaptedFor: `${playerProfile.emotionalState} player with ${playerProfile.skillLevel}% skill`,
        confidenceScore: Math.round(85 + Math.random() * 15),
        reasoningTags: [
          `Emotional State: ${playerProfile.emotionalState}`,
          `Skill Level: ${playerProfile.skillLevel}%`,
          `Recent Performance: ${playerProfile.consecutiveWins} wins`,
          `Preferred Style: ${environment} environments`,
          `Challenge Level: ${Math.round(difficulty * 100)}%`
        ]
      }
    };
    
    setIsGenerating(false);
    return level;
  }, [playerProfile]);

  // Helper functions for AI generation
  const generateLevelName = (env: string, difficulty: number): string => {
    const prefixes = {
      forest: ['Enchanted', 'Mystic', 'Ancient', 'Whispering', 'Emerald'],
      cave: ['Crystal', 'Shadow', 'Echo', 'Glowing', 'Hidden'],
      mountain: ['Frozen', 'Majestic', 'Cloud-Piercing', 'Thunder', 'Sacred'],
      cosmic: ['Stellar', 'Nebula', 'Void', 'Galactic', 'Quantum'],
      urban: ['Neon', 'Metro', 'Cyber', 'Steel', 'Electric'],
      underwater: ['Coral', 'Abyssal', 'Tide', 'Kraken\'s', 'Pearl']
    };
    
    const suffixes = {
      forest: ['Grove', 'Sanctuary', 'Depths', 'Canopy', 'Clearing'],
      cave: ['Caverns', 'Tunnels', 'Chamber', 'Depths', 'Passage'],
      mountain: ['Peak', 'Summit', 'Ridge', 'Cliffs', 'Pass'],
      cosmic: ['Station', 'Cluster', 'Gateway', 'Expanse', 'Nexus'],
      urban: ['District', 'Complex', 'Tower', 'Plaza', 'Junction'],
      underwater: ['Reef', 'Trench', 'Garden', 'Palace', 'Grotto']
    };
    
    const prefix = prefixes[env as keyof typeof prefixes][Math.floor(Math.random() * 5)];
    const suffix = suffixes[env as keyof typeof suffixes][Math.floor(Math.random() * 5)];
    
    return `${prefix} ${suffix}`;
  };

  const selectWeather = (emotion: PlayerProfile['emotionalState']): string => {
    const weatherMap = {
      excited: 'clear',
      frustrated: 'stormy',
      focused: 'foggy',
      bored: 'rainy',
      challenged: 'sunny'
    };
    return weatherMap[emotion];
  };

  const selectTimeOfDay = (playTime: number): string => {
    const hour = new Date().getHours();
    if (hour < 6) return 'dawn';
    if (hour < 18) return 'day';
    if (hour < 20) return 'dusk';
    return 'night';
  };

  const generateEnemies = (difficulty: number, environment: string) => {
    const enemyTypes = {
      forest: ['Forest Spider', 'Wild Boar', 'Tree Guardian', 'Vine Snare'],
      cave: ['Cave Bat', 'Stone Golem', 'Crystal Worm', 'Shadow Lurker'],
      mountain: ['Snow Wolf', 'Ice Giant', 'Wind Spirit', 'Rock Slide'],
      cosmic: ['Void Drone', 'Plasma Entity', 'Star Wraith', 'Quantum Ghost'],
      urban: ['Security Bot', 'Cyber Hound', 'Drone Swarm', 'Digital Virus'],
      underwater: ['Electric Eel', 'Giant Octopus', 'Coral Guardian', 'Tide Phantom']
    };
    
    const types = enemyTypes[environment as keyof typeof enemyTypes] || enemyTypes.forest;
    const enemyCount = Math.floor(2 + difficulty * 6);
    
    return types.slice(0, Math.min(types.length, Math.ceil(enemyCount / 2))).map(type => ({
      type,
      count: Math.floor(1 + difficulty * 3),
      difficulty: Math.round(50 + difficulty * 50),
      behavior: ['passive', 'aggressive', 'strategic', 'random'][Math.floor(Math.random() * 4)] as any
    }));
  };

  const generateObstacles = (difficulty: number, skillLevel: number) => {
    const obstacles = [
      'Moving Platforms', 'Spike Traps', 'Laser Barriers', 'Teleporters',
      'Gravity Wells', 'Time Loops', 'Mirror Mazes', 'Pressure Plates'
    ];
    
    return obstacles.slice(0, Math.floor(2 + difficulty * 4)).map(type => ({
      type,
      intensity: Math.round(30 + difficulty * 70),
      placement: ['scattered', 'clustered', 'path-blocking'][Math.floor(Math.random() * 3)] as any
    }));
  };

  const generateRewards = (difficulty: number, itemsCollected: number) => {
    const rewardTypes = [
      { type: 'coin', value: Math.floor(50 + difficulty * 200), rarity: 'common' },
      { type: 'powerup', value: Math.floor(1 + difficulty * 3), rarity: 'rare' },
      { type: 'health', value: Math.floor(20 + difficulty * 50), rarity: 'common' },
      { type: 'special', value: 1, rarity: difficulty > 0.7 ? 'legendary' : 'epic' }
    ];
    
    return rewardTypes.map(reward => ({
      ...reward,
      rarity: reward.rarity as any
    }));
  };

  const selectMusic = (environment: string, emotion: PlayerProfile['emotionalState']) => {
    const musicMap = {
      forest: { genre: 'ambient', tempo: 'medium' },
      cave: { genre: 'mysterious', tempo: 'slow' },
      mountain: { genre: 'epic', tempo: 'medium' },
      cosmic: { genre: 'ambient', tempo: 'variable' },
      urban: { genre: 'intense', tempo: 'fast' },
      underwater: { genre: 'peaceful', tempo: 'slow' }
    };
    
    return musicMap[environment as keyof typeof musicMap] || { genre: 'ambient', tempo: 'medium' };
  };

  const generateSpecialFeatures = (profile: PlayerProfile): string[] => {
    const features = [
      'Dynamic Weather System',
      'Adaptive Enemy AI',
      'Hidden Secret Areas',
      'Player Emotion Detection',
      'Real-time Difficulty Scaling',
      'Procedural Sound Design',
      'Interactive Environment',
      'AI Companion Assistant'
    ];
    
    return features.slice(0, Math.floor(2 + profile.skillLevel / 25));
  };

  const handleGenerateLevel = async () => {
    const newLevel = await generateLevel();
    setCurrentLevel(newLevel);
  };

  const updateEmotionalState = (newState: PlayerProfile['emotionalState']) => {
    setPlayerProfile(prev => ({ ...prev, emotionalState: newState }));
  };

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Header>
        <h1>🤖 Lionsun AI Level Generator</h1>
        <p className="subtitle">دینامیک و هوشمند - هر مرحله منحصر به فرد!</p>
      </Header>

      <AISection
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3>🧠 Player AI Profile Analysis</h3>
        
        {/* Real-time Emotion Detection */}
        {emotionDetectionEnabled && currentEmotion && (
          <div style={{ 
            background: 'rgba(74, 144, 226, 0.2)', 
            borderRadius: '10px', 
            padding: '1rem', 
            marginBottom: '1rem',
            border: '1px solid rgba(74, 144, 226, 0.4)'
          }}>
            <h4 style={{ color: '#4a90e2', marginBottom: '0.5rem' }}>
              🤖 Real-time AI Emotion Detection
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div>
                <strong>Detected Emotion:</strong> {currentEmotion.primary} 
                <span style={{ color: '#4a90e2' }}>
                  ({Math.round(currentEmotion.confidence * 100)}% confidence)
                </span>
              </div>
              <div>
                <strong>Sources:</strong>
                {currentEmotion.sources.facial && <span style={{ color: '#00ff00' }}>📷 </span>}
                {currentEmotion.sources.audio && <span style={{ color: '#00ff00' }}>🎤 </span>}
                {currentEmotion.sources.gameplay && <span style={{ color: '#00ff00' }}>🎮 </span>}
              </div>
            </div>
            {currentEmotion.secondary && currentEmotion.secondary.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Secondary emotions:</strong> {currentEmotion.secondary.join(', ')}
              </div>
            )}
          </div>
        )}
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <strong>Skill Level:</strong> {playerProfile.skillLevel}%
            <div style={{ background: '#333', borderRadius: '10px', overflow: 'hidden', marginTop: '0.5rem' }}>
              <div 
                style={{ 
                  background: 'linear-gradient(90deg, #4CAF50, #FFC107)', 
                  height: '8px', 
                  width: `${playerProfile.skillLevel}%`,
                  transition: 'width 0.5s ease'
                }} 
              />
            </div>
          </div>
          <div>
            <strong>Emotional State:</strong>
            <select 
              value={playerProfile.emotionalState} 
              onChange={(e) => updateEmotionalState(e.target.value as PlayerProfile['emotionalState'])}
              style={{ 
                background: '#2a2a4e', 
                color: '#fff', 
                border: '1px solid #4a4a6a', 
                borderRadius: '5px', 
                padding: '0.5rem',
                width: '100%',
                marginTop: '0.5rem'
              }}
              disabled={emotionDetectionEnabled} // Disable manual selection when AI is active
            >
              <option value="excited">😄 Excited</option>
              <option value="frustrated">😤 Frustrated</option>
              <option value="focused">🎯 Focused</option>
              <option value="bored">😴 Bored</option>
              <option value="challenged">💪 Challenged</option>
            </select>
            {emotionDetectionEnabled && (
              <div style={{ fontSize: '0.8rem', color: '#4a90e2', marginTop: '0.3rem' }}>
                🤖 Auto-detected by AI
              </div>
            )}
          </div>
          <div>
            <strong>Completed Levels:</strong> {playerProfile.completedLevels}<br/>
            <strong>Consecutive Wins:</strong> {playerProfile.consecutiveWins}
          </div>
          <div>
            <strong>Items Collected:</strong> {playerProfile.itemsCollected}<br/>
            <strong>Play Time:</strong> {Math.floor(playerProfile.playTime / 60)}h {playerProfile.playTime % 60}m
          </div>
        </div>
        
        {/* Emotion Detection Controls */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginTop: '1rem', 
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <button
            onClick={() => emotionDetector.enablePrivacyMode()}
            style={{
              background: emotionDetectionEnabled ? '#4CAF50' : '#666',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '0.5rem 1rem',
              cursor: 'pointer'
            }}
          >
            {emotionDetectionEnabled ? '🟢 AI Detection Active' : '⭕ Enable AI Detection'}
          </button>
          <button
            onClick={() => emotionDetector.stopDetection()}
            style={{
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '0.5rem 1rem',
              cursor: 'pointer'
            }}
          >
            🛑 Stop Detection
          </button>
          <div style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
            {emotionDetectionEnabled ? 
              '🔒 Privacy Mode: Only gameplay patterns analyzed' : 
              '🔒 Click to enable emotion-based level generation'
            }
          </div>
        </div>
      </AISection>

      <GenerateButton
        onClick={handleGenerateLevel}
        disabled={isGenerating}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isGenerating ? '🤖 AI در حال ساخت مرحله...' : '🎮 Generate New AI Level'}
      </GenerateButton>

      {isGenerating && (
        <GenerationStatus>
          <div className="status-indicator" />
          <span>AI در حال تحلیل profile شما و ساخت مرحله شخصی‌سازی‌شده...</span>
        </GenerationStatus>
      )}

      <AnimatePresence>
        {currentLevel && (
          <LevelCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <LevelHeader>
              <div className="level-name">{currentLevel.name}</div>
              <div className="difficulty-badge">
                Difficulty: {currentLevel.difficulty}%
              </div>
            </LevelHeader>

            <LevelDetails>
              <div className="detail-section">
                <h4>🌍 Environment</h4>
                <ul>
                  <li>Type: {currentLevel.environment.type}</li>
                  <li>Weather: {currentLevel.environment.weather}</li>
                  <li>Time: {currentLevel.environment.timeOfDay}</li>
                </ul>
              </div>

              <div className="detail-section">
                <h4>👹 Enemies</h4>
                <ul>
                  {currentLevel.enemies.map((enemy, idx) => (
                    <li key={idx}>{enemy.count}x {enemy.type} ({enemy.behavior})</li>
                  ))}
                </ul>
              </div>

              <div className="detail-section">
                <h4>⚡ Obstacles</h4>
                <ul>
                  {currentLevel.obstacles.map((obstacle, idx) => (
                    <li key={idx}>{obstacle.type} - {obstacle.intensity}% intensity</li>
                  ))}
                </ul>
              </div>

              <div className="detail-section">
                <h4>🎵 Audio Experience</h4>
                <ul>
                  <li>Genre: {currentLevel.music.genre}</li>
                  <li>Tempo: {currentLevel.music.tempo}</li>
                </ul>
              </div>

              <div className="detail-section">
                <h4>✨ Special Features</h4>
                <ul>
                  {currentLevel.specialFeatures.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="detail-section">
                <h4>🏆 Rewards</h4>
                <ul>
                  {currentLevel.rewards.map((reward, idx) => (
                    <li key={idx}>{reward.value}x {reward.type} ({reward.rarity})</li>
                  ))}
                </ul>
              </div>
            </LevelDetails>

            <AIInsights>
              <h4>🤖 AI Personalization Insights</h4>
              <p><strong>Adapted for:</strong> {currentLevel.aiPersonalization.adaptedFor}</p>
              <p><strong>AI Confidence:</strong> {currentLevel.aiPersonalization.confidenceScore}%</p>
              <div style={{ marginTop: '1rem' }}>
                {currentLevel.aiPersonalization.reasoningTags.map((tag, idx) => (
                  <span key={idx} className="ai-tag">{tag}</span>
                ))}
              </div>
            </AIInsights>
          </LevelCard>
        )}
      </AnimatePresence>
    </Container>
  );
};