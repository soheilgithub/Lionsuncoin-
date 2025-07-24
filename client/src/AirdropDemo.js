import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Keyframe animations
const glow = keyframes`
  0%, 100% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.4); }
  50% { box-shadow: 0 0 60px rgba(255, 215, 0, 0.8); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
`;

// Styled components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const CosmicBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
  z-index: -1;
`;

const Stars = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  
  &::before {
    content: '';
    position: absolute;
    width: 3px;
    height: 3px;
    background: white;
    border-radius: 50%;
    animation: ${sparkle} 4s infinite;
    box-shadow: 
      20px 30px 0 0 white,
      40px 70px 0 0 white,
      60px 20px 0 0 white,
      80px 90px 0 0 white,
      120px 40px 0 0 white,
      160px 80px 0 0 white,
      200px 30px 0 0 white,
      240px 100px 0 0 white;
  }
`;

const MainContent = styled(motion.div)`
  text-align: center;
  max-width: 1000px;
  z-index: 1;
`;

const Hero = styled(motion.div)`
  margin-bottom: 3rem;
`;

const LionLogo = styled(motion.div)`
  font-size: 8rem;
  margin-bottom: 1rem;
  animation: ${float} 4s ease-in-out infinite;
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6));
`;

const Title = styled(motion.h1)`
  font-family: 'Orbitron', sans-serif;
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(45deg, #FFD700, #FFA500, #FFD700, #FF8C00);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  animation: ${glow} 3s infinite;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.h2)`
  font-size: 1.8rem;
  color: #ccc;
  margin-bottom: 2rem;
  font-weight: 300;
  line-height: 1.4;
  
  .highlight {
    color: #FFD700;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const DemoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const DemoCard = styled(motion.div)`
  background: rgba(255, 215, 0, 0.05);
  border: 2px solid rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #FFD700, #FFA500, #FFD700, #FF8C00);
    background-size: 300% 300%;
    border-radius: 20px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 0.7;
    animation: ${glow} 2s infinite;
  }
`;

const CardIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  color: #FFD700;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const CardDescription = styled.p`
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const Button = styled(motion.button)`
  padding: 1rem 2rem;
  border: 2px solid #FFD700;
  background: ${props => props.primary ? 'linear-gradient(45deg, #FFD700, #FFA500)' : 'transparent'};
  color: ${props => props.primary ? '#0a0a2e' : '#FFD700'};
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-family: 'Orbitron', sans-serif;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(255, 215, 0, 0.4);
    ${props => !props.primary && 'background: rgba(255, 215, 0, 0.1);'}
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 3rem;
`;

const FeaturesList = styled.div`
  text-align: left;
  margin: 1rem 0;
  
  .feature {
    display: flex;
    align-items: center;
    margin: 0.5rem 0;
    color: #ccc;
    
    .icon {
      margin-right: 0.5rem;
      color: #FFD700;
    }
  }
`;

const StatusBadge = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: linear-gradient(45deg, #00ff88, #00cc6a);
  color: #0a0a2e;
  border-radius: 20px;
  font-weight: bold;
  margin: 1rem 0;
  animation: ${glow} 2s infinite;
`;

const AirdropDemo = () => {
  const navigate = useNavigate();

  const goToAirdrop = () => {
    navigate('/airdrop');
  };

  const openGitHub = () => {
    window.open('https://github.com/soheilgithub/Lionsuncoin-', '_blank');
  };

  const demoFeatures = [
    {
      icon: '🎨',
      title: 'Live Airdrop Demo',
      description: 'Experience the complete Lionsun Airdrop interface with wallet connection, countdown timer, and referral system.',
      features: ['Wallet Integration', 'Real-time Countdown', 'Referral System', 'Cosmic UI Design'],
      action: goToAirdrop,
      buttonText: 'View Airdrop',
      primary: true
    },
    {
      icon: '📄',
      title: 'Smart Contract',
      description: 'View the Lionsun token smart contract with airdrop functionality built for Ethereum and BSC.',
      features: ['ERC-20 Compatible', 'Airdrop Functions', 'Security Audited', 'Testnet Ready'],
      action: openGitHub,
      buttonText: 'View Contract',
      primary: false
    },
    {
      icon: '🌐',
      title: 'Gaming Platform',
      description: 'Explore the full Lionsuncoin gaming ecosystem with multiple games and earning mechanisms.',
      features: ['Cross-platform Gaming', 'Token Rewards', 'Leaderboards', 'Social Features'],
      action: () => navigate('/'),
      buttonText: 'Explore Platform',
      primary: false
    }
  ];

  return (
    <Container>
      <CosmicBackground />
      <Stars />
      
      <MainContent
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Hero>
          <LionLogo
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, type: "spring" }}
          >
            🦁
          </LionLogo>
          <Title
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            LIONSUN AIRDROP
          </Title>
          <Subtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            🧪 <span className="highlight">Demo Showcase</span><br />
            Experience the fantasy-gaming airdrop platform
          </Subtitle>
          <StatusBadge>🚀 LIVE DEMO READY</StatusBadge>
        </Hero>

        <DemoGrid>
          {demoFeatures.map((feature, index) => (
            <DemoCard
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.2, duration: 0.8 }}
              whileHover={{ y: -10 }}
            >
              <CardIcon>{feature.icon}</CardIcon>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
              <FeaturesList>
                {feature.features.map((feat, i) => (
                  <div key={i} className="feature">
                    <span className="icon">✅</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </FeaturesList>
              <Button
                primary={feature.primary}
                onClick={feature.action}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {feature.buttonText}
              </Button>
            </DemoCard>
          ))}
        </DemoGrid>

        <ButtonGroup>
          <Button
            primary
            onClick={goToAirdrop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎯 Launch Airdrop Demo
          </Button>
          <Button
            onClick={openGitHub}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📚 View Documentation
          </Button>
        </ButtonGroup>
      </MainContent>
    </Container>
  );
};

export default AirdropDemo;