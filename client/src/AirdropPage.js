import React, { useState, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Global styles for cosmic background
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Orbitron', 'Arial', sans-serif;
    background: linear-gradient(135deg, #0a0a2e 0%, #16213e 50%, #0f3460 100%);
    min-height: 100vh;
    overflow-x: hidden;
  }
`;

// Keyframe animations
const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
`;

const roar = keyframes`
  0%, 100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.05) rotate(-1deg); }
  75% { transform: scale(1.05) rotate(1deg); }
`;

// Styled components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow: hidden;
`;

const CosmicBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
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
    width: 2px;
    height: 2px;
    background: white;
    border-radius: 50%;
    animation: ${sparkle} 3s infinite;
    box-shadow: 
      10px 10px 0 0 white,
      20px 30px 0 0 white,
      40px 70px 0 0 white,
      60px 20px 0 0 white,
      80px 90px 0 0 white,
      100px 40px 0 0 white,
      120px 80px 0 0 white;
  }
`;

const Header = styled(motion.header)`
  text-align: center;
  padding: 2rem 1rem;
  position: relative;
`;

const Logo = styled(motion.div)`
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(45deg, #FFD700, #FFA500, #FFD700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  animation: ${glow} 2s infinite;
  position: relative;
  
  &::before {
    content: '🦁';
    position: absolute;
    left: -60px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 2.5rem;
    animation: ${roar} 3s infinite;
  }
  
  &::after {
    content: '☀️';
    position: absolute;
    right: -60px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 2.5rem;
    animation: ${float} 2s infinite;
  }
`;

const Subtitle = styled(motion.h2)`
  color: #FFD700;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1rem;
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
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(255, 215, 0, 0.3);
    ${props => !props.primary && 'background: rgba(255, 215, 0, 0.1);'}
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CountdownSection = styled(motion.section)`
  text-align: center;
  padding: 2rem 1rem;
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  margin: 2rem auto;
  max-width: 600px;
  backdrop-filter: blur(10px);
`;

const CountdownTitle = styled.h3`
  color: #FFD700;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const CountdownTimer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const TimeUnit = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 15px;
  padding: 1rem;
  min-width: 80px;
  
  .number {
    font-size: 2rem;
    font-weight: bold;
    color: #FFD700;
    display: block;
  }
  
  .label {
    font-size: 0.8rem;
    color: #ccc;
    text-transform: uppercase;
  }
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const Card = styled(motion.div)`
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
`;

const CardTitle = styled.h3`
  color: #FFD700;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const WalletInfo = styled.div`
  text-align: center;
  margin: 1rem 0;
  
  .address {
    color: #ccc;
    font-family: 'Courier New', monospace;
    background: rgba(255, 215, 0, 0.1);
    padding: 0.5rem;
    border-radius: 10px;
    margin: 1rem 0;
  }
`;

const RewardInfo = styled.div`
  text-align: center;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
  border-radius: 15px;
  padding: 1.5rem;
  margin: 1rem 0;
  
  .amount {
    font-size: 2.5rem;
    font-weight: bold;
    color: #FFD700;
    display: block;
  }
  
  .token {
    color: #ccc;
    font-size: 1rem;
  }
  
  .status {
    background: linear-gradient(45deg, #00ff88, #00cc6a);
    color: #0a0a2e;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    display: inline-block;
    margin-top: 1rem;
    font-weight: bold;
  }
`;

const ReferralSection = styled.div`
  margin: 1rem 0;
  
  .link-container {
    background: rgba(255, 215, 0, 0.1);
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 10px;
    padding: 1rem;
    margin: 1rem 0;
    
    .link {
      color: #FFD700;
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
      word-break: break-all;
    }
  }
  
  .referral-stats {
    text-align: center;
    color: #00ff88;
    font-weight: bold;
    margin-top: 1rem;
  }
`;

const LoreSection = styled(motion.section)`
  max-width: 800px;
  margin: 3rem auto;
  padding: 2rem;
  background: rgba(255, 215, 0, 0.03);
  border: 1px solid rgba(255, 215, 0, 0.1);
  border-radius: 20px;
  text-align: center;
  backdrop-filter: blur(5px);
  
  .quote {
    font-style: italic;
    font-size: 1.2rem;
    color: #ccc;
    line-height: 1.6;
    position: relative;
    
    &::before, &::after {
      content: '"';
      font-size: 2rem;
      color: #FFD700;
      position: absolute;
    }
    
    &::before {
      left: -20px;
      top: -10px;
    }
    
    &::after {
      right: -20px;
      bottom: -30px;
    }
  }
`;

const AirdropPage = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 8,
    minutes: 17,
    seconds: 22
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      // Simulate wallet connection for demo
      const mockAddress = '0x3e4f8a9b2c1d6e5f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d';
      setWalletAddress(mockAddress);
      setWalletConnected(true);
    }
  };

  const claimTokens = () => {
    alert('🎉 Congratulations! Your 150 $LIONSUN tokens have been claimed!');
  };

  const copyReferralLink = () => {
    const link = `https://lionsun.quest/airdrop?ref=${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    navigator.clipboard.writeText(link);
    alert('Referral link copied to clipboard!');
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <CosmicBackground />
        <Stars />
        
        <Header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Logo
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            LIONSUN
          </Logo>
          <Subtitle
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            🌞 LIONSUN AIRDROP LIVE! 🌞<br />
            Claim your Lionsun Coins. Help free the Roaring Lion.
          </Subtitle>
          <ButtonGroup>
            <Button
              primary={!walletConnected}
              onClick={connectWallet}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {walletConnected ? '✅ Wallet Connected' : 'Connect Wallet'}
            </Button>
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </Button>
          </ButtonGroup>
        </Header>

        <CountdownSection
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <CountdownTitle>🚀 Airdrop ends in:</CountdownTitle>
          <CountdownTimer>
            <TimeUnit whileHover={{ scale: 1.1 }}>
              <span className="number">{timeLeft.days.toString().padStart(2, '0')}</span>
              <span className="label">Days</span>
            </TimeUnit>
            <TimeUnit whileHover={{ scale: 1.1 }}>
              <span className="number">{timeLeft.hours.toString().padStart(2, '0')}</span>
              <span className="label">Hours</span>
            </TimeUnit>
            <TimeUnit whileHover={{ scale: 1.1 }}>
              <span className="number">{timeLeft.minutes.toString().padStart(2, '0')}</span>
              <span className="label">Minutes</span>
            </TimeUnit>
            <TimeUnit whileHover={{ scale: 1.1 }}>
              <span className="number">{timeLeft.seconds.toString().padStart(2, '0')}</span>
              <span className="label">Seconds</span>
            </TimeUnit>
          </CountdownTimer>
        </CountdownSection>

        <MainContent>
          <Card
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <CardTitle>🎁 Claim Zone</CardTitle>
            {walletConnected ? (
              <>
                <WalletInfo>
                  <div>👛 Your Wallet:</div>
                  <div className="address">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </div>
                </WalletInfo>
                <RewardInfo>
                  <span className="amount">150</span>
                  <span className="token">$LIONSUN</span>
                  <div className="status">✅ Eligible - You've completed the quest!</div>
                </RewardInfo>
                <Button
                  primary
                  onClick={claimTokens}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ width: '100%', marginTop: '1rem' }}
                >
                  Claim Now
                </Button>
              </>
            ) : (
              <div style={{ textAlign: 'center', color: '#ccc' }}>
                <p>Connect your wallet to claim your rewards!</p>
                <p>📱 Supported Wallets:</p>
                <p>MetaMask • WalletConnect • Trust Wallet</p>
              </div>
            )}
          </Card>

          <Card
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <CardTitle>🔗 Referral System</CardTitle>
            {walletConnected ? (
              <ReferralSection>
                <div>Your Referral Link:</div>
                <div className="link-container">
                  <div className="link">
                    https://lionsun.quest/airdrop?ref={walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </div>
                </div>
                <Button
                  onClick={copyReferralLink}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ width: '100%' }}
                >
                  Copy Link
                </Button>
                <div className="referral-stats">
                  🎉 You earned +50 $LIONSUN from 3 invites!
                </div>
              </ReferralSection>
            ) : (
              <div style={{ textAlign: 'center', color: '#ccc' }}>
                <p>Connect your wallet to get your referral link!</p>
                <p>Earn bonus tokens for each friend you invite!</p>
              </div>
            )}
          </Card>
        </MainContent>

        <LoreSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <div className="quote">
            Lionsun, the cosmic lion, is trapped in a psychological maze. 
            The more people you invite, the stronger he becomes. 
            Set him free—together.
          </div>
        </LoreSection>
      </Container>
    </>
  );
};

export default AirdropPage;