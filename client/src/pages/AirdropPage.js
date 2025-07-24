import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Card, CardContent, TextField, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Styled components for the fantasy theme
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 25%, #2d2d5f 50%, #1a1a3a 75%, #0a0a1a 100%)',
  backgroundAttachment: 'fixed',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
}));

const GlowingCard = styled(Card)(({ theme }) => ({
  background: 'rgba(26, 26, 58, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '2px solid rgba(255, 215, 0, 0.3)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 12px 48px rgba(255, 215, 0, 0.4)',
    transform: 'translateY(-4px)',
  },
}));

const GlowingButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
  color: '#1a1a3a',
  fontWeight: 'bold',
  borderRadius: '25px',
  padding: '12px 32px',
  fontSize: '16px',
  textTransform: 'none',
  boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #FFA500, #FFD700)',
    boxShadow: '0 6px 30px rgba(255, 215, 0, 0.6)',
    transform: 'translateY(-2px)',
  },
}));

const CountdownTimer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: '16px',
  margin: '24px 0',
  '& .timer-unit': {
    background: 'rgba(255, 215, 0, 0.1)',
    border: '2px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '12px',
    padding: '16px 12px',
    minWidth: '80px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
  },
}));

const AirdropPage = () => {
  const [countdown, setCountdown] = useState({ days: 12, hours: 8, minutes: 17, seconds: 22 });
  const [walletAddress, setWalletAddress] = useState('0x3e4...6bF');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [referralCount, setReferralCount] = useState(3);
  const [referralEarnings, setReferralEarnings] = useState(50);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
              days--;
              if (days < 0) {
                clearInterval(timer);
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
              }
            }
          }
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const connectWallet = () => {
    setIsWalletConnected(true);
    // Simulate wallet connection
    setTimeout(() => {
      setWalletAddress('0x3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f');
    }, 1000);
  };

  const claimAirdrop = () => {
    // Simulate claiming
    alert('🎉 Airdrop claimed successfully! 150 $LIONSUN has been sent to your wallet.');
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText('https://lionsun.quest/airdrop?ref=0x3e4...6bF');
    alert('Referral link copied to clipboard!');
  };

  return (
    <StyledContainer maxWidth="lg">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box textAlign="center" py={6}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              mb: 2,
              textShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
            }}
          >
            🌞 LIONSUN AIRDROP LIVE!
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: '#FFD700',
              mb: 4,
              fontWeight: 300,
            }}
          >
            Claim your Lionsun Coins. Help free the Roaring Lion.
          </Typography>
          
          {!isWalletConnected ? (
            <GlowingButton onClick={connectWallet} size="large">
              Connect Wallet
            </GlowingButton>
          ) : (
            <Chip
              label="Wallet Connected"
              color="success"
              sx={{ background: 'rgba(76, 175, 80, 0.2)', color: '#4CAF50' }}
            />
          )}
        </Box>
      </motion.div>

      {/* Countdown Timer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <GlowingCard sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" textAlign="center" sx={{ color: '#FFD700', mb: 2 }}>
              🚀 Airdrop ends in:
            </Typography>
            <CountdownTimer>
              <Box className="timer-unit">
                <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                  {countdown.days.toString().padStart(2, '0')}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>Days</Typography>
              </Box>
              <Box className="timer-unit">
                <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                  {countdown.hours.toString().padStart(2, '0')}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>Hours</Typography>
              </Box>
              <Box className="timer-unit">
                <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                  {countdown.minutes.toString().padStart(2, '0')}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>Minutes</Typography>
              </Box>
              <Box className="timer-unit">
                <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                  {countdown.seconds.toString().padStart(2, '0')}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>Seconds</Typography>
              </Box>
            </CountdownTimer>
          </CardContent>
        </GlowingCard>
      </motion.div>

      {/* Claim Zone */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <GlowingCard sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: '#FFD700', mb: 3, textAlign: 'center' }}>
              🎁 Claim Your Reward
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ color: '#ccc', mb: 1 }}>
                👛 Your Wallet:
              </Typography>
              <Typography variant="body2" sx={{ color: '#FFD700', fontFamily: 'monospace' }}>
                {walletAddress}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ color: '#ccc', mb: 1 }}>
                🎁 Reward:
              </Typography>
              <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                150 $LIONSUN
              </Typography>
              <Chip
                label="✅ Eligible - You've completed the quest!"
                sx={{
                  background: 'rgba(76, 175, 80, 0.2)',
                  color: '#4CAF50',
                  mt: 1,
                }}
              />
            </Box>

            <Box textAlign="center">
              <GlowingButton onClick={claimAirdrop} size="large" disabled={!isWalletConnected}>
                Claim Now
              </GlowingButton>
            </Box>
          </CardContent>
        </GlowingCard>
      </motion.div>

      {/* Referral System */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <GlowingCard sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: '#FFD700', mb: 3, textAlign: 'center' }}>
              🔗 Referral System
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ color: '#ccc', mb: 1 }}>
                Your Referral Link:
              </Typography>
              <TextField
                fullWidth
                value="https://lionsun.quest/airdrop?ref=0x3e4...6bF"
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#FFD700',
                    '& fieldset': {
                      borderColor: 'rgba(255, 215, 0, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 215, 0, 0.5)',
                    },
                  },
                }}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <Button
                      onClick={copyReferralLink}
                      sx={{ color: '#FFD700', minWidth: 'auto' }}
                    >
                      📋
                    </Button>
                  ),
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ color: '#ccc', mb: 1 }}>
                🎉 You earned +{referralEarnings} $LIONSUN from {referralCount} invites!
              </Typography>
            </Box>
          </CardContent>
        </GlowingCard>
      </motion.div>

      {/* Mini Lore Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <GlowingCard>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#FFD700', mb: 2, textAlign: 'center' }}>
              📖 The Legend of Lionsun
            </Typography>
            <Box
              sx={{
                background: 'rgba(255, 215, 0, 0.05)',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                borderRadius: '12px',
                padding: '20px',
                fontStyle: 'italic',
                textAlign: 'center',
              }}
            >
              <Typography variant="body1" sx={{ color: '#ccc', lineHeight: 1.6 }}>
                "Lionsun, the cosmic lion, is trapped in a psychological maze. The more people you invite, the stronger he becomes. Set him free—together."
              </Typography>
            </Box>
          </CardContent>
        </GlowingCard>
      </motion.div>
    </StyledContainer>
  );
};

export default AirdropPage;