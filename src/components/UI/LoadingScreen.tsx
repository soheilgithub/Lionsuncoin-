import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const pulse = keyframes`
  0%, 100% { 
    transform: scale(1); 
    opacity: 1;
  }
  50% { 
    transform: scale(1.1); 
    opacity: 0.8;
  }
`;

const spin = keyframes`
  0% { 
    transform: rotate(0deg); 
  }
  100% { 
    transform: rotate(360deg); 
  }
`;

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.gradients.primary};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Logo = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: ${pulse} 2s infinite;
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.accent};
  font-size: 1.5rem;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: 2rem;
  text-align: center;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${props => props.theme.colors.accent}33;
  border-top: 3px solid ${props => props.theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 1rem;
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading Lionsuncoin Gaming..." 
}) => {
  return (
    <LoadingContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center' }}
      >
        <Logo>🦁</Logo>
        <Title>Lionsuncoin Gaming</Title>
        <Spinner />
        <LoadingText>{message}</LoadingText>
      </motion.div>
    </LoadingContainer>
  );
};

export default LoadingScreen;